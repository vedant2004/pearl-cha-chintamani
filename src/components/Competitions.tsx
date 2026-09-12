'use client';

import React from 'react';
import { Competition } from '@/lib/types';
import { Trophy, Calendar, Clock, Award, Info, Sparkles } from 'lucide-react';

interface CompetitionsProps {
  competitions: Competition[];
}

export default function Competitions({ competitions }: CompetitionsProps) {
  return (
    <section id="competitions" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Talent & Creativity</div>
          <h2 className="section-title">
            <span className="gold-text">Festival</span>{' '}
            <span className="gold-shimmer">Competitions</span>
          </h2>
          <p className="section-subtitle">
            Celebrate community spirit and artistic devotion. Open for all age groups with exciting trophies
            and blessings for every participant!
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="royal-card"
              style={{
                padding: '24px',
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
                      fontSize: '0.74rem',
                      background: 'rgba(212, 175, 55, 0.2)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      color: 'var(--gold-400)',
                      fontWeight: 700,
                    }}
                  >
                    {comp.category}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--gold-300)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={12} />
                    <span>{comp.date}</span>
                  </div>
                </div>

                <h3
                  className="font-royal"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--ivory)',
                    marginBottom: '8px',
                  }}
                >
                  {comp.name}
                </h3>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    marginBottom: '14px',
                  }}
                >
                  {comp.description}
                </p>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(20, 3, 5, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    fontSize: '0.82rem',
                    color: 'var(--cream)',
                    marginBottom: '14px',
                  }}
                >
                  <strong style={{ color: 'var(--gold-400)' }}>Registration: </strong>
                  {comp.registrationInfo}
                </div>
              </div>

              {/* Winners Box */}
              {comp.winners && (
                <div
                  style={{
                    borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <Trophy size={16} color="#FFD700" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--gold-400)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      WINNERS ANNOUNCED
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ivory)', fontWeight: 600 }}>
                      {comp.winners}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
