'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FullDatabaseState,
  ScheduleItem,
  ScheduleCategory,
  PoojaTiming,
  FestivalEvent,
  Announcement,
  CountdownItem,
  VisarjanConfig,
  GalleryItem,
  Volunteer,
  PrasadamSchedule,
  Competition,
  MapMarker,
  ContactPerson,
  DonationInfo,
  BlessingMessage,
  MemoryItem,
  SiteSettings,
} from '@/lib/types';
import {
  Shield,
  LogOut,
  Clock,
  Calendar,
  Bell,
  Camera,
  HeartHandshake,
  Utensils,
  Trophy,
  MapPin,
  Phone,
  MessageSquareHeart,
  Settings,
  Waves,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Edit,
  Sparkles,
  Menu,
  X,
  BellRing,
  Send,
  Upload,
  Radio,
  Search,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { getCategoryBadgeStyle, sortScheduleChronologically } from '@/lib/schedule-utils';

interface Props {
  initialData: FullDatabaseState;
}

export default function AdminDashboardClient({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState<FullDatabaseState>(initialData);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Quick edit state for overview (initialized from live database values)
  const [quickAartiTime, setQuickAartiTime] = useState(
    initialData.poojaTimings?.find((p) => p.name.toLowerCase().includes('evening'))?.time || '07:30 PM'
  );
  const [quickAnnouncementText, setQuickAnnouncementText] = useState(
    initialData.announcements?.[0]?.content || ''
  );

  // Push notifications form state
  const [pushTitle, setPushTitle] = useState('Pearl Cha Chintamani 2026');
  const [pushMessage, setPushMessage] = useState('');
  const [pushUrl, setPushUrl] = useState('/');
  const [pinAsAnnouncement, setPinAsAnnouncement] = useState(true);
  const [sendingPush, setSendingPush] = useState(false);

  // Volunteer dialog state
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);

  // Schedule state & filters
  const [filterScheduleDay, setFilterScheduleDay] = useState<string>('all');
  const [filterScheduleCategory, setFilterScheduleCategory] = useState<string>('all');
  const [searchScheduleQuery, setSearchScheduleQuery] = useState<string>('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);
  const [deletingScheduleItem, setDeletingScheduleItem] = useState<ScheduleItem | null>(null);

  // Form fields for Add/Edit Schedule Modal
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ScheduleCategory>('Pooja');
  const [formDate, setFormDate] = useState('15 September 2026');
  const [formStartTime, setFormStartTime] = useState('07:00 AM');
  const [formEndTime, setFormEndTime] = useState('');
  const [formLocation, setFormLocation] = useState('Stage');
  const [formDescription, setFormDescription] = useState('');
  const [formActive, setFormActive] = useState(true);

  const openAddScheduleModal = () => {
    setEditingScheduleItem(null);
    setFormName('');
    setFormCategory('Pooja');
    setFormDate('15 September 2026');
    setFormStartTime('07:00 AM');
    setFormEndTime('');
    setFormLocation('Stage');
    setFormDescription('');
    setFormActive(true);
    setScheduleModalOpen(true);
  };

  const openEditScheduleModal = (item: ScheduleItem) => {
    setEditingScheduleItem(item);
    setFormName(item.name);
    setFormCategory(item.category as ScheduleCategory);
    setFormDate(item.date);
    setFormStartTime(item.startTime);
    setFormEndTime(item.endTime || '');
    setFormLocation(item.location || 'Stage');
    setFormDescription(item.description || '');
    setFormActive(item.active !== false);
    setScheduleModalOpen(true);
  };

  const handleSaveScheduleItem = async () => {
    if (!formName.trim()) {
      showNotification('Please enter an activity name', 'error');
      return;
    }
    if (!formStartTime.trim()) {
      showNotification('Please enter a start time', 'error');
      return;
    }

    const currentSchedule = data.schedule || [];
    let updatedSchedule: ScheduleItem[];

    if (editingScheduleItem) {
      updatedSchedule = currentSchedule.map((item) =>
        item.id === editingScheduleItem.id
          ? {
              ...item,
              name: formName.trim(),
              category: formCategory,
              date: formDate.trim(),
              startTime: formStartTime.trim(),
              endTime: formEndTime.trim() || undefined,
              location: formLocation.trim() || 'Stage',
              description: formDescription.trim() || undefined,
              active: formActive,
            }
          : item
      );
    } else {
      const newItem: ScheduleItem = {
        id: `sch-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        date: formDate.trim(),
        startTime: formStartTime.trim(),
        endTime: formEndTime.trim() || undefined,
        location: formLocation.trim() || 'Stage',
        description: formDescription.trim() || undefined,
        active: formActive,
        order: currentSchedule.length + 1,
      };
      updatedSchedule = [...currentSchedule, newItem];
    }

    await saveSection('schedule', updatedSchedule);
    setScheduleModalOpen(false);
  };

  const handleDeleteScheduleItem = async () => {
    if (!deletingScheduleItem) return;
    const currentSchedule = data.schedule || [];
    const updatedSchedule = currentSchedule.filter((item) => item.id !== deletingScheduleItem.id);
    await saveSection('schedule', updatedSchedule);
    setDeletingScheduleItem(null);
  };

  const handleToggleScheduleActive = async (item: ScheduleItem) => {
    const currentSchedule = data.schedule || [];
    const updatedSchedule = currentSchedule.map((s) =>
      s.id === item.id ? { ...s, active: !s.active } : s
    );
    await saveSection('schedule', updatedSchedule);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const saveSection = async (section: keyof FullDatabaseState, updatedData: any) => {
    setSavingSection(section);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: updatedData }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Failed to update section');
      }

      const savedData = resJson.data !== undefined ? resJson.data : updatedData;
      setData((prev) => ({
        ...prev,
        [section]: savedData,
        ...(section === 'schedule'
          ? {
              poojaTimings: (savedData as ScheduleItem[])
                .filter((s) => ['Pooja', 'Aarti', 'Morning Aarti'].includes(s.category))
                .map((s, idx) => ({
                  id: s.id,
                  name: s.name,
                  date: s.date,
                  time: s.startTime,
                  description: s.description || '',
                  location: s.location || 'Stage',
                  isSpecial: s.category === 'Pooja' || Boolean(s.name && s.name.toLowerCase().includes('maha')),
                  order: idx + 1,
                })),
              events: (savedData as ScheduleItem[])
                .filter((s) => !['Pooja', 'Aarti', 'Morning Aarti'].includes(s.category))
                .map((s, idx) => ({
                  id: s.id,
                  name: s.name,
                  date: s.date,
                  startTime: s.startTime,
                  endTime: s.endTime || '',
                  description: s.description || '',
                  location: s.location || 'Stage',
                  image: '/images/maha-aarti.jpg',
                  category: s.category as any,
                  isFeatured: idx < 3,
                  order: idx + 1,
                })),
            }
          : {}),
      }));

      router.refresh();
      showNotification(`Saved changes for ${section}! Public website is updated.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to save changes', 'error');
    } finally {
      setSavingSection(null);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: Shield },
    { id: 'schedule', label: 'Festival Schedule', icon: Calendar },
    { id: 'notifications', label: 'Push Alerts', icon: BellRing },
    { id: 'countdowns', label: 'Countdowns', icon: Clock },
    { id: 'visarjan', label: 'Visarjan', icon: Waves },
    { id: 'announcements', label: 'Announcements', icon: Radio },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'volunteers', label: 'Volunteers', icon: HeartHandshake },
    { id: 'competitions', label: 'Competitions', icon: Trophy },
    { id: 'map', label: 'Apartment Map', icon: MapPin },
    { id: 'contacts', label: 'Contacts & Seva', icon: Phone },
    { id: 'blessings', label: 'Blessings', icon: MessageSquareHeart },
    { id: 'memories', label: 'Memories', icon: Calendar },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#160204', color: '#fdfbf7', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          background: 'rgba(28, 3, 6, 0.98)',
          borderBottom: '1.5px solid var(--gold-600)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 60,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-400)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
            className="admin-mobile-toggle"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ fontSize: '1.4rem' }}>🐘</div>
          <div>
            <div className="font-royal gold-shimmer" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              PEARL CHA CHINTAMANI
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gold-400)', letterSpacing: '0.12em' }}>
              ADMIN CONSOLE • LIVE
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Maintenance Mode Status & Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: data.siteSettings.maintenanceMode ? 'rgba(211, 47, 47, 0.25)' : 'rgba(46, 125, 50, 0.2)',
              border: data.siteSettings.maintenanceMode ? '1px solid #ff5252' : '1px solid rgba(76, 175, 80, 0.4)',
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                color: data.siteSettings.maintenanceMode ? '#ff8a80' : '#81c784',
              }}
            >
              {data.siteSettings.maintenanceMode ? '⚠️ MAINTENANCE ACTIVE' : '🟢 SITE LIVE'}
            </span>
            <button
              onClick={async () => {
                const newMode = !data.siteSettings.maintenanceMode;
                const updated = { ...data.siteSettings, maintenanceMode: newMode };
                await saveSection('siteSettings', updated);
              }}
              disabled={savingSection === 'siteSettings'}
              style={{
                background: data.siteSettings.maintenanceMode ? '#d32f2f' : 'var(--gold-gradient)',
                color: data.siteSettings.maintenanceMode ? '#fff' : '#140305',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title={data.siteSettings.maintenanceMode ? 'Click to make public website live' : 'Click to enable maintenance screen'}
            >
              {data.siteSettings.maintenanceMode ? 'Go Live' : 'Maintenance'}
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="btn-outline-gold"
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
          >
            <ExternalLink size={14} />
            <span className="hide-on-mobile">View Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(211, 47, 47, 0.2)',
              border: '1px solid #d32f2f',
              color: '#ff8a80',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <LogOut size={14} />
            <span className="hide-on-mobile">Logout</span>
          </button>
        </div>
      </header>

      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: 100,
            background: notification.type === 'success' ? '#1b5e20' : '#b71c1c',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            border: '1px solid #fff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container with Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar Nav */}
        <aside
          style={{
            width: '240px',
            background: 'rgba(28, 3, 6, 0.95)',
            borderRight: '1px solid rgba(212, 175, 55, 0.2)',
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flexShrink: 0,
          }}
          className={`admin-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const isCurrent = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setMobileNavOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: isCurrent ? '1px solid var(--gold-400)' : 'none',
                  background: isCurrent ? 'var(--gold-gradient)' : 'transparent',
                  color: isCurrent ? '#200407' : 'var(--cream)',
                  fontSize: '0.88rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                  Festival Overview & Quick Controls
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Live metrics, quick one-click edits, and critical timings for Pearl Cha Chintamani 2026.
                </p>
              </div>

              {/* Stats Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  marginBottom: '28px',
                }}
              >
                <div className="royal-card" style={{ padding: '18px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>ACTIVE COUNTDOWN</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ivory)', marginTop: '4px' }}>
                    {data.countdowns.find((c) => c.isActive)?.title || 'Ganesh Chaturthi'}
                  </div>
                </div>

                <div className="royal-card" style={{ padding: '18px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>VOLUNTEER SIGNUPS</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-300)', marginTop: '2px' }}>
                    {data.volunteers.length}
                  </div>
                </div>

                <div className="royal-card" style={{ padding: '18px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>PENDING BLESSINGS</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ff8a80', marginTop: '2px' }}>
                    {data.blessings.filter((b) => b.status === 'pending').length}
                  </div>
                </div>

                <div className="royal-card" style={{ padding: '18px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>GALLERY PHOTOS</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ivory)', marginTop: '2px' }}>
                    {data.gallery.length}
                  </div>
                </div>
              </div>

              {/* Quick Edit Shortcuts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px',
                }}
              >
                {/* Evening Aarti Quick Edit */}
                <div className="royal-card" style={{ padding: '22px', border: '1.5px solid var(--gold-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>QUICK EDIT TIMING</span>
                    <span className="pulse-badge">High Priority</span>
                  </div>
                  <h3 className="font-royal" style={{ fontSize: '1.2rem', color: 'var(--ivory)', marginBottom: '4px' }}>
                    Evening Aarti at Stage
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Change today’s Evening Aarti time with 1 click. Updates public site immediately.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={quickAartiTime}
                      onChange={(e) => setQuickAartiTime(e.target.value)}
                      placeholder="e.g. 07:30 PM"
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(20, 3, 5, 0.9)',
                        border: '1px solid var(--gold-500)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.92rem',
                        flex: 1,
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = data.poojaTimings.map((p) =>
                          p.name.toLowerCase().includes('evening')
                            ? { ...p, time: quickAartiTime, location: 'Stage' }
                            : p
                        );
                        saveSection('poojaTimings', updated);
                      }}
                      disabled={savingSection === 'poojaTimings'}
                      className="btn-gold"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <Save size={14} />
                      <span>{savingSection === 'poojaTimings' ? 'Saving...' : 'Save Timing'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Announcement Banner Edit */}
                <div className="royal-card" style={{ padding: '22px', border: '1.5px solid var(--gold-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>LIVE TICKER BANNER</span>
                    <span className="pulse-badge">Public Notice</span>
                  </div>
                  <h3 className="font-royal" style={{ fontSize: '1.2rem', color: 'var(--ivory)', marginBottom: '4px' }}>
                    Urgent Notice Ticker
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Displayed prominently at the top of every page for residents.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      type="text"
                      value={quickAnnouncementText}
                      onChange={(e) => setQuickAnnouncementText(e.target.value)}
                      placeholder="Enter urgent community notice..."
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(20, 3, 5, 0.9)',
                        border: '1px solid var(--gold-500)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.88rem',
                      }}
                    />
                    <button
                      onClick={() => {
                        const text = quickAnnouncementText.trim();
                        if (!text) return;
                        const updated = [...data.announcements];
                        if (updated[0]) {
                          updated[0] = { ...updated[0], content: text, isImportant: true, active: true };
                        } else {
                          updated.push({
                            id: `anc-${Date.now()}`,
                            title: 'Urgent Notice',
                            content: text,
                            isImportant: true,
                            publishDate: new Date().toISOString().split('T')[0],
                            expiryDate: '2026-09-24',
                            active: true,
                          });
                        }
                        saveSection('announcements', updated);
                      }}
                      disabled={savingSection === 'announcements'}
                      className="btn-gold"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', alignSelf: 'flex-start' }}
                    >
                      <Save size={14} />
                      <span>Update Announcement</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COUNTDOWNS */}
          {activeTab === 'countdowns' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Countdown Manager
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Select which countdown appears prominently on the homepage hero, or create new ones.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newCd: CountdownItem = {
                      id: `cd-${Date.now()}`,
                      title: 'New Countdown Event',
                      targetDate: '2026-09-14T09:00:00',
                      description: 'Special pooja ritual at the Stage',
                      isActive: false,
                      postEventMessage: 'Event concluded at the Stage.',
                    };
                    const updated = [...data.countdowns, newCd];
                    saveSection('countdowns', updated);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Countdown</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.countdowns.map((cd, index) => (
                  <div
                    key={cd.id}
                    className="royal-card"
                    style={{
                      padding: '20px',
                      border: cd.isActive ? '2px solid var(--gold-400)' : '1px solid var(--border-gold)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="radio"
                          name="activeCountdown"
                          checked={cd.isActive}
                          onChange={() => {
                            const updated = data.countdowns.map((c) => ({
                              ...c,
                              isActive: c.id === cd.id,
                            }));
                            saveSection('countdowns', updated);
                          }}
                          style={{ accentColor: '#D4AF37', width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 700, color: cd.isActive ? 'var(--gold-400)' : 'var(--ivory)' }}>
                          {cd.isActive ? '★ Active on Homepage' : 'Set as Active Hero Countdown'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = data.countdowns.filter((c) => c.id !== cd.id);
                          saveSection('countdowns', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                        title="Delete countdown"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                          Countdown Title
                        </label>
                        <input
                          type="text"
                          value={cd.title}
                          onChange={(e) => {
                            const updated = [...data.countdowns];
                            updated[index].title = e.target.value;
                            setData({ ...data, countdowns: updated });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: 'rgba(20, 3, 5, 0.8)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: '6px',
                            color: '#fff',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                          Target Date & Time (ISO format)
                        </label>
                        <input
                          type="datetime-local"
                          value={cd.targetDate ? cd.targetDate.substring(0, 16) : ''}
                          onChange={(e) => {
                            const updated = [...data.countdowns];
                            updated[index].targetDate = e.target.value;
                            setData({ ...data, countdowns: updated });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: 'rgba(20, 3, 5, 0.8)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: '6px',
                            color: '#fff',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                        Post-Event Message (Shown when countdown reaches zero)
                      </label>
                      <input
                        type="text"
                        value={cd.postEventMessage}
                        onChange={(e) => {
                          const updated = [...data.countdowns];
                          updated[index].postEventMessage = e.target.value;
                          setData({ ...data, countdowns: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: 'rgba(20, 3, 5, 0.8)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '6px',
                          color: '#fff',
                        }}
                      />
                    </div>

                    <button
                      onClick={() => saveSection('countdowns', data.countdowns)}
                      disabled={savingSection === 'countdowns'}
                      className="btn-gold"
                      style={{ marginTop: '14px', padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      <Save size={13} />
                      <span>Save Countdown</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: VISARJAN */}
          {activeTab === 'visarjan' && (
            <div>
              <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                Visarjan Section Configuration
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Toggle Visarjan section on/off, set the immersion date & time, and update the procession route.
              </p>

              <div className="royal-card" style={{ padding: '26px', maxWidth: '720px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="checkbox"
                    checked={data.visarjan.enabled}
                    onChange={(e) => {
                      const updated = { ...data.visarjan, enabled: e.target.checked };
                      setData({ ...data, visarjan: updated });
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--ivory)' }}>
                    Display Visarjan Section on Website
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                    Visarjan Target Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={data.visarjan.targetDate ? data.visarjan.targetDate.substring(0, 16) : ''}
                    onChange={(e) => {
                      const updated = { ...data.visarjan, targetDate: e.target.value };
                      setData({ ...data, visarjan: updated });
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '6px',
                      color: '#fff',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                    Procession Route Description
                  </label>
                  <textarea
                    rows={3}
                    value={data.visarjan.routeDescription}
                    onChange={(e) => {
                      const updated = { ...data.visarjan, routeDescription: e.target.value };
                      setData({ ...data, visarjan: updated });
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '6px',
                      color: '#fff',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                    Starting Location (Strictly "Stage")
                  </label>
                  <input
                    type="text"
                    value={data.visarjan.stageLocation || 'Stage'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(20, 3, 5, 0.6)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '6px',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                    }}
                  />
                </div>

                <button
                  onClick={() => saveSection('visarjan', data.visarjan)}
                  disabled={savingSection === 'visarjan'}
                  className="btn-gold"
                  style={{ padding: '10px 22px' }}
                >
                  <Save size={15} />
                  <span>Save Visarjan Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: FESTIVAL SCHEDULE */}
          {activeTab === 'schedule' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                      Festival Schedule & Activities
                    </h2>
                    <span style={{ fontSize: '0.78rem', background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                      {((data.schedule || []).filter((item) => {
                        if (filterScheduleDay !== 'all' && !item.date.toLowerCase().includes(filterScheduleDay.toLowerCase())) return false;
                        if (filterScheduleCategory !== 'all' && item.category !== filterScheduleCategory) return false;
                        if (searchScheduleQuery.trim()) {
                          const q = searchScheduleQuery.toLowerCase();
                          return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)) || item.date.toLowerCase().includes(q) || item.startTime.toLowerCase().includes(q);
                        }
                        return true;
                      })).length} Activities
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                    Manage every activity happening during Ganesh Utsav 2026. Changes persist to live storage and sync with the public schedule.
                  </p>
                </div>

                <button
                  onClick={openAddScheduleModal}
                  className="btn-gold"
                  style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={16} />
                  <span>Add Schedule Item</span>
                </button>
              </div>

              {/* Filters & Search Control Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '22px',
                  background: 'rgba(24, 3, 7, 0.75)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700, display: 'block', marginBottom: '5px' }}>
                    Filter by Festival Day
                  </label>
                  <select
                    value={filterScheduleDay}
                    onChange={(e) => setFilterScheduleDay(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.86rem' }}
                  >
                    <option value="all">All Days (14 - 19 Sep)</option>
                    <option value="14 Sep">Day 1: 14 Sep (Sthapana)</option>
                    <option value="15 Sep">Day 2: 15 Sep (Bhajan & Dhol)</option>
                    <option value="16 Sep">Day 3: 16 Sep (Art & Maha Aarti)</option>
                    <option value="17 Sep">Day 4: 17 Sep (Rangoli)</option>
                    <option value="18 Sep">Day 5: 18 Sep (Homam & Dance)</option>
                    <option value="19 Sep">Day 6: 19 Sep (Visarjan)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700, display: 'block', marginBottom: '5px' }}>
                    Filter by Category
                  </label>
                  <select
                    value={filterScheduleCategory}
                    onChange={(e) => setFilterScheduleCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.86rem' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="Morning Aarti">🌅 Morning Aarti</option>
                    <option value="Pooja">🪔 Pooja</option>
                    <option value="Aarti">🔥 Aarti</option>
                    <option value="Dhol">🥁 Dhol</option>
                    <option value="Cultural">🎭 Cultural</option>
                    <option value="Competition">🏆 Competition</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700, display: 'block', marginBottom: '5px' }}>
                    Search Activities
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Search by name, timing, or notes..."
                      value={searchScheduleQuery}
                      onChange={(e) => setSearchScheduleQuery(e.target.value)}
                      style={{ width: '100%', padding: '9px 10px 9px 32px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.86rem' }}
                    />
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-400)' }} />
                  </div>
                </div>
              </div>

              {/* DESKTOP TABLE VIEW */}
              <div className="admin-desktop-table royal-card" style={{ padding: '0', overflow: 'hidden', border: '1.5px solid var(--border-gold)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(38, 5, 10, 0.95)', borderBottom: '1.5px solid rgba(212, 175, 55, 0.3)' }}>
                        <th style={{ padding: '14px 16px', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Time</th>
                        <th style={{ padding: '14px 16px', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Activity & Details</th>
                        <th style={{ padding: '14px 16px', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Category</th>
                        <th style={{ padding: '14px 16px', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
                        <th style={{ padding: '14px 16px', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Location</th>
                        <th style={{ padding: '14px 16px', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '14px 16px', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortScheduleChronologically((data.schedule || []).filter((item) => {
                        if (filterScheduleDay !== 'all' && !item.date.toLowerCase().includes(filterScheduleDay.toLowerCase())) return false;
                        if (filterScheduleCategory !== 'all' && item.category !== filterScheduleCategory) return false;
                        if (searchScheduleQuery.trim()) {
                          const q = searchScheduleQuery.toLowerCase();
                          return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)) || item.date.toLowerCase().includes(q) || item.startTime.toLowerCase().includes(q);
                        }
                        return true;
                      })).length > 0 ? (
                        sortScheduleChronologically((data.schedule || []).filter((item) => {
                          if (filterScheduleDay !== 'all' && !item.date.toLowerCase().includes(filterScheduleDay.toLowerCase())) return false;
                          if (filterScheduleCategory !== 'all' && item.category !== filterScheduleCategory) return false;
                          if (searchScheduleQuery.trim()) {
                            const q = searchScheduleQuery.toLowerCase();
                            return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)) || item.date.toLowerCase().includes(q) || item.startTime.toLowerCase().includes(q);
                          }
                          return true;
                        })).map((item, idx) => {
                          const badge = getCategoryBadgeStyle(item.category);
                          const isActive = item.active !== false;
                          return (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: '1px solid rgba(212, 175, 55, 0.12)',
                                background: idx % 2 === 0 ? 'rgba(18, 2, 4, 0.6)' : 'rgba(28, 4, 8, 0.6)',
                                transition: 'background 0.15s ease',
                              }}
                            >
                              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 700, color: 'var(--gold-300)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                  <Clock size={13} color="#FFA000" />
                                  <span>{item.startTime}</span>
                                </div>
                                {item.endTime && (
                                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                    to {item.endTime}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--ivory)', fontSize: '0.94rem' }}>
                                  {item.name}
                                </div>
                                {item.description && (
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.3 }}>
                                    {item.description}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                <span
                                  style={{
                                    background: badge.bg,
                                    color: badge.color,
                                    border: badge.border,
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <span>{badge.icon}</span>
                                  <span>{item.category}</span>
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', color: 'var(--cream)', fontSize: '0.84rem' }}>
                                {item.date}
                              </td>
                              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', color: 'var(--gold-300)', fontSize: '0.84rem' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={13} color="#FFA000" />
                                  <span>{item.location || 'Stage'}</span>
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                <button
                                  onClick={() => handleToggleScheduleActive(item)}
                                  style={{
                                    background: isActive ? 'rgba(46, 125, 50, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                                    color: isActive ? '#81c784' : 'var(--text-muted)',
                                    border: isActive ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '16px',
                                    padding: '3px 10px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                  title="Click to toggle public visibility"
                                >
                                  {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                  <span>{isActive ? 'Active' : 'Hidden'}</span>
                                </button>
                              </td>
                              <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  <button
                                    onClick={() => openEditScheduleModal(item)}
                                    style={{
                                      background: 'rgba(212, 175, 55, 0.15)',
                                      border: '1px solid rgba(212, 175, 55, 0.35)',
                                      color: 'var(--gold-300)',
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    <Edit size={13} />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => setDeletingScheduleItem(item)}
                                    style={{
                                      background: 'rgba(211, 47, 47, 0.18)',
                                      border: '1px solid rgba(255, 82, 82, 0.35)',
                                      color: '#ff8a80',
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No schedule activities match your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE CARDS VIEW (Screens < 860px) */}
              <div className="admin-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '14px' }}>
                {sortScheduleChronologically((data.schedule || []).filter((item) => {
                  if (filterScheduleDay !== 'all' && !item.date.toLowerCase().includes(filterScheduleDay.toLowerCase())) return false;
                  if (filterScheduleCategory !== 'all' && item.category !== filterScheduleCategory) return false;
                  if (searchScheduleQuery.trim()) {
                    const q = searchScheduleQuery.toLowerCase();
                    return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)) || item.date.toLowerCase().includes(q) || item.startTime.toLowerCase().includes(q);
                  }
                  return true;
                })).length > 0 ? (
                  sortScheduleChronologically((data.schedule || []).filter((item) => {
                    if (filterScheduleDay !== 'all' && !item.date.toLowerCase().includes(filterScheduleDay.toLowerCase())) return false;
                    if (filterScheduleCategory !== 'all' && item.category !== filterScheduleCategory) return false;
                    if (searchScheduleQuery.trim()) {
                      const q = searchScheduleQuery.toLowerCase();
                      return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)) || item.date.toLowerCase().includes(q) || item.startTime.toLowerCase().includes(q);
                    }
                    return true;
                  })).map((item) => {
                    const badge = getCategoryBadgeStyle(item.category);
                    const isActive = item.active !== false;
                    return (
                      <div
                        key={item.id}
                        className="royal-card"
                        style={{
                          padding: '16px',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span
                            style={{
                              background: badge.bg,
                              color: badge.color,
                              border: badge.border,
                              padding: '3px 9px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>{badge.icon}</span>
                            <span>{item.category}</span>
                          </span>

                          <button
                            onClick={() => handleToggleScheduleActive(item)}
                            style={{
                              background: isActive ? 'rgba(46, 125, 50, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                              color: isActive ? '#81c784' : 'var(--text-muted)',
                              border: isActive ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '16px',
                              padding: '2px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                            <span>{isActive ? 'Active' : 'Hidden'}</span>
                          </button>
                        </div>

                        <div>
                          <h4 className="font-royal" style={{ fontSize: '1.05rem', color: 'var(--ivory)', fontWeight: 700 }}>
                            {item.name}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: 'var(--gold-400)', marginTop: '4px', flexWrap: 'wrap' }}>
                            <span>📅 {item.date}</span>
                            <span>⏰ {item.startTime} {item.endTime ? `- ${item.endTime}` : ''}</span>
                            <span>📍 {item.location || 'Stage'}</span>
                          </div>
                          {item.description && (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.35 }}>
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}>
                          <button
                            onClick={() => openEditScheduleModal(item)}
                            style={{
                              flex: 1,
                              background: 'rgba(212, 175, 55, 0.18)',
                              border: '1px solid rgba(212, 175, 55, 0.4)',
                              color: 'var(--gold-300)',
                              padding: '8px',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                            }}
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingScheduleItem(item)}
                            style={{
                              flex: 1,
                              background: 'rgba(211, 47, 47, 0.2)',
                              border: '1px solid rgba(255, 82, 82, 0.4)',
                              color: '#ff8a80',
                              padding: '8px',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="royal-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No schedule activities match your filter.
                  </div>
                )}
              </div>

              {/* Add/Edit Schedule Modal */}
              {scheduleModalOpen && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.78)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 150,
                    padding: '16px',
                  }}
                >
                  <div
                    className="royal-card"
                    style={{
                      maxWidth: '560px',
                      width: '100%',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                      padding: '26px',
                      border: '2px solid var(--gold-500)',
                      boxShadow: '0 16px 50px rgba(0,0,0,0.85)',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} color="var(--gold-400)" />
                        <h3 className="font-royal" style={{ fontSize: '1.3rem', color: 'var(--ivory)', margin: 0 }}>
                          {editingScheduleItem ? 'Edit Schedule Item' : 'Add New Schedule Item'}
                        </h3>
                      </div>
                      <button
                        onClick={() => setScheduleModalOpen(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer', padding: '4px' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Event Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: 700, marginBottom: '5px' }}>
                          Activity / Event Name *
                        </label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Morning Aarti, Dhol Tasha Pathak, Maha Aarti"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            background: '#1a0407',
                            border: '1px solid var(--border-gold)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.9rem',
                          }}
                        />
                      </div>

                      {/* Category & Location */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: 700, marginBottom: '5px' }}>
                            Category *
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as ScheduleCategory)}
                            style={{
                              width: '100%',
                              padding: '9px 10px',
                              background: '#1a0407',
                              border: '1px solid var(--border-gold)',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.88rem',
                            }}
                          >
                            <option value="Morning Aarti">🌅 Morning Aarti</option>
                            <option value="Pooja">🪔 Pooja</option>
                            <option value="Aarti">🔥 Aarti</option>
                            <option value="Dhol">🥁 Dhol</option>
                            <option value="Cultural">🎭 Cultural</option>
                            <option value="Competition">🏆 Competition</option>
                            <option value="Other">✨ Other</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: 700, marginBottom: '5px' }}>
                            Location / Stage *
                          </label>
                          <input
                            type="text"
                            value={formLocation}
                            onChange={(e) => setFormLocation(e.target.value)}
                            placeholder="e.g. Stage"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              background: '#1a0407',
                              border: '1px solid var(--border-gold)',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.88rem',
                            }}
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: 700 }}>
                            Festival Date *
                          </label>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Choose or type custom</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <select
                            onChange={(e) => {
                              if (e.target.value) setFormDate(e.target.value);
                            }}
                            defaultValue=""
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              background: '#1a0407',
                              border: '1px solid var(--border-gold)',
                              borderRadius: '6px',
                              color: 'var(--gold-300)',
                              fontSize: '0.82rem',
                            }}
                          >
                            <option value="" disabled>Quick select festival day...</option>
                            <option value="14 September 2026">14 Sep 2026 (Day 1 - Sthapana)</option>
                            <option value="15 September 2026">15 Sep 2026 (Day 2 - Bhajan & Dhol)</option>
                            <option value="16 September 2026">16 Sep 2026 (Day 3 - Maha Aarti)</option>
                            <option value="17 September 2026">17 Sep 2026 (Day 4 - Cultural & Rangoli)</option>
                            <option value="18 September 2026">18 Sep 2026 (Day 5 - Homam & Competition)</option>
                            <option value="19 September 2026">19 Sep 2026 (Day 6 - Visarjan)</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          placeholder="e.g. 15 September 2026"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            background: '#1a0407',
                            border: '1px solid var(--border-gold)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.88rem',
                          }}
                        />
                      </div>

                      {/* Timings */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: 700, marginBottom: '5px' }}>
                            Start Time *
                          </label>
                          <input
                            type="text"
                            value={formStartTime}
                            onChange={(e) => setFormStartTime(e.target.value)}
                            placeholder="e.g. 07:00 AM or 06:00 PM"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              background: '#1a0407',
                              border: '1px solid var(--border-gold)',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.88rem',
                            }}
                          />
                          <div style={{ display: 'flex', gap: '4px', marginTop: '5px', flexWrap: 'wrap' }}>
                            {['7:00 AM', '12:00 PM', '6:00 PM', '7:30 PM'].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setFormStartTime(t)}
                                style={{
                                  background: 'rgba(212, 175, 55, 0.1)',
                                  border: '1px solid rgba(212, 175, 55, 0.3)',
                                  color: 'var(--gold-300)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.68rem',
                                  cursor: 'pointer',
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: 700, marginBottom: '5px' }}>
                            End Time <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={formEndTime}
                            onChange={(e) => setFormEndTime(e.target.value)}
                            placeholder="e.g. 08:30 AM or 09:00 PM"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              background: '#1a0407',
                              border: '1px solid var(--border-gold)',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.88rem',
                            }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: 700, marginBottom: '5px' }}>
                          Description / Devotee Instructions <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                        </label>
                        <textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Provide details such as participating teams, samagri requirements, dress code, etc."
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            background: '#1a0407',
                            border: '1px solid var(--border-gold)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.86rem',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      {/* Status Toggle */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: 'rgba(212, 175, 55, 0.06)',
                          borderRadius: '8px',
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--ivory)' }}>
                            Public Visibility Status
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {formActive ? 'Active — Devotees can view this activity on public website' : 'Hidden — Visible only in Admin'}
                          </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formActive}
                            onChange={(e) => setFormActive(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }}
                          />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: formActive ? '#81c784' : '#ff8a80' }}>
                            {formActive ? 'Active' : 'Hidden'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Modal Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                      <button
                        type="button"
                        onClick={() => setScheduleModalOpen(false)}
                        className="btn-outline-gold"
                        style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveScheduleItem}
                        disabled={savingSection === 'schedule'}
                        className="btn-gold"
                        style={{ padding: '8px 22px', fontSize: '0.86rem', opacity: savingSection === 'schedule' ? 0.7 : 1 }}
                      >
                        <Save size={15} />
                        <span>{savingSection === 'schedule' ? 'Saving...' : editingScheduleItem ? 'Update Activity' : 'Save Activity'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {deletingScheduleItem && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.82)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 160,
                    padding: '16px',
                  }}
                >
                  <div
                    className="royal-card"
                    style={{
                      maxWidth: '460px',
                      width: '100%',
                      padding: '24px',
                      border: '2px solid rgba(211, 47, 47, 0.6)',
                      boxShadow: '0 16px 50px rgba(0,0,0,0.9)',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                      <div
                        style={{
                          background: 'rgba(211, 47, 47, 0.2)',
                          padding: '10px',
                          borderRadius: '50%',
                          color: '#ff8a80',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-royal" style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 6px 0' }}>
                          Delete Schedule Activity?
                        </h3>
                        <p style={{ fontSize: '0.86rem', color: 'var(--cream)', lineHeight: 1.4, margin: 0 }}>
                          Are you sure you want to delete <strong style={{ color: 'var(--gold-300)' }}>&ldquo;{deletingScheduleItem.name}&rdquo;</strong> scheduled on <strong style={{ color: 'var(--gold-300)' }}>{deletingScheduleItem.date} at {deletingScheduleItem.startTime}</strong>?
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(211, 47, 47, 0.1)',
                        border: '1px solid rgba(211, 47, 47, 0.25)',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: '#ff8a80',
                        marginBottom: '20px',
                      }}
                    >
                      ⚠️ This will immediately remove the entry from both the Admin Console and the live public festival calendar.
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setDeletingScheduleItem(null)}
                        className="btn-outline-gold"
                        style={{ padding: '8px 16px', fontSize: '0.86rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteScheduleItem}
                        disabled={savingSection === 'schedule'}
                        style={{
                          background: '#d32f2f',
                          border: '1px solid #ff5252',
                          color: '#fff',
                          padding: '8px 18px',
                          borderRadius: '6px',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: savingSection === 'schedule' ? 0.7 : 1,
                        }}
                      >
                        <Trash2 size={14} />
                        <span>{savingSection === 'schedule' ? 'Deleting...' : 'Confirm Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Announcements Manager
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Post urgent timing updates and committee notices.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newAnc: Announcement = {
                      id: `anc-${Date.now()}`,
                      title: 'New Notice',
                      content: 'Please note the latest update from the festival committee.',
                      isImportant: false,
                      publishDate: new Date().toISOString().split('T')[0],
                      expiryDate: '2026-09-24',
                      active: true,
                    };
                    const updated = [newAnc, ...data.announcements];
                    saveSection('announcements', updated);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>New Announcement</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.announcements.map((a, index) => (
                  <div key={a.id} className="royal-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={a.isImportant}
                          onChange={(e) => {
                            const updated = [...data.announcements];
                            updated[index].isImportant = e.target.checked;
                            setData({ ...data, announcements: updated });
                          }}
                          style={{ width: '16px', height: '16px', accentColor: '#ff1744' }}
                        />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: a.isImportant ? '#ff8a80' : 'var(--cream)' }}>
                          🔴 Mark as Important (Homepage Alert)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = data.announcements.filter((item) => item.id !== a.id);
                          saveSection('announcements', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Title</label>
                      <input
                        type="text"
                        value={a.title}
                        onChange={(e) => {
                          const updated = [...data.announcements];
                          updated[index].title = e.target.value;
                          setData({ ...data, announcements: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: '#1a0407',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '6px',
                          color: '#fff',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Notice Content</label>
                      <textarea
                        rows={2}
                        value={a.content}
                        onChange={(e) => {
                          const updated = [...data.announcements];
                          updated[index].content = e.target.value;
                          setData({ ...data, announcements: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: '#1a0407',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '6px',
                          color: '#fff',
                        }}
                      />
                    </div>

                    <button
                      onClick={() => saveSection('announcements', data.announcements)}
                      className="btn-gold"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Save size={13} />
                      <span>Save Announcement</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BLESSINGS MODERATION */}
          {activeTab === 'blessings' && (
            <div>
              <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                Digital Blessings Moderation
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Review resident prayers for Bappa. Only approved messages are displayed on the public blessing wall.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.blessings.map((b) => (
                  <div
                    key={b.id}
                    className="royal-card"
                    style={{
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      border: b.status === 'pending' ? '1.5px solid #ff9800' : '1px solid var(--border-gold)',
                    }}
                  >
                    <div style={{ maxWidth: '650px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ color: 'var(--gold-300)' }}>{b.name}</strong>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(212, 175, 55, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                          {b.flatNo}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background:
                              b.status === 'approved' ? '#2e7d32' : b.status === 'pending' ? '#ef6c00' : '#424242',
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--cream)', fontStyle: 'italic' }}>
                        &ldquo;{b.message}&rdquo;
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {b.status !== 'approved' && (
                        <button
                          onClick={() => {
                            const updated = data.blessings.map((item) =>
                              item.id === b.id ? { ...item, status: 'approved' as const } : item
                            );
                            saveSection('blessings', updated);
                          }}
                          className="btn-gold"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          Approve
                        </button>
                      )}
                      {b.status !== 'hidden' && (
                        <button
                          onClick={() => {
                            const updated = data.blessings.map((item) =>
                              item.id === b.id ? { ...item, status: 'hidden' as const } : item
                            );
                            saveSection('blessings', updated);
                          }}
                          className="btn-outline-gold"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const updated = data.blessings.filter((item) => item.id !== b.id);
                          saveSection('blessings', updated);
                        }}
                        style={{
                          background: 'rgba(211, 47, 47, 0.2)',
                          border: '1px solid #d32f2f',
                          color: '#ff8a80',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Volunteer Registrations & Seva Management
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Residents signed up for festival seva. Update status, edit contact details, or add new volunteers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingVolunteer({
                      id: `vol-${Date.now()}`,
                      name: '',
                      flatNo: '',
                      phone: '',
                      category: 'Pooja',
                      notes: '',
                      createdAt: new Date().toISOString(),
                      status: 'confirmed',
                    });
                    setVolunteerModalOpen(true);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Volunteer</span>
                </button>
              </div>

              {/* Volunteer Add/Edit Modal */}
              {volunteerModalOpen && editingVolunteer && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 150,
                    padding: '16px',
                  }}
                >
                  <div
                    className="royal-card"
                    style={{
                      maxWidth: '520px',
                      width: '100%',
                      padding: '24px',
                      border: '2px solid var(--gold-500)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 className="font-royal" style={{ fontSize: '1.25rem', color: 'var(--ivory)' }}>
                        {data.volunteers.some((v) => v.id === editingVolunteer.id) ? 'Edit Volunteer Seva' : 'Add New Volunteer'}
                      </h3>
                      <button
                        onClick={() => {
                          setVolunteerModalOpen(false);
                          setEditingVolunteer(null);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                          Devotee Full Name *
                        </label>
                        <input
                          type="text"
                          value={editingVolunteer.name}
                          onChange={(e) => setEditingVolunteer({ ...editingVolunteer, name: e.target.value })}
                          placeholder="e.g. Ramesh Kulkarni"
                          style={{ width: '100%', padding: '8px 12px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                            Flat / Tower *
                          </label>
                          <input
                            type="text"
                            value={editingVolunteer.flatNo}
                            onChange={(e) => setEditingVolunteer({ ...editingVolunteer, flatNo: e.target.value })}
                            placeholder="e.g. Tower B - 504"
                            style={{ width: '100%', padding: '8px 12px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                            Phone Number *
                          </label>
                          <input
                            type="text"
                            value={editingVolunteer.phone}
                            onChange={(e) => setEditingVolunteer({ ...editingVolunteer, phone: e.target.value })}
                            placeholder="e.g. +91 98200 12345"
                            style={{ width: '100%', padding: '8px 12px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                            Seva Wing
                          </label>
                          <select
                            value={editingVolunteer.category}
                            onChange={(e) => setEditingVolunteer({ ...editingVolunteer, category: e.target.value as Volunteer['category'] })}
                            style={{ width: '100%', padding: '8px 12px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                          >
                            <option value="Pooja">Pooja & Rituals</option>
                            <option value="Decoration">Decoration & Stage</option>
                            <option value="Cultural Events">Cultural & Music</option>
                            <option value="Photography">Photography & Media</option>
                            <option value="Prasadam">Prasad Distribution</option>
                            <option value="Cleanup">Swachhata / Cleanup</option>
                            <option value="Visarjan">Visarjan Seva</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                            Status
                          </label>
                          <select
                            value={editingVolunteer.status || 'registered'}
                            onChange={(e) => setEditingVolunteer({ ...editingVolunteer, status: e.target.value as any })}
                            style={{ width: '100%', padding: '8px 12px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                          >
                            <option value="registered">Registered</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                          Notes / Availability
                        </label>
                        <input
                          type="text"
                          value={editingVolunteer.notes || ''}
                          onChange={(e) => setEditingVolunteer({ ...editingVolunteer, notes: e.target.value })}
                          placeholder="e.g. Available every evening for Aarti"
                          style={{ width: '100%', padding: '8px 12px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setVolunteerModalOpen(false);
                            setEditingVolunteer(null);
                          }}
                          className="btn-outline-gold"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!editingVolunteer.name.trim() || !editingVolunteer.phone.trim()) {
                              showNotification('Please enter volunteer name and phone number', 'error');
                              return;
                            }
                            const exists = data.volunteers.some((v) => v.id === editingVolunteer.id);
                            const updated = exists
                              ? data.volunteers.map((v) => (v.id === editingVolunteer.id ? editingVolunteer : v))
                              : [editingVolunteer, ...data.volunteers];
                            saveSection('volunteers', updated);
                            setVolunteerModalOpen(false);
                            setEditingVolunteer(null);
                          }}
                          className="btn-gold"
                          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                        >
                          Save Volunteer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ overflowX: 'auto', background: 'rgba(28, 3, 6, 0.85)', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(42, 8, 13, 0.95)', borderBottom: '1.5px solid var(--gold-500)', textAlign: 'left' }}>
                      <th style={{ padding: '14px', color: 'var(--gold-400)' }}>Devotee Name</th>
                      <th style={{ padding: '14px', color: 'var(--gold-400)' }}>Flat / Tower</th>
                      <th style={{ padding: '14px', color: 'var(--gold-400)' }}>Contact Phone</th>
                      <th style={{ padding: '14px', color: 'var(--gold-400)' }}>Seva Wing</th>
                      <th style={{ padding: '14px', color: 'var(--gold-400)' }}>Notes</th>
                      <th style={{ padding: '14px', color: 'var(--gold-400)' }}>Status</th>
                      <th style={{ padding: '14px', color: 'var(--gold-400)', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.volunteers.map((v, index) => (
                      <tr key={v.id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}>
                        <td style={{ padding: '14px', fontWeight: 600, color: 'var(--ivory)' }}>{v.name}</td>
                        <td style={{ padding: '14px', color: 'var(--cream)' }}>{v.flatNo}</td>
                        <td style={{ padding: '14px' }}>
                          <a href={`tel:${v.phone}`} style={{ color: 'var(--gold-300)', textDecoration: 'none', fontWeight: 600 }}>
                            {v.phone}
                          </a>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ background: 'rgba(212, 175, 55, 0.2)', padding: '3px 10px', borderRadius: '4px', color: 'var(--gold-300)', fontWeight: 600 }}>
                            {v.category}
                          </span>
                        </td>
                        <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '200px' }}>{v.notes || '-'}</td>
                        <td style={{ padding: '14px' }}>
                          <select
                            value={v.status || 'registered'}
                            onChange={(e) => {
                              const updated = [...data.volunteers];
                              updated[index].status = e.target.value as any;
                              saveSection('volunteers', updated);
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background:
                                v.status === 'confirmed'
                                  ? 'rgba(46, 125, 50, 0.4)'
                                  : v.status === 'contacted'
                                  ? 'rgba(230, 81, 0, 0.4)'
                                  : 'rgba(212, 175, 55, 0.2)',
                              border: '1px solid var(--border-gold)',
                              color: '#fff',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <option value="registered">Registered</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => {
                              setEditingVolunteer({ ...v });
                              setVolunteerModalOpen(true);
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer', padding: '4px', marginRight: '8px' }}
                            title="Edit Volunteer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove volunteer ${v.name}?`)) {
                                const updated = data.volunteers.filter((item) => item.id !== v.id);
                                saveSection('volunteers', updated);
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer', padding: '4px' }}
                            title="Remove Volunteer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Gallery & Photos
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Upload and manage high quality darshan and celebration photos. Upload directly from your device or specify an image URL.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label
                    className="btn-gold"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Upload size={14} />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        try {
                          showNotification('Uploading image...');
                          const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                          const json = await res.json();
                          if (!res.ok) throw new Error(json.error || 'Upload failed');
                          const newPhoto: GalleryItem = {
                            id: `gal-${Date.now()}`,
                            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                            caption: 'Pearl Cha Chintamani 2026 darshan moment.',
                            imageUrl: json.url,
                            category: 'Darshan',
                            year: 2026,
                            isFeatured: true,
                            createdAt: new Date().toISOString().split('T')[0],
                          };
                          const updated = [newPhoto, ...data.gallery];
                          saveSection('gallery', updated);
                          showNotification('Photo uploaded and added to gallery!');
                        } catch (err: any) {
                          showNotification(err.message, 'error');
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={() => {
                      const newPhoto: GalleryItem = {
                        id: `gal-${Date.now()}`,
                        title: 'Stage Darshan',
                        caption: 'Devotees offering prayers at the Stage mandap.',
                        imageUrl: '/images/ganpati-hero.jpg',
                        category: 'Darshan',
                        year: 2026,
                        isFeatured: true,
                        createdAt: new Date().toISOString().split('T')[0],
                      };
                      const updated = [newPhoto, ...data.gallery];
                      saveSection('gallery', updated);
                    }}
                    className="btn-outline-gold"
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                  >
                    <Plus size={14} />
                    <span>Add Manual</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
                {data.gallery.map((item, index) => (
                  <div key={item.id} className="royal-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontWeight: 700 }}>
                        {item.category} • {item.year}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Delete this photo?')) {
                            const updated = data.gallery.filter((g) => g.id !== item.id);
                            saveSection('gallery', updated);
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                        title="Delete Photo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div
                      style={{
                        width: '100%',
                        height: '140px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '10px',
                        background: '#120204',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '0.74rem', color: 'var(--gold-400)' }}>Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...data.gallery];
                          updated[index].title = e.target.value;
                          setData({ ...data, gallery: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: '#1a0407',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '4px',
                          color: '#fff',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '0.74rem', color: 'var(--gold-400)', display: 'block', marginBottom: '2px' }}>
                        Image URL or Upload
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          value={item.imageUrl}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[index].imageUrl = e.target.value;
                            setData({ ...data, gallery: updated });
                          }}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            background: '#1a0407',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '0.82rem',
                          }}
                        />
                        <label
                          style={{
                            background: 'rgba(212, 175, 55, 0.2)',
                            border: '1px solid var(--gold-500)',
                            color: 'var(--gold-300)',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Upload size={12} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append('file', file);
                              try {
                                showNotification('Uploading image...');
                                const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                                const json = await res.json();
                                if (!res.ok) throw new Error(json.error || 'Upload failed');
                                const updated = [...data.gallery];
                                updated[index].imageUrl = json.url;
                                setData({ ...data, gallery: updated });
                                showNotification('Image uploaded! Click Save to apply.');
                              } catch (err: any) {
                                showNotification(err.message, 'error');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="checkbox"
                        checked={item.isFeatured}
                        onChange={(e) => {
                          const updated = [...data.gallery];
                          updated[index].isFeatured = e.target.checked;
                          setData({ ...data, gallery: updated });
                        }}
                        style={{ accentColor: '#D4AF37' }}
                      />
                      <span style={{ fontSize: '0.78rem', color: 'var(--cream)' }}>Show in "Today's Moments"</span>
                    </div>

                    <button
                      onClick={() => saveSection('gallery', data.gallery)}
                      className="btn-gold"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', width: '100%' }}
                    >
                      <Save size={13} />
                      <span>Save Photo Details</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PUSH NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Push Notifications & Devotee Broadcasts
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Broadcast instant Web Push notifications to subscribed devotees for Aarti, Visarjan, and urgent festival announcements.
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--gold-500)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <BellRing size={20} color="var(--gold-400)" />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: 700, textTransform: 'uppercase' }}>Subscribers</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ivory)' }}>
                      {(data.pushSubscriptions || []).length} Devices
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick One-Click Reminders */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="royal-card" style={{ padding: '20px', border: '1.5px solid var(--gold-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔔</span>
                    <h4 className="font-royal" style={{ fontSize: '1.1rem', color: 'var(--ivory)' }}>
                      Evening Aarti Reminder
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Notify all devotees: Evening Aarti at Stage (Today at {quickAartiTime}).
                  </p>
                  <button
                    onClick={async () => {
                      setSendingPush(true);
                      try {
                        const res = await fetch('/api/admin/notifications/send', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: '🔔 Evening Aarti Reminder — Pearl Cha Chintamani',
                            body: `Grand Evening Aarti is starting at ${quickAartiTime} at the Stage. Join with family for divine darshan and blessings!`,
                            url: '/#timings',
                            pinAsAnnouncement: true,
                          }),
                        });
                        const resJson = await res.json();
                        if (!res.ok) throw new Error(resJson.error || 'Failed to broadcast');
                        showNotification(`Broadcast sent to ${resJson.sent} subscriber(s)!`);
                        if (resJson.record) {
                          setData((prev) => ({
                            ...prev,
                            sentNotifications: [resJson.record, ...(prev.sentNotifications || [])],
                          }));
                        }
                        router.refresh();
                      } catch (err: any) {
                        showNotification(err.message, 'error');
                      } finally {
                        setSendingPush(false);
                      }
                    }}
                    disabled={sendingPush}
                    className="btn-gold"
                    style={{ width: '100%', padding: '8px 14px', fontSize: '0.85rem' }}
                  >
                    <Send size={14} />
                    <span>{sendingPush ? 'Broadcasting...' : 'Send Evening Aarti Alert'}</span>
                  </button>
                </div>

                <div className="royal-card" style={{ padding: '20px', border: '1.5px solid var(--gold-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🌺</span>
                    <h4 className="font-royal" style={{ fontSize: '1.1rem', color: 'var(--ivory)' }}>
                      Visarjan Shobhayatra Reminder
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Notify all devotees for the Grand Visarjan procession on Saturday, 19 September 2026.
                  </p>
                  <button
                    onClick={async () => {
                      setSendingPush(true);
                      try {
                        const res = await fetch('/api/admin/notifications/send', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: '🌺 Visarjan Shobhayatra — Pearl Cha Chintamani',
                            body: 'Bappa Visarjan Miravnuk begins on 19 September 2026 at 04:00 PM with Dhol Tasha from the Stage. Ganpati Bappa Morya!',
                            url: '/visarjan',
                            pinAsAnnouncement: true,
                          }),
                        });
                        const resJson = await res.json();
                        if (!res.ok) throw new Error(resJson.error || 'Failed to broadcast');
                        showNotification(`Broadcast sent to ${resJson.sent} subscriber(s)!`);
                        if (resJson.record) {
                          setData((prev) => ({
                            ...prev,
                            sentNotifications: [resJson.record, ...(prev.sentNotifications || [])],
                          }));
                        }
                        router.refresh();
                      } catch (err: any) {
                        showNotification(err.message, 'error');
                      } finally {
                        setSendingPush(false);
                      }
                    }}
                    disabled={sendingPush}
                    className="btn-gold"
                    style={{ width: '100%', padding: '8px 14px', fontSize: '0.85rem' }}
                  >
                    <Send size={14} />
                    <span>{sendingPush ? 'Broadcasting...' : 'Send Visarjan Alert'}</span>
                  </button>
                </div>
              </div>

              {/* Custom Broadcast Form */}
              <div className="royal-card" style={{ padding: '24px', marginBottom: '28px' }}>
                <h3 className="font-royal" style={{ fontSize: '1.25rem', color: 'var(--ivory)', marginBottom: '6px' }}>
                  Compose Custom Broadcast
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Send any custom alert to all registered devices and optionally pin it to the homepage notice ticker.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                      Notification Title *
                    </label>
                    <input
                      type="text"
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      placeholder="e.g. Bhajan Sandhya Starting Soon!"
                      style={{ width: '100%', padding: '10px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                      Message Body *
                    </label>
                    <textarea
                      rows={3}
                      value={pushMessage}
                      onChange={(e) => setPushMessage(e.target.value)}
                      placeholder="Write the message that appears on residents' phone/desktop notifications..."
                      style={{ width: '100%', padding: '10px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                        Target URL (when clicked)
                      </label>
                      <input
                        type="text"
                        value={pushUrl}
                        onChange={(e) => setPushUrl(e.target.value)}
                        placeholder="/ or /visarjan or /gallery"
                        style={{ width: '100%', padding: '10px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--cream)' }}>
                        <input
                          type="checkbox"
                          checked={pinAsAnnouncement}
                          onChange={(e) => setPinAsAnnouncement(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }}
                        />
                        <span>Also pin as Live Ticker Announcement on Homepage</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={async () => {
                        if (!pushTitle.trim() || !pushMessage.trim()) {
                          showNotification('Please provide both a title and message', 'error');
                          return;
                        }
                        setSendingPush(true);
                        try {
                          const res = await fetch('/api/admin/notifications/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: pushTitle.trim(),
                              body: pushMessage.trim(),
                              url: pushUrl.trim() || '/',
                              pinAsAnnouncement,
                            }),
                          });
                          const resJson = await res.json();
                          if (!res.ok) throw new Error(resJson.error || 'Failed to broadcast');
                          showNotification(`Broadcast sent to ${resJson.sent} subscriber(s)!`);
                          setPushMessage('');
                          if (resJson.record) {
                            setData((prev) => ({
                              ...prev,
                              sentNotifications: [resJson.record, ...(prev.sentNotifications || [])],
                            }));
                          }
                          router.refresh();
                        } catch (err: any) {
                          showNotification(err.message, 'error');
                        } finally {
                          setSendingPush(false);
                        }
                      }}
                      disabled={sendingPush || !pushMessage.trim()}
                      className="btn-gold"
                      style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                    >
                      <Send size={15} />
                      <span>{sendingPush ? 'Broadcasting...' : 'Broadcast Notification Now'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sent Notifications History */}
              <div>
                <h3 className="font-royal" style={{ fontSize: '1.25rem', color: 'var(--ivory)', marginBottom: '12px' }}>
                  Notification Broadcast History
                </h3>
                {(data.sentNotifications || []).length === 0 ? (
                  <div className="royal-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No broadcasts sent yet. Use the quick reminders or custom broadcast form above.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(data.sentNotifications || []).map((sn) => (
                      <div key={sn.id} className="royal-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-300)' }}>{sn.title}</div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--cream)', marginTop: '2px' }}>{sn.message}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Target: {sn.url || '/'} • {new Date(sn.sentAt).toLocaleString()}
                          </div>
                        </div>
                        <div style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#81c784', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                          ✓ {sn.recipientCount} delivered
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: COMPETITIONS */}
          {activeTab === 'competitions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Competitions & Talent Utsav
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Art, rangoli, singing, dance, and cultural competitions for Pearl community residents.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newComp: Competition = {
                      id: `cmp-${Date.now()}`,
                      name: 'Bal Ganesha Art Contest',
                      date: '16 September 2026',
                      time: '04:30 PM',
                      category: 'Art',
                      description: 'Drawing and painting competition celebrating Lord Ganesha. Paper provided at Stage.',
                      registrationInfo: 'Open to all children ages 5-15. Free registration at the seva desk.',
                      status: 'upcoming',
                    };
                    const updated = [...data.competitions, newComp];
                    saveSection('competitions', updated);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Competition</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.competitions.map((c, index) => (
                  <div key={c.id} className="royal-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 className="font-royal" style={{ fontSize: '1.15rem', color: 'var(--ivory)' }}>
                          {c.name}
                        </h4>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            background:
                              c.status === 'completed'
                                ? 'rgba(76, 175, 80, 0.25)'
                                : c.status === 'ongoing'
                                ? 'rgba(255, 152, 0, 0.25)'
                                : 'rgba(212, 175, 55, 0.2)',
                            color:
                              c.status === 'completed'
                                ? '#81c784'
                                : c.status === 'ongoing'
                                ? '#ffb74d'
                                : 'var(--gold-400)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {c.status}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = data.competitions.filter((item) => item.id !== c.id);
                          saveSection('competitions', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                        title="Delete Competition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Name</label>
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => {
                            const updated = [...data.competitions];
                            updated[index].name = e.target.value;
                            setData({ ...data, competitions: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Date</label>
                        <input
                          type="text"
                          value={c.date}
                          onChange={(e) => {
                            const updated = [...data.competitions];
                            updated[index].date = e.target.value;
                            setData({ ...data, competitions: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Time</label>
                        <input
                          type="text"
                          value={c.time}
                          onChange={(e) => {
                            const updated = [...data.competitions];
                            updated[index].time = e.target.value;
                            setData({ ...data, competitions: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Category</label>
                        <input
                          type="text"
                          value={c.category}
                          onChange={(e) => {
                            const updated = [...data.competitions];
                            updated[index].category = e.target.value;
                            setData({ ...data, competitions: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Status</label>
                        <select
                          value={c.status}
                          onChange={(e) => {
                            const updated = [...data.competitions];
                            updated[index].status = e.target.value as any;
                            setData({ ...data, competitions: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Winners (if declared)</label>
                        <input
                          type="text"
                          value={c.winners || ''}
                          placeholder="e.g. 1st: Ananya (T-A), 2nd: Rohan (T-B)"
                          onChange={(e) => {
                            const updated = [...data.competitions];
                            updated[index].winners = e.target.value;
                            setData({ ...data, competitions: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Description</label>
                      <textarea
                        rows={2}
                        value={c.description}
                        onChange={(e) => {
                          const updated = [...data.competitions];
                          updated[index].description = e.target.value;
                          setData({ ...data, competitions: updated });
                        }}
                        style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Registration Info</label>
                      <input
                        type="text"
                        value={c.registrationInfo}
                        onChange={(e) => {
                          const updated = [...data.competitions];
                          updated[index].registrationInfo = e.target.value;
                          setData({ ...data, competitions: updated });
                        }}
                        style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                      />
                    </div>

                    <button
                      onClick={() => saveSection('competitions', data.competitions)}
                      className="btn-gold"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Save size={13} />
                      <span>Save Competition</span>
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => saveSection('competitions', data.competitions)}
                    disabled={savingSection === 'competitions'}
                    className="btn-gold"
                    style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                  >
                    <Save size={16} />
                    <span>{savingSection === 'competitions' ? 'Saving Competitions...' : 'Save All Competitions'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APARTMENT MAP */}
          {activeTab === 'map' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Campus & Apartment Map Markers
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Configure the interactive pins displayed on the society festival layout.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newMarker: MapMarker = {
                      id: `map-${Date.now()}`,
                      title: 'New Festival Location',
                      category: 'stage',
                      description: 'Festival point near the Stage area.',
                      x: 50,
                      y: 50,
                      icon: 'map-pin',
                    };
                    const updated = [...data.mapMarkers, newMarker];
                    saveSection('mapMarkers', updated);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Map Marker</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.mapMarkers.map((m, index) => (
                  <div key={m.id} className="royal-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>📍</span>
                        <h4 className="font-royal" style={{ fontSize: '1.15rem', color: 'var(--ivory)' }}>
                          {m.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          const updated = data.mapMarkers.filter((item) => item.id !== m.id);
                          saveSection('mapMarkers', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                        title="Delete Marker"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Title</label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const updated = [...data.mapMarkers];
                            updated[index].title = e.target.value;
                            setData({ ...data, mapMarkers: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Category</label>
                        <select
                          value={m.category}
                          onChange={(e) => {
                            const updated = [...data.mapMarkers];
                            updated[index].category = e.target.value as any;
                            setData({ ...data, mapMarkers: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        >
                          <option value="stage">Stage (Ganpati Mandap)</option>
                          <option value="seating">Seating Area</option>
                          <option value="parking">Parking</option>
                          <option value="gate">Main Gate</option>
                          <option value="photo">Photo Area</option>
                          <option value="footwear">Footwear Stand</option>
                          <option value="washroom">Washroom</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>X Position (% 0-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={m.x}
                          onChange={(e) => {
                            const updated = [...data.mapMarkers];
                            updated[index].x = parseFloat(e.target.value) || 0;
                            setData({ ...data, mapMarkers: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Y Position (% 0-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={m.y}
                          onChange={(e) => {
                            const updated = [...data.mapMarkers];
                            updated[index].y = parseFloat(e.target.value) || 0;
                            setData({ ...data, mapMarkers: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Description</label>
                      <textarea
                        rows={2}
                        value={m.description}
                        onChange={(e) => {
                          const updated = [...data.mapMarkers];
                          updated[index].description = e.target.value;
                          setData({ ...data, mapMarkers: updated });
                        }}
                        style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                      />
                    </div>

                    <button
                      onClick={() => saveSection('mapMarkers', data.mapMarkers)}
                      className="btn-gold"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Save size={13} />
                      <span>Save Marker</span>
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => saveSection('mapMarkers', data.mapMarkers)}
                    disabled={savingSection === 'mapMarkers'}
                    className="btn-gold"
                    style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                  >
                    <Save size={16} />
                    <span>{savingSection === 'mapMarkers' ? 'Saving Markers...' : 'Save All Markers'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACTS & DONATIONS */}
          {activeTab === 'contacts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Committee Contacts & Donations Notice
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Emergency contacts, seva leads, and the strictly compliant offline donation protocol.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newContact: ContactPerson = {
                      id: `cnt-${Date.now()}`,
                      role: 'Committee Volunteer Coordinator',
                      name: 'Volunteer Desk',
                      phone: '+91 98490 00000',
                      availableHours: '08:00 AM - 10:00 PM',
                    };
                    const updated = [...data.contacts, newContact];
                    saveSection('contacts', updated);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Committee Contact</span>
                </button>
              </div>

              {/* Committee Contacts List */}
              <h3 className="font-royal" style={{ fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '14px' }}>
                Festival Committee & Helpline Contacts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {data.contacts.map((c, index) => (
                  <div key={c.id} className="royal-card" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 className="font-royal" style={{ fontSize: '1.1rem', color: 'var(--ivory)' }}>
                        {c.name} ({c.role})
                      </h4>
                      <button
                        onClick={() => {
                          const updated = data.contacts.filter((item) => item.id !== c.id);
                          saveSection('contacts', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                        title="Delete Contact"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.74rem', color: 'var(--gold-400)' }}>Name</label>
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => {
                            const updated = [...data.contacts];
                            updated[index].name = e.target.value;
                            setData({ ...data, contacts: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.86rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', color: 'var(--gold-400)' }}>Role</label>
                        <input
                          type="text"
                          value={c.role}
                          onChange={(e) => {
                            const updated = [...data.contacts];
                            updated[index].role = e.target.value;
                            setData({ ...data, contacts: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.86rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', color: 'var(--gold-400)' }}>Phone</label>
                        <input
                          type="text"
                          value={c.phone}
                          onChange={(e) => {
                            const updated = [...data.contacts];
                            updated[index].phone = e.target.value;
                            setData({ ...data, contacts: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.86rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', color: 'var(--gold-400)' }}>Available Hours</label>
                        <input
                          type="text"
                          value={c.availableHours || ''}
                          onChange={(e) => {
                            const updated = [...data.contacts];
                            updated[index].availableHours = e.target.value;
                            setData({ ...data, contacts: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.86rem' }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => saveSection('contacts', data.contacts)}
                      className="btn-gold"
                      style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                    >
                      <Save size={12} />
                      <span>Save Contact</span>
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => saveSection('contacts', data.contacts)}
                  disabled={savingSection === 'contacts'}
                  className="btn-gold"
                  style={{ padding: '10px 24px', fontSize: '0.92rem', alignSelf: 'flex-start' }}
                >
                  <Save size={16} />
                  <span>Save All Contacts</span>
                </button>
              </div>

              {/* Donations Notice Section */}
              <h3 className="font-royal" style={{ fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '14px' }}>
                Donations Notice Guidelines (Policy Compliant)
              </h3>
              <div className="royal-card" style={{ padding: '22px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                    Heading
                  </label>
                  <input
                    type="text"
                    value={data.donations.heading}
                    onChange={(e) => {
                      const updated = { ...data.donations, heading: e.target.value };
                      setData({ ...data, donations: updated });
                    }}
                    style={{ width: '100%', padding: '10px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                    Notice Message (Note: Strictly no direct UPI/QR/bank info)
                  </label>
                  <textarea
                    rows={3}
                    value={data.donations.notice}
                    onChange={(e) => {
                      const updated = { ...data.donations, notice: e.target.value };
                      setData({ ...data, donations: updated });
                    }}
                    style={{ width: '100%', padding: '10px', background: '#1a0407', border: '1px solid var(--border-gold)', borderRadius: '6px', color: '#fff', resize: 'vertical' }}
                  />
                </div>

                <button
                  onClick={() => saveSection('donations', data.donations)}
                  disabled={savingSection === 'donations'}
                  className="btn-gold"
                  style={{ padding: '10px 22px' }}
                >
                  <Save size={15} />
                  <span>Save Donations Notice</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: MEMORIES */}
          {activeTab === 'memories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Festival Legacy & Memories
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Archival retrospectives, past festival themes, and cherished moments of Pearl Cha Chintamani.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newYear = (data.memories[0]?.year || 2025) - 1;
                    const newMemory: MemoryItem = {
                      id: `mem-${newYear}`,
                      year: newYear,
                      title: `Pearl Cha Chintamani ${newYear}`,
                      description: `Joyous celebrations, daily maha aartis, and grand visarjan in ${newYear}.`,
                      coverImage: '/images/maha-aarti.jpg',
                      highlights: ['Grand Floral Stage Mandap', 'Daily 108 Diya Maha Aarti', 'Visarjan Shobhayatra with Dhol Tasha'],
                    };
                    const updated = [newMemory, ...data.memories];
                    saveSection('memories', updated);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Memory Year</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {data.memories.map((m, index) => (
                  <div key={m.id} className="royal-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                        <h4 className="font-royal" style={{ fontSize: '1.2rem', color: 'var(--ivory)' }}>
                          Utsav {m.year}: {m.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          const updated = data.memories.filter((item) => item.id !== m.id);
                          saveSection('memories', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                        title="Delete Year Memory"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Year</label>
                        <input
                          type="number"
                          value={m.year}
                          onChange={(e) => {
                            const updated = [...data.memories];
                            updated[index].year = parseInt(e.target.value) || m.year;
                            setData({ ...data, memories: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Title</label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const updated = [...data.memories];
                            updated[index].title = e.target.value;
                            setData({ ...data, memories: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Cover Image</label>
                        <input
                          type="text"
                          value={m.coverImage || ''}
                          onChange={(e) => {
                            const updated = [...data.memories];
                            updated[index].coverImage = e.target.value;
                            setData({ ...data, memories: updated });
                          }}
                          style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Description</label>
                      <textarea
                        rows={2}
                        value={m.description}
                        onChange={(e) => {
                          const updated = [...data.memories];
                          updated[index].description = e.target.value;
                          setData({ ...data, memories: updated });
                        }}
                        style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Highlights (one per line)</label>
                      <textarea
                        rows={3}
                        value={(m.highlights || []).join('\n')}
                        onChange={(e) => {
                          const updated = [...data.memories];
                          updated[index].highlights = e.target.value.split('\n').filter(Boolean);
                          setData({ ...data, memories: updated });
                        }}
                        style={{ width: '100%', padding: '8px', background: '#1a0407', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                      />
                    </div>

                    <button
                      onClick={() => saveSection('memories', data.memories)}
                      className="btn-gold"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Save size={13} />
                      <span>Save Memory Year</span>
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => saveSection('memories', data.memories)}
                    disabled={savingSection === 'memories'}
                    className="btn-gold"
                    style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                  >
                    <Save size={16} />
                    <span>{savingSection === 'memories' ? 'Saving Memories...' : 'Save All Memories'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                Site Settings
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Global configuration and header ticker controls.
              </p>

              <div className="royal-card" style={{ padding: '26px', maxWidth: '680px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                    Festival Title
                  </label>
                  <input
                    type="text"
                    value={data.siteSettings.siteTitle}
                    onChange={(e) => {
                      const updated = { ...data.siteSettings, siteTitle: e.target.value };
                      setData({ ...data, siteSettings: updated });
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a0407',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '6px',
                      color: '#fff',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={data.siteSettings.subtitle}
                    onChange={(e) => {
                      const updated = { ...data.siteSettings, subtitle: e.target.value };
                      setData({ ...data, siteSettings: updated });
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a0407',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '6px',
                      color: '#fff',
                    }}
                  />
                </div>

                {/* Maintenance Mode Configuration */}
                <div
                  style={{
                    marginBottom: '24px',
                    padding: '18px',
                    borderRadius: '8px',
                    background: data.siteSettings.maintenanceMode ? 'rgba(211, 47, 47, 0.15)' : 'rgba(212, 175, 55, 0.08)',
                    border: data.siteSettings.maintenanceMode ? '1.5px solid #d32f2f' : '1px solid var(--border-gold)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={18} color={data.siteSettings.maintenanceMode ? '#ff8a80' : 'var(--gold-400)'} />
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: data.siteSettings.maintenanceMode ? '#ff8a80' : 'var(--ivory)' }}>
                        Maintenance Mode
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...data.siteSettings, maintenanceMode: !data.siteSettings.maintenanceMode };
                        setData({ ...data, siteSettings: updated });
                      }}
                      style={{
                        background: data.siteSettings.maintenanceMode ? '#d32f2f' : 'rgba(212, 175, 55, 0.2)',
                        border: '1px solid var(--gold-500)',
                        color: '#fff',
                        padding: '5px 12px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {data.siteSettings.maintenanceMode ? 'Disable (Go Live)' : 'Enable Maintenance'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    When enabled, public visitors will see the sacred Ganesh temple maintenance notice while schedules and updates are finalized. The Admin Console remains fully accessible. Note: No farewell or departure wording is shown.
                  </p>
                  {data.siteSettings.maintenanceMode && (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#ff8a80', fontWeight: 700 }}>
                      ⚠️ Currently active: Visitors will see the maintenance screen until toggled off.
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <input
                    type="checkbox"
                    checked={data.siteSettings.announcementTickerEnabled}
                    onChange={(e) => {
                      const updated = { ...data.siteSettings, announcementTickerEnabled: e.target.checked };
                      setData({ ...data, siteSettings: updated });
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 600 }}>
                    Enable Header Urgent Announcement Ticker
                  </span>
                </div>

                <button
                  onClick={() => saveSection('siteSettings', data.siteSettings)}
                  className="btn-gold"
                  style={{ padding: '10px 22px' }}
                >
                  <Save size={15} />
                  <span>Save Site Settings</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
