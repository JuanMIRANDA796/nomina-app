import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Using as any to bypass Prisma schema sync issues with the plan field
        const company = await prisma.company.findUnique({
            where: { id: companyId }
        }) as any;

        if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            id: company.id,
            name: company.name,
            plan: company.plan,
            createdAt: company.createdAt
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}
