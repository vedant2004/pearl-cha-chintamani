# 🐘 PEARL CHA CHINTAMANI — Ganesh Utsav 2026

A complete, production-ready, highly animated, mobile-first responsive web application and remote admin dashboard for **Pearl Cha Chintamani (Ganesh Utsav 2026)** at Pearl Community in Hyderabad, India.

Built with the **"Royal Chintamani"** visual identity: combining Indian mythology, Ganesh Chaturthi traditions, royal Indian temple architecture, and modern cinematic web design.

---

## 🌟 Visual Identity & Design Highlights

- **Curated Royal Palette**: Deep Burgundy / Maroon (`#1c0306`, `#420d14`), Antique Gold (`#d4af37`, `#f3e5ab`), Warm Ivory (`#fdfbf7`), and subtle Saffron / Marigold accents.
- **Temple Motifs**: Sanskrit typography, glowing brass diyas with realistic flicker animations, ornate mandap archways, floating marigold flower petals and golden sparkles canvas effect (respects `prefers-reduced-motion`).
- **Devotional Interactivity**: "Aarti Pranam" button that showers festival flower confetti.
- **Mobile First & Responsive**: Optimized for phones, tablets, laptops, and ultra-wide desktops.
- **PWA Ready**: Includes web manifest, metadata, and theme color for home-screen installation.

---

## 🚀 Key Features

1. **Cinematic Hero**:
   - Grand Mandap archway framing the divine idol of Pearl Cha Chintamani.
   - Dynamic countdown timer configured by admin (e.g. Ganesh Chaturthi, Next Aarti, or Visarjan).
   - Instant highlights: Next Event, Today's Schedule, and Latest Notice.
2. **Dedicated Visarjan Section**:
   - "🌊 VISARJAN — Until we meet again, Bappa ❤️".
   - Days : Hours : Minutes : Seconds countdown timer with route directions starting from the Stage.
   - Admin toggle on/off.
3. **Pooja Timings**:
   - Verified Vedic schedule: Ganpati Sthapana, Morning Aarti, Evening Aarti, Special Pooja, Maha Aarti, Visarjan.
   - **Crucial Rule**: The venue is strictly designated as **Stage** (never Club House).
4. **Festival Events & Interactive Calendar**:
   - Filterable category grid: Cultural Programs, Bhajans, Kids Activities, Classical Dance, Music.
   - 10-day interactive day-by-day timeline (Day 1: 14 Sep to Day 10: 23 Sep).
5. **Urgent Announcements**:
   - Prominent notification ticker across the header and dedicated announcement feed.
6. **Gallery & Today's Moments**:
   - Responsive masonry/grid with high-res lightbox zoom modal.
   - "Today's Moments" featured section on the homepage.
7. **Apartment Map**:
   - Architectural SVG master-plan map of Pearl Apartments with interactive, clickable pins:
     - 🐘 Stage (Central Mandap)
     - 🚪 Main Security Gate
     - 🚗 Visitor & Resident Parking
     - 📸 Royal Photo Booth
     - 🍽️ Prasadam Counter
     - 👟 Footwear Stand
     - 🚻 Washrooms
8. **Prasadam Schedule**:
   - Daily menu offerings, timings at the Stage, and seva sponsor recognition.
9. **Competitions & Winners**:
   - Rangoli, Kids Clay Idol Making, Traditional Dance, and winner announcements.
10. **Volunteers Registration**:
    - Resident signup form for 7 seva categories (Decoration, Pooja, Prasadam, Cultural, Photography, Cleanup, Visarjan).
11. **Digital Pranam & Blessings Wall**:
    - Resident prayer submission with celebratory flower shower.
    - Moderated queue: committee approves or hides messages before they appear publicly.
12. **Festival Memories Archive**:
    - Historical retrospective for 2026, 2025, and 2024 with highlights and photos.
13. **Donations & Important Contacts**:
    - Strictly compliant: **NO** UPI IDs, QR codes, bank details, or payment gateways.
    - Committee coordinator contact numbers for seva information.

---

## 🛡️ Admin Dashboard (`/admin`)

- **Secure Authentication**: Server-side JWT session cookies verified using edge crypto. Master password stored in server environment variable (`ADMIN_PASSWORD`).
- **Fully Responsive**: Designed for smartphones, tablets, and desktops.
- **Zero-Code Content Editing**:
  - Change Evening Aarti time with 1 click: `7:00 PM` → `7:30 PM`.
  - Switch active homepage countdown target.
  - Add and delete announcements.
  - Upload photos and update captions.
  - Approve or hide blessings from residents.
  - View volunteer signups.
  - Modify map markers and festival schedules.
  - All changes update the public site immediately!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with modern CSS variables, fluid typography, and glassmorphism (No Tailwind dependency)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti, custom HTML5 Canvas particle systems, CSS keyframes
- **Security**: Jose (Edge JWT), HTTP-only cookies
- **Database**: Dual-mode storage (Built-in persistent JSON cache + Supabase PostgreSQL support via `supabase/schema.sql`)

---

## ⚙️ Setup & Local Development

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd pearl-cha-chintamani
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Default admin credentials in `.env.local`:
   ```env
   ADMIN_PASSWORD=pearl_bappa_2026
   ADMIN_EMAIL=admin@pearlchachintamani.com
   ADMIN_JWT_SECRET=pearl_cha_chintamani_jwt_secret_key_2026_super_secure
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   Access Admin Portal at [http://localhost:3000/admin](http://localhost:3000/admin).

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import your repository.
3. Configure the Environment Variables in Vercel Project Settings:
   - `ADMIN_PASSWORD` (e.g. `your_secure_password`)
   - `ADMIN_JWT_SECRET` (e.g. random 32-character string)
   - *(Optional)* `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` if using Supabase.
4. Click **Deploy**. Vercel will automatically build and deploy your production website with global CDN caching.

---

## 🪔 Dedication

*॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥*

**Ganpati Bappa Morya! 🙏**
