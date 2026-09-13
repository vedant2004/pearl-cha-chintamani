import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { subscriptionRateLimiter, getClientIp } from '@/lib/rate-limit';
import { sanitizeText } from '@/lib/security';
import { PushSubscriptionItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = subscriptionRateLimiter.check(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: `Too many subscription attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint || typeof subscription.endpoint !== 'string') {
      return NextResponse.json({ error: 'Invalid push subscription endpoint' }, { status: 400 });
    }

    const endpoint = sanitizeText(subscription.endpoint, 1000);
    const p256dh = sanitizeText(subscription.keys?.p256dh || '', 500);
    const auth = sanitizeText(subscription.keys?.auth || '', 500);

    if (!p256dh || !auth) {
      return NextResponse.json({ error: 'Missing encryption keys for push subscription' }, { status: 400 });
    }

    const db = getDatabase();
    if (!db.pushSubscriptions) {
      db.pushSubscriptions = [];
    }

    // Upsert subscription
    const existingIndex = db.pushSubscriptions.findIndex((s) => s.endpoint === endpoint);
    const subItem: PushSubscriptionItem = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      endpoint,
      keys: { p256dh, auth },
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db.pushSubscriptions[existingIndex] = subItem;
    } else {
      db.pushSubscriptions.push(subItem);
    }

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Pearl Cha Chintamani live alerts! 🙏',
      subscriberCount: db.pushSubscriptions.length,
    });
  } catch (error) {
    console.error('Push subscription error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
