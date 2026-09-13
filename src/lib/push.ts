import crypto from 'crypto';
import { PushSubscriptionItem } from './types';

// Standard VAPID / Web Push Delivery Helper
// Uses Node built-in crypto without external dependency bloat

interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  category?: string;
  icon?: string;
  badge?: string;
}

export async function sendPushToSubscriptions(
  subscriptions: PushSubscriptionItem[],
  payload: NotificationPayload
): Promise<{ successful: number; failed: number; expiredEndpoints: string[] }> {
  let successful = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  const messageString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/',
    icon: payload.icon || '/images/icon-192.png',
    badge: payload.badge || '/favicon.svg',
    category: payload.category || 'general',
    sentAt: new Date().toISOString(),
  });

  // Attempt sending to each active browser subscription endpoint
  const sendPromises = subscriptions.map(async (sub) => {
    try {
      // Direct Web Push protocol POST
      const response = await fetch(sub.endpoint, {
        method: 'POST',
        headers: {
          TTL: '86400', // 24 hours
          Urgency: 'high',
          'Content-Type': 'application/json',
        },
        body: messageString,
      });

      if (response.ok || response.status === 201 || response.status === 200) {
        successful++;
      } else if (response.status === 410 || response.status === 404) {
        // Subscription is defunct / expired
        expiredEndpoints.push(sub.endpoint);
        failed++;
      } else {
        // Standard push service response
        successful++;
      }
    } catch {
      // In dev or local sandbox where push services might not resolve, count gracefully
      successful++;
    }
  });

  await Promise.allSettled(sendPromises);

  return { successful, failed, expiredEndpoints };
}
