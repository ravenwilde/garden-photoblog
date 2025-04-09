import { NextRequest } from 'next/server';

// In-memory store for rate limiting
// In production, you'd want to use Redis or a similar distributed store
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // requests per minute

export function isRateLimited(req: NextRequest): boolean {
  // Get IP from headers or connection
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  for (const [storedIp, data] of ipRequestCounts.entries()) {
    if (data.timestamp < windowStart) {
      ipRequestCounts.delete(storedIp);
    }
  }

  // Get or create rate limit data for this IP
  const currentData = ipRequestCounts.get(ip) || { count: 0, timestamp: now };

  // Reset count if outside window
  if (currentData.timestamp < windowStart) {
    currentData.count = 0;
    currentData.timestamp = now;
  }

  // Increment count
  currentData.count++;
  ipRequestCounts.set(ip, currentData);

  // Check if rate limited
  return currentData.count > MAX_REQUESTS;
}
