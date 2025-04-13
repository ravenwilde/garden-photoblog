import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr';

export async function createClient(useServiceRole: boolean = false) {
  if (useServiceRole) {
    // Use service role key for admin operations
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  // Use cookie-based auth for normal operations
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieOptions = { name, value, ...options };
          cookieStore.set(cookieOptions);
        },
        async remove(name: string, options: CookieOptions) {
          const cookieOptions = { name, value: '', ...options };
          cookieStore.set(cookieOptions);
        },
      },
    }
  );
}
