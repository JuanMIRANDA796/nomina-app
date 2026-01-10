import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { calculateShiftHours, ShiftResult } from '@/lib/payroll';

// Official Colombian Surcharges
const RATES = {
    HD: 1.0,     // Ordinaria Diurna
    HN: 1.35,    // Recargo Nocturno (0.35) -> Total 1.35 if worked as Ordinary
    HDD: 1.75,   // Dominical Diurna (0.75 recargo) -> Total 1.75
    HND: 2.10,   // Dom Nocturna (0.75 + 0.35) -> Total 2.10

    HED: 1.25,   // Extra Diurna
    HEN: 1.75,   // Extra Nocturna
    HEDD: 2.00,  // Extra Dom Diurna
    HEND: 2.50   // Extra Dom Nocturna
};

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date'); // YYYY-MM

        if (!dateParam) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        const date = parseISO(`${dateParam}-01`);
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const employees = await prisma.employee.findMany({
            include: {
                attendances: {
                    where: {
                        date: {
                            gte: start,
                            lte: end,
                        },
                        exitTime: { not: null }, // Only completed shifts
                    },
                },
            },
        });

        const report = employees.map(emp => {
            let totalHours: ShiftResult = {
                HD: 0, HN: 0, HDD: 0, HND: 0,
                HED: 0, HEN: 0, HEDD: 0, HEND: 0
            };

            emp.attendances.forEach(att => {
                if (!att.entryTime || !att.exitTime) return;

                // Determine if Sunday
                // TODO: Add Holiday Logic (Festivos)
                const isSunday = att.date.getDay() === 0;

                const hours = calculateShiftHours(att.entryTime, att.exitTime, isSunday);

                // Accumulate
                totalHours.HD += hours.HD;
                totalHours.HN += hours.HN;
                totalHours.HDD += hours.HDD;
                totalHours.HND += hours.HND;
                totalHours.HED += hours.HED;
                totalHours.HEN += hours.HEN;
                totalHours.HEDD += hours.HEDD;
                totalHours.HEND += hours.HEND;
            });

            // Calculate Pay
            // Base Hourly Rate = Salary / 240 (Standard 30 days * 8 hours legacy, or 230 for 46h? 
            // Standard is still 240 for calculations usually, or 235 for 47h week.
            // Let's stick to 240 for now unless specified otherwise).
            const hourlyRate = emp.salary / 240;

            const payment =
                (totalHours.HD * hourlyRate * RATES.HD) +
                (totalHours.HN * hourlyRate * RATES.HN) +
                (totalHours.HDD * hourlyRate * RATES.HDD) +
                (totalHours.HND * hourlyRate * RATES.HND) +
                (totalHours.HED * hourlyRate * RATES.HED) +
                (totalHours.HEN * hourlyRate * RATES.HEN) +
                (totalHours.HEDD * hourlyRate * RATES.HEDD) +
                (totalHours.HEND * hourlyRate * RATES.HEND);

            return {
                employee: {
                    id: emp.id,
                    name: emp.name,
                    cedula: emp.cedula,
                    salary: emp.salary,
                },
                hours: totalHours,
                payment: Math.round(payment),
                totalWorkedHours: Object.values(totalHours).reduce((a, b) => a + b, 0),
            };
        });

        return NextResponse.json(report);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
