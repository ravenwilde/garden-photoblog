import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Add headers to help with test identification
  const headers = new Headers();
  headers.set('x-request-path', '/auth/set-session');

  const { session } = await request.json();

  if (!session) {
    return NextResponse.json({ error: 'No session provided' }, { status: 400, headers });
  }

  // For Next.js 15, we need to use the correct approach with cookies
  const supabase = createRouteHandlerClient({ cookies });

  // Set auth cookie
  const {
    data: { session: newSession },
    error,
  } = await supabase.auth.setSession(session);

  if (error) {
    console.error('Error setting session:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 500, headers });
  }

  return NextResponse.json({ session: newSession }, { headers });
}
