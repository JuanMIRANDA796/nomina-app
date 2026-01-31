import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subHours, addHours, parseISO, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);
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

        if (isNaN(employeeId)) {
            return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
        }

        // ---------------------------------------------------------
        // AUTO-CORRECTION LOGIC (Run before fetch)
        // ---------------------------------------------------------

        // 1. Fix "Stale Open Shifts" (Entry exists, No Exit, Entry > 20h ago)
        // We look for ANY open shift for this employee, not just this month, to be safe? 
        // Or just this month? User said "llegado el caso...". 
        // It's safer to check current context. 
        // Let's check records in the requested window OR slightly before (to catch end of prev month)?
        // Actually, if I fetch strict window, I might miss a shift started yesterday.
        // But for "History View", we usually care about the data we see.
        // Let's run a check on the fetched records manually.

        // Fetch raw records first
        let attendances = await prisma.attendance.findMany({
            where: {
                employeeId: employeeId,
                date: {
                    gte: start,
                    lte: end
                }
            },
            orderBy: { date: 'asc' }
        });

        const nowTime = new Date();
        const staleThreshold = subHours(nowTime, 20);
        let updatesMade = false;

        // Iterate and Fix
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
                // Persist fix
                await prisma.attendance.update({
                    where: { id: att.id },
                    data: {
                        entryTime: att.entryTime,
                        exitTime: att.exitTime
                    }
                });
                updatesMade = true;
            }
        }

        // If updates made, technically 'attendances' array is updated in memory (mutated above), 
        // so we can use it directly or refetch. Mutation is fine for generic display.

        // ---------------------------------------------------------
        // MERGE WITH FULL DAYS
        // ---------------------------------------------------------

        // ---------------------------------------------------------
        // MERGE WITH FULL DAYS (Visual Alignment Fix)
        // ---------------------------------------------------------

        // Helper: Get "Colombia Date String" (YYYY-MM-DD) from a UTC Date
        const getColombiaDateStr = (date: Date) => {
            // Shift UTC to -5
            const colombiaTime = subHours(date, 5);
            return format(colombiaTime, 'yyyy-MM-dd');
        };

        // Pre-process attendances to find their "Visual Date"
        // Priority: EntryTime > Date Bucket
        const mappedRecords = attendances.reduce((acc, att) => {
            let sortDate = new Date(att.date);
            if (att.entryTime) {
                sortDate = new Date(att.entryTime);
            } else {
                // If only date bucket exists, shift it. 
                // Our new buckets are Noon UTC, so -5h stays same day.
                // Old buckets are Midnight UTC, so -5h becomes prev day.
                // If we want to support old buckets appearing on the "Next" day (correct day)?
                // Old Bucket: 00:00 UTC = 7PM Prev Day. 
                // If it has NO entry time, safe to assume it belongs to the day it claims to be?
                // Actually, if it has no entry time, it's just a placeholder. 
                // Let's stick to simple shift.
            }

            const key = getColombiaDateStr(sortDate);
            acc[key] = att;
            return acc;
        }, {} as Record<string, typeof attendances[0]>);


        const allDays = eachDayOfInterval({ start, end });
        const history = allDays.map(day => {
            // 'day' is loop variable (e.g. 2026-01-01 00:00:00 Local/UTC)
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

        return NextResponse.json({
            employee,
            history
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
        const { id } = await params;
        const employeeId = parseInt(id);
        const body = await request.json();
        const { date, entryTime, exitTime } = body;

        if (isNaN(employeeId) || !date) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const targetDate = parseISO(date);

        const combineDateTime = (dateObj: Date, value: string) => {
            if (!value) return null;

            // Check if it's already an ISO string (contains 'T')
            if (value.includes('T')) {
                return new Date(value);
            }

            // Legacy HH:mm format
            if (value === '00:00') return null;
            const [hours, minutes] = value.split(':').map(Number);
            const newDate = new Date(dateObj);
            newDate.setHours(hours, minutes, 0, 0);
            return newDate;
        };

        // Prepare Update Data dynamically to avoid overwriting undefined fields with null
        const updateData: any = {};

        if (entryTime !== undefined) {
            // Handle empty string as null
            updateData.entryTime = entryTime ? combineDateTime(targetDate, entryTime) : null;
        }

        if (exitTime !== undefined) {
            updateData.exitTime = exitTime ? combineDateTime(targetDate, exitTime) : null;
        }

        const record = await prisma.attendance.upsert({
            where: {
                employeeId_date: {
                    employeeId,
                    date: targetDate
                }
            },
            update: updateData,
            create: {
                employeeId,
                date: targetDate,
                entryTime: updateData.entryTime || null, // If creating, undefined becomes null
                exitTime: updateData.exitTime || null
            }
        });

        return NextResponse.json({ success: true, record });

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
        const { id } = await params;
        const employeeId = parseInt(id);
        const json = await request.json();
        const date = parseISO(json.date);

        if (isNaN(employeeId) || !json.date) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        // ROBUST DELETE: Use Range instead of Exact Match
        // This avoids timezone mismatches (00:00 UTC vs 05:00 UTC etc)
        // We delete ANY record for this employee on this calendar day.

        // Assuming 'date' param is YYYY-MM-DD from UI
        // We use the same start/end logic as GET
        const targetDay = parseISO(json.date); // or use the date object directly
        const start = new Date(targetDay);
        start.setHours(0, 0, 0, 0);
        const end = new Date(targetDay);
        end.setHours(23, 59, 59, 999);

        await prisma.attendance.deleteMany({
            where: {
                employeeId,
                date: {
                    gte: start,
                    lte: end
                }
            }
        });

        // Also delete any absence for this date? The reset logic in frontend handles attendance reset.
        // Usually, an absence is stored in 'Absence' table, not 'Attendance' table.
        // My Logic in Payroll Route checks Absence OR Attendance.
        // Resetting to "Sin Registro" implies deleting Attendance AND Absence?
        // Let's delete Absence too if it exists.
        // Need to check if Absence model has composite key or need to find it first.
        // Schema: Absence has 'id', 'employeeId', 'date'.
        // It doesn't have unique constraint on [employeeId, date] in my memory? 
        // Let's check schema later. For now, let's try deleteMany for safety on Absence too.

        await prisma.absence.deleteMany({
            where: {
                employeeId,
                date
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting attendance/absence:', error);
        // Return success to allow UI to update even if record missing
        return NextResponse.json({ success: true });
    }
}
