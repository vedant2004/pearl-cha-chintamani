'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Menu, X, Bell, Shield, Sparkles, MapPin, Calendar, Clock, Heart } from 'lucide-react';
import NotificationPrompt from './NotificationPrompt';

interface HeaderProps {
  announcementText?: string;
  isImportantAnnouncement?: boolean;
}

export default function Header({ announcementText, isImportantAnnouncement }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerAartiCelebration = () => {
    // Joyous festival petal/gold confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#FFA000', '#FF7722', '#FFD700', '#FFFFFF', '#D32F2F'],
      shapes: ['circle'],
      scalar: 1.2,
    });
  };

  const navLinks = [
    { name: 'Pooja Timings', href: '#pooja' },
    { name: 'Events', href: '#events' },
    { name: 'Calendar', href: '#calendar' },
    { name: 'Announcements', href: '#announcements' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Map', href: '#map' },
    { name: 'Competitions', href: '#competitions' },
    { name: 'Blessings', href: '#blessings' },
    { name: 'Volunteers', href: '#volunteers' },
    { name: 'Contacts', href: '#contacts' },
  ];

  return (
    <>
      {/* Top Urgent Announcement Banner */}
      {announcementText && (
        <div
          style={{
            background: isImportantAnnouncement
              ? 'linear-gradient(90deg, #780206 0%, #061161 100%)'
              : 'linear-gradient(90deg, #420d14 0%, #2a080d 100%)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            position: 'relative',
            zIndex: 51,
          }}
        >
          {isImportantAnnouncement && (
            <span
              style={{
                background: '#ff1744',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
              }}
            >
              🔴 IMPORTANT
            </span>
          )}
          <span style={{ fontWeight: 500 }}>{announcementText}</span>
          <a
            href="#announcements"
            style={{
              color: 'var(--gold-400)',
              marginLeft: '8px',
              textDecoration: 'underline',
              fontSize: '0.78rem',
            }}
          >
            Details →
          </a>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: isScrolled ? 'rgba(28, 3, 6, 0.94)' : 'rgba(28, 3, 6, 0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: isScrolled
            ? '1px solid rgba(212, 175, 55, 0.35)'
            : '1px solid rgba(212, 175, 55, 0.15)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px',
          }}
        >
          {/* Logo & Branding */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #420d14, #1a0305)',
                border: '1.5px solid var(--gold-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.35)',
                fontSize: '1.5rem',
              }}
            >
              🐘
            </div>
            <div>
              <div
                className="font-royal gold-shimmer"
                style={{
                  fontSize: '1.22rem',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '0.04em',
                }}
              >
                PEARL CHA CHINTAMANI
              </div>
              <div
                style={{
                  fontSize: '0.74rem',
                  letterSpacing: '0.18em',
                  color: 'var(--gold-400)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Ganesh Utsav 2026
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '18px',
            }}
            className="desktop-nav"
          >
            {navLinks.slice(0, 6).map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-400)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {link.name}
              </a>
            ))}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: moreOpen ? 'var(--gold-400)' : 'var(--text-muted)',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 0',
                }}
              >
                <span>More</span>
                <span style={{ fontSize: '0.65rem' }}>▼</span>
              </button>
              {moreOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'rgba(28, 3, 6, 0.98)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '8px',
                    padding: '6px 0',
                    minWidth: '150px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                    zIndex: 60,
                  }}
                >
                  {navLinks.slice(6).map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        color: 'var(--cream)',
                        textDecoration: 'none',
                        fontSize: '0.84rem',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <NotificationPrompt />

            <button
              onClick={triggerAartiCelebration}
              className="btn-gold"
              style={{
                padding: '8px 14px',
                fontSize: '0.84rem',
                borderRadius: '20px',
              }}
              title="Shower Blessings & Flowers"
            >
              <Bell size={15} />
              <span>Aarti Pranam 🙏</span>
            </button>

            <Link
              href="/admin"
              className="btn-outline-gold"
              style={{
                padding: '8px 12px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                display: 'inline-flex',
              }}
              title="Admin Portal"
            >
              <Shield size={14} />
              <span className="admin-btn-text">Admin</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-400)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle menu"
              className="mobile-toggle"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              background: 'rgba(28, 3, 6, 0.98)',
              borderBottom: '2px solid var(--gold-600)',
              padding: '16px 20px 24px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: 'var(--ivory)',
                    textDecoration: 'none',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(66, 13, 20, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{link.name}</span>
                  <span style={{ color: 'var(--gold-500)', fontSize: '0.8rem' }}>→</span>
                </a>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                paddingTop: '14px',
              }}
            >
              <button
                onClick={() => {
                  triggerAartiCelebration();
                  setMobileMenuOpen(false);
                }}
                className="btn-gold"
                style={{ flex: 1 }}
              >
                <Sparkles size={16} />
                <span>Shower Flowers 🌸</span>
              </button>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-outline-gold"
                style={{ flex: 1 }}
              >
                <Shield size={16} />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
