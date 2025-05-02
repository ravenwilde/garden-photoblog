import type { NextRequest, NextResponse } from 'next/server';

/**
 * Creates a mock NextRequest object for testing API routes
 * @param options Request options
 * @returns A mocked NextRequest object
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
  cookies?: Record<string, string>;
}): NextRequest {
  const {
    method = 'GET',
    url = 'http://localhost:3000/api/test',
    headers = {},
    body = null,
    cookies = {},
  } = options;

  // Create headers object
  const headersObj = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    headersObj.append(key, value);
  });

  // Create request init
  const init: RequestInit = {
    method,
    headers: headersObj,
  };

  // Add body if provided
  if (body) {
    init.body = JSON.stringify(body);
  }

  // Create the request
  const request = new Request(url, init) as NextRequest;

  // Mock the json method
  request.json = jest.fn().mockResolvedValue(body);

  // Mock cookies
  const cookieObj: unknown = {};
  Object.entries(cookies).forEach(([key, value]) => {
    cookieObj[key] = value;
  });
  
  // Add cookies to the request
  Object.defineProperty(request, 'cookies', {
    get: jest.fn().mockReturnValue({
      getAll: () => Object.entries(cookieObj).map(([name, value]) => ({ name, value })),
      get: (name: string) => cookieObj[name] ? { name, value: cookieObj[name] } : undefined,
      has: (name: string) => !!cookieObj[name],
    }),
  });

  return request;
}

/**
 * Parses a NextResponse object for testing
 * @param response The NextResponse to parse
 * @returns The parsed response data
 */
export async function parseResponse(response: NextResponse): Promise<{
  status: number;
  data: unknown;
  headers: Headers;
}> {
  const status = response.status;
  const headers = response.headers;
  
  // Parse the response body
  let data;
  try {
    const text = await response.text();
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  return {
    status,
    data,
    headers,
  };
}

/**
 * Mock for the getServerSession function
 * @param user Optional user object to include in the session
 * @returns A mock session object or null
 */
export function mockSession(user?: {
  id: string;
  email: string;
  role?: string;
}) {
  if (!user) {
    return null;
  }

  return {
    user,
    session: {
      access_token: 'mock-access-token',
      expires_at: Date.now() + 3600,
    },
  };
}
