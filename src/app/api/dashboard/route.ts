import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';
import { startOfDay, endOfDay } from 'date-fns';
import { calculatePayroll, WORK_HOURS_MONTH } from '@/lib/payroll_engine';

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
            where: { companyId, status: 'ACTIVE' },
            select: { salary: true, riskClass: true }
        });

        const totalMonthlyPayroll = activeEmployees.reduce((acc, emp) => acc + emp.salary, 0);

        // Use the payroll engine to calculate exact prestaciones and seguridad social
        // for a standard full month (no overtime, no absences)
        const fullMonthHours = { HD: WORK_HOURS_MONTH, HN: 0, HDD: 0, HND: 0, HED: 0, HEN: 0, HEDD: 0, HEND: 0 };
        
        let totalPrestaciones = 0;
        let totalSegSocial = 0;

        for (const emp of activeEmployees) {
            const payroll = calculatePayroll(emp, fullMonthHours, 0, 0, 0, 30);
            totalPrestaciones += payroll.totalProvisions;
            totalSegSocial += payroll.totalSecurity;
        }

        totalPrestaciones = Math.round(totalPrestaciones);
        totalSegSocial = Math.round(totalSegSocial);

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
                projectedMonthly: totalMonthlyPayroll,
                totalPrestaciones,
                totalSegSocial
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
