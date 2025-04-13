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

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Auth error:', error?.message);
    return null;
  }

  // Get the session for additional context if needed
  const { data: { session } } = await supabase.auth.getSession();

  return {
    ...session,
    user  // Use the authenticated user data
  };
}
