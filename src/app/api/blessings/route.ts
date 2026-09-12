import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { BlessingMessage } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, flatNo, message } = body;

    if (!name || !flatNo || !message) {
      return NextResponse.json(
        { error: 'Name, flat number, and blessing message are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const newBlessing: BlessingMessage = {
      id: `bl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim().substring(0, 100),
      flatNo: String(flatNo).trim().substring(0, 50),
      message: String(message).trim().substring(0, 500),
      status: 'pending', // Requires admin approval
      createdAt: new Date().toISOString(),
    };

    db.blessings.unshift(newBlessing);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Your blessing has been submitted for Bappa! It will appear on the blessing wall once reviewed by the committee.',
      blessing: newBlessing,
    });
  } catch (error) {
    console.error('Error submitting blessing:', error);
    return NextResponse.json({ error: 'Failed to submit blessing' }, { status: 500 });
  }
}
