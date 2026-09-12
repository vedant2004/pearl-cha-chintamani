'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { VisarjanConfig } from '@/lib/types';
import { Heart, Waves, MapPin, Compass } from 'lucide-react';

interface VisarjanProps {
  config: VisarjanConfig;
}

export default function VisarjanSection({ config }: VisarjanProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    setMounted(true);
    if (!config?.targetDate) return;

    const updateTimer = () => {
      const diff = +new Date(config.targetDate) - +new Date();
      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isCompleted: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [config?.targetDate]);

  if (!config.enabled) return null;

  return (
    <section
      id="visarjan"
      className="section-py"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #1c0306 0%, #2e070e 50%, #170205 100%)',
        borderTop: '1px solid var(--border-gold)',
        borderBottom: '1px solid var(--border-gold)',
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Pudhchya Varshi Lavkar Ya</div>
          <h2
            className="section-title"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <span>🌊</span>
            <span className="gold-shimmer">VISARJAN</span>
          </h2>
          <p
            className="section-subtitle font-royal"
            style={{
              fontSize: '1.25rem',
              color: 'var(--gold-300)',
              fontWeight: 600,
              marginTop: '6px',
            }}
          >
            Until we meet again, Bappa ❤️
          </p>
        </div>

        <div
          className="royal-card"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            overflow: 'hidden',
            border: '1.5px solid var(--border-gold-glow)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              alignItems: 'center',
            }}
          >
            {/* Procession Visual */}
            <div
              style={{
                position: 'relative',
                height: '320px',
                width: '100%',
              }}
            >
              <Image
                src="/images/visarjan-procession.jpg"
                alt="Grand Visarjan Procession"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to right, transparent 60%, rgba(45, 10, 16, 0.95) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  background: 'rgba(28, 3, 6, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  color: 'var(--gold-300)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Compass size={14} color="#FFA000" />
                <span>Procession begins at Stage</span>
              </div>
            </div>

            {/* Countdown & Procession Info */}
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--gold-400)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '12px',
                }}
              >
                GRAND VISARJAN COUNTDOWN
              </div>

              {mounted && timeLeft.isCompleted ? (
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--gold-500)',
                    color: 'var(--gold-300)',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    marginBottom: '18px',
                  }}
                >
                  🙏 Ganpati Bappa Morya, Pudhchya Varshi Lavkar Ya! ❤️
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px',
                    marginBottom: '24px',
                  }}
                >
                  {[
                    { label: 'DAYS', val: timeLeft.days },
                    { label: 'HOURS', val: timeLeft.hours },
                    { label: 'MINUTES', val: timeLeft.minutes },
                    { label: 'SECONDS', val: timeLeft.seconds },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      style={{
                        background: 'rgba(20, 3, 5, 0.95)',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '10px',
                        padding: '10px 4px',
                      }}
                    >
                      <div
                        className="font-royal gold-shimmer"
                        style={{
                          fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                          fontWeight: 800,
                          lineHeight: 1.1,
                        }}
                      >
                        {String(unit.val).padStart(2, '0')}
                      </div>
                      <div
                        style={{
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          color: 'var(--gold-400)',
                          fontWeight: 600,
                          marginTop: '2px',
                        }}
                      >
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--cream)',
                  lineHeight: 1.6,
                  marginBottom: '18px',
                }}
              >
                {config.routeDescription ||
                  'The sacred Visarjan procession will depart from the Stage with traditional Dhol Tasha, Gulal, and Maha Aarti.'}
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  fontSize: '0.82rem',
                  color: 'var(--gold-300)',
                }}
              >
                <MapPin size={14} color="#FFA000" />
                <span>Starting Point: {config.stageLocation || 'Stage'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
