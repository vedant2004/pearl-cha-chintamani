import { NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const correctPassword = process.env.ADMIN_PASSWORD || 'pearl_bappa_2026';

    if (!password || password !== correctPassword) {
      return NextResponse.json(
        { error: 'Invalid admin credentials. Please enter the correct password.' },
        { status: 401 }
      );
    }

    const token = await createAdminToken();

    const isSecure = process.env.NODE_ENV === 'production' && !request.url.includes('localhost') && !request.url.includes('127.0.0.1');

    const response = NextResponse.json({
      success: true,
      token,
      message: 'Admin authenticated successfully',
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
