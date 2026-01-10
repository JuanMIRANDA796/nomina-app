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

        const today = startOfDay(new Date());
        const now = new Date();

        // 2. Find today's attendance record
        let attendance = await prisma.attendance.findFirst({
            where: {
                employeeId: employee.id,
                date: today,
            },
        });

        if (action === 'ENTRY') {
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
                if (attendance.entryTime) {
                    return NextResponse.json({ error: 'Ya existe una hora de entrada para hoy' }, { status: 400 });
                } else {
                    // Update existing record (unlikely case unless manually messed up, but safe to handle)
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { entryTime: now },
                    });
                    return NextResponse.json({ message: 'Hora de entrada registrada', time: now });
                }
            }
        }

        else if (action === 'EXIT') {
            if (!attendance) {
                // Case: No record exists at all.
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
                // Record exists
                if (!attendance.entryTime && !attendance.exitTime) {
                    // Should not happen if record exists, but same logic as above
                    const estimatedEntry = subHours(now, 8);
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: {
                            entryTime: estimatedEntry,
                            exitTime: now
                        },
                    });
                    return NextResponse.json({ message: 'Salida registrada', time: now });
                }
                else if (!attendance.entryTime && attendance.exitTime) {
                    // VBA: "Si hay salida pero no entrada -> calcular entrada = salida - 8h"
                    // This implies we are UPDATING the exit time? Or fixing the entry?
                    // The VBA logic says: celdaFecha.Offset(0, 5).Value = celdaFecha.Offset(0, 6).Value - TimeSerial(8, 0, 0)
                    // It seems to fix the missing entry based on the EXISTING exit? 
                    // Or is it updating the exit to NOW and then fixing entry?
                    // Let's assume we are registering a NEW exit, so we update exit to NOW, and if entry is missing, fix it.

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
                    // Normal case: Entry exists, no exit. Register exit.
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { exitTime: now },
                    });
                    return NextResponse.json({ message: 'Hora de salida registrada', time: now });
                }
                else {
                    // Both exist. VBA: "Si ambas existen -> sobrescribe salida con la hora actual"
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { exitTime: now },
                    });
                    return NextResponse.json({ message: 'Hora de salida actualizada', time: now });
                }
            }
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
