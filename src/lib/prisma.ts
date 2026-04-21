import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        // Only log queries in development — in production only errors matter
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

// Always persist the singleton regardless of environment.
// In Vercel, serverless containers are reused across warm invocations,
// so keeping a single PrismaClient avoids opening a new DB connection on every request.
globalForPrisma.prisma = prisma;

// ---------------------------------------------------------------------------
// Retry utility — shared across all API routes
// ---------------------------------------------------------------------------

/** Prisma error codes that indicate a transient connection issue (safe to retry) */
const RETRYABLE_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);

/**
 * Retries a Prisma operation up to `maxAttempts` times when a transient
 * connection error is detected (cold start, pool exhaustion, network blip).
 * Non-transient errors (constraint violations, bad input, etc.) are re-thrown
 * immediately so the caller can handle them correctly.
 *
 * @example
 *   return await withRetry(() => prisma.attendance.upsert({ ... }));
 */
export async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
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
                console.warn(`[DB] Transient error on attempt ${attempt}/${maxAttempts}, retrying in ${300 * attempt}ms...`);
                await new Promise(resolve => setTimeout(resolve, 300 * attempt)); // 300ms, 600ms
            }
        }
    }
    throw lastError;
}
