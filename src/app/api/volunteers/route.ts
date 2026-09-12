import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { Volunteer } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, flatNo, phone, category, notes } = body;

    if (!name || !flatNo || !phone || !category) {
      return NextResponse.json(
        { error: 'Name, flat number, phone, and seva category are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const newVolunteer: Volunteer = {
      id: `vol-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim().substring(0, 100),
      flatNo: String(flatNo).trim().substring(0, 50),
      phone: String(phone).trim().substring(0, 20),
      category: category,
      notes: notes ? String(notes).trim().substring(0, 300) : '',
      createdAt: new Date().toISOString(),
      status: 'registered',
    };

    db.volunteers.unshift(newVolunteer);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Thank you for registering as a volunteer for Pearl Cha Chintamani! The festival committee will reach out to you shortly.',
      volunteer: newVolunteer,
    });
  } catch (error) {
    console.error('Error registering volunteer:', error);
    return NextResponse.json({ error: 'Failed to register volunteer' }, { status: 500 });
  }
}
