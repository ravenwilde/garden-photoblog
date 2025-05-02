import './setup';
import { POST } from '../auth/clear-session/route';
import { parseResponse } from './test-utils';

// Mock the Supabase client
const mockSignOut = jest.fn();
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      signOut: mockSignOut
    }
  }))
}));

describe('API: /api/auth/clear-session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear the session successfully', async () => {
    // Mock successful sign out
    mockSignOut.mockResolvedValue({ error: null });
    
    // Call the POST handler
    const response = await POST();
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(200);
    expect(data).toEqual({ success: true });
    
    // Verify signOut was called
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should handle errors when clearing the session', async () => {
    // Mock error during sign out
    mockSignOut.mockResolvedValue({ error: { message: 'Failed to sign out' } });
    
    // Call the POST handler
    const response = await POST();
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(500);
    expect(data).toEqual({ error: 'Failed to sign out' });
    
    // Verify signOut was called
    expect(mockSignOut).toHaveBeenCalled();
  });
});
