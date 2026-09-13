/**
 * Sanitize text inputs by removing HTML tags, script markers, and dangerous characters.
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip javascript: pseudo-protocol
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF]/g, '') // Strip control chars
    .trim()
    .substring(0, maxLength);
}

/**
 * Validate standard phone number format (allows international formats)
 */
export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  const cleaned = phone.trim();
  // Accepts: +91 9876543210, 9876543210, +91-98765-43210, (123) 456-7890
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Valid volunteer seva categories
 */
export const ALLOWED_VOLUNTEER_CATEGORIES = [
  'Decoration',
  'Pooja',
  'Cultural Events',
  'Photography',
  'Cleanup',
  'Visarjan',
] as const;

export type VolunteerCategory = typeof ALLOWED_VOLUNTEER_CATEGORIES[number];

export function isValidVolunteerCategory(cat: unknown): cat is VolunteerCategory {
  return typeof cat === 'string' && ALLOWED_VOLUNTEER_CATEGORIES.includes(cat as any);
}

/**
 * Sanitize object recursively against prototype pollution attacks
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // Block dangerous prototype properties
    }
    cleanObj[key] = sanitizeObject(value);
  }
  return cleanObj as T;
}
