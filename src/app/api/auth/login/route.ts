import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { prisma, withRetry } from '@/lib/prisma';
import {
    createSessionToken,
    hashPassword,
    verifyPassword,
    SESSION_COOKIE,
    sessionCookieOptions,
} from '@/lib/session';

/** Comparación en tiempo constante, para no filtrar aciertos parciales. */
function safeEqual(a: string, b: string): boolean {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function POST(req: Request) {
    try {
        const { name, password } = await req.json();

        if (!name || !password) {
            return NextResponse.json({ error: 'Nombre y contraseña son obligatorios' }, { status: 400 });
        }

        // --- Superadministrador ---------------------------------------------
        // El usuario y la contraseña estaban escritos en este archivo, que vive
        // en un repositorio. Ahora vienen de variables de entorno.
        const suUser = process.env.SUPERADMIN_USER;
        const suPass = process.env.SUPERADMIN_PASSWORD;

        if (suUser && suPass && safeEqual(name, suUser) && safeEqual(password, suPass)) {
            const res = NextResponse.json({
                message: 'Login exitoso',
                companyId: 0,
                companyName: suUser,
                role: 'SUPERADMIN',
            });
            res.cookies.set(SESSION_COOKIE, createSessionToken(0, 'SUPERADMIN'), sessionCookieOptions());
            return res;
        }

        // --- Empresa ---------------------------------------------------------
        const company = await withRetry(() => prisma.company.findUnique({ where: { name } }));

        if (!company) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        const { ok, needsRehash } = verifyPassword(password, company.password);

        if (!ok) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Migración transparente: la contraseña estaba guardada en texto plano.
        // Al primer ingreso correcto se vuelve a guardar hasheada, sin que la
        // empresa tenga que cambiarla ni enterarse.
        if (needsRehash) {
            try {
                const hashed = hashPassword(password);
                await withRetry(() =>
                    prisma.company.update({ where: { id: company.id }, data: { password: hashed } })
                );
                console.info(`[auth] contraseña migrada a hash para la empresa ${company.id}`);
            } catch (err) {
                // Que falle la migración no debe impedir el ingreso: la próxima
                // vez se vuelve a intentar.
                console.error('[auth] no se pudo migrar la contraseña:', err);
            }
        }

        const res = NextResponse.json({
            message: 'Login exitoso',
            companyId: company.id,
            companyName: company.name,
            role: 'COMPANY',
        });
        res.cookies.set(SESSION_COOKIE, createSessionToken(company.id, 'COMPANY'), sessionCookieOptions());
        return res;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
