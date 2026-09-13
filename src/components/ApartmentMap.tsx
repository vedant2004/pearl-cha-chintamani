'use client';

import React, { useState } from 'react';
import { MapMarker } from '@/lib/types';
import { MapPin, Compass, Info, X, Navigation } from 'lucide-react';

interface ApartmentMapProps {
  markers: MapMarker[];
}

export default function ApartmentMap({ markers }: ApartmentMapProps) {
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(
    markers.find((m) => m.category === 'stage') || markers[0] || null
  );
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

  const selectMarkerByCategory = (category: string) => {
    const found = markers.find((m) => m.category === category);
    if (found) {
      setActiveMarker(found);
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
            Interactive schematic festival layout of Pearl Apartments for Ganesh Utsav 2026.
            Locate the Stage Mandap, Seating & Prasad Pavilion, Main Gate, and Seva points.
          </p>
        </div>

        {/* Categories Filter Bar */}
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
            { id: 'stage', label: '🐘 Stage Mandap' },
            { id: 'gate', label: '🚪 Main Gate' },
            { id: 'parking', label: '🚗 Festival Parking' },
            { id: 'prasadam', label: '🍽️ Seating & Prasad' },
            { id: 'footwear', label: '👟 Footwear Stand' },
            { id: 'photo', label: '📸 Photo Booth' },
            { id: 'washroom', label: '🚻 Amenities' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border:
                  filterCategory === cat.id
                    ? '1.5px solid var(--gold-400)'
                    : '1px solid rgba(212, 175, 55, 0.25)',
                background:
                  filterCategory === cat.id
                    ? 'var(--gold-gradient)'
                    : 'rgba(45, 10, 16, 0.65)',
                color: filterCategory === cat.id ? '#200407' : 'var(--cream)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Map Canvas Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            maxWidth: '1100px',
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
              background: '#120204',
              border: '1.5px solid var(--border-gold)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '68%', // 1000:680 Aspect Ratio
              }}
            >
              {/* SVG Architectural Schematic Map */}
              <svg
                viewBox="0 0 1000 680"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <defs>
                  {/* Background Grid Pattern */}
                  <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(212, 175, 55, 0.04)"
                      strokeWidth="1"
                    />
                  </pattern>

                  {/* Stage Mandap Divine Radiance */}
                  <radialGradient id="stageRadiance" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFA000" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                  </radialGradient>

                  {/* Building Roof Gradient */}
                  <linearGradient id="buildingRoof" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c0910" />
                    <stop offset="50%" stopColor="#1e0408" />
                    <stop offset="100%" stopColor="#28070e" />
                  </linearGradient>

                  {/* Central Courtyard Gradient */}
                  <linearGradient id="courtyardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#350c14" />
                    <stop offset="100%" stopColor="#22050b" />
                  </linearGradient>

                  {/* Gold Linear Gradient for Borders */}
                  <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#AA771C" />
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#AA771C" />
                  </linearGradient>

                  {/* Shamiana Canopy Stripe Pattern */}
                  <pattern id="shamianaStripes" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="16" fill="#4d121c" />
                    <rect x="8" width="8" height="16" fill="#661926" />
                  </pattern>

                  {/* Drop Shadows */}
                  <filter id="buildingShadow" x="-5%" y="-5%" width="115%" height="115%">
                    <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.9" />
                  </filter>
                  <filter id="mandapShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#FFA000" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* 1. Base Canvas & Ambient Grid */}
                <rect width="1000" height="680" fill="#130205" />
                <rect width="1000" height="680" fill="url(#campusGrid)" />

                {/* Compass Rose (North Arrow) */}
                <g transform="translate(60, 50)" opacity="0.8">
                  <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
                  <path d="M 0 -18 L 5 0 L 0 -4 L -5 0 Z" fill="#FFD700" />
                  <path d="M 0 18 L 5 0 L 0 4 L -5 0 Z" fill="rgba(212, 175, 55, 0.4)" />
                  <text x="0" y="-23" fill="#FFD700" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                    N
                  </text>
                </g>

                {/* Map Title Stamp */}
                <g transform="translate(60, 110)">
                  <text fill="var(--gold-400)" fontSize="10" letterSpacing="2" fontWeight="700" fontFamily="sans-serif">
                    PEARL APARTMENTS
                  </text>
                  <text y="16" fill="#fdfbf7" fontSize="13" fontWeight="800" fontFamily="serif">
                    FESTIVAL GROUNDS SCHEMATIC
                  </text>
                </g>

                {/* Outer Compound Wall Boundary */}
                <path
                  d="M 120 180 L 485 50 L 760 170 L 960 290 L 920 520 L 830 630 L 710 655 L 430 515 L 260 415 L 140 425 L 110 320 L 120 180 Z"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.18)"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                />

                {/* 2. Primary Devotee Walking Arteries (Gate -> Courtyard -> Stage) */}
                {/* Main Gate Inward Avenue */}
                <path
                  d="M 485 50 L 485 170 L 515 280 L 610 400 L 720 480"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.22)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 485 50 L 485 170 L 515 280 L 610 400 L 720 480"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.5"
                  strokeDasharray="8,8"
                  opacity="0.6"
                />

                {/* 3. PEARL APARTMENTS RESIDENTIAL FOOTPRINT */}
                {/* Stepped angled building perimeter following the user's hand-drawn reference */}
                <path
                  d="M 220 180 L 485 75 L 720 200 L 925 315 L 890 480 L 820 580 L 730 625 L 480 480 L 310 380 L 240 390 L 220 340 L 190 340 L 170 280 L 180 230 Z"
                  fill="url(#buildingRoof)"
                  stroke="url(#goldBorder)"
                  strokeWidth="2.5"
                  filter="url(#buildingShadow)"
                />

                {/* Inner Architectural Contour Lines */}
                <path
                  d="M 230 190 L 485 88 L 710 208 L 910 320 L 878 475 L 812 568 L 728 610 L 485 470 L 315 372 L 245 382 L 228 335 L 200 335 L 182 282 L 190 238 Z"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.2)"
                  strokeWidth="1"
                />

                {/* Building Block Texture Accent Lines */}
                <g stroke="rgba(212, 175, 55, 0.08)" strokeWidth="1">
                  <line x1="260" y1="165" x2="330" y2="300" />
                  <line x1="360" y1="125" x2="430" y2="260" />
                  <line x1="560" y1="120" x2="630" y2="250" />
                  <line x1="640" y1="160" x2="710" y2="290" />
                  <line x1="780" y1="240" x2="840" y2="360" />
                </g>

                {/* Architectural Building Wing Labels */}
                <text
                  x="350"
                  y="180"
                  fill="rgba(253, 251, 247, 0.55)"
                  fontSize="12"
                  fontFamily="sans-serif"
                  fontWeight="700"
                  letterSpacing="3"
                  transform="rotate(22, 350, 180)"
                >
                  PEARL APARTMENTS RESIDENCE
                </text>

                {/* 4. CENTRAL OPEN COURTYARD / ATRIUM */}
                {/* Large open interior courtyard running parallel through the building center */}
                <polygon
                  points="380,250 660,410 615,485 335,325"
                  fill="url(#courtyardGrad)"
                  stroke="rgba(212, 175, 55, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
                {/* Courtyard Floor Paving Pattern */}
                <g opacity="0.4" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1">
                  <line x1="410" y1="268" x2="365" y2="343" />
                  <line x1="460" y1="297" x2="415" y2="372" />
                  <line x1="510" y1="326" x2="465" y2="401" />
                  <line x1="560" y1="355" x2="515" y2="430" />
                  <line x1="610" y1="384" x2="565" y2="459" />
                </g>
                <text
                  x="500"
                  y="380"
                  fill="var(--gold-400)"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="1.5"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  transform="rotate(30, 500, 380)"
                >
                  CENTRAL OPEN COURTYARD
                </text>

                {/* 5. MAIN GATE ENTRANCE (North Wall) */}
                <g
                  onClick={() => selectMarkerByCategory('gate')}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Gate Portico & Road Connection */}
                  <path d="M 450 30 L 450 85 L 520 85 L 520 30 Z" fill="#24060b" stroke="#AA771C" strokeWidth="2" />
                  <line x1="485" y1="30" x2="485" y2="85" stroke="#FFD700" strokeWidth="2" strokeDasharray="3,3" />

                  {/* Gate Pillars */}
                  <rect x="444" y="70" width="12" height="18" rx="2" fill="#D4AF37" stroke="#fff" strokeWidth="1" />
                  <rect x="514" y="70" width="12" height="18" rx="2" fill="#D4AF37" stroke="#fff" strokeWidth="1" />

                  {/* Gate Label Banner */}
                  <rect x="445" y="92" width="80" height="20" rx="4" fill="#380911" stroke="#FFD700" strokeWidth="1.5" />
                  <text x="485" y="106" fill="#FFF0BE" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                    MAIN GATE
                  </text>
                </g>

                {/* 6. FESTIVAL PARKING ZONE (Beside Stage on East Perimeter) */}
                <g
                  onClick={() => selectMarkerByCategory('parking')}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x="830"
                    y="350"
                    width="105"
                    height="75"
                    rx="8"
                    fill="rgba(35, 6, 11, 0.9)"
                    stroke="rgba(212, 175, 55, 0.45)"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />
                  {/* Parking Bay Dividers */}
                  <line x1="850" y1="350" x2="850" y2="400" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
                  <line x1="875" y1="350" x2="875" y2="400" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
                  <line x1="900" y1="350" x2="900" y2="400" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
                  <text x="882" y="415" fill="#e8d8b5" fontSize="10" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">
                    PARKING AREA
                  </text>
                </g>

                {/* 7. SEATING & PRASAD PAVILION (Adjacent to Stage) */}
                {/* Drawn as 'Seating + PRASAD' in user's diagram */}
                <g
                  onClick={() => selectMarkerByCategory('prasadam')}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x="615"
                    y="400"
                    width="110"
                    height="85"
                    rx="10"
                    fill="url(#shamianaStripes)"
                    stroke="#FFD700"
                    strokeWidth="2"
                  />
                  {/* Canopy Pillars */}
                  <circle cx="625" cy="410" r="3.5" fill="#FFD700" />
                  <circle cx="715" cy="410" r="3.5" fill="#FFD700" />
                  <circle cx="625" cy="475" r="3.5" fill="#FFD700" />
                  <circle cx="715" cy="475" r="3.5" fill="#FFD700" />

                  {/* Seating & Prasad Label */}
                  <rect x="622" y="432" width="96" height="24" rx="4" fill="rgba(24, 3, 7, 0.95)" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1" />
                  <text x="670" y="445" fill="#FFD700" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                    SEATING AREA
                  </text>
                  <text x="670" y="455" fill="#FFF0BE" fontSize="8" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">
                    & Maha Prasad Desk
                  </text>
                </g>

                {/* 8. MAIN STAGE (GANPATI MANDAP) */}
                {/* Drawn as rounded rectangle 'STAGE' on the lower-right in user's diagram */}
                <g
                  onClick={() => selectMarkerByCategory('stage')}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Divine Golden Aura */}
                  <circle cx="797" cy="512" r="90" fill="url(#stageRadiance)" />

                  {/* Mandap Raised Platform Footprint */}
                  <rect
                    x="740"
                    y="470"
                    width="115"
                    height="85"
                    rx="20"
                    fill="#420d14"
                    stroke="#FFD700"
                    strokeWidth="3.5"
                    filter="url(#mandapShadow)"
                  />

                  {/* Inner Floral Sanctum Border */}
                  <rect
                    x="748"
                    y="478"
                    width="99"
                    height="69"
                    rx="14"
                    fill="#5c121d"
                    stroke="rgba(255, 215, 0, 0.6)"
                    strokeWidth="1.5"
                    strokeDasharray="4,2"
                  />

                  {/* Sanctum Altar Platform */}
                  <circle cx="797" cy="505" r="16" fill="#8c1b2c" stroke="#FFD700" strokeWidth="2" />
                  <text x="797" y="511" fill="#FFF0BE" fontSize="14" textAnchor="middle">
                    🐘
                  </text>

                  {/* Stage Mandap Title Text */}
                  <text x="797" y="534" fill="#FFD700" fontSize="11" fontWeight="bold" fontFamily="serif" textAnchor="middle">
                    STAGE MANDAP
                  </text>
                  <text x="797" y="544" fill="#FFF0BE" fontSize="8" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">
                    Pearl Cha Chintamani
                  </text>
                </g>
              </svg>

              {/* Dynamic Interactive Pin Marker Buttons */}
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
                      transform: isSelected ? 'translate(-50%, -50%) scale(1.08)' : 'translate(-50%, -50%) scale(1)',
                      zIndex: isSelected ? 30 : 15,
                      background: isSelected
                        ? 'var(--gold-gradient)'
                        : isStage
                        ? 'linear-gradient(135deg, #b71c1c, #e65100)'
                        : 'rgba(38, 5, 10, 0.95)',
                      border: isSelected
                        ? '2px solid #ffffff'
                        : isStage
                        ? '2px solid #FFD700'
                        : '1.5px solid var(--gold-500)',
                      color: isSelected ? '#1a0306' : '#ffffff',
                      borderRadius: '50px',
                      padding: isStage ? '8px 16px' : '6px 13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: isSelected
                        ? '0 0 28px rgba(212, 175, 55, 0.95), 0 6px 18px rgba(0,0,0,0.8)'
                        : '0 4px 14px rgba(0,0,0,0.75)',
                      cursor: 'pointer',
                      fontSize: isStage ? '0.88rem' : '0.80rem',
                      fontWeight: 700,
                      transition: 'all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                    title={marker.title}
                  >
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>{getMarkerIcon(marker.category)}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>{cleanTitle(marker.title)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Marker Detailed Information Card */}
          {activeMarker && (
            <div
              className="royal-card"
              style={{
                padding: '24px 28px',
                border: '1.5px solid var(--gold-500)',
                background: 'linear-gradient(145deg, rgba(66, 13, 20, 0.96), rgba(28, 3, 6, 0.98))',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.7rem' }}>{getMarkerIcon(activeMarker.category)}</span>
                  <div>
                    <h3 className="font-royal gold-shimmer" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                      {cleanTitle(activeMarker.title)}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontWeight: 600 }}>
                      Campus Coordinates: {activeMarker.x}% E, {activeMarker.y}% S
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: 'var(--gold-400)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                  }}
                >
                  {activeMarker.category}
                </span>
              </div>

              <p style={{ color: 'var(--cream)', fontSize: '0.94rem', lineHeight: 1.65, marginTop: '10px' }}>
                {activeMarker.description}
              </p>

              {/* Navigation Guide / Accessibility Tip */}
              <div
                style={{
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: 'var(--gold-300)',
                }}
              >
                <Navigation size={15} />
                <span>
                  {activeMarker.category === 'stage' && 'Directly visible on the south-east grounds with floral archway. Main aartis at 07:30 PM.'}
                  {activeMarker.category === 'gate' && 'Main security and vehicular entrance from Mayur Marg. Follow volunteer signs inward.'}
                  {activeMarker.category === 'prasadam' && 'Connected directly in front of the Stage Mandap. Chairs arranged for elders.'}
                  {activeMarker.category === 'parking' && 'Located along the east perimeter beside the Stage. Please follow traffic volunteers.'}
                  {activeMarker.category === 'footwear' && 'Safe tokenized counter located before entering the Seating & Stage zone.'}
                  {activeMarker.category === 'photo' && 'Family photo zone beside the decorated Stage with royal marigold backdrop.'}
                  {activeMarker.category === 'washroom' && 'Sanitized campus restrooms and cold drinking water dispensers available.'}
                </span>
              </div>
            </div>
          )}

          {/* Schematic Disclaimer Note */}
          <div style={{ textAlign: 'center', marginTop: '-6px' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(212, 175, 55, 0.65)', fontStyle: 'italic' }}>
              ✦ Schematic festival grounds map for devotee navigation during Ganesh Utsav 2026. Non-geodesic schematic illustration based on apartment grounds reference. ✦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
