import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDatabase();
    // Only return approved blessings to public visitors
    const publicState = {
      ...db,
      blessings: db.blessings.filter((b) => b.status === 'approved'),
    };
    return NextResponse.json(publicState);
  } catch (error) {
    console.error('Error fetching public data:', error);
    return NextResponse.json({ error: 'Failed to fetch festival data' }, { status: 500 });
  }
}
