'use client';

import React from 'react';
import { ContactPerson, DonationInfo } from '@/lib/types';
import { Phone, Users, ShieldAlert, HeartHandshake, Sparkles } from 'lucide-react';

interface ContactsAndDonationsProps {
  contacts: ContactPerson[];
  donations: DonationInfo;
}

export default function ContactsAndDonations({ contacts, donations }: ContactsAndDonationsProps) {
  return (
    <section id="contacts" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        {/* Donations Notice Section (STRICTLY COMPLIANT: NO UPI, NO QR, NO BANK DETAILS) */}
        <div
          className="royal-card"
          style={{
            maxWidth: '820px',
            margin: '0 auto 60px',
            padding: '36px 30px',
            textAlign: 'center',
            border: '1.5px solid var(--border-gold-glow)',
            background: 'linear-gradient(145deg, rgba(66, 13, 20, 0.95), rgba(30, 4, 7, 0.98))',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--gold-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.8rem',
            }}
          >
            🌺
          </div>

          <h3
            className="font-royal gold-shimmer"
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              marginBottom: '10px',
            }}
          >
            {donations.heading || 'Want to contribute to Pearl Cha Chintamani?'}
          </h3>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--cream)',
              marginBottom: '24px',
              fontWeight: 500,
            }}
          >
            {donations.notice || 'Please contact the festival committee for donation information.'}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            {donations.contacts?.map((c, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(20, 3, 5, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {c.role}
                </div>
                <div style={{ fontSize: '0.98rem', color: 'var(--ivory)', fontWeight: 700 }}>
                  {c.name}
                </div>
                <a
                  href={`tel:${c.phone}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--gold-300)',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    marginTop: '4px',
                  }}
                >
                  <Phone size={13} color="#FFA000" />
                  <span>{c.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Important Committee Contacts Section */}
        <div className="section-header">
          <div className="section-pretitle">Support & Coordination</div>
          <h2 className="section-title">
            <span className="gold-text">Important</span>{' '}
            <span className="gold-shimmer">Contacts</span>
          </h2>
          <p className="section-subtitle">
            Need assistance, have queries regarding pooja rituals, or require society security coordination?
            Reach out to our dedicated committee team.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            maxWidth: '1040px',
            margin: '0 auto',
          }}
        >
          {contacts.map((cnt) => (
            <div
              key={cnt.id}
              className="royal-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--gold-400)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                  }}
                >
                  {cnt.role}
                </div>
                <h4
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--ivory)',
                    marginBottom: '8px',
                  }}
                >
                  {cnt.name}
                </h4>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '14px',
                  }}
                >
                  Available: {cnt.availableHours}
                </div>
              </div>

              <a
                href={`tel:${cnt.phone}`}
                className="btn-outline-gold"
                style={{
                  padding: '10px 14px',
                  fontSize: '0.86rem',
                  width: '100%',
                }}
              >
                <Phone size={14} />
                <span>{cnt.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
