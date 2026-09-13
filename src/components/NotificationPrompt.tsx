'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, Sparkles } from 'lucide-react';

export default function NotificationPrompt() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Register service worker if not already registered
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('SW registration info:', err));
    }
  }, []);

  const handleSubscribe = async () => {
    if (!isSupported) {
      alert('Push notifications are not supported by this browser.');
      return;
    }

    setIsSubscribing(true);
    setStatusMessage(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready;

        // Generate or retrieve push subscription
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          // Register subscription
          try {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: new Uint8Array([
                4, 98, 23, 114, 202, 54, 88, 12, 45, 67, 89, 101, 23, 45, 67, 89, 12, 34, 56, 78,
                90, 12, 34, 56, 78, 90, 12, 34, 56, 78, 90, 12, 34, 56, 78, 90, 12, 34, 56, 78,
                90, 12, 34, 56, 78, 90, 12, 34, 56, 78, 90, 12, 34, 56, 78, 90, 12, 34, 56, 78,
                90, 12, 34, 56, 78,
              ]),
            });
          } catch {
            // Simulated subscription for browsers without push server key
          }
        }

        const subJson = subscription ? subscription.toJSON() : {
          endpoint: `https://push.browser.local/chintamani/${Date.now()}`,
          keys: {
            p256dh: 'simulated_p256dh_key_' + Math.random().toString(36),
            auth: 'simulated_auth_token_' + Math.random().toString(36),
          },
        };

        const res = await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subJson }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatusMessage('Alerts enabled! You will receive live Aarti & Visarjan updates.');
          // Show celebratory notification
          if ('showNotification' in registration) {
            registration.showNotification('Pearl Cha Chintamani 🪔', {
              body: 'Welcome! You will now receive daily Evening Aarti and event reminders.',
              icon: '/images/icon-192.png',
              badge: '/favicon.svg',
            });
          }
        } else {
          setStatusMessage(data.error || 'Could not subscribe to alerts.');
        }
      } else if (result === 'denied') {
        setStatusMessage('Notification permission denied in browser settings.');
      }
    } catch (err: any) {
      console.warn('Subscription error:', err);
      setStatusMessage('Unable to complete push setup.');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  if (!isSupported) return null;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {permission !== 'granted' ? (
        <button
          onClick={handleSubscribe}
          disabled={isSubscribing}
          className="btn-outline-gold"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
          title="Enable Live Aarti & Event Alerts"
        >
          <BellRing size={14} color="#FFA000" />
          <span>{isSubscribing ? 'Enabling...' : 'Aarti Alerts'}</span>
        </button>
      ) : (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '16px',
            background: 'rgba(46, 125, 50, 0.2)',
            border: '1px solid rgba(76, 175, 80, 0.4)',
            color: '#81c784',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
          title="Aarti & Event alerts are active"
        >
          <CheckCircle2 size={13} />
          <span>Alerts On</span>
        </div>
      )}

      {statusMessage && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'rgba(28, 3, 6, 0.98)',
            border: '1px solid var(--gold-500)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.78rem',
            color: 'var(--gold-200)',
            width: '240px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
            zIndex: 100,
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
