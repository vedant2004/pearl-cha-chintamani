'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'radial-gradient(circle at 50% 30%, #3a0d14 0%, #170204 100%)',
      }}
    >
      <div
        className="royal-card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '38px 28px',
          border: '1.5px solid var(--border-gold-glow)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1.5px solid var(--gold-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              fontSize: '1.6rem',
            }}
          >
            🐘
          </div>
          <h1 className="font-royal gold-shimmer" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            ADMIN PORTAL
          </h1>
          <div style={{ fontSize: '0.78rem', color: 'var(--gold-400)', letterSpacing: '0.1em' }}>
            PEARL CHA CHINTAMANI 2026
          </div>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(211, 47, 47, 0.2)',
              border: '1px solid #d32f2f',
              color: '#ff8a80',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                color: 'var(--gold-300)',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Master Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  background: 'rgba(20, 3, 5, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
              <Lock
                size={16}
                color="#D4AF37"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Protected by server-side JWT session security.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginBottom: '18px' }}
          >
            <Shield size={16} />
            <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              color: 'var(--gold-400)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Public Festival Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
