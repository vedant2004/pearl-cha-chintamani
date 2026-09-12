import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDatabase();

    // Data Privacy: Exclude confidential resident volunteers from public endpoint
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { volunteers: _privateVolunteers, ...publicData } = db;

    const publicState = {
      ...publicData,
      // Only approved blessings are visible to public visitors
      blessings: (db.blessings || []).filter((b) => b.status === 'approved'),
      // Public volunteer count indicator without exposing personal resident PII
      volunteerCount: (db.volunteers || []).length,
    };

    return NextResponse.json(publicState);
  } catch (error) {
    console.error('Error fetching public data:', error);
    return NextResponse.json({ error: 'Failed to fetch festival data' }, { status: 500 });
  }
}
