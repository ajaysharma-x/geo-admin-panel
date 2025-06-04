// In-memory store: IP => { attempts, lastAttempt }
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return false;
  }

  if (now - entry.lastAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return true;
  }

  loginAttempts.set(ip, { count: entry.count + 1, lastAttempt: now });
  return false;
}

export function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
