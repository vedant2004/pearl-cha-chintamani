-- ============================================================
-- PEARL CHA CHINTAMANI (Ganesh Utsav 2026) - Database Schema
-- Supabase PostgreSQL Migration Script
-- ============================================================

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  site_title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  tagline TEXT NOT NULL,
  active_countdown_id TEXT,
  live_aarti_url TEXT,
  announcement_ticker_enabled BOOLEAN DEFAULT true,
  apartment_name TEXT NOT NULL,
  city TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Countdowns Table
CREATE TABLE IF NOT EXISTS countdowns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  post_event_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Visarjan Configuration Table
CREATE TABLE IF NOT EXISTS visarjan_config (
  id TEXT PRIMARY KEY DEFAULT 'current',
  enabled BOOLEAN DEFAULT true,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  route_description TEXT,
  stage_location TEXT DEFAULT 'Stage',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Pooja Timings Table (location is always 'Stage')
CREATE TABLE IF NOT EXISTS pooja_timings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  location TEXT DEFAULT 'Stage' NOT NULL,
  is_special BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  description TEXT,
  location TEXT DEFAULT 'Stage' NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_important BOOLEAN DEFAULT false,
  publish_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Darshan',
  year INT DEFAULT 2026,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Volunteers Table
CREATE TABLE IF NOT EXISTS volunteers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  flat_no TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. Prasadam Schedule Table
CREATE TABLE IF NOT EXISTS prasadam (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  menu TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT DEFAULT 'Stage' NOT NULL,
  sponsor_notes TEXT,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. Competitions Table
CREATE TABLE IF NOT EXISTS competitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  registration_info TEXT,
  winners TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. Map Locations Table
CREATE TABLE IF NOT EXISTS map_locations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  x NUMERIC NOT NULL,
  y NUMERIC NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  available_hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 13. Digital Blessings Table (moderated)
CREATE TABLE IF NOT EXISTS blessings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  flat_no TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 14. Memories Table
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  year INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE visarjan_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE pooja_timings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prasadam ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for all public festival information
CREATE POLICY "Allow public read of site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read of countdowns" ON countdowns FOR SELECT USING (true);
CREATE POLICY "Allow public read of visarjan_config" ON visarjan_config FOR SELECT USING (true);
CREATE POLICY "Allow public read of pooja_timings" ON pooja_timings FOR SELECT USING (true);
CREATE POLICY "Allow public read of events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read of announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public read of gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read of prasadam" ON prasadam FOR SELECT USING (true);
CREATE POLICY "Allow public read of competitions" ON competitions FOR SELECT USING (true);
CREATE POLICY "Allow public read of map_locations" ON map_locations FOR SELECT USING (true);
CREATE POLICY "Allow public read of contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public read of memories" ON memories FOR SELECT USING (true);
-- Public read of approved blessings only
CREATE POLICY "Allow public read of approved blessings" ON blessings FOR SELECT USING (status = 'approved');

-- Allow public insert of blessings (pending by default) and volunteer registration
CREATE POLICY "Allow public submission of blessings" ON blessings FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "Allow public volunteer signups" ON volunteers FOR INSERT WITH CHECK (true);
