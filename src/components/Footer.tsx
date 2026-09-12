'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #180305 0%, #0d0102 100%)',
        borderTop: '2px solid var(--gold-600)',
        padding: '60px 0 30px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Emblem */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #420d14, #1a0305)',
            border: '2px solid var(--gold-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '2rem',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
          }}
        >
          🐘
        </div>

        {/* Titles */}
        <h2
          className="font-royal gold-shimmer"
          style={{
            fontSize: '1.9rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: '4px',
          }}
        >
          PEARL CHA CHINTAMANI
        </h2>

        <div
          style={{
            fontSize: '0.9rem',
            letterSpacing: '0.2em',
            color: 'var(--gold-400)',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Ganesh Utsav 2026
        </div>

        <p
          className="font-royal"
          style={{
            fontSize: '1.2rem',
            color: 'var(--cream)',
            fontWeight: 600,
            marginBottom: '28px',
          }}
        >
          Ganpati Bappa Morya 🙏
        </p>

        {/* Sacred Sanskrit Shloka */}
        <div
          className="font-sanskrit"
          style={{
            fontSize: '0.92rem',
            color: 'var(--gold-300)',
            maxWidth: '640px',
            margin: '0 auto 34px',
            lineHeight: 1.8,
            padding: '12px 20px',
            background: 'rgba(42, 8, 13, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.25)',
          }}
        >
          वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । <br />
          निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
        </div>

        {/* Navigation Quick Links */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '18px',
            marginBottom: '36px',
            fontSize: '0.88rem',
          }}
        >
          {[
            { label: 'Pooja Timings', href: '#pooja' },
            { label: 'Events', href: '#events' },
            { label: 'Calendar', href: '#calendar' },
            { label: 'Announcements', href: '#announcements' },
            { label: 'Gallery', href: '#gallery' },
            { label: 'Map', href: '#map' },
            { label: 'Prasadam', href: '#prasadam' },
            { label: 'Competitions', href: '#competitions' },
            { label: 'Volunteers', href: '#volunteers' },
            { label: 'Leave Blessings', href: '#blessings' },
            { label: 'Memories', href: '#memories' },
            { label: 'Contacts', href: '#contacts' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-400)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div
          style={{
            borderTop: '1px solid rgba(212, 175, 55, 0.15)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © 2026 Pearl Cha Chintamani Festival Committee • Pearl Community, Hyderabad
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Built with devotion for Bappa ❤️</span>
            <Link
              href="/admin"
              style={{
                color: 'var(--gold-400)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <Shield size={12} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
