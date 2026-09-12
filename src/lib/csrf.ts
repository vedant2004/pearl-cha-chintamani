/**
 * Verify whether a state-changing HTTP request originated from the same host (CSRF protection).
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host');

  if (!host) {
    return true; // Cannot determine host, let route-level auth handle it
  }

  // Check Origin if provided (browsers send Origin on POST/PUT/DELETE)
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host.toLowerCase() === host.toLowerCase()) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Fallback to Referer
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host.toLowerCase() === host.toLowerCase()) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Non-browser client or same-origin direct request without Origin/Referer
  return true;
}
