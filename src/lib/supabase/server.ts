import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr';
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            const cookieStore = cookies() as unknown as RequestCookies;
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error('Error getting cookie:', error);
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = cookies() as unknown as RequestCookies;
            cookieStore.set(name, value, options);
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = cookies() as unknown as RequestCookies;
            cookieStore.delete(name, options);
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
}
