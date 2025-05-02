import './setup';
import { GET } from '../csrf-token/route';
import { NextResponse } from 'next/server';

// Mock crypto.randomBytes
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('mock-csrf-token')
  })
}));

describe('API: /api/csrf-token', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate and return a CSRF token', async () => {
    // Mock NextResponse.json to return our mock response
    const mockResponse = {
      cookies: {
        set: jest.fn()
      },
      token: 'mock-csrf-token'
    };
    jest.spyOn(NextResponse, 'json').mockImplementation(() => mockResponse as unknown as ReturnType<typeof NextResponse.json>);
    
    // Call the GET handler
    const response = await GET();
    
    // Verify the response is our mock response
    expect(response).toBe(mockResponse);
    
    // Verify the cookie was set
    expect(mockResponse.cookies.set).toHaveBeenCalledWith('csrf-token', 'mock-csrf-token', {
      httpOnly: true,
      secure: false, // In test environment, NODE_ENV is not 'production'
      sameSite: 'strict',
      path: '/'
    });
  });
});
