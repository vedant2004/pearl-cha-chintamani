'use client';

import React from 'react';
import { PoojaTiming } from '@/lib/types';
import { Clock, Calendar, MapPin, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PoojaTimingsProps {
  timings: PoojaTiming[];
}

export default function PoojaTimings({ timings }: PoojaTimingsProps) {
  const sortedTimings = [...timings].sort((a, b) => a.order - b.order);

  const handlePranamClick = (name: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFA000', '#FFD700', '#FF7722'],
    });
  };

  return (
    <section id="pooja" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Auspicious Rituals & Timings</div>
          <h2 className="section-title">
            <span className="gold-text">Pooja</span>{' '}
            <span className="gold-shimmer">Timings</span>
          </h2>
          <p className="section-subtitle">
            Join the Pearl community in invoking Lord Ganesha’s divine blessings. All ceremonies
            are performed at the central Stage.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '22px',
          }}
        >
          {sortedTimings.map((item) => (
            <div
              key={item.id}
              className="royal-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: item.isSpecial
                  ? '1.5px solid rgba(212, 175, 55, 0.7)'
                  : '1px solid var(--border-gold)',
                background: item.isSpecial
                  ? 'linear-gradient(145deg, rgba(74, 14, 23, 0.95) 0%, rgba(32, 5, 9, 0.98) 100%)'
                  : 'var(--card-gradient)',
              }}
            >
              <div>
                {/* Header Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '0.78rem',
                      color: 'var(--gold-300)',
                      fontWeight: 600,
                    }}
                  >
                    <Clock size={13} color="#FFA000" />
                    <span>{item.time}</span>
                  </div>

                  {item.isSpecial && (
                    <span
                      style={{
                        background: 'linear-gradient(90deg, #d32f2f, #b71c1c)',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      ★ Maha Pooja
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3
                  className="font-royal"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--ivory)',
                    marginBottom: '10px',
                    lineHeight: 1.25,
                  }}
                >
                  {item.name}
                </h3>

                {/* Date */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--gold-400)',
                    fontSize: '0.85rem',
                    marginBottom: '12px',
                    fontWeight: 500,
                  }}
                >
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>

                {/* Description */}
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    lineHeight: 1.55,
                    marginBottom: '18px',
                  }}
                >
                  {item.description}
                </p>
              </div>

              {/* Bottom Meta & Action */}
              <div
                style={{
                  borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    color: 'var(--gold-300)',
                    fontWeight: 600,
                  }}
                >
                  <MapPin size={14} color="#FFA000" />
                  <span>Location: <strong>{item.location}</strong></span>
                </div>

                <button
                  onClick={() => handlePranamClick(item.name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold-400)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                  title="Offer flower tribute"
                >
                  <span>Pranam</span>
                  <span>🙏</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
