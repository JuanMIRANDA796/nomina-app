import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
    try {
        const now = new Date();
        const start = startOfDay(now);
        const end = endOfDay(now);
        const startMonth = startOfMonth(now);
        const endMonth = endOfMonth(now);

        // 1. Employee Stats
        const totalEmployees = await prisma.employee.count({
            where: { status: 'ACTIVE' }
        });

        const inactiveEmployees = await prisma.employee.count({
            where: { status: 'INACTIVE' }
        });

        // 2. Attendance Daily Stats
        const attendanceToday = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end
                }
            },
            include: { employee: true }
        });

        const presentCount = attendanceToday.length;
        const activeNowCount = attendanceToday.filter(a => !a.exitTime).length; // clocked in, not out

        // 3. Financial Estimates (Rough projection based on monthly salary)
        // Sum of all active employees' salary
        const activeEmployees = await prisma.employee.findMany({
            where: { status: 'ACTIVE' },
            select: { salary: true }
        });

        const totalMonthlyPayroll = activeEmployees.reduce((acc, emp) => acc + emp.salary, 0);

        return NextResponse.json({
            employees: {
                total: totalEmployees,
                inactive: inactiveEmployees,
                active: totalEmployees // Assuming total is active filter? No, total is just active count per query above.
            },
            attendance: {
                present: presentCount,
                workingNow: activeNowCount,
                absent: totalEmployees - presentCount // Rough estimate
            },
            financials: {
                projectedMonthly: totalMonthlyPayroll
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
