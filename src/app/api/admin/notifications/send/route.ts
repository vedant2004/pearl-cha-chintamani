import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase, saveDatabase } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { isSameOrigin } from '@/lib/csrf';
import { sanitizeText } from '@/lib/security';
import { sendPushToSubscriptions } from '@/lib/push';
import { SentNotificationItem, Announcement } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 1. Authentication
  const isAuth = await isAdminAuthenticated(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized access to notifications' }, { status: 401 });
  }

  // 2. CSRF
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-site request forgery detected' }, { status: 403 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    const payload = await request.json();
    const { title, message, body, url, category, postToTicker, pinAsAnnouncement } = payload;

    const rawMessage = message || body;
    const shouldPin = postToTicker !== undefined ? postToTicker : (pinAsAnnouncement ?? true);

    const cleanTitle = sanitizeText(title, 120);
    const cleanMessage = sanitizeText(rawMessage, 300);
    const cleanUrl = url ? sanitizeText(url, 200) : '/';
    const cleanCategory = (category || 'general') as 'aarti' | 'announcement' | 'event' | 'general';

    if (!cleanTitle || cleanTitle.length < 3) {
      return NextResponse.json({ error: 'Notification title must be at least 3 characters' }, { status: 400 });
    }
    if (!cleanMessage || cleanMessage.length < 5) {
      return NextResponse.json({ error: 'Notification message must be at least 5 characters' }, { status: 400 });
    }

    const db = getDatabase();
    if (!db.pushSubscriptions) db.pushSubscriptions = [];
    if (!db.sentNotifications) db.sentNotifications = [];

    // 3. Dispatch web push to all registered browser subscriptions
    const { successful, expiredEndpoints } = await sendPushToSubscriptions(db.pushSubscriptions, {
      title: cleanTitle,
      body: cleanMessage,
      url: cleanUrl,
      category: cleanCategory,
    });

    // 4. Remove defunct/unregistered endpoints
    if (expiredEndpoints.length > 0) {
      db.pushSubscriptions = db.pushSubscriptions.filter(
        (sub) => !expiredEndpoints.includes(sub.endpoint)
      );
    }

    // 5. Record sent notification entry
    const sentRecord: SentNotificationItem = {
      id: `notif-${Date.now()}`,
      title: cleanTitle,
      message: cleanMessage,
      url: cleanUrl,
      category: cleanCategory,
      sentAt: new Date().toISOString(),
      recipientCount: Math.max(successful, db.pushSubscriptions.length),
    };

    db.sentNotifications.unshift(sentRecord);

    // Keep log manageable (last 50 notifications)
    if (db.sentNotifications.length > 50) {
      db.sentNotifications = db.sentNotifications.slice(0, 50);
    }

    // 6. Optionally also sync as top urgent ticker announcement on homepage
    if (shouldPin) {
      const newAnc: Announcement = {
        id: `anc-${Date.now()}`,
        title: cleanTitle,
        content: cleanMessage,
        isImportant: true,
        publishDate: new Date().toISOString().split('T')[0],
        expiryDate: '2026-09-24',
        active: true,
      };
      db.announcements.unshift(newAnc);
      db.siteSettings.announcementTickerEnabled = true;
    }

    saveDatabase(db);

    try {
      revalidatePath('/');
      revalidatePath('/admin');
    } catch {
      // Ignore outside request cycle
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${sentRecord.recipientCount} subscribed devotees!`,
      sentNotification: sentRecord,
      record: sentRecord,
      sent: sentRecord.recipientCount,
      totalSubscribers: db.pushSubscriptions.length,
    });
  } catch (error) {
    console.error('Notification dispatch error:', error);
    return NextResponse.json({ error: 'Failed to broadcast notification safely' }, { status: 500 });
  }
}
