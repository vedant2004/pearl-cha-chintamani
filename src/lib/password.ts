import crypto from 'crypto';

/**
 * Hash a password using scrypt with a cryptographically secure random salt.
 * Format: scrypt$<salt_hex>$<hash_hex>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a scrypt hash or plaintext environment variable.
 * All comparisons are strictly constant-time to eliminate timing attacks.
 */
export function verifyPassword(attempt: string): boolean {
  if (!attempt || typeof attempt !== 'string') {
    return false;
  }

  // Priority 1: Hashed password in ADMIN_PASSWORD_HASH
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (passwordHash && passwordHash.startsWith('scrypt$')) {
    const parts = passwordHash.split('$');
    if (parts.length === 3) {
      const salt = parts[1];
      const expectedHashHex = parts[2];
      try {
        const attemptKey = crypto.scryptSync(attempt, salt, 64);
        const expectedKey = Buffer.from(expectedHashHex, 'hex');
        if (attemptKey.length === expectedKey.length) {
          return crypto.timingSafeEqual(attemptKey, expectedKey);
        }
      } catch (err) {
        console.error('Error during password hash verification:', err);
        return false;
      }
    }
  }

  // Priority 2: Plaintext password in ADMIN_PASSWORD (compared in constant-time)
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (configuredPassword && typeof configuredPassword === 'string' && configuredPassword.length > 0) {
    // Hash both strings with SHA-256 before timingSafeEqual to ensure fixed 32-byte buffers
    // and eliminate any length-based timing leak
    const attemptDigest = crypto.createHash('sha256').update(attempt).digest();
    const expectedDigest = crypto.createHash('sha256').update(configuredPassword).digest();
    return crypto.timingSafeEqual(attemptDigest, expectedDigest);
  }

  // Neither environment variable is set. For security, REFUSE authentication.
  console.error('[SECURITY WARNING] Neither ADMIN_PASSWORD nor ADMIN_PASSWORD_HASH is set in environment.');
  return false;
}
