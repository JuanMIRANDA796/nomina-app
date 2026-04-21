import { PrismaClient } from '@prisma/client';

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
