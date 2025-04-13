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

  // First get the user to ensure authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Auth error: ${userError.message}`);
  }

  if (!user) {
    throw new Error('No user found');
  }

  // Then get the session to ensure it's valid
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(`Session error: ${sessionError.message}`);
  }

  if (!session) {
    throw new Error('No valid session found');
  }

  return { user, session };
}
