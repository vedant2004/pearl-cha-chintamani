import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { isSameOrigin } from '@/lib/csrf';
import { uploadRateLimiter, getClientIp } from '@/lib/rate-limit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB maximum

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function verifyImageSignature(buffer: Buffer): { valid: boolean; ext: string; mime: string } {
  if (buffer.length < 12) {
    return { valid: false, ext: '', mime: '' };
  }

  // Check JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: '.jpg', mime: 'image/jpeg' };
  }

  // Check PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: '.png', mime: 'image/png' };
  }

  // Check WebP: RIFF ... WEBP
  const riff = buffer.subarray(0, 4).toString('ascii');
  const webp = buffer.subarray(8, 12).toString('ascii');
  if (riff === 'RIFF' && webp === 'WEBP') {
    return { valid: true, ext: '.webp', mime: 'image/webp' };
  }

  return { valid: false, ext: '', mime: '' };
}

export async function POST(request: Request) {
  // 1. Authentication
  const isAuth = await isAdminAuthenticated(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. CSRF Check
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-site request forgery detected' }, { status: 403 });
  }

  // 3. Rate Limit Check (20 uploads / 10 min)
  const clientIp = getClientIp(request);
  const rateCheck = uploadRateLimiter.check(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: `Upload rate limit reached. Retry in ${rateCheck.retryAfterSeconds} seconds.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No valid image file uploaded' }, { status: 400 });
    }

    // 4. File Size Check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 5MB size limit' }, { status: 400 });
    }

    // 5. Extension Validation
    const rawExt = path.extname(file.name || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Only JPG, PNG, and WebP images are permitted.' },
        { status: 400 }
      );
    }

    // 6. MIME Type Validation
    const claimedMime = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(claimedMime)) {
      return NextResponse.json(
        { error: 'Invalid MIME type. Only JPG, PNG, and WebP images are permitted.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 7. Magic Number (File Signature) Verification
    const signature = verifyImageSignature(buffer);
    if (!signature.valid) {
      return NextResponse.json(
        { error: 'Corrupt or disallowed image format. File header signature did not match safe image types.' },
        { status: 400 }
      );
    }

    // 8. Generate completely random alphanumeric filename (no path traversal risk)
    const safeFilename = `chintamani_${Date.now()}_${crypto.randomUUID()}${signature.ext}`;

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeFilename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
      });
    } catch {
      // Fallback for read-only serverless environments
      const base64Url = `data:${signature.mime};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Url,
      });
    }
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to process file upload safely' }, { status: 500 });
  }
}
