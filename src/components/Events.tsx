'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FestivalEvent } from '@/lib/types';
import { Clock, Calendar, MapPin, Sparkles, Filter } from 'lucide-react';

interface EventsProps {
  events: FestivalEvent[];
}

export default function Events({ events }: EventsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Cultural Program',
    'Bhajan',
    'Kids Activities',
    'Dance',
    'Music',
  ];

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  return (
    <section id="events" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Joyous Celebrations</div>
          <h2 className="section-title">
            <span className="gold-text">Festival</span>{' '}
            <span className="gold-shimmer">Events</span>
          </h2>
          <p className="section-subtitle">
            Immerse yourself in our community cultural programs, devotional music, youth activities,
            and grand celebrations at the Stage.
          </p>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '38px',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '24px',
                border:
                  selectedCategory === cat
                    ? '1.5px solid var(--gold-400)'
                    : '1px solid rgba(212, 175, 55, 0.25)',
                background:
                  selectedCategory === cat
                    ? 'var(--gold-gradient)'
                    : 'rgba(45, 10, 16, 0.6)',
                color: selectedCategory === cat ? '#200407' : 'var(--cream)',
                fontFamily: 'var(--font-sans)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="royal-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Event Image Banner */}
              <div
                style={{
                  position: 'relative',
                  height: '190px',
                  width: '100%',
                  background: '#1a0407',
                }}
              >
                <Image
                  src={event.image || '/images/ganpati-hero.jpg'}
                  alt={event.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(32, 5, 9, 0.95) 0%, transparent 60%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(28, 3, 6, 0.85)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.74rem',
                    color: 'var(--gold-300)',
                    fontWeight: 600,
                  }}
                >
                  {event.category}
                </div>
                {event.isFeatured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(90deg, #d32f2f, #b71c1c)',
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    ★ Featured
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3
                    className="font-royal"
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--ivory)',
                      marginBottom: '8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {event.name}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      color: 'var(--gold-400)',
                      fontSize: '0.82rem',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {event.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.88rem',
                      lineHeight: 1.55,
                      marginBottom: '16px',
                    }}
                  >
                    {event.description}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: 'var(--gold-300)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#FFA000" />
                    <strong>{event.location}</strong>
                  </span>
                  <a
                    href="#map"
                    style={{
                      color: 'var(--gold-400)',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                    }}
                  >
                    Locate on Map →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
