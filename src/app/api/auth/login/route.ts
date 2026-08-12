import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SUPERADMIN_USER = 'NominaX';
const SUPERADMIN_PASS = 'NominaX';

export async function POST(req: Request) {
    try {
        const { name, password } = await req.json();

        if (!name || !password) {
            return NextResponse.json({ error: 'Nombre y contraseña son obligatorios' }, { status: 400 });
        }

        // Super-admin bypass
        if (name === SUPERADMIN_USER && password === SUPERADMIN_PASS) {
            return NextResponse.json({
                message: 'Login exitoso',
                companyId: 0,
                companyName: 'NominaX',
                role: 'SUPERADMIN'
            });
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
            companyName: company.name,
            role: 'COMPANY'
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
