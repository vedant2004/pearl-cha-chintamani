import React from 'react';
import { getDatabase } from '@/lib/db';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VisarjanSection from '@/components/VisarjanSection';
import PoojaTimings from '@/components/PoojaTimings';
import Events from '@/components/Events';
import FestivalCalendar from '@/components/FestivalCalendar';
import Announcements from '@/components/Announcements';
import Gallery from '@/components/Gallery';
import ApartmentMap from '@/components/ApartmentMap';
import Competitions from '@/components/Competitions';
import Volunteers from '@/components/Volunteers';
import Blessings from '@/components/Blessings';
import Memories from '@/components/Memories';
import ContactsAndDonations from '@/components/ContactsAndDonations';
import Footer from '@/components/Footer';
import MaintenanceScreen from '@/components/MaintenanceScreen';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const db = getDatabase();

  // If Maintenance Mode is enabled by Admin, show Maintenance Screen to public visitors
  if (db.siteSettings.maintenanceMode) {
    return <MaintenanceScreen />;
  }

  // Find active countdown
  const activeCountdown =
    db.countdowns.find((c) => c.isActive) ||
    db.countdowns.find((c) => c.id === db.siteSettings.activeCountdownId) ||
    db.countdowns[0];

  // Next upcoming event & upcoming pooja
  const nextEvent = db.events.find((e) => e.isFeatured) || db.events[0];
  const upcomingPooja = db.poojaTimings[0];

  // Latest important announcement for header ticker
  const latestAnnouncement = db.announcements.find((a) => a.active && a.isImportant) || db.announcements[0];

  // Only pass approved blessings to public visitor view
  const approvedBlessings = db.blessings.filter((b) => b.status === 'approved');

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <Header
        announcementText={
          db.siteSettings.announcementTickerEnabled && latestAnnouncement
            ? latestAnnouncement.content
            : undefined
        }
        isImportantAnnouncement={latestAnnouncement?.isImportant}
      />

      <Hero
        activeCountdown={activeCountdown}
        nextEvent={nextEvent}
        upcomingPooja={upcomingPooja}
        announcementSnippet={latestAnnouncement?.content}
      />

      <VisarjanSection config={db.visarjan} />

      <PoojaTimings timings={db.poojaTimings} />

      <Events events={db.events} />

      <FestivalCalendar
        schedule={db.schedule}
        events={db.events}
        poojaTimings={db.poojaTimings}
      />

      <Announcements announcements={db.announcements} />

      <Gallery items={db.gallery} />

      <ApartmentMap markers={db.mapMarkers} />

      <Competitions competitions={db.competitions} />

      <Blessings blessings={approvedBlessings} />

      <Volunteers />

      <Memories memories={db.memories} />

      <ContactsAndDonations contacts={db.contacts} donations={db.donations} />

      <Footer />
    </main>
  );
}
