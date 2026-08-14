import { createHmac, timingSafeEqual, randomBytes, scryptSync } from 'crypto';

// ---------------------------------------------------------------------------
// Sesión firmada
//
// Antes de agosto de 2026 la sesión era el número de empresa viajando en el
// header `x-company-id`, sin firma: cambiar ese número daba acceso a la nómina
// de otra empresa. Ahora se emite un token firmado con HMAC-SHA256 y se guarda
// en una cookie httpOnly, que el JavaScript de la página no puede leer.
//
// Se usa solo `crypto` de Node, sin dependencias nuevas.
// ---------------------------------------------------------------------------

export type Role = 'COMPANY' | 'SUPERADMIN';

export interface Session {
    companyId: number;
    role: Role;
    /** Vencimiento en segundos desde epoch */
    exp: number;
}

export const SESSION_COOKIE = 'nx_session';

/** 30 días. Suficiente para que nadie tenga que volver a entrar a diario. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        // Fallar cerrado: sin secreto no se firma nada, y sobre todo no se
        // valida nada. Un token sin verificar es peor que no tener sesión.
        throw new Error('SESSION_SECRET ausente o demasiado corto');
    }
    return secret;
}

function sign(body: string): string {
    return createHmac('sha256', getSecret()).update(body).digest('base64url');
}

/** Firma una sesión y devuelve el token `payload.firma`. */
export function createSessionToken(companyId: number, role: Role): string {
    const payload: Session = {
        companyId,
        role,
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    };
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${body}.${sign(body)}`;
}

/**
 * Verifica un token y devuelve la sesión, o `null` si la firma no cuadra,
 * el formato es inválido o ya venció.
 */
export function readSessionToken(token: string | undefined | null): Session | null {
    if (!token) return null;

    const dot = token.lastIndexOf('.');
    if (dot <= 0) return null;

    const body = token.slice(0, dot);
    const providedSig = token.slice(dot + 1);

    let expectedSig: string;
    try {
        expectedSig = sign(body);
    } catch {
        return null; // Sin secreto configurado no se valida nada.
    }

    // Comparación en tiempo constante: un `!==` normal filtra información
    // sobre cuántos caracteres iniciales acertó quien esté probando firmas.
    const a = Buffer.from(providedSig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    let parsed: Session;
    try {
        parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    } catch {
        return null;
    }

    if (typeof parsed.companyId !== 'number' || !Number.isFinite(parsed.companyId)) return null;
    if (parsed.role !== 'COMPANY' && parsed.role !== 'SUPERADMIN') return null;
    if (typeof parsed.exp !== 'number' || parsed.exp < Math.floor(Date.now() / 1000)) return null;

    return parsed;
}

/** Opciones de la cookie de sesión, iguales al emitir y al borrar. */
export function sessionCookieOptions(maxAge: number = SESSION_MAX_AGE) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge,
    };
}

// ---------------------------------------------------------------------------
// Contraseñas
//
// Estaban guardadas en texto plano y comparadas con `!==`. Se migran a scrypt
// de forma transparente: en el próximo ingreso de cada empresa, si lo guardado
// no tiene formato de hash se compara en plano y se vuelve a guardar hasheado.
// Nadie tiene que cambiar su contraseña.
// ---------------------------------------------------------------------------

const SCRYPT_PREFIX = 'scrypt$';
const KEY_LENGTH = 64;

export function hashPassword(plain: string): string {
    const salt = randomBytes(16);
    const derived = scryptSync(plain, salt, KEY_LENGTH);
    return `${SCRYPT_PREFIX}${salt.toString('base64')}$${derived.toString('base64')}`;
}

export function isHashed(stored: string): boolean {
    return stored.startsWith(SCRYPT_PREFIX);
}

/**
 * Compara una contraseña contra lo guardado, soportando tanto el formato nuevo
 * como el texto plano heredado.
 *
 * `needsRehash` avisa a quien llama que debe volver a guardar la contraseña
 * hasheada — es el mecanismo de migración.
 */
export function verifyPassword(plain: string, stored: string): { ok: boolean; needsRehash: boolean } {
    if (!isHashed(stored)) {
        const a = Buffer.from(plain);
        const b = Buffer.from(stored);
        const ok = a.length === b.length && timingSafeEqual(a, b);
        return { ok, needsRehash: ok };
    }

    const parts = stored.slice(SCRYPT_PREFIX.length).split('$');
    if (parts.length !== 2) return { ok: false, needsRehash: false };

    const [saltB64, hashB64] = parts;
    let expected: Buffer;
    let actual: Buffer;
    try {
        expected = Buffer.from(hashB64, 'base64');
        actual = scryptSync(plain, Buffer.from(saltB64, 'base64'), KEY_LENGTH);
    } catch {
        return { ok: false, needsRehash: false };
    }

    const ok = expected.length === actual.length && timingSafeEqual(expected, actual);
    return { ok, needsRehash: false };
}
