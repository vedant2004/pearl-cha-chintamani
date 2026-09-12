import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { BlessingMessage } from '@/lib/types';
import { blessingRateLimiter, getClientIp } from '@/lib/rate-limit';
import { sanitizeText } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 1. Rate Limiting Check (5 blessings per 10 minutes)
  const clientIp = getClientIp(request);
  const rateCheck = blessingRateLimiter.check(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Submission rate limit reached. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting another blessing.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    const body = await request.json();
    const { name, flatNo, message } = body;

    // 2. Strict Input Sanitization & Validation
    const cleanName = sanitizeText(name, 100);
    const cleanFlatNo = sanitizeText(flatNo, 50);
    const cleanMessage = sanitizeText(message, 500);

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid name (at least 2 characters)' }, { status: 400 });
    }
    if (!cleanFlatNo || cleanFlatNo.length < 1) {
      return NextResponse.json({ error: 'Please enter your flat number/tower' }, { status: 400 });
    }
    if (!cleanMessage || cleanMessage.length < 3) {
      return NextResponse.json({ error: 'Please enter a blessing message (at least 3 characters)' }, { status: 400 });
    }

    const db = getDatabase();
    const newBlessing: BlessingMessage = {
      id: `bl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      flatNo: cleanFlatNo,
      message: cleanMessage,
      status: 'pending', // Moderated: requires committee approval before public display
      createdAt: new Date().toISOString(),
    };

    db.blessings.unshift(newBlessing);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Your blessing has been submitted for Bappa! It will appear on the blessing wall once reviewed by the committee.',
    });
  } catch (error) {
    console.error('Error submitting blessing:', error);
    return NextResponse.json({ error: 'Failed to submit blessing safely' }, { status: 500 });
  }
}
