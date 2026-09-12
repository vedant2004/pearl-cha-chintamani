import { NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { loginRateLimiter, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // 1. Rate Limiting Check (5 failed attempts per 15 minutes)
  const rateCheck = loginRateLimiter.check(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Account temporarily locked for security. Please retry in ${rateCheck.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    const body = await request.json();
    const { password } = body;

    // 2. Input validation
    if (!password || typeof password !== 'string' || password.length > 256) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // 3. Constant-time timing-safe password verification
    const isValid = verifyPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    loginRateLimiter.reset(clientIp);

    // 4. Generate JWT
    const token = await createAdminToken();

    const isSecure = process.env.NODE_ENV === 'production' && !request.url.includes('localhost') && !request.url.includes('127.0.0.1');

    const response = NextResponse.json({
      success: true,
      token,
      message: 'Admin authenticated successfully',
    });

    // 5. Set hardened session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'strict', // Strict against CSRF
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login processing error:', error);
    return NextResponse.json({ error: 'Authentication request failed' }, { status: 500 });
  }
}
