import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { FullDatabaseState } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized access to admin update' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, data } = body;

    const db = getDatabase();

    if (section && data !== undefined) {
      // Validate section
      const validSections: (keyof FullDatabaseState)[] = [
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
      ];

      if (!validSections.includes(section)) {
        return NextResponse.json({ error: `Invalid section: ${section}` }, { status: 400 });
      }

      // Enforce user rule: location must be "Stage" and NEVER "Club House"
      if (section === 'poojaTimings' && Array.isArray(data)) {
        data.forEach((p: any) => {
          if (p.location && p.location.toLowerCase().includes('club')) {
            p.location = 'Stage';
          }
        });
      }

      (db as any)[section] = data;
      saveDatabase(db);

      return NextResponse.json({
        success: true,
        message: `Section ${section} updated successfully`,
        data: db[section as keyof FullDatabaseState],
      });
    }

    return NextResponse.json({ error: 'Section and data required' }, { status: 400 });
  } catch (error) {
    console.error('Error in admin update:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
