import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, username, currentPassword, newPassword } = body;
        
        const companyId = id ? parseInt(id) : 1;

        // Verify current password first
        const company = await prisma.company.findUnique({
            where: { id: companyId }
        });

        if (!company) {
             return NextResponse.json({ error: 'Compañía no encontrada' }, { status: 404 });
        }

        if (company.password !== currentPassword) {
            return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
        }

        const dataToUpdate: any = {};
        if (username && username.trim() !== '') {
            dataToUpdate.name = username.trim();
        }
        if (newPassword && newPassword.trim() !== '') {
            dataToUpdate.password = newPassword.trim();
        }

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: dataToUpdate
        });

        return NextResponse.json({ message: 'Credenciales actualizadas correctamente' });
    } catch (error) {
        console.error('Error updating credentials:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
