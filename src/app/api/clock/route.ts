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
                // Validation relaxed: Allow updating the entry time if they click again.
                attendance = await prisma.attendance.update({
                    where: { id: attendance.id },
                    data: { entryTime: now }
                });
                return NextResponse.json({ message: 'Hora de entrada actualizada', time: now });
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
                // ATTENDANCE EXISTS
                // We previously handled "Open Shift" (entry && !exit) at the top.
                // Remaining cases: Completed (entry && exit) OR Missing Entry (!entry).

                if (attendance.entryTime && attendance.exitTime) {
                    // Shift already completed.
                    // USER REQUEST: "Quitar el bloqueo". We overwrite to restart the day.
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: {
                            entryTime: now,
                            exitTime: null
                        },
                    });
                    return NextResponse.json({
                        message: 'Hora de entrada actualizada (Turno reiniciado)',
                        time: now,
                        warning: 'Se sobreescribió el registro anterior.'
                    });
                }

                else if (!attendance.entryTime) {
                    // Fix missing entry (Broken state or just Exit recorded?)
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { entryTime: now },
                    });
                    return NextResponse.json({ message: 'Hora de entrada registrada', time: now });
                }

                else {
                    // Fallback for any other weird state (e.g. valid entry but we missed the check?)
                    // Just update entry time.
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { entryTime: now }
                    });
                    return NextResponse.json({ message: 'Hora de entrada actualizada', time: now });
                }
            }
        }


        else if (action === 'EXIT') {
            // ------------------------------------------------------------------
            // LOGIC PARITY: 14-HOUR RULE
            // ------------------------------------------------------------------

            // 1. Check Previous Day's Attendance
            const yesterday = subHours(today, 24);
            const yesterdayAttendance = await prisma.attendance.findFirst({
                where: {
                    employeeId: employee.id,
                    date: yesterday,
                }
            });

            // 2. Evaluate "Overnight Shift" (Entry Yesterday + No Exit Yesterday)
            let isOvernightShift = false;

            if (yesterdayAttendance && yesterdayAttendance.entryTime && !yesterdayAttendance.exitTime) {
                const entryTime = new Date(yesterdayAttendance.entryTime);
                const durationHours = (now.getTime() - entryTime.getTime()) / (1000 * 60 * 60);

                // User Rule: "si la diferencia... es menor a 14 horas"
                // Example: 9 PM (21:00) to 5 AM (05:00) = 8 hours. 8 < 14 -> TRUE.
                if (durationHours < 14) {
                    isOvernightShift = true;

                    // Close YESTERDAY's record with TODAY's time
                    // The 'date' of the record remains Yesterday (e.g., 16 Enero)
                    // The 'exitTime' is Now (e.g., 17 Enero 05:00 AM)
                    await prisma.attendance.update({
                        where: { id: yesterdayAttendance.id },
                        data: { exitTime: now },
                    });

                    return NextResponse.json({
                        message: 'Salida registrada (Turno nocturno cerrado)',
                        time: now,
                        warning: 'Cierre de turno del día anterior (< 14h).'
                    });
                }
            }

            // 3. If NOT Overnight (Duration > 14h OR No Entry Yesterday), Apply "Minus 8h" Logic to Today
            if (!isOvernightShift) {
                // Determine which 'attendance' record we are updating/creating

                if (!attendance) {
                    // Start fresh for Today -> assume 8 hours shift
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
                        warning: 'Se asumió turno de 8 horas.'
                    });
                } else {
                    // Record exists for today
                    if (!attendance.entryTime && attendance.exitTime) {
                        // Already has exit? Update it.
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
                    else if (attendance.entryTime && !attendance.exitTime) {
                        // Normal shift entered TODAY -> Close TODAY
                        attendance = await prisma.attendance.update({
                            where: { id: attendance.id },
                            data: { exitTime: now },
                        });
                        return NextResponse.json({ message: 'Hora de salida registrada', time: now });
                    }
                    else {
                        // Overwrite existing exit
                        attendance = await prisma.attendance.update({
                            where: { id: attendance.id },
                            data: { exitTime: now },
                        });
                        return NextResponse.json({ message: 'Hora de salida actualizada', time: now });
                    }
                }
            }
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
