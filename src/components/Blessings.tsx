'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BlessingMessage } from '@/lib/types';
import { Heart, Send, Sparkles, CheckCircle2, MessageSquareHeart } from 'lucide-react';

interface BlessingsProps {
  blessings: BlessingMessage[];
}

export default function Blessings({ blessings }: BlessingsProps) {
  const [formData, setFormData] = useState({
    name: '',
    flatNo: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/blessings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit blessing');
      }

      setSubmitted(true);
      setFormData({ name: '', flatNo: '', message: '' });

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FF7722', '#FFA000', '#FFD700', '#D32F2F'],
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="blessings" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Bhakti & Pranam</div>
          <h2 className="section-title">
            <span className="gold-text">Digital</span>{' '}
            <span className="gold-shimmer">Pranam & Blessings</span>
          </h2>
          <p className="section-subtitle">
            Offer your heart’s prayer and heartfelt wishes to Pearl Cha Chintamani. Messages appear
            publicly after review.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {/* Submission Form Card */}
          <div
            className="royal-card"
            style={{
              padding: '30px',
              border: '1.5px solid var(--border-gold-glow)',
            }}
          >
            <h3
              className="font-royal"
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--ivory)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🙏</span>
              <span>Leave Your Blessings</span>
            </h3>
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
                marginBottom: '20px',
              }}
            >
              Share your family’s prayer, devotion, or festive greetings for the entire Pearl community.
            </p>

            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  background: 'rgba(20, 3, 5, 0.7)',
                  borderRadius: '12px',
                  border: '1px solid var(--gold-500)',
                }}
              >
                <CheckCircle2 size={42} color="#4caf50" style={{ margin: '0 auto 12px' }} />
                <h4 className="font-royal gold-shimmer" style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                  Pranam Received 🙏
                </h4>
                <p style={{ color: 'var(--cream)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  May Lord Ganesha shower His divine grace on your family! Your blessing has been sent to
                  the committee and will be displayed on the wall shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline-gold"
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  Submit Another Prayer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div
                    style={{
                      background: 'rgba(211, 47, 47, 0.2)',
                      border: '1px solid #d32f2f',
                      color: '#ff8a80',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      marginBottom: '14px',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Your Name / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh & Ananya Verma"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Flat / Tower *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.flatNo}
                    onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                    placeholder="e.g. Tower A - 702"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Your Prayer / Blessing for Bappa *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="May Pearl Cha Chintamani bless everyone with health, happiness, and peace..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Offering Pranam...' : 'Offer Pranam to Bappa 🙏'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Wall of Approved Blessings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '560px', overflowY: 'auto' }}>
            {blessings.length > 0 ? (
              blessings.map((b) => (
                <div
                  key={b.id}
                  className="royal-card"
                  style={{
                    padding: '18px 20px',
                    background: 'rgba(38, 7, 12, 0.85)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>🪔</span>
                      <strong style={{ color: 'var(--gold-300)', fontSize: '0.92rem' }}>{b.name}</strong>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--gold-400)',
                        background: 'rgba(212, 175, 55, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {b.flatNo}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--cream)',
                      lineHeight: 1.55,
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{b.message}&rdquo;
                  </p>
                </div>
              ))
            ) : (
              <div
                className="royal-card"
                style={{
                  padding: '30px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                Be the first to submit a blessing for Bappa!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
