type Key = string;

const WINDOWS = new Map<Key, { count: number; expiresAt: number }>();

export function getClientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  // NextRequest in edge/runtime may expose ip on request, but we accept unknown here
  return 'unknown';
}

export function rateLimit({ key, limit, windowMs }: { key: string; limit: number; windowMs: number }) {
  const now = Date.now();
  const entry = WINDOWS.get(key);
  if (!entry || entry.expiresAt <= now) {
    WINDOWS.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetIn: entry.expiresAt - now };
  }
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}

