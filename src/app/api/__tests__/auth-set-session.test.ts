import './setup';
import { POST } from '../auth/set-session/route';
import { createMockRequest, parseResponse } from './test-utils';

// Mock the Supabase client
const mockSetSession = jest.fn();
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      setSession: mockSetSession
    }
  }))
}));

describe('API: /api/auth/set-session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set the session successfully', async () => {
    // Mock session data
    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Date.now() + 3600,
    };
    
    // Mock successful session setting
    const mockNewSession = {
      ...mockSession,
      user: { id: 'user-id', email: 'user@example.com' }
    };
    mockSetSession.mockResolvedValue({
      data: { session: mockNewSession },
      error: null
    });
    
    // Create a mock request
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/set-session',
      body: { session: mockSession }
    });
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(200);
    expect(data).toEqual({ session: mockNewSession });
    
    // Verify setSession was called with the correct session
    expect(mockSetSession).toHaveBeenCalledWith(mockSession);
  });

  it('should return 400 when no session is provided', async () => {
    // Create a mock request with no session
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/set-session',
      body: {}
    });
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(400);
    expect(data).toEqual({ error: 'No session provided' });
    
    // Verify setSession was not called
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it('should handle errors when setting the session', async () => {
    // Mock session data
    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Date.now() + 3600,
    };
    
    // Mock error during session setting
    mockSetSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid session' }
    });
    
    // Create a mock request
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/set-session',
      body: { session: mockSession }
    });
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(500);
    expect(data).toEqual({ error: 'Invalid session' });
    
    // Verify setSession was called with the correct session
    expect(mockSetSession).toHaveBeenCalledWith(mockSession);
  });
});
