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
        }
      }
    }
  );

  // Get both user and session
  const [{ data: { user }, error: userError }, { data: { session }, error: sessionError }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession()
  ]);

  // Handle errors gracefully
  if (userError) {
    console.error('Auth error:', userError);
    return null;
  }

  if (sessionError) {
    console.error('Session error:', sessionError);
    return null;
  }

  // Both user and session must be present
  if (!user || !session) {
    return null;
  }

  return { user, session };
}
