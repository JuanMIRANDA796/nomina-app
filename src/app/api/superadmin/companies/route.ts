import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    // Very simple protection: only callable from server context
    // In a real app this would use a proper auth token
    const authHeader = req.headers.get('x-superadmin-key');
    if (authHeader !== 'NominaX') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const companies = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                companyName: true,
                email: true,
                phone: true,
                plan: true,
                createdAt: true,
                _count: {
                    select: { employees: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ companies });
    } catch (error) {
        console.error('Superadmin companies error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
