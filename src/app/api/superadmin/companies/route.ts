import { NextResponse } from 'next/server';
import { prisma, withRetry } from '@/lib/prisma';
import { isSuperAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Hasta agosto de 2026 esta ruta se "protegía" comparando el header
    // `x-superadmin-key` contra un texto fijo. Ese texto estaba escrito en
    // src/app/superadmin/page.tsx, un componente de cliente, así que viajaba
    // en el JavaScript que descarga cualquier visitante: bastaba leerlo del
    // bundle para obtener el nombre, correo y teléfono de todas las empresas.
    //
    // Ahora exige una sesión firmada con rol de superadministrador. El header
    // heredado sin firma nunca alcanza ese rol.
    if (!(await isSuperAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const companies = await withRetry(() =>
            prisma.company.findMany({
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
            })
        );

        return NextResponse.json({ companies });
    } catch (error) {
        console.error('Superadmin companies error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
