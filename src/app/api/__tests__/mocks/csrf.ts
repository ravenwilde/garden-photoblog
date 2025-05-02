// Mock the CSRF module
jest.mock('@/lib/csrf', () => {
  const originalModule = jest.requireActual('@/lib/csrf');
  
  return {
    ...originalModule,
    verifyToken: jest.fn(),
    generateToken: jest.fn().mockReturnValue('mock-csrf-token'),
  };
});

// Import the mocked module
import * as csrf from '@/lib/csrf';

/**
 * Configure mock responses for CSRF validation
 * @param config The mock configuration
 */
export function setupCSRFMocks(config: {
  isValid?: boolean;
  error?: any;
}) {
  // Reset mocks
  jest.clearAllMocks();
  
  // Configure CSRF validation response
  const mockedCSRF = csrf as jest.Mocked<typeof csrf>;
  
  if (config.isValid !== undefined) {
    if (config.isValid) {
      mockedCSRF.verifyToken.mockReturnValue(true);
    } else {
      mockedCSRF.verifyToken.mockImplementation(() => {
        if (config.error) {
          throw config.error;
        }
        return false;
      });
    }
  }
  
  return mockedCSRF;
}
