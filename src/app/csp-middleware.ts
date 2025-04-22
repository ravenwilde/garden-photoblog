// This file sets a Content Security Policy header for all responses in development and production.
// It allows images to load from your custom S3 domain and other trusted sources.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware() {
  const res = NextResponse.next();

  // Allow images from self, data, blob, and your S3 bucket(s)
  // Add any additional domains as needed
  const csp = [
    "default-src 'self'",
    "img-src 'self' blob: data: https://s3.us-east-005.dream.io https://garden-blog.s3.us-east-005.dream.io",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://s3.us-east-005.dream.io https://garden-blog.s3.us-east-005.dream.io",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  // Apply this middleware to all routes
  matcher: '/:path*',
};
