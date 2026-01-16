import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, subHours, addHours } from 'date-fns';

export async function POST(request: Request) {
    try {
        const { cedula, action } = await request.json(); // action: 'ENTRY' | 'EXIT'

        if (!cedula || !action) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // 1. Find Employee
        const employee = await prisma.employee.findUnique({
            where: { cedula },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
        }

        // TIMZONE FIX: Force Colombia Time (UTC-5) for "Day" calculation
        // Vercel server is UTC. 9PM Colombia = 2AM Next Day UTC.
        // This causes the shift to be saved as "Tomorrow", blocking the actual tomorrow shift.
        const now = new Date();
        const colombiaOffset = 5;
        const colombiaTime = subHours(now, colombiaOffset);

        // "Today" is the start of the day in COLOMBIA time
        const today = startOfDay(colombiaTime); // e.g. 2026-01-15 00:00:00 (Local)

        // 2. Find today's attendance record
        let attendance = await prisma.attendance.findFirst({
            where: {
                employeeId: employee.id,
                date: today,
            },
        });

        if (action === 'ENTRY') {
            if (attendance && attendance.entryTime && !attendance.exitTime) {
                // Already has an open entry?
                // Technically this shouldn't happen if UI respects state, but if they click Entry again?
                return NextResponse.json({ error: 'Ya tienes un turno abierto' }, { status: 400 });
            }

            if (!attendance) {
                // Create new record
                attendance = await prisma.attendance.create({
                    data: {
                        employeeId: employee.id,
                        date: today,
                        entryTime: now,
                    },
                });
                return NextResponse.json({ message: 'Hora de entrada registrada', time: now });
            } else {
                if (attendance.entryTime && attendance.exitTime) {
                    // Shift already completed today. Blocking new entry?
                    // User complaint: "le dice que ya existe una hora de entrada para hoy"
                    // If they work doubled shifts (morning + night), we need to allow this.
                    // But schema has UNIQUE(date). We cannot create a SECOND record for 'today'.
                    // We must reuse the record? No, that overwrites.
                    // LIMITATION: System supports 1 shift per day.
                    // However, for the specific user complaint (Night Shift), the bug implies the "Day 12" record shouldn't exist yet.
                    // If we fix the Exit logic below, this Entry logic might be fine as is (since attendance won't exist).
                    // But if it DOES exist (e.g. they really worked morning), we warn.
                    return NextResponse.json({ error: 'Ya existe una hora de entrada para hoy' }, { status: 400 });
                } else if (!attendance.entryTime) {
                    // Fix missing entry
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { entryTime: now },
                    });
                    return NextResponse.json({ message: 'Hora de entrada registrada', time: now });
                }
            }
        }

        else if (action === 'EXIT') {
            // CRITICAL FIX: Check if we have an open shift from YESTERDAY (Overnight shift)
            // Before checking 'today', check if we need to close 'yesterday'.
            const yesterday = subHours(today, 24); // safely subtract 1 day

            const yesterdayAttendance = await prisma.attendance.findFirst({
                where: {
                    employeeId: employee.id,
                    date: yesterday,
                }
            });

            // If yesterday has Entry but NO Exit, we stick the exit there!
            if (yesterdayAttendance && yesterdayAttendance.entryTime && !yesterdayAttendance.exitTime) {
                await prisma.attendance.update({
                    where: { id: yesterdayAttendance.id },
                    data: { exitTime: now },
                });
                return NextResponse.json({
                    message: 'Salida registrada (Turno nocturno cerrado)',
                    time: now,
                    warning: 'Cierre de turno del día anterior.'
                });
            }

            // Normal Logic (Same Day)
            if (!attendance) {
                // Case: No record exists at all for today.
                // VBA Logic: "Si no hay ninguna -> asigna salida actual y calcula entrada automática (Salida - 8h)"
                const estimatedEntry = subHours(now, 8);
                attendance = await prisma.attendance.create({
                    data: {
                        employeeId: employee.id,
                        date: today,
                        entryTime: estimatedEntry,
                        exitTime: now,
                    },
                });
                return NextResponse.json({
                    message: 'Salida registrada (Entrada estimada hace 8h)',
                    time: now,
                    warning: 'Se asumió turno de 8 horas por falta de registro de entrada.'
                });
            } else {
                // Record exists for today
                if (!attendance.entryTime && attendance.exitTime) {
                    // Already has exit, updating it?
                    const estimatedEntry = subHours(now, 8);
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: {
                            entryTime: estimatedEntry,
                            exitTime: now
                        },
                    });
                    return NextResponse.json({ message: 'Salida actualizada', time: now });
                }
                else {
                    // Normal case: Entry exists (or both), update Exit to NOW.
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { exitTime: now },
                    });
                    return NextResponse.json({ message: 'Hora de salida registrada', time: now });
                }
            }
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
