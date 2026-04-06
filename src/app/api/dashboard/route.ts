import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, eachDayOfInterval, format, isBefore, subHours, getISOWeek } from 'date-fns';
import { calculateShiftHours, isHoliday } from '@/lib/payroll';
import { calculatePayroll } from '@/lib/payroll_engine';
import { getAbsencePercentage } from '@/lib/absence_config';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const now = new Date();
        const start = startOfDay(now);
        const end = endOfDay(now);

        // 1. Employee Stats
        const totalEmployees = await prisma.employee.count({
            where: { companyId, status: 'ACTIVE' }
        });

        const inactiveEmployees = await prisma.employee.count({
            where: { companyId, status: 'INACTIVE' }
        });

        // 2. Attendance Daily Stats
        const attendanceToday = await prisma.attendance.findMany({
            where: {
                employee: { companyId },
                date: { gte: start, lte: end }
            },
            include: { employee: true }
        });

        const presentCount = attendanceToday.length;
        const activeNowCount = attendanceToday.filter(a => !a.exitTime).length;

        // 3. Active employees with all data needed for payroll engine
        const activeEmployees = await prisma.employee.findMany({
            where: { companyId, status: 'ACTIVE' },
            include: {
                attendances: {
                    where: {
                        date: {
                            gte: startOfWeek(startOfMonth(now), { weekStartsOn: 1 }),
                            lte: endOfMonth(now)
                        },
                        exitTime: { not: null }
                    }
                },
                absences: {
                    where: {
                        date: {
                            gte: startOfWeek(startOfMonth(now), { weekStartsOn: 1 }),
                            lte: endOfMonth(now)
                        }
                    }
                }
            }
        });

        const totalMonthlyPayroll = activeEmployees.reduce((acc, emp) => acc + emp.salary, 0);

        // 4. Calculate real netPay, prestaciones and seguridad social using exact same logic as payroll reports
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const fetchStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const allDays = eachDayOfInterval({ start: fetchStart, end: monthEnd });

        let totalPrestaciones = 0;
        let totalSegSocial = 0;
        let totalNetoPagar = 0;

        for (const emp of activeEmployees) {
            // Build a map of attendances keyed by Colombia-local date string
            const mappedRecords = emp.attendances.reduce((acc, att) => {
                const dateToUse = att.entryTime ? new Date(att.entryTime) : new Date(att.date);
                const colombiaTime = subHours(dateToUse, 5);
                const key = format(colombiaTime, 'yyyy-MM-dd');
                acc[key] = att;
                return acc;
            }, {} as Record<string, typeof emp.attendances[0]>);

            let totalHours = { HD: 0, HN: 0, HDD: 0, HND: 0, HED: 0, HEN: 0, HEDD: 0, HEND: 0 };
            let daysAbsent = 0;
            let daysIncapacity = 0;
            let daysVacation = 0;
            let workedDaysInWeek = 0;
            let currentWeek = getISOWeek(fetchStart);

            for (const day of allDays) {
                const dateStr = format(day, 'yyyy-MM-dd');
                const att = mappedRecords[dateStr];
                const abs = emp.absences.find(a => format(new Date(a.date), 'yyyy-MM-dd') === dateStr);
                const isWithinPeriod = !isBefore(day, monthStart);
                const isSunday = day.getDay() === 0;
                const isFestivo = isHoliday(day);

                const dayWeek = getISOWeek(day);
                if (dayWeek !== currentWeek) {
                    currentWeek = dayWeek;
                    workedDaysInWeek = 0;
                }

                let dayHours = { HD: 0, HN: 0, HDD: 0, HND: 0, HED: 0, HEN: 0, HEDD: 0, HEND: 0 };
                let isPaidDay = false;

                if (att && att.entryTime && att.exitTime) {
                    const isSpecialDay = isSunday || isFestivo;
                    const calculated = calculateShiftHours(att.entryTime, att.exitTime, isSpecialDay);
                    if (day.getDate() === 31) {
                        dayHours = { ...calculated, HD: 0, HN: 0 };
                    } else {
                        dayHours = calculated;
                    }
                    workedDaysInWeek++;
                    isPaidDay = true;
                } else if (abs) {
                    const reason = abs.reason;
                    const percentage = getAbsencePercentage(reason);
                    if (isWithinPeriod) {
                        if (reason.toLowerCase().includes('vacaciones')) daysVacation++;
                        else if (percentage > 0 && percentage < 1) daysIncapacity++;
                        else if (percentage === 0) daysAbsent++;
                    }
                    if (percentage === 1) workedDaysInWeek++;
                    if (percentage > 0) {
                        dayHours.HD = 8 * percentage;
                        isPaidDay = true;
                    }
                } else if (isFestivo) {
                    dayHours.HD = 8;
                    isPaidDay = true;
                }

                // Sunday rest entitlement
                if (isSunday && !att && workedDaysInWeek >= 6) {
                    dayHours.HD = 8;
                    isPaidDay = true;
                }

                if (isWithinPeriod) {
                    totalHours.HD += dayHours.HD;
                    totalHours.HN += dayHours.HN;
                    totalHours.HDD += dayHours.HDD;
                    totalHours.HND += dayHours.HND;
                    totalHours.HED += dayHours.HED;
                    totalHours.HEN += dayHours.HEN;
                    totalHours.HEDD += dayHours.HEDD;
                    totalHours.HEND += dayHours.HEND;
                }
            }

            // February commercial adjustment
            if (now.getMonth() === 1) {
                const daysInFeb = monthEnd.getDate();
                totalHours.HD += (30 - daysInFeb) * 8;
            }

            const payroll = calculatePayroll(
                { salary: emp.salary, riskClass: emp.riskClass },
                totalHours,
                daysAbsent,
                daysIncapacity,
                daysVacation,
                30
            );

            totalPrestaciones += payroll.totalProvisions;
            totalSegSocial += payroll.totalSecurity;
            totalNetoPagar += payroll.netPay;
        }

        return NextResponse.json({
            employees: {
                total: totalEmployees,
                inactive: inactiveEmployees,
                active: totalEmployees
            },
            attendance: {
                present: presentCount,
                workingNow: activeNowCount,
                absent: Math.max(0, totalEmployees - presentCount)
            },
            financials: {
                projectedMonthly: Math.round(totalNetoPagar),
                totalPrestaciones: Math.round(totalPrestaciones),
                totalSegSocial: Math.round(totalSegSocial)
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
