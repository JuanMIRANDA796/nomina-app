import { NextResponse } from 'next/server';
import { prisma, withRetry } from '@/lib/prisma';
import {
    createSessionToken,
    hashPassword,
    SESSION_COOKIE,
    sessionCookieOptions,
} from '@/lib/session';

export async function POST(req: Request) {
    try {
        const { name, password, email, phone } = await req.json();

        if (!name || name.length < 3) {
            return NextResponse.json({ error: 'El nombre debe tener al menos 3 caracteres' }, { status: 400 });
        }

        if (!password || password.length < 4) {
            return NextResponse.json({ error: 'La contraseña debe tener al menos 4 caracteres' }, { status: 400 });
        }

        const existing = await withRetry(() => prisma.company.findUnique({ where: { name } }));

        if (existing) {
            return NextResponse.json({ error: 'Esta empresa ya está registrada' }, { status: 400 });
        }

        // Las empresas nuevas nacen con la contraseña hasheada. Las anteriores
        // se migran en su próximo ingreso, en la ruta de login.
        const company = await withRetry(() =>
            prisma.company.create({
                data: {
                    name,
                    password: hashPassword(password),
                    email: email || null,
                    phone: phone || null,
                    configs: {
                        create: [
                            { key: 'AUX_TRANSPORTE', value: '162000', description: 'Auxilio de transporte legal 2024' },
                            { key: 'SMLV', value: '1300000', description: 'Salario Mínimo Legal Vigente 2024' },
                            { key: 'UVT', value: '47065', description: 'Valor UVT 2024' }
                        ]
                    }
                }
            })
        );

        const res = NextResponse.json({
            message: 'Empresa registrada con éxito',
            companyId: company.id,
            companyName: company.name,
            role: 'COMPANY',
        });
        res.cookies.set(SESSION_COOKIE, createSessionToken(company.id, 'COMPANY'), sessionCookieOptions());
        return res;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
