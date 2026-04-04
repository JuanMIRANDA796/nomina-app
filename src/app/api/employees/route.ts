import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const employees = await prisma.employee.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(employees);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { name, cedula, cargo, salary } = body;

        // Fetch company details to check plan limits
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: {
                _count: {
                    select: { employees: true }
                }
            }
        });

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        // Apply plan limits, except for PERSIFAL
        if (company.name !== 'PERSIFAL') {
            const currentEmployeeCount = company._count.employees;
            
            if (company.plan === 'SEMILLA' && currentEmployeeCount >= 2) {
                return NextResponse.json({ 
                    error: 'Límite alcanzado',
                    details: 'El plan Semilla permite un máximo de 2 empleados. Por favor, mejora tu suscripción para continuar creciendo.'
                }, { status: 403 });
            }

            if (company.plan === 'EMPRENDEDOR' && currentEmployeeCount >= 10) {
                return NextResponse.json({ 
                    error: 'Límite alcanzado',
                    details: 'El plan Emprendedor permite un máximo de 10 empleados. Por favor, mejora a Empresarial para no tener límites.'
                }, { status: 403 });
            }
        }

        console.log('Intentando crear empleado:', { name, cedula, cargo, salary, companyId });

        const employee = await prisma.employee.create({
            data: {
                name,
                cedula,
                cargo,
                salary: parseFloat(salary),
                status: 'ACTIVE',
                companyId
            },
        });

        console.log('Empleado creado exitosamente:', employee);
        return NextResponse.json(employee);
    } catch (error: any) {
        console.error('Error detallado al crear empleado:', error);
        return NextResponse.json({
            error: 'Failed to create employee',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
