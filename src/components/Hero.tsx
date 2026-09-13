'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CountdownItem, FestivalEvent, PoojaTiming } from '@/lib/types';
import { Sparkles, Clock, Calendar, MapPin, ChevronRight, Flame } from 'lucide-react';

interface HeroProps {
  activeCountdown?: CountdownItem;
  nextEvent?: FestivalEvent;
  upcomingPooja?: PoojaTiming;
  announcementSnippet?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function Hero({
  activeCountdown,
  nextEvent,
  upcomingPooja,
  announcementSnippet,
}: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    setMounted(true);
    if (!activeCountdown?.targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(activeCountdown.targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeCountdown?.targetDate]);

  return (
    <section
      style={{
        position: 'relative',
        padding: '50px 0 60px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Mandala */}
      <div
        className="mandala-bg"
        style={{
          width: '700px',
          height: '700px',
          top: '-150px',
          left: '50%',
          marginLeft: '-350px',
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="1,2" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <polygon points="50,5 61,39 97,39 68,60 79,95 50,74 21,95 32,60 3,39 39,39" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Sacred Sanskrit Invocation */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span
            className="font-sanskrit gold-shimmer"
            style={{
              fontSize: '1rem',
              letterSpacing: '0.22em',
              fontWeight: 700,
            }}
          >
            ॥ श्री गणेशाय नमः • ॐ गं गणपतये नमः ॥
          </span>
        </div>

        {/* Hero Titles */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '30px',
              background: 'rgba(66, 13, 20, 0.7)',
              border: '1px solid var(--border-gold)',
              marginBottom: '14px',
              fontSize: '0.85rem',
              color: 'var(--gold-300)',
              fontWeight: 600,
              letterSpacing: '0.12em',
            }}
          >
            <Sparkles size={14} color="#FFA000" />
            <span>HYDERABAD • GANESH UTSAV 2026</span>
          </div>

          <h1
            className="font-royal"
            style={{
              fontSize: 'clamp(2.4rem, 6.5vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '0.02em',
              marginBottom: '12px',
              textShadow: '0 4px 25px rgba(0, 0, 0, 0.8)',
            }}
          >
            <span className="gold-text">PEARL CHA</span> <br />
            <span className="gold-shimmer">CHINTAMANI</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: 'var(--cream)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            Ganpati Bappa Morya 🙏
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--gold-200)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Welcome to the divine celebrations of Pearl Cha Chintamani 2026. Join our community in prayers, daily aartis, and festive joy at the Stage.
          </p>
        </div>

        {/* Grand Royal Mandap Idol Frame */}
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto 40px',
            position: 'relative',
          }}
        >
          {/* Ornate Arch Border Container */}
          <div
            style={{
              borderRadius: 'var(--radius-arch)',
              padding: '10px',
              background: 'linear-gradient(180deg, #d4af37 0%, #420d14 40%, #1c0306 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(212, 175, 55, 0.25)',
              position: 'relative',
            }}
          >
            <div
              style={{
                borderRadius: 'calc(var(--radius-arch) - 6px)',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '16 / 10',
                maxHeight: '520px',
                background: '#120204',
              }}
            >
              <Image
                src="/images/ganpati-hero.jpg"
                alt="Pearl Cha Chintamani 2026 - Lord Ganesha Idol"
                fill
                priority
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                }}
              />

              {/* Bottom Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(20, 3, 5, 0.95) 0%, rgba(20, 3, 5, 0.4) 35%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Glowing Diyas on Lower Sides */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(28, 3, 6, 0.85)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                }}
              >
                <div className="diya-flame" style={{ fontSize: '1.3rem' }}>
                  🪔
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gold-300)', fontWeight: 600 }}>
                  Stage Mandap
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  right: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(28, 3, 6, 0.85)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                }}
              >
                <div className="diya-flame" style={{ fontSize: '1.3rem' }}>
                  🪔
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gold-300)', fontWeight: 600 }}>
                  Divine Darshan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Countdown Display */}
        {activeCountdown && (
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto 40px',
              textAlign: 'center',
            }}
          >
            <div
              className="royal-card"
              style={{
                padding: '24px 20px',
                background:
                  'radial-gradient(ellipse at center, rgba(66, 13, 20, 0.95) 0%, rgba(28, 3, 6, 0.98) 100%)',
                border: '1.5px solid var(--gold-500)',
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  letterSpacing: '0.15em',
                  color: 'var(--gold-400)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                ❖ {activeCountdown.title} ❖
              </div>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                }}
              >
                {activeCountdown.description}
              </p>

              {mounted && timeLeft.isExpired ? (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--gold-500)',
                    color: 'var(--gold-300)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  🎉 {activeCountdown.postEventMessage || 'The auspicious moment has arrived! 🙏'}
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    maxWidth: '560px',
                    margin: '0 auto',
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
                        background: 'rgba(20, 3, 5, 0.9)',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '12px',
                        padding: '12px 6px',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div
                        className="font-royal gold-shimmer"
                        style={{
                          fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                          fontWeight: 800,
                          lineHeight: 1.1,
                        }}
                      >
                        {String(unit.val).padStart(2, '0')}
                      </div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          letterSpacing: '0.14em',
                          color: 'var(--gold-400)',
                          fontWeight: 600,
                          marginTop: '4px',
                        }}
                      >
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Action Navigation CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '46px',
          }}
        >
          <a href="#pooja" className="btn-gold">
            <Clock size={16} />
            <span>Pooja Timings</span>
          </a>
          <a href="#events" className="btn-outline-gold">
            <Calendar size={16} />
            <span>Festival Events</span>
          </a>
          <a href="#blessings" className="btn-outline-gold">
            <span>🙏 Leave Blessings</span>
          </a>
          <a href="#map" className="btn-outline-gold">
            <MapPin size={16} />
            <span>Apartment Map</span>
          </a>
        </div>

        {/* Highlights Row: Next Event, Upcoming Pooja, Announcement */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
          }}
        >
          {/* Next Event Card */}
          {nextEvent && (
            <div className="royal-card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--gold-400)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                  }}
                >
                  NEXT EVENT
                </span>
                <span className="pulse-badge">Featured</span>
              </div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--ivory)',
                  marginBottom: '6px',
                }}
              >
                {nextEvent.name}
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--gold-300)',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Clock size={14} /> {nextEvent.date} • {nextEvent.startTime}
              </p>
              <div
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MapPin size={13} color="#FFA000" />
                <span>Location: {nextEvent.location}</span>
              </div>
            </div>
          )}

          {/* Upcoming Pooja Card */}
          {upcomingPooja && (
            <div className="royal-card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--gold-400)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                  }}
                >
                  UPCOMING POOJA
                </span>
                <span style={{ fontSize: '1.1rem' }}>🪔</span>
              </div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--ivory)',
                  marginBottom: '6px',
                }}
              >
                {upcomingPooja.name}
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--gold-300)',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Clock size={14} /> {upcomingPooja.time} ({upcomingPooja.date})
              </p>
              <div
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MapPin size={13} color="#FFA000" />
                <span>Sanctum: {upcomingPooja.location}</span>
              </div>
            </div>
          )}

          {/* Latest Announcement Card */}
          <div className="royal-card" style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--gold-400)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}
              >
                LATEST NOTICE
              </span>
              <span className="pulse-badge">Live</span>
            </div>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--cream)',
                lineHeight: 1.5,
                marginBottom: '12px',
              }}
            >
              {announcementSnippet ||
                'Nitya Evening Aarti is conducted daily at 7:30 PM at the central Stage.'}
            </p>
            <a
              href="#announcements"
              style={{
                color: 'var(--gold-400)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>View all announcements</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
