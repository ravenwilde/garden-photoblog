/**
 * This file mocks the server-auth module for testing
 */

// Define the type for our extended server-auth module
type MockedServerAuth = typeof import('@/lib/server-auth') & {
  isAdmin: jest.Mock;
};

// Mock the server-auth module before importing it
jest.mock('@/lib/server-auth', () => ({
  // Mock getServerSession to return a configurable session
  getServerSession: jest.fn(),
  // Add isAdmin function that's not in the original module but used in tests
  isAdmin: jest.fn().mockReturnValue(false)
}));

// Import the mocked module
import * as serverAuthOriginal from '@/lib/server-auth';

// Cast to our extended type
const serverAuth = serverAuthOriginal as MockedServerAuth;

/**
 * Configure mock responses for server authentication
 * @param config The mock configuration
 */
export function setupServerAuthMocks(config: {
  session?: {
    user?: {
      id: string;
      email: string;
      role?: string;
    } | null;
    error?: Error;
  };
  isAdmin?: boolean;
}) {
  // Reset mocks
  jest.clearAllMocks();
  
  // Configure session response
  if (config.session) {
    if (config.session.user) {
      (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
        user: config.session.user,
        session: {
          access_token: 'mock-access-token',
          expires_at: Date.now() + 3600,
        },
      });
    } else {
      (serverAuth.getServerSession as jest.Mock).mockResolvedValue(null);
    }
  }
  
  // Configure isAdmin response
  if (config.isAdmin !== undefined) {
    serverAuth.isAdmin.mockReturnValue(config.isAdmin);
  }
  
  return serverAuth;
}
