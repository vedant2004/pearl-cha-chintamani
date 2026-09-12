interface RateLimitRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Periodic cleanup of stale entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref?.();
  }

  public check(key: string): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.records.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.records.set(key, record);
    }

    // Filter out timestamps outside current sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldest = record.timestamps[0];
      const retryAfterSeconds = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, retryAfterSeconds),
      };
    }

    record.timestamps.push(now);
    return {
      allowed: true,
      remaining: this.maxRequests - record.timestamps.length,
      retryAfterSeconds: 0,
    };
  }

  public reset(key: string): void {
    this.records.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    for (const [key, record] of this.records.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.records.delete(key);
      }
    }
  }
}

/**
 * Extract reliable client IP address from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Leftmost IP is the client IP
    const clientIp = forwardedFor.split(',')[0].trim();
    if (clientIp) return clientIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}

// 5 failed login attempts per 15 minutes per IP
export const loginRateLimiter = new SlidingWindowRateLimiter(15 * 60 * 1000, 5);

// 5 blessing submissions per 10 minutes per IP
export const blessingRateLimiter = new SlidingWindowRateLimiter(10 * 60 * 1000, 5);

// 3 volunteer registrations per 10 minutes per IP
export const volunteerRateLimiter = new SlidingWindowRateLimiter(10 * 60 * 1000, 3);

// 20 file uploads per 10 minutes per admin session
export const uploadRateLimiter = new SlidingWindowRateLimiter(10 * 60 * 1000, 20);
