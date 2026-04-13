import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In a real application, we would use auth tokens. 
// Assuming we fetch the first company or the one with ID 1 for simplicity, 
// as this resembles the current multi-tenant or single-tenant structure.
// Adjust as needed if tokens are provided.

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const companyIdParam = searchParams.get('companyId');
        const companyId = companyIdParam ? parseInt(companyIdParam) : 1;
        
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: {
                id: true,
                name: true,
                companyName: true,
                businessName: true,
                documentType: true,
                documentNumber: true,
                phone: true,
                nit: true,
                dv: true,
                departmentCode: true,
                cityCode: true,
                taxResponsibility: true,
                dianEnabled: true,
                dianTestSetId: true,
                dianPrefix: true,
                dianStartNumber: true,
            }
        });

        if (!company) {
            return NextResponse.json({ error: 'Compañía no encontrada' }, { status: 404 });
        }

        return NextResponse.json(company);
    } catch (error) {
        console.error('Error fetching company:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, companyName, businessName, documentType, documentNumber, phone, nit, dv, departmentCode, cityCode, taxResponsibility, dianEnabled, dianTestSetId, dianPrefix, dianStartNumber } = body;

        const companyId = id ? parseInt(id) : 1;

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: {
                companyName,
                businessName,
                documentType,
                documentNumber,
                phone,
                nit,
                dv,
                departmentCode,
                cityCode,
                taxResponsibility,
                dianEnabled: dianEnabled !== undefined ? dianEnabled : undefined,
                dianTestSetId,
                dianPrefix,
                dianStartNumber
            }
        });

        return NextResponse.json({ message: 'Datos actualizados correctamente', company: updatedCompany });
    } catch (error) {
        console.error('Error updating company:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
