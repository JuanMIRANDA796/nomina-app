import { NextResponse } from 'next/server';
import { prisma, withRetry } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';
import { startOfMonth, endOfMonth, eachDayOfInterval, subHours, addHours, parseISO, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const employeeId = parseInt(id);

        if (isNaN(employeeId)) {
            return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
        }

        return await withRetry(async () => {
            // Verify Ownership
            const employeeCheck = await prisma.employee.findUnique({ where: { id: employeeId } });
            if (!employeeCheck || employeeCheck.companyId !== companyId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            const { searchParams } = new URL(request.url);

            // Month/Year selection (Default to current)
            const now = new Date();
            const monthParam = searchParams.get('month');
            const yearParam = searchParams.get('year');

            const year = yearParam ? parseInt(yearParam) : now.getFullYear();
            const month = monthParam ? parseInt(monthParam) : now.getMonth(); // 0-11

            // Construct target date
            const targetDate = new Date(year, month, 1);
            const start = startOfMonth(targetDate);
            const end = endOfMonth(targetDate);

            // ---------------------------------------------------------
            // AUTO-CORRECTION LOGIC (Run before fetch)
            // ---------------------------------------------------------

            // Fetch raw records first
            let attendances = await prisma.attendance.findMany({
                where: {
                    employeeId: employeeId,
                    date: { gte: start, lte: end }
                },
                orderBy: { date: 'asc' }
            });

            const nowTime = new Date();
            const staleThreshold = subHours(nowTime, 20);

            // Iterate and Fix stale records
            for (const att of attendances) {
                let modified = false;
                // Case 1: Entry + >20h + No Exit -> Exit = Entry + 8h
                if (att.entryTime && !att.exitTime) {
                    if (new Date(att.entryTime) < staleThreshold) {
                        att.exitTime = addHours(new Date(att.entryTime), 8);
                        modified = true;
                    }
                }
                // Case 2: No Entry + Exit -> Entry = Exit - 8h
                else if (!att.entryTime && att.exitTime) {
                    att.entryTime = subHours(new Date(att.exitTime), 8);
                    modified = true;
                }

                if (modified) {
                    await prisma.attendance.update({
                        where: { id: att.id },
                        data: { entryTime: att.entryTime, exitTime: att.exitTime }
                    });
                }
            }

            // ---------------------------------------------------------
            // MERGE WITH FULL DAYS (Visual Alignment Fix)
            // ---------------------------------------------------------

            // Helper: Get "Colombia Date String" (YYYY-MM-DD) from a UTC Date
            const getColombiaDateStr = (date: Date) => {
                const colombiaTime = subHours(date, 5);
                return format(colombiaTime, 'yyyy-MM-dd');
            };

            // Pre-process attendances to find their "Visual Date"
            const mappedRecords = attendances.reduce((acc, att) => {
                let sortDate = new Date(att.date);
                if (att.entryTime) {
                    sortDate = new Date(att.entryTime);
                }
                const key = getColombiaDateStr(sortDate);
                acc[key] = att;
                return acc;
            }, {} as Record<string, typeof attendances[0]>);

            const allDays = eachDayOfInterval({ start, end });
            const history = allDays.map(day => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const record = mappedRecords[dayKey];
                return {
                    date: day.toISOString(),
                    recordId: record?.id || null,
                    entryTime: record?.entryTime || null,
                    exitTime: record?.exitTime || null,
                    status: (record?.entryTime && record?.exitTime) ? 'Completo' : 'Incompleto'
                };
            });

            // Fetch Employee Details
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
                select: { id: true, name: true, cedula: true, cargo: true }
            });

            return NextResponse.json({ employee, history });
        });

    } catch (error) {
        console.error('Error fetching attendance history:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const employeeId = parseInt(id);

        if (isNaN(employeeId)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const body = await request.json();
        const { date, entryTime, exitTime } = body;

        if (!date) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const targetDate = parseISO(date);
        
        // Extract the target calendar day (Vercel generates targetDate as 00:00 UTC)
        const year = targetDate.getUTCFullYear();
        const month = targetDate.getUTCMonth();
        const day = targetDate.getUTCDate();
        
        // The /api/clock endpoint always stores 'date' as exactly 12:00:00 UTC 
        // (noon of that calendar day) to avoid edge cases.
        const canonicalDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));

        const combineDateTime = (dateObj: Date, value: string) => {
            if (!value) return null;
            if (value.includes('T')) return new Date(value);
            if (value === '00:00') return null;
            const [hours, minutes] = value.split(':').map(Number);
            const newDate = new Date(dateObj);
            newDate.setHours(hours, minutes, 0, 0);
            return newDate;
        };

        return await withRetry(async () => {
            // Verify Ownership
            const employeeCheck = await prisma.employee.findUnique({ where: { id: employeeId } });
            if (!employeeCheck || employeeCheck.companyId !== companyId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            const updateData: { entryTime?: Date | null; exitTime?: Date | null } = {};
            if (entryTime !== undefined) {
                updateData.entryTime = entryTime ? combineDateTime(targetDate, entryTime) : null;
            }
            if (exitTime !== undefined) {
                updateData.exitTime = exitTime ? combineDateTime(targetDate, exitTime) : null;
            }

            // Upsert using the EXACT canonical date so it matches what /api/clock generates
            const record = await prisma.attendance.upsert({
                where: {
                    employeeId_date: { employeeId, date: canonicalDate }
                },
                update: updateData,
                create: {
                    employeeId,
                    date: canonicalDate,
                    entryTime: updateData.entryTime ?? null,
                    exitTime: updateData.exitTime ?? null
                }
            });

            return NextResponse.json({ success: true, record });
        });

    } catch (error) {
        console.error('Error updating attendance:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const employeeId = parseInt(id);

        if (isNaN(employeeId)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const json = await request.json();
        if (!json.date) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const date = parseISO(json.date);

        return await withRetry(async () => {
            // Verify Ownership
            const employeeCheck = await prisma.employee.findUnique({ where: { id: employeeId } });
            if (!employeeCheck || employeeCheck.companyId !== companyId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            // ROBUST DELETE: Find the canonical date
            const year = targetDay.getUTCFullYear();
            const month = targetDay.getUTCMonth();
            const day = targetDay.getUTCDate();
            
            // Delete the canonical attendance record (12:00 UTC)
            const canonicalDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));

            await prisma.attendance.deleteMany({
                where: {
                    employeeId,
                    date: canonicalDate
                }
            });

            // Also delete any exact matches just in case buggy ones were created
            const start = new Date(Date.UTC(year, month, day, 0, 0, 0));
            const end = new Date(Date.UTC(year, month, day, 23, 59, 59));
            
            await prisma.attendance.deleteMany({
                where: {
                    employeeId,
                    date: { gte: start, lte: end }
                }
            });

            await prisma.absence.deleteMany({
                where: { employeeId, date: targetDay }
            });

            return NextResponse.json({ success: true });
        });

    } catch (error) {
        console.error('Error deleting attendance/absence:', error);
        // Return success to allow UI to update even if record is already missing
        return NextResponse.json({ success: true });
    }
}
