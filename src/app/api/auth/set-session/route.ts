import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { session } = await request.json();

  if (!session) {
    return NextResponse.json({ error: 'No session provided' }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Set auth cookie
  const {
    data: { session: newSession },
    error,
  } = await supabase.auth.setSession(session);

  if (error) {
    console.error('Error setting session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: newSession });
}
