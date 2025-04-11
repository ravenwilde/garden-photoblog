import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';

async function getCookieStore() {
  return await cookies();
}

export function createClient() {
  // Use server-side environment variables for better security
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        async get(name: string) {
          try {
            const cookieStore = await getCookieStore();
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error('Error getting cookie:', error);
            return undefined;
          }
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await getCookieStore();
            cookieStore.set(name, value, {
              path: options.path || '/',
              maxAge: options.maxAge,
              domain: options.domain,
              secure: options.secure
            });
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await getCookieStore();
            cookieStore.set(name, '', {
              path: options.path || '/',
              maxAge: 0,
              domain: options.domain,
              secure: options.secure
            });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
}
