import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, password } = await req.json();

        if (!name || !password) {
            return NextResponse.json({ error: 'Nombre y contraseña son obligatorios' }, { status: 400 });
        }

        const company = await prisma.company.findUnique({
            where: { name }
        });

        if (!company || company.password !== password) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        return NextResponse.json({
            message: 'Login exitoso',
            companyId: company.id,
            companyName: company.name
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
