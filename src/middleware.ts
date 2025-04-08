import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    // Create a response to modify its headers
    const res = NextResponse.next();

    // Create supabase client with both request and response
    const supabase = createMiddlewareClient({ req, res });

    // Get and refresh session if expired
    const { data: { session } } = await supabase.auth.getSession();

    // Only protect write operations on /api/tags routes
    if (req.nextUrl.pathname.startsWith('/api/tags') && req.method !== 'GET') {
      if (!session?.user?.email) {
        console.log('No user email found in session');
        console.log('Session:', session);
        console.log('Cookies:', req.cookies.getAll());
        return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
      }

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (session.user.email !== adminEmail) {
        console.log('Not admin:', session.user.email, 'vs', adminEmail);
        return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
      }
    }

    // Return response with updated auth cookie
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
