import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';
import { startOfDay, endOfDay, subHours, addHours } from 'date-fns';

export async function POST(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { cedula, action } = await request.json(); // action: 'ENTRY' | 'EXIT'

        if (!cedula || !action) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // 1. Find Employee for this company
        const employee = await prisma.employee.findUnique({
            where: { 
                companyId_cedula: { companyId, cedula }
            },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
        }

        const now = new Date();
        const colombiaOffset = 5;
        const colombiaTime = subHours(now, colombiaOffset);

        const todayStart = startOfDay(colombiaTime);
        const today = addHours(todayStart, 12);

        let attendance = await prisma.attendance.findFirst({
            where: {
                employeeId: employee.id,
                date: {
                    gte: todayStart,
                    lt: endOfDay(colombiaTime)
                }
            },
        });

        if (action === 'ENTRY') {
            if (attendance && attendance.entryTime && !attendance.exitTime) {
                attendance = await prisma.attendance.update({
                    where: { id: attendance.id },
                    data: { entryTime: now }
                });
                return NextResponse.json({ message: 'Hora de entrada actualizada', time: now });
            }

            if (!attendance) {
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
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { entryTime: now },
                    });
                    return NextResponse.json({ message: 'Hora de entrada registrada', time: now });
                }
                else {
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: { entryTime: now }
                    });
                    return NextResponse.json({ message: 'Hora de entrada actualizada', time: now });
                }
            }
        }
        else if (action === 'EXIT') {
            const yesterday = subHours(today, 24);
            const yesterdayAttendance = await prisma.attendance.findFirst({
                where: {
                    employeeId: employee.id,
                    date: yesterday,
                }
            });

            let isOvernightShift = false;

            if (yesterdayAttendance && yesterdayAttendance.entryTime && !yesterdayAttendance.exitTime) {
                const entryTime = new Date(yesterdayAttendance.entryTime);
                const durationHours = (now.getTime() - entryTime.getTime()) / (1000 * 60 * 60);

                if (durationHours < 14) {
                    isOvernightShift = true;
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

            if (!isOvernightShift) {
                if (!attendance) {
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
                    if (!attendance.entryTime && attendance.exitTime) {
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
                        attendance = await prisma.attendance.update({
                            where: { id: attendance.id },
                            data: { exitTime: now },
                        });
                        return NextResponse.json({ message: 'Hora de salida registrada', time: now });
                    }
                    else {
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
