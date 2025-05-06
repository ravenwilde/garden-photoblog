import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function getServerSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name) as RequestCookie | undefined;
          return cookie?.value;
        },
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  // Get both user and session
  const [
    {
      data: { user },
      error: userError,
    },
    {
      data: { session },
      error: sessionError,
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);

  // Handle errors gracefully and return partial objects
  if (userError && sessionError) {
    console.error('Auth error:', userError);
    console.error('Session error:', sessionError);
    return { user: null, session: null };
  }

  if (userError) {
    console.error('Auth error:', userError);
    return { user: null, session };
  }

  if (sessionError) {
    console.error('Session error:', sessionError);
    return { user, session: null };
  }

  // Return partial results if either user or session is missing; both being present constitutes a complete return
  if (!user && !session) {
    return { user: null, session: null };
  }

  return { user, session };
}
