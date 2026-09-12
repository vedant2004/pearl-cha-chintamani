'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FullDatabaseState,
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
} from 'lucide-react';

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

  // Quick edit state for overview
  const [quickAartiTime, setQuickAartiTime] = useState('07:30 PM');

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

      setData((prev) => ({ ...prev, [section]: updatedData }));
      showNotification(`Saved changes for ${section}! Public website is updated.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to save changes', 'error');
    } finally {
      setSavingSection(null);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: Shield },
    { id: 'countdowns', label: 'Countdowns', icon: Clock },
    { id: 'visarjan', label: 'Visarjan', icon: Waves },
    { id: 'pooja', label: 'Pooja Timings', icon: Sparkles },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'volunteers', label: 'Volunteers', icon: HeartHandshake },
    { id: 'prasadam', label: 'Prasadam', icon: Utensils },
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
                      defaultValue={data.announcements[0]?.content || ''}
                      id="quick-announcement-input"
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
                        const val = (document.getElementById('quick-announcement-input') as HTMLInputElement)?.value;
                        if (!val) return;
                        const updated = [...data.announcements];
                        if (updated[0]) {
                          updated[0] = { ...updated[0], content: val, isImportant: true, active: true };
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

          {/* TAB: POOJA TIMINGS */}
          {activeTab === 'pooja' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Pooja Timings Management
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    All poojas are held at the <strong>Stage</strong>. Update times, dates, or add rituals.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newPooja: PoojaTiming = {
                      id: `pt-${Date.now()}`,
                      name: 'Special Pooja',
                      date: '15 September 2026',
                      time: '07:00 PM',
                      description: 'Devotional pooja ceremony at the Stage.',
                      location: 'Stage',
                      isSpecial: false,
                      order: data.poojaTimings.length + 1,
                    };
                    const updated = [...data.poojaTimings, newPooja];
                    saveSection('poojaTimings', updated);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Pooja Timing</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.poojaTimings.map((p, index) => (
                  <div key={p.id} className="royal-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h4 className="font-royal" style={{ fontSize: '1.15rem', color: 'var(--ivory)' }}>
                        {p.name}
                      </h4>
                      <button
                        onClick={() => {
                          const updated = data.poojaTimings.filter((item) => item.id !== p.id);
                          saveSection('poojaTimings', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Pooja Name</label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const updated = [...data.poojaTimings];
                            updated[index].name = e.target.value;
                            setData({ ...data, poojaTimings: updated });
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

                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Time</label>
                        <input
                          type="text"
                          value={p.time}
                          onChange={(e) => {
                            const updated = [...data.poojaTimings];
                            updated[index].time = e.target.value;
                            setData({ ...data, poojaTimings: updated });
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

                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Date</label>
                        <input
                          type="text"
                          value={p.date}
                          onChange={(e) => {
                            const updated = [...data.poojaTimings];
                            updated[index].date = e.target.value;
                            setData({ ...data, poojaTimings: updated });
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

                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Location (Strictly Stage)</label>
                        <input
                          type="text"
                          value="Stage"
                          readOnly
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#22060a',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            borderRadius: '6px',
                            color: 'var(--gold-400)',
                            fontWeight: 600,
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Description</label>
                      <input
                        type="text"
                        value={p.description}
                        onChange={(e) => {
                          const updated = [...data.poojaTimings];
                          updated[index].description = e.target.value;
                          setData({ ...data, poojaTimings: updated });
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
                      onClick={() => saveSection('poojaTimings', data.poojaTimings)}
                      className="btn-gold"
                      style={{ marginTop: '12px', padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Save size={13} />
                      <span>Save Pooja</span>
                    </button>
                  </div>
                ))}
              </div>
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
              <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                Volunteer Registrations
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Residents who signed up for festival seva categories.
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(42, 8, 13, 0.8)', borderBottom: '1.5px solid var(--gold-500)', textAlign: 'left' }}>
                      <th style={{ padding: '12px', color: 'var(--gold-400)' }}>Name</th>
                      <th style={{ padding: '12px', color: 'var(--gold-400)' }}>Flat</th>
                      <th style={{ padding: '12px', color: 'var(--gold-400)' }}>Phone</th>
                      <th style={{ padding: '12px', color: 'var(--gold-400)' }}>Seva Category</th>
                      <th style={{ padding: '12px', color: 'var(--gold-400)' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.volunteers.map((v) => (
                      <tr key={v.id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: 'var(--ivory)' }}>{v.name}</td>
                        <td style={{ padding: '12px' }}>{v.flatNo}</td>
                        <td style={{ padding: '12px' }}>
                          <a href={`tel:${v.phone}`} style={{ color: 'var(--gold-300)', textDecoration: 'none' }}>
                            {v.phone}
                          </a>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: 'rgba(212, 175, 55, 0.2)', padding: '2px 8px', borderRadius: '4px', color: 'var(--gold-300)' }}>
                            {v.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{v.notes || '-'}</td>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Gallery & Photos
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Upload and manage high quality darshan and celebration photos.
                  </p>
                </div>
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
                  className="btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>Add Photo</span>
                </button>
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
                          const updated = data.gallery.filter((g) => g.id !== item.id);
                          saveSection('gallery', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ff8a80', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
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
                      <label style={{ fontSize: '0.74rem', color: 'var(--gold-400)' }}>Image URL or Path</label>
                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={(e) => {
                          const updated = [...data.gallery];
                          updated[index].imageUrl = e.target.value;
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

          {/* TAB: PRASADAM */}
          {activeTab === 'prasadam' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="font-royal gold-shimmer" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Prasadam Schedule
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Manage the daily menu and donor seva notes for Stage prasadam distribution.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.prasadam.map((pr, index) => (
                  <div key={pr.id} className="royal-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Date</label>
                        <input
                          type="text"
                          value={pr.date}
                          onChange={(e) => {
                            const updated = [...data.prasadam];
                            updated[index].date = e.target.value;
                            setData({ ...data, prasadam: updated });
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

                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Menu Offering</label>
                        <input
                          type="text"
                          value={pr.menu}
                          onChange={(e) => {
                            const updated = [...data.prasadam];
                            updated[index].menu = e.target.value;
                            setData({ ...data, prasadam: updated });
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

                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Distribution Time</label>
                        <input
                          type="text"
                          value={pr.time}
                          onChange={(e) => {
                            const updated = [...data.prasadam];
                            updated[index].time = e.target.value;
                            setData({ ...data, prasadam: updated });
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

                      <div>
                        <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Location</label>
                        <input
                          type="text"
                          value="Stage"
                          readOnly
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#22060a',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            borderRadius: '6px',
                            color: 'var(--gold-400)',
                            fontWeight: 600,
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <label style={{ fontSize: '0.76rem', color: 'var(--gold-400)' }}>Sponsor / Seva Notes</label>
                      <input
                        type="text"
                        value={pr.sponsorNotes}
                        onChange={(e) => {
                          const updated = [...data.prasadam];
                          updated[index].sponsorNotes = e.target.value;
                          setData({ ...data, prasadam: updated });
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
                      onClick={() => saveSection('prasadam', data.prasadam)}
                      className="btn-gold"
                      style={{ marginTop: '12px', padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Save size={13} />
                      <span>Save Prasadam</span>
                    </button>
                  </div>
                ))}
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

      <style jsx global>{`
        @media (max-width: 860px) {
          .admin-sidebar {
            position: fixed;
            top: 65px;
            bottom: 0;
            left: -260px;
            z-index: 55;
            transition: left 0.3s ease;
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.8);
          }
          .admin-sidebar.mobile-open {
            left: 0;
          }
          .admin-mobile-toggle {
            display: flex !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
        @media (min-width: 861px) {
          .admin-mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
