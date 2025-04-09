import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          let cookie = `${name}=${value}`;
          if (options.path) cookie += `; path=${options.path}`;
          if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
          if (options.domain) cookie += `; domain=${options.domain}`;
          if (options.secure) cookie += '; secure';
          document.cookie = cookie;
        },
        remove(name: string, options: { path?: string }) {
          document.cookie = `${name}=; max-age=0${options.path ? `; path=${options.path}` : ''}`;
        },
      },
    }
  );
}
