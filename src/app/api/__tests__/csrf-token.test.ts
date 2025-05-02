import './setup';
import { GET } from '../csrf-token/route';
import { parseResponse } from './test-utils';
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
    // Mock the cookies.set method
    const mockSet = jest.fn();
    const mockResponse = {
      cookies: {
        set: mockSet
      },
      token: 'mock-csrf-token'
    };
    
    // Mock NextResponse.json to return our mock response
    jest.spyOn(NextResponse, 'json').mockImplementation(() => mockResponse as any);
    
    // Call the GET handler
    const response = await GET();
    
    // Verify the response is our mock response
    expect(response).toBe(mockResponse);
    
    // Verify the cookie was set
    expect(mockSet).toHaveBeenCalledWith('csrf-token', 'mock-csrf-token', {
      httpOnly: true,
      secure: false, // In test environment, NODE_ENV is not 'production'
      sameSite: 'strict',
      path: '/'
    });
  });
});
