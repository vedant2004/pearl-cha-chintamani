'use client';

import React from 'react';
import { Announcement } from '@/lib/types';
import { AlertCircle, Bell, Calendar, Info } from 'lucide-react';

interface AnnouncementsProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  const activeAnnouncements = announcements.filter((a) => a.active);

  return (
    <section id="announcements" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Official Notices</div>
          <h2 className="section-title">
            <span className="gold-text">Festival</span>{' '}
            <span className="gold-shimmer">Announcements</span>
          </h2>
          <p className="section-subtitle">
            Stay updated with real-time schedule modifications, pooja announcements, and society
            guidelines issued by the festival committee.
          </p>
        </div>

        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeAnnouncements.map((a) => (
            <div
              key={a.id}
              className="royal-card"
              style={{
                padding: '20px 24px',
                border: a.isImportant
                  ? '1.5px solid #ff5252'
                  : '1px solid var(--border-gold)',
                background: a.isImportant
                  ? 'linear-gradient(135deg, rgba(90, 10, 20, 0.95) 0%, rgba(30, 4, 7, 0.98) 100%)'
                  : 'var(--card-gradient)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {a.isImportant ? (
                    <span
                      style={{
                        background: '#d32f2f',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <AlertCircle size={12} />
                      🔴 IMPORTANT NOTICE
                    </span>
                  ) : (
                    <span
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        color: 'var(--gold-300)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Bell size={12} />
                      COMMUNITY UPDATE
                    </span>
                  )}
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--ivory)',
                    }}
                  >
                    {a.title}
                  </h3>
                </div>

                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--gold-400)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Calendar size={12} />
                  <span>Posted: {a.publishDate}</span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--cream)',
                  lineHeight: 1.6,
                }}
              >
                {a.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
