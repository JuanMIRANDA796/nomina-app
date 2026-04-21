import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';
import { startOfDay, endOfDay, subHours, addHours } from 'date-fns';
import { Prisma } from '@prisma/client';

// Prisma error codes that indicate a transient connection issue (safe to retry)
const RETRYABLE_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);

/**
 * Retries a Prisma operation up to `maxAttempts` times on transient connection errors.
 * Other errors (e.g. constraint violations) are thrown immediately without retrying.
 */
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            const isRetryable =
                (err instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE_CODES.has(err.code)) ||
                err instanceof Prisma.PrismaClientInitializationError ||
                err instanceof Prisma.PrismaClientRustPanicError;

            if (!isRetryable) throw err; // Non-transient error — fail immediately

            if (attempt < maxAttempts) {
                console.warn(`[CLOCK API] DB connection error (attempt ${attempt}/${maxAttempts}), retrying...`);
                await new Promise(resolve => setTimeout(resolve, 300 * attempt)); // 300ms, 600ms
            }
        }
    }
    throw lastError;
}

/**
 * Calculates the canonical "date key" for a given moment in Colombia time.
 * Always stored as noon UTC-offset to be deterministic and timezone-safe.
 */
function getColombiaDateKey(now: Date): { today: Date; todayStart: Date; todayEnd: Date } {
    const COLOMBIA_OFFSET = 5; // UTC-5, no DST
    const colombiaTime = subHours(now, COLOMBIA_OFFSET);
    const todayStart = startOfDay(colombiaTime);
    const todayEnd = endOfDay(colombiaTime);
    // Store canonical date as noon of the Colombia day to avoid edge cases at midnight
    const today = addHours(todayStart, 12);
    return { today, todayStart, todayEnd };
}

export async function POST(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cedula, action } = await request.json(); // action: 'ENTRY' | 'EXIT'

        if (!cedula || !action) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Find the employee for this company
        const employee = await prisma.employee.findUnique({
            where: { companyId_cedula: { companyId, cedula } },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
        }

        const now = new Date();
        const { today, todayStart, todayEnd } = getColombiaDateKey(now);

        // Wrap all DB operations in a retry block to handle transient
        // connection timeouts on Vercel cold/warm starts transparently.
        return await withRetry(async () => {

            // ── ENTRY ────────────────────────────────────────────────────────────
            if (action === 'ENTRY') {
                // Read existing record to determine the right response message
                const existing = await prisma.attendance.findFirst({
                    where: {
                        employeeId: employee.id,
                        date: { gte: todayStart, lte: todayEnd },
                    },
                });

                // UPSERT is atomic: creates if not found, updates if found.
                // This permanently eliminates the race-condition / P2002 bug.
                await prisma.attendance.upsert({
                    where: {
                        employeeId_date: { employeeId: employee.id, date: today },
                    },
                    update: {
                        entryTime: now,
                        exitTime: null, // Reset exit so the shift starts fresh
                    },
                    create: {
                        employeeId: employee.id,
                        date: today,
                        entryTime: now,
                    },
                });

                if (!existing) {
                    return NextResponse.json({ message: 'Hora de entrada registrada', time: now });
                }
                if (existing.entryTime && existing.exitTime) {
                    return NextResponse.json({
                        message: 'Hora de entrada actualizada (Turno reiniciado)',
                        time: now,
                        warning: 'Se sobreescribió el registro anterior.',
                    });
                }
                return NextResponse.json({ message: 'Hora de entrada actualizada', time: now });
            }

            // ── EXIT ──────────────────────────────────────────────────────────────
            if (action === 'EXIT') {
                const yesterday = subHours(today, 24);

                // Check for an open overnight shift from yesterday
                const yesterdayRecord = await prisma.attendance.findUnique({
                    where: { employeeId_date: { employeeId: employee.id, date: yesterday } },
                });

                if (yesterdayRecord?.entryTime && !yesterdayRecord?.exitTime) {
                    const hoursElapsed =
                        (now.getTime() - new Date(yesterdayRecord.entryTime).getTime()) / 3_600_000;

                    if (hoursElapsed < 14) {
                        // Close the overnight shift on yesterday's record
                        await prisma.attendance.update({
                            where: { id: yesterdayRecord.id },
                            data: { exitTime: now },
                        });
                        return NextResponse.json({
                            message: 'Salida registrada (Turno nocturno cerrado)',
                            time: now,
                            warning: 'Cierre de turno del día anterior (< 14h).',
                        });
                    }
                }

                // Normal exit flow — find today's existing record
                const todayRecord = await prisma.attendance.findFirst({
                    where: {
                        employeeId: employee.id,
                        date: { gte: todayStart, lte: todayEnd },
                    },
                });

                if (todayRecord) {
                    // Update the existing record's exit time
                    await prisma.attendance.update({
                        where: { id: todayRecord.id },
                        data: { exitTime: now },
                    });
                    const msg = todayRecord.exitTime
                        ? 'Hora de salida actualizada'
                        : 'Hora de salida registrada';
                    return NextResponse.json({ message: msg, time: now });
                } else {
                    // No entry found today — upsert with estimated 8-hour entry
                    const estimatedEntry = subHours(now, 8);
                    await prisma.attendance.upsert({
                        where: {
                            employeeId_date: { employeeId: employee.id, date: today },
                        },
                        update: { exitTime: now },
                        create: {
                            employeeId: employee.id,
                            date: today,
                            entryTime: estimatedEntry,
                            exitTime: now,
                        },
                    });
                    return NextResponse.json({
                        message: 'Salida registrada (Entrada estimada hace 8h)',
                        time: now,
                        warning: 'Se asumió turno de 8 horas.',
                    });
                }
            }

            return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        });

    } catch (error) {
        console.error('[CLOCK API ERROR]', error);

        // Should never happen with upsert, but kept as last-resort safety net
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Conflicto de registro de asistencia. Intenta de nuevo.' },
                { status: 409 }
            );
        }

        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
