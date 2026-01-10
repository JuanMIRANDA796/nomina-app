import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ABSENCE_CONFIG, getAbsencePercentage } from '@/lib/absence_config';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);
        const { date, reason } = await request.json();

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        const dateObj = new Date(date);

        // If reason is empty, delete absence
        if (!reason) {
            await prisma.absence.deleteMany({
                where: {
                    employeeId,
                    date: dateObj
                }
            });
            // Also ensure no attendance exists if we want "Sin Registro"? 
            // The "Cambiar" button implies clearing the Absence. 
            // If Attendance is also null, status becomes MISSING.
            return NextResponse.json({ success: true, deleted: true });
        }

        // Upsert absence
        const paidPercentage = getAbsencePercentage(reason);

        const absence = await prisma.absence.upsert({
            where: {
                employeeId_date: {
                    employeeId,
                    date: dateObj
                }
            },
            update: {
                reason,
                paidPercentage
            },
            create: {
                employeeId,
                date: dateObj,
                reason,
                paidPercentage
            }
        });

        // Ensure no Attendance record exists for this day if it's an absence?
        // Usually creating an absence overrides attendance. 
        // We should probably delete attendance if it exists to be consistent.
        await prisma.attendance.deleteMany({
            where: {
                employeeId,
                date: dateObj
            }
        });

        return NextResponse.json(absence);
    } catch (error) {
        console.error('Error creating absence:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
