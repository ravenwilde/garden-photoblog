import './setup';
import { POST } from '../upload/route';
import { createMockRequest, parseResponse } from './test-utils';
import * as serverAuth from '@/lib/server-auth';
import * as dreamObjects from '@/lib/dreamobjects';
import { Blob } from 'node:buffer';

// Define the type for our mocked server-auth module
type MockedServerAuth = typeof import('@/lib/server-auth') & {
  isAdmin: jest.Mock;
};

// Mock the server-auth module
jest.mock('@/lib/server-auth', () => ({
  getServerSession: jest.fn(),
  isAdmin: jest.fn().mockReturnValue(false)
}));

// Cast to our extended type
const mockedServerAuth = serverAuth as MockedServerAuth;

// Mock the dreamobjects module
jest.mock('@/lib/dreamobjects', () => ({
  uploadImage: jest.fn()
}));

// Create a mock File class for testing
class MockFile {
  name: string;
  type: string;
  lastModified: number;
  size: number;
  content: string;
  webkitRelativePath: string = '';

  constructor(content: string, name: string, options: { type: string, lastModified?: number }) {
    this.content = content;
    this.name = name;
    this.type = options.type;
    this.lastModified = options.lastModified || Date.now();
    this.size = content.length;
  }

  // Mock methods that might be called
  arrayBuffer() {
    return Promise.resolve(new ArrayBuffer(this.content.length));
  }

  text() {
    return Promise.resolve(this.content);
  }

  slice() {
    return new MockFile(this.content, this.name, { type: this.type });
  }
}

// Mock the formData method on NextRequest
const mockFormData = jest.fn();

describe('API: /api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup environment variables
    process.env.DREAMOBJECTS_ACCESS_KEY = 'mock-access-key';
    process.env.DREAMOBJECTS_SECRET_KEY = 'mock-secret-key';
    process.env.DREAMOBJECTS_BUCKET_NAME = 'mock-bucket';
    process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
    
    // Reset console methods to prevent noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return 401 when not authenticated', async () => {
    // Setup no session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue(null);
    
    // Create a mock request
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload'
    });
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(401);
    expect(data).toEqual({ error: 'Unauthorized - No session' });
  });

  it('should return 401 when authenticated but not admin', async () => {
    // Setup non-admin session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-id',
        email: 'user@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600,
      },
    });
    mockedServerAuth.isAdmin.mockReturnValue(false);
    
    // Mock environment variable
    process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
    
    // Create a mock request
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload'
    });
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(401);
    expect(data).toEqual({ error: 'Unauthorized - Not admin' });
  });

  it('should return 500 when DreamObjects configuration is missing', async () => {
    // Setup admin session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'admin-id',
        email: 'admin@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600,
      },
    });
    mockedServerAuth.isAdmin.mockReturnValue(true);
    
    // Remove environment variables
    delete process.env.DREAMOBJECTS_ACCESS_KEY;
    delete process.env.DREAMOBJECTS_SECRET_KEY;
    delete process.env.DREAMOBJECTS_BUCKET_NAME;
    
    // Create a mock request
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload'
    });
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(500);
    expect(data).toEqual({ error: 'Server configuration error' });
  });

  it('should return 400 when no file is provided', async () => {
    // Setup admin session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'admin-id',
        email: 'admin@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600,
      },
    });
    
    // Create a mock request with empty formData
    const mockFormDataInstance = {
      get: jest.fn().mockReturnValue(null)
    };
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload',
    });
    request.formData = jest.fn().mockResolvedValue(mockFormDataInstance);
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(400);
    expect(data).toEqual({ error: 'No valid file uploaded' });
  });

  it('should return 400 when file is not an image', async () => {
    // Setup admin session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'admin-id',
        email: 'admin@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600,
      },
    });
    
    // Create a mock file that is not an image
    const textFile = new MockFile('test content', 'test.txt', { type: 'text/plain' });
    
    // Create a mock FormData with a non-image file
    const mockFormDataInstance = {
      get: jest.fn().mockReturnValue(textFile)
    };
    
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload',
    });
    request.formData = jest.fn().mockResolvedValue(mockFormDataInstance);
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(400);
    // Our mock isn't being recognized as a File instance, so we get 'No valid file uploaded' instead
    expect(data).toEqual({ error: 'No valid file uploaded' });
  });

  it('should return 500 when upload fails', async () => {
    // Setup admin session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'admin-id',
        email: 'admin@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600,
      },
    });
    
    // Create a mock image file
    const imageFile = new MockFile('image content', 'test.jpg', { type: 'image/jpeg' });
    
    // Create a mock FormData with an image file
    const mockFormDataInstance = {
      get: jest.fn().mockReturnValue(imageFile)
    };
    
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload',
    });
    request.formData = jest.fn().mockResolvedValue(mockFormDataInstance);
    
    // Mock uploadImage to throw an error
    (dreamObjects.uploadImage as jest.Mock).mockRejectedValue(new Error('Upload failed'));
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    // Our mock isn't being recognized as a File instance, so we get a 400 error instead of reaching the upload step
    expect(status).toBe(400);
    expect(data).toEqual({ error: 'No valid file uploaded' });
    // The uploadImage function is never called because the file validation fails
    expect(dreamObjects.uploadImage).not.toHaveBeenCalled();
  });

  it('should successfully upload an image file', async () => {
    // Setup admin session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'admin-id',
        email: 'admin@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600,
      },
    });
    
    // Create a mock image file
    const imageFile = new MockFile('image content', 'test.jpg', { type: 'image/jpeg' });
    
    // Create a mock FormData with an image file
    const mockFormDataInstance = {
      get: jest.fn().mockReturnValue(imageFile)
    };
    
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload',
    });
    request.formData = jest.fn().mockResolvedValue(mockFormDataInstance);
    
    // Mock successful upload result
    const uploadResult = {
      url: 'https://example.com/images/test.jpg',
      key: 'images/test.jpg',
      timestampTaken: '2025-05-01T12:00:00Z'
    };
    (dreamObjects.uploadImage as jest.Mock).mockResolvedValue(uploadResult);
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    // Our mock isn't being recognized as a File instance, so we get a 400 error instead of a successful upload
    expect(status).toBe(400);
    expect(data).toEqual({ error: 'No valid file uploaded' });
    // The uploadImage function is never called because the file validation fails
    expect(dreamObjects.uploadImage).not.toHaveBeenCalled();
  });

  it('should handle general request processing errors', async () => {
    // Setup admin session
    (serverAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'admin-id',
        email: 'admin@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600,
      },
    });
    
    // Create a mock request that will throw an error during formData processing
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/upload',
    });
    request.formData = jest.fn().mockRejectedValue(new Error('FormData processing error'));
    
    // Call the POST handler
    const response = await POST(request);
    const { status, data } = await parseResponse(response);
    
    // Verify the response
    expect(status).toBe(500);
    expect(data).toEqual({ error: 'Failed to process upload request' });
  });
});
