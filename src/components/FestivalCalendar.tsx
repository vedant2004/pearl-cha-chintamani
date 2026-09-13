'use client';

import React, { useState } from 'react';
import { FestivalEvent, PoojaTiming, ScheduleItem } from '@/lib/types';
import { Calendar, Clock, MapPin, Sparkles, Filter } from 'lucide-react';
import {
  sortScheduleChronologically,
  getCategoryBadgeStyle,
} from '@/lib/schedule-utils';

interface CalendarProps {
  schedule?: ScheduleItem[];
  events?: FestivalEvent[];
  poojaTimings?: PoojaTiming[];
}

export default function FestivalCalendar({
  schedule,
  events = [],
  poojaTimings = [],
}: CalendarProps) {
  // Festival Days (Sep 14 to Sep 19, 2026 - Visarjan on 19 Sep)
  const festivalDays = [
    { dayNumber: 1, dateStr: '14 Sep', fullDate: '14 September 2026', title: 'Ganesh Chaturthi Sthapana' },
    { dayNumber: 2, dateStr: '15 Sep', fullDate: '15 September 2026', title: 'Bhajan Sandhya & Kirtan' },
    { dayNumber: 3, dateStr: '16 Sep', fullDate: '16 September 2026', title: 'Kids Clay Art & Drawing' },
    { dayNumber: 4, dateStr: '17 Sep', fullDate: '17 September 2026', title: 'Rangoli Utsav' },
    { dayNumber: 5, dateStr: '18 Sep', fullDate: '18 September 2026', title: 'Modak Homam & Dance Night' },
    { dayNumber: 6, dateStr: '19 Sep', fullDate: '19 September 2026', title: 'Grand Visarjan Shobhayatra' },
  ];

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const currentDay = festivalDays[selectedDayIndex];

  // Derive all items from schedule source of truth (or fallback to legacy events/poojaTimings)
  const allItems: ScheduleItem[] =
    schedule && schedule.length > 0
      ? schedule
      : [
          ...poojaTimings.map((p) => ({
            id: p.id,
            name: p.name,
            category: (p.name.toLowerCase().includes('morning')
              ? 'Morning Aarti'
              : p.name.toLowerCase().includes('aarti')
              ? 'Aarti'
              : 'Pooja') as any,
            date: p.date,
            startTime: p.time,
            location: p.location || 'Stage',
            description: p.description,
            active: true,
          })),
          ...events.map((e) => ({
            id: e.id,
            name: e.name,
            category: (e.category === 'Special Pooja'
              ? 'Pooja'
              : e.category === 'Kids Activities'
              ? 'Competition'
              : 'Cultural') as any,
            date: e.date,
            startTime: e.startTime,
            endTime: e.endTime,
            location: e.location || 'Stage',
            description: e.description,
            active: true,
          })),
        ];

  // Filter for active items on the selected day
  const dayItems = allItems.filter(
    (item) =>
      item.active !== false &&
      (item.date.toLowerCase().includes(currentDay.dateStr.toLowerCase()) ||
        item.date.toLowerCase().includes('daily'))
  );

  // Sort strictly chronologically by start time!
  const sortedItems = sortScheduleChronologically(dayItems);

  // Apply optional category filter
  const displayedItems =
    selectedCategory === 'All'
      ? sortedItems
      : sortedItems.filter((item) => item.category === selectedCategory);

  const availableCategories = [
    'All',
    ...Array.from(new Set(sortedItems.map((item) => item.category))),
  ];

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
            Explore the complete celebration schedule from 14 to 19 September 2026.
            Select any date to see poojas, aartis, dhol sessions, and cultural programs planned at the Stage.
          </p>
        </div>

        {/* Date Selector Pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '28px',
            scrollbarWidth: 'thin',
          }}
        >
          {festivalDays.map((d, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={d.dayNumber}
                onClick={() => {
                  setSelectedDayIndex(index);
                  setSelectedCategory('All');
                }}
                style={{
                  flex: '1 0 140px',
                  maxWidth: '180px',
                  padding: '14px 16px',
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
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    margin: '3px 0',
                  }}
                >
                  {d.dateStr}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    opacity: 0.9,
                    whiteSpace: 'nowrap',
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
            padding: '28px',
            border: '1.5px solid var(--border-gold-glow)',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              paddingBottom: '18px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--gold-400)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                DAY {currentDay.dayNumber} OF 6
              </div>
              <h3
                className="font-royal gold-shimmer"
                style={{
                  fontSize: '1.5rem',
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

          {/* Optional Category Filter Pills */}
          {availableCategories.length > 2 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '22px',
              }}
            >
              {availableCategories.map((cat) => {
                const isCatSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '16px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isCatSelected
                        ? '1px solid var(--gold-400)'
                        : '1px solid rgba(212, 175, 55, 0.2)',
                      background: isCatSelected
                        ? 'rgba(212, 175, 55, 0.25)'
                        : 'rgba(20, 3, 5, 0.6)',
                      color: isCatSelected ? 'var(--gold-300)' : 'var(--cream)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Chronological Schedule Activities List */}
          {displayedItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {displayedItems.map((item) => {
                const badge = getCategoryBadgeStyle(item.category);
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(20, 3, 5, 0.75)',
                      border: '1px solid rgba(212, 175, 55, 0.22)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      transition: 'border 0.2s ease, transform 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: '1 1 300px' }}>
                      {/* Time Pillar */}
                      <div
                        style={{
                          minWidth: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'var(--gold-400)',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                          }}
                        >
                          <Clock size={14} color="#FFA000" />
                          <span>{item.startTime}</span>
                        </div>
                        {item.endTime && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '19px' }}>
                            to {item.endTime}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span
                            style={{
                              background: badge.bg,
                              color: badge.color,
                              border: badge.border,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>{badge.icon}</span>
                            <span>{item.category}</span>
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            • {item.location || 'Stage'}
                          </span>
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--ivory)',
                            fontSize: '1rem',
                            marginBottom: item.description ? '3px' : '0',
                          }}
                        >
                          {item.name}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
                background: 'rgba(20, 3, 5, 0.5)',
                borderRadius: '12px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                border: '1px dashed rgba(212, 175, 55, 0.2)',
              }}
            >
              Open community darshan, devotional bhajans, and family blessings at the Stage.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
