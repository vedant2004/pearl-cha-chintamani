'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MemoryItem } from '@/lib/types';
import { Sparkles, Calendar, Award } from 'lucide-react';

interface MemoriesProps {
  memories: MemoryItem[];
}

export default function Memories({ memories }: MemoriesProps) {
  const [activeYear, setActiveYear] = useState<number>(memories[0]?.year || 2025);

  const selectedMemory = memories.find((m) => m.year === activeYear) || memories[0];

  return (
    <section id="memories" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Legacy of Devotion</div>
          <h2 className="section-title">
            <span className="gold-text">Festival</span>{' '}
            <span className="gold-shimmer">Memories</span>
          </h2>
          <p className="section-subtitle">
            Reliving the glorious years of Pearl Cha Chintamani. A community journey of faith, joy,
            and shared celebrations.
          </p>
        </div>

        {/* Year Selector Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          {memories.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveYear(m.year)}
              style={{
                padding: '10px 22px',
                borderRadius: '24px',
                border:
                  activeYear === m.year
                    ? '1.5px solid var(--gold-400)'
                    : '1px solid rgba(212, 175, 55, 0.25)',
                background:
                  activeYear === m.year
                    ? 'var(--gold-gradient)'
                    : 'rgba(45, 10, 16, 0.6)',
                color: activeYear === m.year ? '#200407' : 'var(--cream)',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Utsav {m.year}
            </button>
          ))}
        </div>

        {/* Memory Showcase Card */}
        {selectedMemory && (
          <div
            className="royal-card"
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              overflow: 'hidden',
              border: '1.5px solid var(--border-gold-glow)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              }}
            >
              <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <Image
                  src={selectedMemory.coverImage || '/images/maha-aarti.jpg'}
                  alt={selectedMemory.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to right, transparent 50%, rgba(45, 10, 16, 0.95) 100%)',
                  }}
                />
              </div>

              <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--gold-400)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}
                >
                  HISTORICAL HIGHLIGHT • {selectedMemory.year}
                </div>
                <h3
                  className="font-royal gold-shimmer"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    marginBottom: '12px',
                  }}
                >
                  {selectedMemory.title}
                </h3>
                <p
                  style={{
                    color: 'var(--cream)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    marginBottom: '18px',
                  }}
                >
                  {selectedMemory.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedMemory.highlights?.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.84rem',
                        color: 'var(--gold-300)',
                      }}
                    >
                      <Sparkles size={14} color="#FFA000" style={{ flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
