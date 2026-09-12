import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Ephemeral fallback key generated securely in memory if ADMIN_JWT_SECRET is omitted in env
let inMemorySecret: Uint8Array | null = null;

function getJwtSecret(): Uint8Array {
  const envSecret = process.env.ADMIN_JWT_SECRET;
  if (envSecret && envSecret.trim().length >= 32) {
    return new TextEncoder().encode(envSecret.trim());
  }

  // Use persistent ephemeral in-memory secret for the running instance
  if (!inMemorySecret) {
    inMemorySecret = crypto.randomBytes(32);
    if (process.env.NODE_ENV === 'production') {
      console.warn('[SECURITY NOTICE] ADMIN_JWT_SECRET not set in production. Generated secure ephemeral key.');
    }
  }
  return inMemorySecret;
}

const COOKIE_NAME = 'pearl_admin_session';

export async function createAdminToken(): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ role: 'admin', user: 'festival_admin', jti: crypto.randomUUID() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // 24 hours expiration
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(request?: Request): Promise<boolean> {
  let token: string | undefined;

  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
      if (match) token = decodeURIComponent(match[1]);
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // Fall through if outside request store context
    }
  }

  if (!token) return false;
  return verifyAdminToken(token);
}

export { COOKIE_NAME };
