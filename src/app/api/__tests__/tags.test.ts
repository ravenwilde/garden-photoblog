import './setup';
import { GET, POST } from '../tags/route';
import { createMockRequest, parseResponse } from './test-utils';
import * as tagsLib from '@/lib/tags';
import * as serverAuth from '@/lib/server-auth';

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

// Mock the tags library
jest.mock('@/lib/tags', () => ({
  getAllTags: jest.fn(),
  createTag: jest.fn(),
  updateTag: jest.fn(),
  deleteTag: jest.fn()
}));

describe('API: /api/tags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all tags', async () => {
      // Mock the getAllTags function to return test data
      const mockTags = [
        { id: '1', name: 'garden', post_count: 5 },
        { id: '2', name: 'flowers', post_count: 3 },
        { id: '3', name: 'vegetables', post_count: 2 }
      ];
      
      (tagsLib.getAllTags as jest.Mock).mockResolvedValue(mockTags);
      
      // Call the GET handler
      const response = await GET();
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(200);
      expect(data).toEqual(mockTags);
      expect(tagsLib.getAllTags).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching tags', async () => {
      // Mock the getAllTags function to throw an error
      (tagsLib.getAllTags as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Call the GET handler
      const response = await GET();
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Failed to get tags' });
    });
  });

  describe('POST', () => {
    it('should create a new tag when authenticated as admin', async () => {
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
      
      // Mock environment variable
      process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
      
      // Mock the createTag function
      const newTag = { name: 'newtag' };
      const createdTag = {
        id: 'new-id',
        name: 'newtag',
        post_count: 0
      };
      
      (tagsLib.createTag as jest.Mock).mockResolvedValue(createdTag);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/tags',
        body: newTag
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(200);
      expect(data).toEqual(createdTag);
      expect(tagsLib.createTag).toHaveBeenCalledWith('newtag');
    });

    it('should return 401 when not authenticated', async () => {
      // Setup no session
      (serverAuth.getServerSession as jest.Mock).mockResolvedValue(null);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/tags',
        body: { name: 'newtag' }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(tagsLib.createTag).not.toHaveBeenCalled();
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
        url: 'http://localhost:3000/api/tags',
        body: { name: 'newtag' }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(tagsLib.createTag).not.toHaveBeenCalled();
    });

    it('should return 400 when tag name is missing', async () => {
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
      
      // Mock environment variable
      process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
      
      // Create a mock request with missing name
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/tags',
        body: {}
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Invalid tag name' });
      expect(tagsLib.createTag).not.toHaveBeenCalled();
    });

    it('should return 400 when tag name is not a string', async () => {
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
      
      // Mock environment variable
      process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
      
      // Create a mock request with non-string name
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/tags',
        body: { name: 123 }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Invalid tag name' });
      expect(tagsLib.createTag).not.toHaveBeenCalled();
    });

    it('should handle errors when creating a tag', async () => {
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
      
      // Mock environment variable
      process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
      
      // Mock the createTag function to throw an error
      const errorMessage = 'Database error';
      (tagsLib.createTag as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/tags',
        body: { name: 'newtag' }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: errorMessage });
    });
  });
});
