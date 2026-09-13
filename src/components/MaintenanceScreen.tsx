'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Clock, Wrench } from 'lucide-react';

export default function MaintenanceScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center top, #3b090f 0%, #170205 100%)',
        color: '#fdfbf7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Radial Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Sacred Sanskrit Invocation */}
        <div style={{ marginBottom: '18px' }}>
          <span
            className="font-sanskrit gold-shimmer"
            style={{
              fontSize: '1.05rem',
              letterSpacing: '0.22em',
              fontWeight: 700,
            }}
          >
            ॥ श्री गणेशाय नमः • ॐ गं गणपतये नमः ॥
          </span>
        </div>

        {/* Emblem */}
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #420d14, #1a0305)',
            border: '2px solid var(--gold-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
            fontSize: '2.5rem',
          }}
        >
          🐘
        </div>

        {/* Main Headings */}
        <h1
          className="font-royal"
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: '6px',
            lineHeight: 1.2,
          }}
        >
          <span className="gold-text">PEARL CHA</span> <span className="gold-shimmer">CHINTAMANI</span>
        </h1>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 16px',
            borderRadius: '20px',
            background: 'rgba(66, 13, 20, 0.7)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            fontSize: '0.8rem',
            color: 'var(--gold-400)',
            fontWeight: 600,
            letterSpacing: '0.14em',
            marginBottom: '28px',
          }}
        >
          <Sparkles size={13} color="#FFA000" />
          <span>HYDERABAD • GANESH UTSAV 2026</span>
        </div>

        {/* Maintenance Box */}
        <div
          className="royal-card"
          style={{
            padding: '36px 28px',
            background: 'linear-gradient(145deg, rgba(42, 8, 13, 0.95) 0%, rgba(20, 3, 5, 0.98) 100%)',
            border: '1.5px solid var(--gold-500)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.15)',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(255, 152, 0, 0.15)',
              border: '1px solid rgba(255, 152, 0, 0.4)',
              color: '#ffb74d',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            <Clock size={14} />
            <span>Scheduled Maintenance</span>
          </div>

          <h2
            className="font-royal"
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--ivory)',
              marginBottom: '14px',
            }}
          >
            Website Under Scheduled Maintenance
          </h2>

          <p
            style={{
              fontSize: '0.98rem',
              color: 'var(--cream)',
              lineHeight: 1.7,
              marginBottom: '16px',
            }}
          >
            We are currently performing scheduled festival updates and maintenance for the Pearl Cha Chintamani portal.
            The website will be back online shortly.
          </p>

          <p
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--gold-400)',
              letterSpacing: '0.04em',
            }}
          >
            Ganpati Bappa Morya! 🙏
          </p>
        </div>

        {/* Discreet Admin Login Access */}
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/admin/login"
            className="btn-outline-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            <Shield size={14} />
            <span>Committee / Admin Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
