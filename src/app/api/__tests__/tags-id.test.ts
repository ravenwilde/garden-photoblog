import './setup';
import { PUT, DELETE } from '../tags/[id]/route';
import { createMockRequest, parseResponse } from './test-utils';
import * as serverAuth from '@/lib/server-auth';
import * as tagsLib from '@/lib/tags';

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
  updateTag: jest.fn(),
  deleteTag: jest.fn()
}));

describe('API: /api/tags/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT', () => {
    it('should update a tag when authenticated as admin', async () => {
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
      
      // Mock updateTag function
      const mockUpdatedTag = { id: 'tag-id', name: 'Updated Tag' };
      (tagsLib.updateTag as jest.Mock).mockResolvedValue(mockUpdatedTag);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/tags/tag-id',
        body: {
          name: 'Updated Tag'
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(200);
      expect(data).toEqual(mockUpdatedTag);
      
      // Verify the updateTag function was called with correct parameters
      expect(tagsLib.updateTag).toHaveBeenCalledWith('tag-id', 'Updated Tag');
    });

    it('should return 401 when not authenticated', async () => {
      // Setup no session
      (serverAuth.getServerSession as jest.Mock).mockResolvedValue(null);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/tags/tag-id',
        body: {
          name: 'Updated Tag'
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request, { params: Promise.resolve({ id: 'tag-id' }) });
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
        method: 'PUT',
        url: 'http://localhost:3000/api/tags/tag-id',
        body: {
          name: 'Updated Tag'
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - Not admin' });
    });

    it('should return 400 when name is missing', async () => {
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
      
      // Create a mock request with empty body
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/tags/tag-id',
        body: {}
      });
      
      // Call the PUT handler
      const response = await PUT(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Name is required' });
    });

    it('should return 409 when tag name already exists', async () => {
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
      
      // Mock updateTag function to throw an error
      (tagsLib.updateTag as jest.Mock).mockRejectedValue(
        new Error('A tag with this name already exists')
      );
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/tags/tag-id',
        body: {
          name: 'Existing Tag'
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(409);
      expect(data).toEqual({ error: 'A tag with this name already exists' });
    });

    it('should return 500 on server error', async () => {
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
      
      // Mock updateTag function to throw a generic error
      (tagsLib.updateTag as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/tags/tag-id',
        body: {
          name: 'Updated Tag'
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('DELETE', () => {
    it('should delete a tag when authenticated as admin', async () => {
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
      
      // Mock deleteTag function
      (tagsLib.deleteTag as jest.Mock).mockResolvedValue(undefined);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/tags/tag-id'
      });
      
      // Call the DELETE handler
      const response = await DELETE(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(204);
      
      // Verify the deleteTag function was called with correct parameters
      expect(tagsLib.deleteTag).toHaveBeenCalledWith('tag-id');
    });

    it('should return 401 when not authenticated', async () => {
      // Setup no session
      (serverAuth.getServerSession as jest.Mock).mockResolvedValue(null);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/tags/tag-id'
      });
      
      // Call the DELETE handler
      const response = await DELETE(request, { params: Promise.resolve({ id: 'tag-id' }) });
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
        method: 'DELETE',
        url: 'http://localhost:3000/api/tags/tag-id'
      });
      
      // Call the DELETE handler
      const response = await DELETE(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - Not admin' });
    });

    it('should return 409 when tag is still in use', async () => {
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
      
      // Mock deleteTag function to throw an error
      (tagsLib.deleteTag as jest.Mock).mockRejectedValue(
        new Error('Cannot delete tag that is still in use')
      );
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/tags/tag-id'
      });
      
      // Call the DELETE handler
      const response = await DELETE(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(409);
      expect(data).toEqual({ error: 'Cannot delete tag that is still in use' });
    });

    it('should return 500 on server error', async () => {
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
      
      // Mock deleteTag function to throw a generic error
      (tagsLib.deleteTag as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/tags/tag-id'
      });
      
      // Call the DELETE handler
      const response = await DELETE(request, { params: Promise.resolve({ id: 'tag-id' }) });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Internal Server Error' });
    });
  });
});
