'use client';

import React, { useState } from 'react';
import { MapMarker } from '@/lib/types';
import { MapPin, Compass, Info, X } from 'lucide-react';

interface ApartmentMapProps {
  markers: MapMarker[];
}

export default function ApartmentMap({ markers }: ApartmentMapProps) {
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(markers[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const cleanTitle = (title: string) => {
    return title.replace(/^[\p{Emoji}\u200d\uFE0F\s]+/u, '').trim() || title;
  };

  const handleCategoryChange = (catId: string) => {
    setFilterCategory(catId);
    const newFiltered = catId === 'all' ? markers : markers.filter((m) => m.category === catId);
    if (newFiltered.length > 0 && (!activeMarker || !newFiltered.some((m) => m.id === activeMarker.id))) {
      setActiveMarker(newFiltered[0]);
    }
  };

  const filteredMarkers =
    filterCategory === 'all'
      ? markers
      : markers.filter((m) => m.category === filterCategory);

  const getMarkerIcon = (category: string) => {
    switch (category) {
      case 'stage':
        return '🐘';
      case 'gate':
        return '🚪';
      case 'parking':
        return '🚗';
      case 'photo':
        return '📸';
      case 'washroom':
        return '🚻';
      case 'prasadam':
        return '🍽️';
      case 'footwear':
        return '👟';
      default:
        return '📍';
    }
  };

  return (
    <section id="map" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Campus Navigation</div>
          <h2 className="section-title">
            <span className="gold-text">Apartment</span>{' '}
            <span className="gold-shimmer">Festival Map</span>
          </h2>
          <p className="section-subtitle">
            Find the Stage, parking, entrance gates, footwear stands, and photo booths across Pearl
            community. Click any pin for directions and details.
          </p>
        </div>

        {/* Categories Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '28px',
          }}
        >
          {[
            { id: 'all', label: 'All Locations' },
            { id: 'stage', label: '🐘 Stage' },
            { id: 'gate', label: '🚪 Main Gate' },
            { id: 'parking', label: '🚗 Parking' },
            { id: 'photo', label: '📸 Photo Area' },
            { id: 'prasadam', label: '🍽️ Prasadam' },
            { id: 'footwear', label: '👟 Footwear' },
            { id: 'washroom', label: '🚻 Washrooms' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border:
                  filterCategory === cat.id
                    ? '1.5px solid var(--gold-400)'
                    : '1px solid rgba(212, 175, 55, 0.25)',
                background:
                  filterCategory === cat.id
                    ? 'var(--gold-gradient)'
                    : 'rgba(45, 10, 16, 0.65)',
                color: filterCategory === cat.id ? '#200407' : 'var(--cream)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Map Layout Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            maxWidth: '1080px',
            margin: '0 auto',
          }}
        >
          {/* Visual SVG Map Canvas */}
          <div
            className="royal-card"
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#180407',
              border: '1.5px solid var(--border-gold)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '62%', // 16:10 aspect ratio container
              }}
            >
              {/* SVG Background Architectural Map Illustration */}
              <svg
                viewBox="0 0 1000 620"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(212, 175, 55, 0.06)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFA000" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FFA000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Base ground & grid */}
                <rect width="1000" height="620" fill="#140306" />
                <rect width="1000" height="620" fill="url(#grid)" />

                {/* Society Boundary Wall */}
                <rect
                  x="40"
                  y="30"
                  width="920"
                  height="560"
                  rx="24"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.4)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />

                {/* Internal Pathways */}
                <path
                  d="M 180 540 L 180 300 L 500 260 L 500 150 M 500 260 L 820 300 L 820 540 M 500 260 L 500 450 L 180 450"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.25)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Tower A (Residential) */}
                <rect x="100" y="80" width="220" height="150" rx="12" fill="#2d0a11" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" />
                <text x="210" y="165" fill="#fdfbf7" fontSize="18" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  TOWER A
                </text>

                {/* Tower B (Residential) */}
                <rect x="680" y="80" width="220" height="150" rx="12" fill="#2d0a11" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" />
                <text x="790" y="165" fill="#fdfbf7" fontSize="18" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  TOWER B
                </text>

                {/* Tower C (Residential) */}
                <rect x="700" y="380" width="200" height="160" rx="12" fill="#2d0a11" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" />
                <text x="800" y="465" fill="#fdfbf7" fontSize="18" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  TOWER C
                </text>

                {/* Central Festival Courtyard */}
                <circle cx="500" cy="260" r="130" fill="url(#stageGlow)" />
                <circle cx="500" cy="260" r="80" fill="#420d14" stroke="#D4AF37" strokeWidth="3" />
                <text x="500" y="265" fill="#FFD700" fontSize="16" fontFamily="serif" fontWeight="bold" textAnchor="middle">
                  STAGE MANDAP
                </text>
                <text x="500" y="285" fill="#FFF0BE" fontSize="11" fontFamily="sans-serif" textAnchor="middle">
                  (Central Sanctum)
                </text>

                {/* Main Gate Entry Area */}
                <rect x="120" y="520" width="120" height="40" rx="8" fill="#380a10" stroke="#FF7722" strokeWidth="2" />
                <text x="180" y="545" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
                  MAIN GATE
                </text>
              </svg>

              {/* Dynamic Interactive Pin Markers */}
              {filteredMarkers.map((marker) => {
                const isSelected = activeMarker?.id === marker.id;
                const isStage = marker.category === 'stage';
                return (
                  <button
                    key={marker.id}
                    onClick={() => setActiveMarker(marker)}
                    style={{
                      position: 'absolute',
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: isSelected ? 20 : 10,
                      background: isSelected
                        ? 'var(--gold-gradient)'
                        : isStage
                        ? 'linear-gradient(135deg, #d32f2f, #ff7722)'
                        : 'rgba(42, 8, 13, 0.95)',
                      border: isSelected
                        ? '2px solid #fff'
                        : isStage
                        ? '2px solid #FFD700'
                        : '1.5px solid var(--gold-500)',
                      color: isSelected ? '#200407' : '#fff',
                      borderRadius: '50px',
                      padding: isStage ? '8px 16px' : '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isSelected
                        ? '0 0 25px rgba(212, 175, 55, 0.9)'
                        : '0 4px 15px rgba(0,0,0,0.6)',
                      cursor: 'pointer',
                      fontSize: isStage ? '0.9rem' : '0.8rem',
                      fontWeight: 700,
                      transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                  >
                    <span>{getMarkerIcon(marker.category)}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>{cleanTitle(marker.title)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Marker Detail Drawer / Card */}
          {activeMarker && (
            <div
              className="royal-card"
              style={{
                padding: '22px 26px',
                border: '1.5px solid var(--gold-500)',
                background: 'linear-gradient(145deg, rgba(66, 13, 20, 0.95), rgba(28, 3, 6, 0.98))',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{getMarkerIcon(activeMarker.category)}</span>
                  <h3 className="font-royal gold-shimmer" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    {cleanTitle(activeMarker.title)}
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: 'var(--gold-400)',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {activeMarker.category}
                </span>
              </div>
              <p style={{ color: 'var(--cream)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {activeMarker.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
