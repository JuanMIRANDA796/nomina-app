import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyId } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!employee || employee.companyId !== companyId) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
        }

        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener empleado' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { name, cedula, cargo, salary, riskClass, status } = body;

        // Verify ownership
        const employee = await prisma.employee.findUnique({ where: { id: parseInt(id) } });
        if (!employee || employee.companyId !== companyId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: {
                name,
                cedula,
                cargo,
                salary: parseFloat(salary),
                riskClass,
                status
            },
        });

        return NextResponse.json(updatedEmployee);
    } catch (error: any) {
        console.error('Error updating employee:', error);
        
        if (error.code === 'P2002') {
            return NextResponse.json({
                error: 'Cédula duplicada',
                details: 'Ya existe un empleado con esta cédula en tu empresa.'
            }, { status: 400 });
        }

        return NextResponse.json({ error: 'Error al actualizar empleado', details: error.message || String(error) }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const permanent = searchParams.get('permanent') === 'true';

        // Verify ownership
        const employee = await prisma.employee.findUnique({ where: { id: parseInt(id) } });
        if (!employee || employee.companyId !== companyId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (permanent) {
            // Hard Delete: First clean up related data to avoid foreign key violations
            await prisma.$transaction([
                prisma.attendance.deleteMany({ where: { employeeId: parseInt(id) } }),
                prisma.absence.deleteMany({ where: { employeeId: parseInt(id) } }),
                prisma.employee.delete({ where: { id: parseInt(id) } })
            ]);
            return NextResponse.json({ message: 'Empleado eliminado permanentemente' });
        } else {
            // Soft Delete
            await prisma.employee.update({
                where: { id: parseInt(id) },
                data: { status: 'INACTIVE' }
            });
            return NextResponse.json({ message: 'Empleado desactivado (Eliminado logicamente)' });
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        return NextResponse.json({ error: 'Error al eliminar empleado' }, { status: 500 });
    }
}
