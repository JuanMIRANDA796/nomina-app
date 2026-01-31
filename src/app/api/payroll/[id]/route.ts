import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, parseISO, eachDayOfInterval, format, isSameDay, getISOWeek, startOfWeek, isBefore, subHours } from 'date-fns';
import { calculateShiftHours, ShiftResult, isHoliday } from '@/lib/payroll';
import { calculatePayroll } from '@/lib/payroll_engine';
import { getAbsencePercentage } from '@/lib/absence_config';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date'); // YYYY-MM
        const periodParam = searchParams.get('period') || 'month'; // 'month' | 'q1' | 'q2'
        const employeeId = parseInt(id);

        if (!dateParam || isNaN(employeeId)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const date = parseISO(`${dateParam}-01`);

        let start = startOfMonth(date);
        let end = endOfMonth(date);
        let periodDays = 30;

        // Adjust dates for fortnights
        if (periodParam === 'q1') {
            end = new Date(date.getFullYear(), date.getMonth(), 15);
            periodDays = 15;
        } else if (periodParam === 'q2') {
            start = new Date(date.getFullYear(), date.getMonth(), 16);
            periodDays = 15;
        }

        // Extended Fetch Range: Start from the Monday of the first week
        // This ensures we have the full week context for the first Sunday
        const fetchStart = startOfWeek(start, { weekStartsOn: 1 });

        // Fetch Employee with Absences
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include: {
                attendances: {
                    where: {
                        date: { gte: fetchStart, lte: end },
                        exitTime: { not: null }
                    }
                },
                absences: {
                    where: {
                        date: { gte: fetchStart, lte: end }
                    }
                }
            }
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        const allDays = eachDayOfInterval({ start: fetchStart, end });
        const dailyRecords: any[] = [];
        let totalHours: ShiftResult = {
            HD: 0, HN: 0, HDD: 0, HND: 0,
            HED: 0, HEN: 0, HEDD: 0, HEND: 0
        };

        // Counters for Payroll Engine
        let daysAbsent = 0;
        let daysIncapacity = 0;
        let daysVacation = 0;

        // Process each day
        let workedDaysInWeek = 0;
        let currentWeek = getISOWeek(fetchStart);

        // Pre-process attendances to find their "Visual Date" (Colombia Local)
        // This ensures a record with Entry Jan 30 maps to row Jan 30 even if DB bucket is Jan 29.
        const mappedRecords = employee.attendances.reduce((acc, att) => {
            const dateToUse = att.entryTime ? new Date(att.entryTime) : new Date(att.date);
            const colombiaTime = subHours(dateToUse, 5);
            const key = format(colombiaTime, 'yyyy-MM-dd');
            acc[key] = att;
            return acc;
        }, {} as Record<string, typeof employee.attendances[0]>);

        for (const day of allDays) {
            const dateStr = format(day, 'yyyy-MM-dd');
            const att = mappedRecords[dateStr];
            const abs = employee.absences.find(a => format(new Date(a.date), 'yyyy-MM-dd') === dateStr);

            // Check Week Change for Dominical Logic
            const dayWeek = getISOWeek(day);
            if (dayWeek !== currentWeek) {
                currentWeek = dayWeek;
                workedDaysInWeek = 0;
            }

            let dayHours: ShiftResult = { HD: 0, HN: 0, HDD: 0, HND: 0, HED: 0, HEN: 0, HEDD: 0, HEND: 0 };
            let status: 'ATTENDED' | 'ABSENT' | 'MISSING' | 'HOLIDAY' | 'REST' = 'MISSING';
            let isPaidDay = false;

            const isSunday = day.getDay() === 0;
            const isFestivo = isHoliday(day);
            const isWithinPeriod = !isBefore(day, start); // Only pay/record if within requested period

            // 1. Process Attendance
            if (att && att.entryTime && att.exitTime) {
                status = 'ATTENDED';
                const isSpecialDay = isSunday || isFestivo;
                const calculated = calculateShiftHours(att.entryTime, att.exitTime, isSpecialDay);

                // 31st Rule: If 31st, only Extras/Surcharges are paid.
                if (day.getDate() === 31) {
                    dayHours = { ...calculated };
                    dayHours.HD = 0;
                    dayHours.HN = 0;
                } else {
                    dayHours = calculated;
                }

                workedDaysInWeek++;
                isPaidDay = true;

            } else if (abs) {
                status = 'ABSENT';
                const reason = abs.reason; // Look up percentage
                let percentage = getAbsencePercentage(reason);
                if (abs.paidPercentage !== undefined && abs.paidPercentage !== null) {
                    percentage = getAbsencePercentage(reason);
                }

                if (isWithinPeriod) {
                    if (reason.toLowerCase().includes('vacaciones')) daysVacation++;
                    else if (percentage > 0 && percentage < 1) {
                        daysIncapacity++;
                    } else if (percentage === 1) {
                        // Fully paid license/excuse
                        // No logic here, workedDays handled below/outside period check?
                    } else {
                        daysAbsent++; // Unpaid
                    }
                }

                // Worked Days Logic (Runs always for Sunday entitlement)
                if (percentage === 1) {
                    workedDaysInWeek++;
                }

                // Add Paid Hours (Only if within period?)
                // Actually dayHours is added to totalHours LATER inside isWithinPeriod check.
                // So we can calculate dayHours here always.
                if (percentage > 0) {
                    dayHours.HD = 8 * percentage;
                    isPaidDay = true;
                }
            } else {
                // No Attendance, No Absence
                if (isFestivo) {
                    status = 'HOLIDAY';
                    // Paid Holiday: If not worked, paid as 8h HD
                    dayHours.HD = 8;
                    isPaidDay = true;
                } else if (isSunday) {
                    status = 'MISSING'; // Will update to REST if entitled
                }
            }

            // Weekly Rest Logic (Dominical)
            // If Sunday, check entitlement
            if (isSunday) {
                // If worked 6 days? Or "Worked all scheduled days"?
                // Assuming 6 days for now.
                // If Festivo count as worked? Yes.
                // If Paid Absence count as worked? Yes.
                if (workedDaysInWeek >= 6) {
                    if (status !== 'ATTENDED') {
                        status = 'REST';
                        dayHours.HD = 8;
                        isPaidDay = true;
                    }
                    // If Attended, they get Sunday work pay (HDD) handled in calculateShiftHours
                    // PLUS the base pay (Rest Day)?
                    // Law: Sunday work is paid with surcharge. 
                    // Usually: 1.75 (0.75 surcharge + 1.00 base).
                    // My `calculateShiftHours` returns HDD = 1.75 factor hours?
                    // RATES.HDD = 1.75.
                    // IMPORTANT: Does 1.75 include the "Descanso" payment?
                    // "Trabajo dominical habitual": Retribution + Descanso compensatorio.
                    // "Ocasional": Retribution OR Descanso.
                    // Usually payroll calculates: (Hours * 1.75). This is the work payment.
                    // Is the "Day of Rest" paid separately?
                    // Fixed salary (Mensual) covers 30 days including Sundays.
                    // So if I pay 8 HD for Sunday (Rest), and ALSO pay HDD for work...
                    // I might be double paying the base 1.0?
                    // "Salarios Mensuales": Sueldo cubre todos los dias.
                    // Si trabaja domingo: Se paga recargo (0.75).
                    // Mi engine: `Earnings = Hours * Rate`.
                    // Si el domingo NO se trabaja: 8 HD -> 8 * 1.0 = 8h pagas. Correcto (cubierto por sueldo).
                    // Si el domingo SI se trabaja: 8 HDD.
                    // HDD Rate = 1.75.
                    // Totales = 14h (8 * 1.75).
                    // Esto incluye el día (1.0) + Recargo (0.75).
                    // ¿Es correcto?
                    // Si el sueldo es fijo, el 1.0 YA está pago?
                    // Si sumo HDD, estoy sumando 1.75 ADICIONAL al sueldo?
                    // Si mi "BasicPay" es Sum(All Hours).
                    // Entonces SI debo sumar todas las horas.
                    // Si no trabaja: Sumo 8 HD.
                    // Si trabaja: Sumo 8 HDD (que vale más).
                    // Parece correcto para sistema basado en horas acumulativas.
                }
            } else {
                // Weekday
                // Check phantom days not here.
            }

            // ONLY accumulate if day is in the requested period
            if (isWithinPeriod) {
                totalHours.HD += dayHours.HD;
                totalHours.HN += dayHours.HN;
                totalHours.HDD += dayHours.HDD;
                totalHours.HND += dayHours.HND;
                totalHours.HED += dayHours.HED;
                totalHours.HEN += dayHours.HEN;
                totalHours.HEDD += dayHours.HEDD;
                totalHours.HEND += dayHours.HEND;

                dailyRecords.push({
                    date: day,
                    status,
                    attendance: att ? { entry: att.entryTime, exit: att.exitTime } : null,
                    absence: abs ? { reason: abs.reason, paidPercentage: getAbsencePercentage(abs.reason) } : null,
                    hours: dayHours
                });
            }
        }

        // Commercial 30-Day Adjustment (February)
        if (periodParam === 'month' && date.getMonth() === 1) {
            const daysInFeb = end.getDate();
            const daysToPay = 30 - daysInFeb;
            totalHours.HD += (daysToPay * 8);
        }

        const payroll = calculatePayroll(
            { salary: employee.salary, riskClass: employee.riskClass },
            totalHours,
            daysAbsent,
            daysIncapacity,
            daysVacation,
            periodDays
        );

        payroll.period = format(date, 'MMMM yyyy');
        if (periodParam === 'q1') payroll.period += ' (Q1)';
        if (periodParam === 'q2') payroll.period += ' (Q2)';
        payroll.employeeId = employee.id;

        return NextResponse.json({
            employee: {
                id: employee.id,
                name: employee.name,
                cedula: employee.cedula,
                salary: employee.salary,
                riskClass: employee.riskClass,
                cargo: employee.cargo
            },
            period: payroll.period,
            dailyRecords,
            payroll
        });

    } catch (error) {
        console.error('Error fetching payroll:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
