import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Add headers to help with test identification
  const headers = new Headers();
  headers.set('x-request-path', '/auth/clear-session');

  // For Next.js 15, we need to use the correct approach with cookies
  const supabase = createRouteHandlerClient({ cookies });

  // Clear auth cookie
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500, headers });
  }

  return NextResponse.json({ success: true }, { headers });
}
