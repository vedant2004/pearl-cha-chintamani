'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HeartHandshake, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function Volunteers() {
  const [formData, setFormData] = useState({
    name: '',
    flatNo: '',
    phone: '',
    category: 'Pooja',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    'Decoration',
    'Pooja',
    'Prasadam',
    'Cultural Events',
    'Photography',
    'Cleanup',
    'Visarjan',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMessage(
        '🙏 Pranam! Thank you for registering as a volunteer for Pearl Cha Chintamani. The festival committee will contact you soon.'
      );
      setFormData({
        name: '',
        flatNo: '',
        phone: '',
        category: 'Pooja',
        notes: '',
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFA000', '#FFD700', '#FF5722'],
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="volunteers" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pretitle">Selfless Seva</div>
          <h2 className="section-title">
            <span className="gold-text">Volunteer</span>{' '}
            <span className="gold-shimmer">Registration</span>
          </h2>
          <p className="section-subtitle">
            Join the team of devoted resident volunteers who make Pearl Cha Chintamani an unforgettable
            experience every year. Every small seva brings immense joy.
          </p>
        </div>

        <div
          className="royal-card"
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '36px 30px',
            border: '1.5px solid var(--border-gold-glow)',
          }}
        >
          {successMessage ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 20px',
              }}
            >
              <CheckCircle2 size={54} color="#4caf50" style={{ margin: '0 auto 16px' }} />
              <h3 className="font-royal gold-shimmer" style={{ fontSize: '1.4rem', marginBottom: '10px' }}>
                Seva Registration Successful
              </h3>
              <p style={{ color: 'var(--cream)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '24px' }}>
                {successMessage}
              </p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="btn-gold"
                style={{ padding: '10px 24px' }}
              >
                Register Another Volunteer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div
                  style={{
                    background: 'rgba(211, 47, 47, 0.2)',
                    border: '1px solid #d32f2f',
                    color: '#ff8a80',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name & Flat */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '18px',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kulkarni"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.92rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Flat / Tower Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.flatNo}
                    onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                    placeholder="e.g. Tower B - 402"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.92rem',
                    }}
                  />
                </div>
              </div>

              {/* Phone & Category */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '18px',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(20, 3, 5, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.92rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      color: 'var(--gold-400)',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Preferred Seva Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#1a0407',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.92rem',
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    color: 'var(--gold-400)',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Availability / Special Skills (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Available for evening aartis and decoration on 13th & 14th Sept."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(20, 3, 5, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.92rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <Sparkles size={16} />
                <span>{isSubmitting ? 'Registering Seva...' : 'Submit Seva Registration 🙏'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
