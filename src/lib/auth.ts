import { headers, cookies } from 'next/headers';
import { readSessionToken, SESSION_COOKIE, type Session } from './session';

// ---------------------------------------------------------------------------
// Identidad de quien hace la petición.
//
// La fuente buena es la cookie de sesión firmada. Mientras dure la transición
// se acepta también el header `x-company-id` sin firmar, que es como
// funcionaba antes: hay dispositivos —los relojes de marcación— con la sesión
// vieja guardada en localStorage, y cortarlos de golpe dejaría a empleados sin
// poder registrar entrada ni salida.
//
// Ese respaldo es EXACTAMENTE el agujero que se está cerrando: quien cambie el
// número del header lee datos de otra empresa. Se quita en cuanto todas las
// empresas hayan vuelto a entrar. Mientras tanto:
//
//   - nunca otorga rol de superadministrador (el header no lleva rol), así que
//     el portal de superadmin queda cerrado desde ya;
//   - cada uso queda registrado, para saber cuándo ya no lo usa nadie.
// ---------------------------------------------------------------------------

/** Cambiar a `false` y desplegar para cerrar la transición. */
const ALLOW_LEGACY_HEADER = true;

/**
 * Devuelve la sesión verificada, o `null` si no hay ninguna.
 *
 * Una sesión heredada (del header sin firmar) siempre sale con rol `COMPANY`.
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
    if (session) return session;

    if (!ALLOW_LEGACY_HEADER) return null;

    const headersList = await headers();
    const legacy = headersList.get('x-company-id');
    if (!legacy) return null;

    const id = parseInt(legacy, 10);
    if (isNaN(id) || id <= 0) return null;

    console.warn(`[auth] sesión heredada sin firmar para la empresa ${id}`);

    return {
        companyId: id,
        role: 'COMPANY',
        exp: Math.floor(Date.now() / 1000) + 60,
    };
}

/**
 * Id de la empresa de quien hace la petición, o `null`.
 *
 * Mantiene la firma que ya usaban todas las rutas de la API.
 */
export async function getCompanyId(): Promise<number | null> {
    const session = await getSession();
    return session ? session.companyId : null;
}

/**
 * `true` solo si hay una sesión firmada con rol de superadministrador.
 * El header heredado nunca alcanza para esto.
 */
export async function isSuperAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
    return session?.role === 'SUPERADMIN';
}
