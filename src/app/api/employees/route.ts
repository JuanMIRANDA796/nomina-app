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
        const { name, cedula, cargo, salary, riskClass } = body;

        // Fetch company details to check plan limits
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: {
                _count: {
                    select: { employees: true }
                }
            }
        }) as any;

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        // Apply plan limits, except for PERSIFAL
        if (company.name !== 'PERSIFAL') {
            const currentEmployeeCount = company._count.employees;
            const extraEmployees = company.extraEmployees || 0;

            if (company.plan === 'SEMILLA' && currentEmployeeCount >= 10) {
                return NextResponse.json({ 
                    error: 'LIMIT_REACHED_SEMILLA',
                    details: 'La prueba gratuita permite un máximo de 10 empleados. Activa tu plan para añadir más.'
                }, { status: 403 });
            } else if (company.plan === 'EMPRENDEDOR' && currentEmployeeCount >= (10 + extraEmployees)) {
                return NextResponse.json({ 
                    error: 'LIMIT_REACHED_EMPRENDEDOR',
                    details: 'Límite del plan alcanzado. Adquiere un cupo adicional para continuar.'
                }, { status: 403 });
            } else if (company.plan === 'EMPRESARIAL' && currentEmployeeCount >= (20 + extraEmployees)) {
                return NextResponse.json({ 
                    error: 'LIMIT_REACHED_EMPRESARIAL',
                    details: 'Límite del plan alcanzado. Adquiere un cupo adicional para continuar.'
                }, { status: 403 });
            }
        }

        console.log('Intentando crear empleado:', { name, cedula, cargo, salary, riskClass, companyId });

        const employee = await prisma.employee.create({
            data: {
                name,
                cedula,
                cargo,
                salary: parseFloat(salary),
                riskClass: riskClass || 'I',
                status: 'ACTIVE',
                companyId
            },
        });

        console.log('Empleado creado exitosamente:', employee);
        return NextResponse.json(employee);
    } catch (error: any) {
        console.error('Error detallado al crear empleado:', error);
        
        if (error.code === 'P2002') {
            return NextResponse.json({
                error: 'Cédula duplicada',
                details: 'Ya existe un empleado con esta cédula en tu empresa.'
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Failed to create employee',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
