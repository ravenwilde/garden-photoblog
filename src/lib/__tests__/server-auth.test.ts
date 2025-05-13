import { getServerSession } from '@/lib/server-auth';
// Import the modules we need to mock
import * as nextHeaders from 'next/headers';
import * as supabaseSSR from '@supabase/ssr';

// Mock the necessary dependencies
jest.mock('next/headers', () => ({
  // In Next.js 15, cookies() returns a Promise
  cookies: jest.fn().mockImplementation(() =>
    Promise.resolve({
      get: jest.fn(name => ({ value: `cookie-${name}` })),
      set: jest.fn(),
    })
  ),
}));

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

describe('Server Auth Utilities', () => {
  // Setup environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getServerSession', () => {
    it('should return user and session when authentication is successful', async () => {
      const mockCookieStore = {
        get: jest.fn(name => ({ value: `cookie-${name}` })),
        set: jest.fn(),
      };
      (nextHeaders.cookies as jest.Mock).mockReturnValue(mockCookieStore);

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'user-123', email: 'test@example.com' } },
            error: null,
          }),
          getSession: jest.fn().mockResolvedValue({
            data: { session: { id: 'session-123', expires_at: Date.now() + 3600 } },
            error: null,
          }),
        },
      };
      (supabaseSSR.createServerClient as jest.Mock).mockReturnValue(mockSupabaseClient);

      const result = await getServerSession();

      expect(result).toEqual({
        user: { id: 'user-123', email: 'test@example.com' },
        session: { id: 'session-123', expires_at: expect.any(Number) },
      });
      expect(nextHeaders.cookies).toHaveBeenCalled();
      expect(supabaseSSR.createServerClient).toHaveBeenCalledWith(
        'https://example.supabase.co',
        'test-anon-key',
        expect.objectContaining({
          cookies: expect.any(Object),
        })
      );
    });

    it('should return null user and session when getUser fails', async () => {
      const mockCookieStore = {
        get: jest.fn(name => ({ value: `cookie-${name}` })),
        set: jest.fn(),
      };
      (nextHeaders.cookies as jest.Mock).mockReturnValue(mockCookieStore);

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('User not found'),
          }),
          getSession: jest.fn().mockResolvedValue({
            data: { session: { id: 'session-123', expires_at: Date.now() + 3600 } },
            error: null,
          }),
        },
      };
      (supabaseSSR.createServerClient as jest.Mock).mockReturnValue(mockSupabaseClient);

      const result = await getServerSession();

      expect(result).toEqual({
        user: null,
        session: { id: 'session-123', expires_at: expect.any(Number) },
      });
    });

    it('should return null user and session when getSession fails', async () => {
      const mockCookieStore = {
        get: jest.fn(name => ({ value: `cookie-${name}` })),
        set: jest.fn(),
      };
      (nextHeaders.cookies as jest.Mock).mockReturnValue(mockCookieStore);

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'user-123', email: 'test@example.com' } },
            error: null,
          }),
          getSession: jest.fn().mockResolvedValue({
            data: { session: null },
            error: new Error('Session not found'),
          }),
        },
      };
      (supabaseSSR.createServerClient as jest.Mock).mockReturnValue(mockSupabaseClient);

      const result = await getServerSession();

      expect(result).toEqual({
        user: { id: 'user-123', email: 'test@example.com' },
        session: null,
      });
    });

    it('should return null for both user and session when both fail', async () => {
      const mockCookieStore = {
        get: jest.fn(name => ({ value: `cookie-${name}` })),
        set: jest.fn(),
      };
      (nextHeaders.cookies as jest.Mock).mockReturnValue(mockCookieStore);

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('User not found'),
          }),
          getSession: jest.fn().mockResolvedValue({
            data: { session: null },
            error: new Error('Session not found'),
          }),
        },
      };
      (supabaseSSR.createServerClient as jest.Mock).mockReturnValue(mockSupabaseClient);

      const result = await getServerSession();

      expect(result).toEqual({
        user: null,
        session: null,
      });
    });
  });
});
