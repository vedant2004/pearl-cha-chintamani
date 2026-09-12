'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types';
import { Camera, X, Maximize2, Sparkles } from 'lucide-react';

interface GalleryProps {
  items: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Darshan', 'Aarti', 'Visarjan'];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const todaysMoments = items.filter((i) => i.isFeatured);

  return (
    <section id="gallery" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        {/* Today's Moments Section */}
        {todaysMoments.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="section-pretitle">Live Visual Glimpses</span>
              <h2 className="section-title">
                <span className="gold-text">Today’s</span>{' '}
                <span className="gold-shimmer">Moments</span>
              </h2>
              <p className="section-subtitle">
                Captured straight from the Stage Mandap. Feel the divine presence and joyous devotion.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {todaysMoments.map((item) => (
                <div
                  key={`today-${item.id}`}
                  className="royal-card"
                  onClick={() => setActiveModalItem(item)}
                  style={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative', height: '240px', width: '100%' }}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top, rgba(20, 3, 5, 0.95) 0%, transparent 60%)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '14px',
                        left: '16px',
                        right: '16px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(212, 175, 55, 0.3)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          color: 'var(--gold-300)',
                          fontWeight: 700,
                        }}
                      >
                        {item.category}
                      </span>
                      <h4
                        className="font-royal"
                        style={{
                          fontSize: '1.05rem',
                          color: 'var(--ivory)',
                          marginTop: '4px',
                        }}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Festival Gallery */}
        <div className="section-header">
          <div className="section-pretitle">Festive Memories & Darshan</div>
          <h2 className="section-title">
            <span className="gold-text">Festival</span>{' '}
            <span className="gold-shimmer">Gallery</span>
          </h2>
          <p className="section-subtitle">
            Cherishing the auspicious sights of Pearl Cha Chintamani, evening aartis, and procession memories.
          </p>
        </div>

        {/* Filter Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '32px',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border:
                  selectedCategory === cat
                    ? '1.5px solid var(--gold-400)'
                    : '1px solid rgba(212, 175, 55, 0.25)',
                background:
                  selectedCategory === cat
                    ? 'var(--gold-gradient)'
                    : 'rgba(45, 10, 16, 0.6)',
                color: selectedCategory === cat ? '#200407' : 'var(--cream)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="royal-card"
              onClick={() => setActiveModalItem(item)}
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(28, 3, 6, 0.9) 0%, transparent 60%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '14px',
                    right: '14px',
                  }}
                >
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--ivory)' }}>
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--gold-400)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeModalItem && (
          <div
            onClick={() => setActiveModalItem(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(10, 1, 2, 0.92)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '850px',
                width: '100%',
                background: 'rgba(32, 5, 9, 0.98)',
                border: '1.5px solid var(--gold-500)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              }}
            >
              <button
                onClick={() => setActiveModalItem(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid var(--gold-400)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              <div style={{ position: 'relative', height: '420px', width: '100%' }}>
                <Image
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-gold)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(212, 175, 55, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: 'var(--gold-400)',
                      fontWeight: 700,
                    }}
                  >
                    {activeModalItem.category} • {activeModalItem.year}
                  </span>
                </div>
                <h3 className="font-royal" style={{ fontSize: '1.25rem', color: 'var(--ivory)' }}>
                  {activeModalItem.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  {activeModalItem.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
