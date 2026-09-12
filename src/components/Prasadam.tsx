'use client';

import React from 'react';
import { PrasadamSchedule } from '@/lib/types';
import { Utensils, Clock, MapPin, Heart, Sparkles } from 'lucide-react';

interface PrasadamProps {
  schedules: PrasadamSchedule[];
}

export default function Prasadam({ schedules }: PrasadamProps) {
  return (
    <section id="prasadam" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Sacred Offerings & Seva</div>
          <h2 className="section-title">
            <span className="gold-text">Mahaprasadam</span>{' '}
            <span className="gold-shimmer">Schedule</span>
          </h2>
          <p className="section-subtitle">
            Bappa’s divine bhog and sanctified sweet prasadam distributed to all residents and visitors
            following the daily aartis at the Stage.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '1040px',
            margin: '0 auto',
          }}
        >
          {schedules.map((item) => (
            <div
              key={item.id}
              className="royal-card"
              style={{
                padding: '24px',
                border: item.isSpecial
                  ? '1.5px solid var(--gold-500)'
                  : '1px solid var(--border-gold)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--gold-400)',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {item.date}
                  </span>
                  {item.isSpecial && (
                    <span
                      style={{
                        background: 'linear-gradient(90deg, #d32f2f, #ff7722)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      ★ Maha Bhog
                    </span>
                  )}
                </div>

                <h3
                  className="font-royal"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--ivory)',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {item.menu}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--gold-300)',
                    fontSize: '0.85rem',
                    marginBottom: '12px',
                  }}
                >
                  <Clock size={13} color="#FFA000" />
                  <span>{item.time}</span>
                </div>

                {item.sponsorNotes && (
                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                    }}
                  >
                    {item.sponsorNotes}
                  </p>
                )}
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                  paddingTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  color: 'var(--gold-400)',
                  fontWeight: 600,
                }}
              >
                <MapPin size={14} color="#FFA000" />
                <span>Counter: {item.location || 'Stage'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
