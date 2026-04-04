import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, password } = await req.json();

        if (!name || name.length < 3) {
            return NextResponse.json({ error: 'El nombre debe tener al menos 3 caracteres' }, { status: 400 });
        }

        if (!password || password.length < 4) {
            return NextResponse.json({ error: 'La contraseña debe tener al menos 4 caracteres' }, { status: 400 });
        }

        // Check if exists
        const existing = await prisma.company.findUnique({
            where: { name }
        });

        if (existing) {
            return NextResponse.json({ error: 'Esta empresa ya está registrada' }, { status: 400 });
        }

        // Create company
        const company = await prisma.company.create({
            data: {
                name,
                password,
                configs: {
                    create: [
                        { key: 'AUX_TRANSPORTE', value: '162000', description: 'Auxilio de transporte legal 2024' },
                        { key: 'SMLV', value: '1300000', description: 'Salario Mínimo Legal Vigente 2024' },
                        { key: 'UVT', value: '47065', description: 'Valor UVT 2024' }
                    ]
                }
            }
        });

        return NextResponse.json({
            message: 'Empresa registrada con éxito',
            companyId: company.id,
            companyName: company.name
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
