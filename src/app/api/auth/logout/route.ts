import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';

export async function POST() {
    const res = NextResponse.json({ message: 'Sesión cerrada' });
    // Misma configuración que al emitirla, con vencimiento en cero: si las
    // opciones no coinciden el navegador no la borra.
    res.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
    return res;
}
