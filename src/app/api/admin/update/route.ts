import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase, saveDatabase } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { isSameOrigin } from '@/lib/csrf';
import { sanitizeObject } from '@/lib/security';
import { FullDatabaseState } from '@/lib/types';

export const dynamic = 'force-dynamic';

const VALID_SECTIONS: (keyof FullDatabaseState)[] = [
  'poojaTimings',
  'events',
  'announcements',
  'countdowns',
  'visarjan',
  'gallery',
  'volunteers',
  'prasadam',
  'competitions',
  'mapMarkers',
  'contacts',
  'donations',
  'blessings',
  'memories',
  'siteSettings',
  'pushSubscriptions',
  'sentNotifications',
];

export async function POST(request: Request) {
  // 1. Authentication Check
  const isAuth = await isAdminAuthenticated(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized access to admin update' }, { status: 401 });
  }

  // 2. CSRF / Same-Origin Check
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-site request forgery detected' }, { status: 403 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || data === undefined) {
      return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
    }

    // 3. Section Allowlist Validation
    if (!VALID_SECTIONS.includes(section as keyof FullDatabaseState)) {
      return NextResponse.json({ error: `Invalid section: ${section}` }, { status: 400 });
    }

    // 4. Sanitize against prototype pollution
    const cleanData = sanitizeObject(data);

    const db = getDatabase();

    // 5. Enforce rule: location must be "Stage"
    if (section === 'poojaTimings' && Array.isArray(cleanData)) {
      cleanData.forEach((p: any) => {
        if (p && typeof p === 'object' && p.location && typeof p.location === 'string' && p.location.toLowerCase().includes('club')) {
          p.location = 'Stage';
        }
      });
    }

    // 6. Two-way sync for active countdown and siteSettings
    if (section === 'countdowns' && Array.isArray(cleanData)) {
      const activeCd = cleanData.find((c: any) => c && c.isActive);
      if (activeCd && db.siteSettings) {
        db.siteSettings.activeCountdownId = activeCd.id;
      }
    } else if (section === 'siteSettings' && cleanData && cleanData.activeCountdownId) {
      if (Array.isArray(db.countdowns)) {
        db.countdowns.forEach((c) => {
          c.isActive = c.id === cleanData.activeCountdownId;
        });
      }
    }

    (db as any)[section] = cleanData;
    saveDatabase(db);

    // 7. Invalidate Next.js Server Component page caches so updates reflect immediately
    try {
      revalidatePath('/');
      revalidatePath('/admin');
    } catch {
      // Ignore if called outside dynamic page render context
    }

    return NextResponse.json({
      success: true,
      message: `Section ${section} updated successfully`,
      data: db[section as keyof FullDatabaseState],
    });
  } catch (error) {
    console.error('Error in admin update:', error);
    return NextResponse.json({ error: 'Failed to update data safely' }, { status: 500 });
  }
}
