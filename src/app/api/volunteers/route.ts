import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { Volunteer } from '@/lib/types';
import { volunteerRateLimiter, getClientIp } from '@/lib/rate-limit';
import { sanitizeText, isValidPhone, isValidVolunteerCategory } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 1. Rate Limiting Check (3 volunteer registrations per 10 minutes)
  const clientIp = getClientIp(request);
  const rateCheck = volunteerRateLimiter.check(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Registration rate limit reached. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.`,
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
    const { name, flatNo, phone, category, notes } = body;

    // 2. Strict Input Sanitization & Schema Validation
    const cleanName = sanitizeText(name, 100);
    const cleanFlatNo = sanitizeText(flatNo, 50);
    const cleanNotes = notes ? sanitizeText(notes, 300) : '';

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Please provide a valid full name (at least 2 characters)' }, { status: 400 });
    }
    if (!cleanFlatNo || cleanFlatNo.length < 1) {
      return NextResponse.json({ error: 'Please provide your flat and tower number' }, { status: 400 });
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Please provide a valid contact phone number' }, { status: 400 });
    }
    if (!category || !isValidVolunteerCategory(category)) {
      return NextResponse.json({ error: 'Please select a valid seva category from the list' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/[^0-9+\s\-()]/g, '').trim().substring(0, 20);

    const db = getDatabase();
    const newVolunteer: Volunteer = {
      id: `vol-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      flatNo: cleanFlatNo,
      phone: cleanPhone,
      category: category,
      notes: cleanNotes,
      createdAt: new Date().toISOString(),
      status: 'registered',
    };

    db.volunteers.unshift(newVolunteer);
    saveDatabase(db);

    // 3. Response data minimization: Do not echo back phone number or personal PII
    return NextResponse.json({
      success: true,
      message: 'Thank you for registering as a volunteer for Pearl Cha Chintamani! The festival committee will reach out to you shortly.',
    });
  } catch (error) {
    console.error('Error registering volunteer:', error);
    return NextResponse.json({ error: 'Failed to register volunteer safely' }, { status: 500 });
  }
}
