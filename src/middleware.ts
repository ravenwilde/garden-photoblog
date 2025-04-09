import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRateLimited } from './lib/rate-limiter';
import { verifyToken, getTokenFromHeaders } from './lib/csrf';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Skip middleware for Supabase auth endpoints
  if (req.nextUrl.pathname.startsWith('/auth/')) {
    return res;
  }

  try {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );

    // Refresh session if needed
    const authResponse = await supabase.auth.getSession();

    // Check rate limiting and CSRF for API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
      // Skip CSRF check for GET requests, token endpoint, and Supabase auth endpoints
      const isSupabaseAuthRequest = req.nextUrl.pathname.startsWith('/auth/');
      if (req.method !== 'GET' && !req.nextUrl.pathname.endsWith('/csrf-token') && !isSupabaseAuthRequest) {
        const token = getTokenFromHeaders(req.headers);
        const storedToken = req.cookies.get('csrf-token')?.value;
        
        if (!token || !storedToken || !verifyToken(token, storedToken)) {
          return NextResponse.json(
            { error: 'Invalid CSRF token' },
            { status: 403 }
          );
        }
      }

      // Check auth for protected routes
      if (req.method !== 'GET' && !req.nextUrl.pathname.endsWith('/csrf-token')) {
        const session = authResponse.data.session;
        if (!session?.user?.email) {
          console.log('No user email found in session');
          console.log('Session:', session);
          console.log('Cookies:', req.cookies.getAll());
          return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
        }

        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (session.user.email !== adminEmail) {
          console.log('User is not admin:', session.user.email);
          console.log('Expected admin:', adminEmail);
          return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
        }
      }

      if (isRateLimited(req)) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
    }

    // Add security headers
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    // Content Security Policy
    const isDev = process.env.NODE_ENV === 'development';
    
    const csp = isDev ? `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://s3.us-east-005.dream.io;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      connect-src 'self' ws: http: https:;
      worker-src 'self' blob:;
    ` : `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' https://vercel.live https://*.vercel.app;
      script-src-elem 'self' 'unsafe-inline' https://vercel.live https://*.vercel.app;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://s3.us-east-005.dream.io;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      connect-src 'self' https:;
      worker-src 'self' blob:;
    `.replace(/\s+/g, ' ').trim();

    // Set security headers
    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}
