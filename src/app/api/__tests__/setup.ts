// Import Supabase client mocks
import './mocks/supabase-client';

// Mock global Request and Response objects for Next.js API routes
if (!global.Request) {
  global.Request = class MockRequest {
    url: string;
    method: string;
    headers: Headers;
    body: unknown;
    json: () => Promise<Record<string, unknown>>;
    text: () => Promise<string>;
    cookies: {
      getAll: () => Array<{name: string, value: string}>;
      get: (name: string) => {name: string, value: string} | undefined;
      has: (name: string) => boolean;
    };

    constructor(input: string | URL | Request, init?: RequestInit) {
      this.url = input.toString();
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = init?.body || null;
      this.json = jest.fn().mockResolvedValue({});
      this.text = jest.fn().mockResolvedValue('');
      this.cookies = {
        getAll: jest.fn().mockReturnValue([]),
        get: jest.fn().mockReturnValue(undefined),
        has: jest.fn().mockReturnValue(false),
      };
    }
  } as unknown as typeof Request;
}

if (!global.Response) {
  global.Response = class MockResponse {
    status: number;
    statusText: string;
    headers: Headers;
    body: unknown;
    json: () => Promise<Record<string, unknown>>;
    text: () => Promise<string>;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Headers(init?.headers);
      this.body = body || null;
      
      const bodyText = typeof body === 'string' ? body : JSON.stringify(body);
      
      this.json = jest.fn().mockImplementation(() => {
        try {
          return Promise.resolve(JSON.parse(bodyText || '{}'));
        } catch {
          return Promise.resolve({});
        }
      });
      
      this.text = jest.fn().mockResolvedValue(bodyText || '');
    }
  } as unknown as typeof Request;
}

// Mock Next.js modules
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn((data, init) => {
        const response = new Response(JSON.stringify(data), {
          status: init?.status || 200,
          headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
          },
        });
        
        return response;
      }),
      redirect: jest.fn((url) => {
        return new Response(null, {
          status: 302,
          headers: {
            Location: url,
          },
        });
      }),
    },
  };
});

// Mock Next.js cookies function
jest.mock('next/headers', () => {
  const mockCookieStore = {
    get: jest.fn((name) => ({ name, value: `mock-${name}-value` })),
    getAll: jest.fn(() => []),
    set: jest.fn(),
    delete: jest.fn(),
  };

  return {
    cookies: jest.fn(() => mockCookieStore),
  };
});

// Mock environment variables
process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key';

// Mock console.error to keep test output clean
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});
