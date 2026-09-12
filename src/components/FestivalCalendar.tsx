'use client';

import React, { useState } from 'react';
import { FestivalEvent, PoojaTiming, PrasadamSchedule } from '@/lib/types';
import { Calendar, Clock, MapPin, Sparkles, Utensils } from 'lucide-react';

interface CalendarProps {
  events: FestivalEvent[];
  poojaTimings: PoojaTiming[];
  prasadam: PrasadamSchedule[];
}

export default function FestivalCalendar({ events, poojaTimings, prasadam }: CalendarProps) {
  // Festival Days (Sep 14 to Sep 23, 2026)
  const festivalDays = [
    { dayNumber: 1, dateStr: '14 Sep', fullDate: '14 September 2026', title: 'Ganesh Chaturthi Aagman' },
    { dayNumber: 2, dateStr: '15 Sep', fullDate: '15 September 2026', title: 'Bhajan Sandhya' },
    { dayNumber: 3, dateStr: '16 Sep', fullDate: '16 September 2026', title: 'Kids Clay Art' },
    { dayNumber: 4, dateStr: '17 Sep', fullDate: '17 September 2026', title: 'Rangoli Utsav' },
    { dayNumber: 5, dateStr: '18 Sep', fullDate: '18 September 2026', title: 'Modak Maha Homam' },
    { dayNumber: 6, dateStr: '19 Sep', fullDate: '19 September 2026', title: 'Classical Dance Night' },
    { dayNumber: 7, dateStr: '20 Sep', fullDate: '20 September 2026', title: 'Community Antakshari' },
    { dayNumber: 8, dateStr: '21 Sep', fullDate: '21 September 2026', title: 'Youth Cultural Night' },
    { dayNumber: 9, dateStr: '22 Sep', fullDate: '22 September 2026', title: 'Chhappan Bhog & Maha Aarti' },
    { dayNumber: 10, dateStr: '23 Sep', fullDate: '23 September 2026', title: 'Anant Chaturdashi Visarjan' },
  ];

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const currentDay = festivalDays[selectedDayIndex];

  // Match items for the selected day
  const dayEvents = events.filter((e) =>
    e.date.toLowerCase().includes(currentDay.dateStr.toLowerCase())
  );

  const dayPoojas = poojaTimings.filter(
    (p) =>
      p.date.toLowerCase().includes(currentDay.dateStr.toLowerCase()) ||
      p.date.toLowerCase().includes('daily')
  );

  const dayPrasadam = prasadam.filter((pr) =>
    pr.date.toLowerCase().includes(currentDay.dateStr.toLowerCase())
  );

  return (
    <section id="calendar" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Daily Timeline</div>
          <h2 className="section-title">
            <span className="gold-text">Festival</span>{' '}
            <span className="gold-shimmer">Calendar</span>
          </h2>
          <p className="section-subtitle">
            Explore the complete 10-day celebration schedule. Select any date to see poojas, events,
            and prasadam planned at the Stage.
          </p>
        </div>

        {/* Date Selector Pills */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '32px',
            scrollbarWidth: 'thin',
          }}
        >
          {festivalDays.map((d, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDayIndex(index)}
                style={{
                  flex: '0 0 auto',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  border: isSelected
                    ? '1.5px solid var(--gold-400)'
                    : '1px solid rgba(212, 175, 55, 0.25)',
                  background: isSelected
                    ? 'var(--gold-gradient)'
                    : 'rgba(45, 10, 16, 0.65)',
                  color: isSelected ? '#200407' : 'var(--cream)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? '0 4px 18px rgba(212, 175, 55, 0.4)' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: isSelected ? '#200407' : 'var(--gold-400)',
                  }}
                >
                  Day {d.dayNumber}
                </div>
                <div
                  className="font-royal"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    margin: '2px 0',
                  }}
                >
                  {d.dateStr}
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    opacity: 0.85,
                    whiteSpace: 'nowrap',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {d.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Day Schedule Overview Card */}
        <div
          className="royal-card"
          style={{
            padding: '30px',
            border: '1.5px solid var(--border-gold-glow)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              paddingBottom: '18px',
              marginBottom: '26px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--gold-400)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                }}
              >
                DAY {currentDay.dayNumber} OF 10
              </div>
              <h3
                className="font-royal gold-shimmer"
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                }}
              >
                {currentDay.fullDate} — {currentDay.title}
              </h3>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(212, 175, 55, 0.15)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                color: 'var(--gold-300)',
              }}
            >
              <MapPin size={14} color="#FFA000" />
              <span>Venue: Stage</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Daily Poojas */}
            <div>
              <h4
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--gold-300)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🪔</span>
                <span>Poojas & Aartis</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dayPoojas.length > 0 ? (
                  dayPoojas.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(20, 3, 5, 0.7)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '10px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--gold-400)',
                          fontWeight: 600,
                          marginBottom: '2px',
                        }}
                      >
                        {p.time} • Stage
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--ivory)', fontSize: '0.92rem' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {p.description}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Nitya Morning (7:30 AM) & Evening (7:30 PM) Aarti at Stage.
                  </div>
                )}
              </div>
            </div>

            {/* Cultural Events */}
            <div>
              <h4
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--gold-300)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={16} color="#FFA000" />
                <span>Special Program</span>
              </h4>
              {dayEvents.length > 0 ? (
                dayEvents.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      padding: '12px 14px',
                      background: 'rgba(20, 3, 5, 0.7)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--gold-400)',
                        fontWeight: 600,
                        marginBottom: '2px',
                      }}
                    >
                      {e.startTime} - {e.endTime} • Stage
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--ivory)', fontSize: '0.95rem' }}>
                      {e.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {e.description}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(20, 3, 5, 0.5)',
                    borderRadius: '10px',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  Open community darshan, bhajans, and family blessings at the Stage.
                </div>
              )}
            </div>

            {/* Today's Prasadam */}
            <div>
              <h4
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--gold-300)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Utensils size={16} color="#FFA000" />
                <span>Mahaprasadam Seva</span>
              </h4>
              {dayPrasadam.length > 0 ? (
                dayPrasadam.map((pr) => (
                  <div
                    key={pr.id}
                    style={{
                      padding: '12px 14px',
                      background: 'rgba(20, 3, 5, 0.7)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--gold-400)',
                        fontWeight: 600,
                        marginBottom: '2px',
                      }}
                    >
                      {pr.time} • {pr.location}
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--ivory)', fontSize: '0.95rem' }}>
                      {pr.menu}
                    </div>
                    {pr.sponsorNotes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--gold-300)', marginTop: '4px' }}>
                        {pr.sponsorNotes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(20, 3, 5, 0.5)',
                    borderRadius: '10px',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  Fresh Modak, Panchamrit, and Boondi Laddoo distribution following evening Aarti at the Stage.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
