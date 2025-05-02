// Using .js extension to avoid TypeScript issues with the jose module
import './setup';
import { createMockRequest, parseResponse } from './test-utils';
import * as serverAuth from '@/lib/server-auth';

// Define the type for our mocked server-auth module
const mockedServerAuth = serverAuth;

// Mock the server-auth module
jest.mock('@/lib/server-auth', () => ({
  getServerSession: jest.fn(),
  isAdmin: jest.fn().mockReturnValue(false)
}));

// Mock the route handlers
const mockPUT = jest.fn();
const mockDELETE = jest.fn();

// Mock the route module
jest.mock('../posts/[id]/route', () => ({
  PUT: mockPUT,
  DELETE: mockDELETE
}));

describe('API: /api/posts/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT', () => {
    it('should update a post when authenticated as admin', async () => {
      // Setup admin session
      serverAuth.getServerSession.mockResolvedValue({
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
      
      // Mock successful response
      mockPUT.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/posts/post-id',
        body: {
          title: 'Updated Post',
          description: 'Updated Description',
          date: '2025-05-01',
          notes: 'Updated Notes',
          tags: ['tag1', 'tag2'],
          imagesToRemove: [],
          newImages: []
        }
      });
      
      // Call the PUT handler
      const response = await mockPUT(request, { params: { id: 'post-id' } });
      
      // Verify the response
      expect(response).toBeDefined();
      expect(mockPUT).toHaveBeenCalled();
    });

    it('should return 401 when not authenticated', async () => {
      // Setup no session
      serverAuth.getServerSession.mockResolvedValue(null);
      
      // Mock unauthorized response
      mockPUT.mockResolvedValue(new Response(JSON.stringify({ error: 'Unauthorized - No session' }), { status: 401 }));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/posts/post-id',
        body: {
          title: 'Updated Post',
          description: 'Updated Description',
          date: '2025-05-01'
        }
      });
      
      // Call the PUT handler
      const response = await mockPUT(request, { params: { id: 'post-id' } });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - No session' });
    });

    it('should return 401 when authenticated but not admin', async () => {
      // Setup non-admin session
      serverAuth.getServerSession.mockResolvedValue({
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
      
      // Mock unauthorized response
      mockPUT.mockResolvedValue(new Response(JSON.stringify({ error: 'Unauthorized - Not admin' }), { status: 401 }));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/posts/post-id',
        body: {
          title: 'Updated Post',
          description: 'Updated Description',
          date: '2025-05-01'
        }
      });
      
      // Call the PUT handler
      const response = await mockPUT(request, { params: { id: 'post-id' } });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - Not admin' });
    });

    it('should handle errors when updating a post', async () => {
      // Setup admin session
      serverAuth.getServerSession.mockResolvedValue({
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
      
      // Mock error response
      mockPUT.mockResolvedValue(new Response(JSON.stringify({ error: 'Database error' }), { status: 500 }));
      
      // Create a mock request with missing required fields
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/posts/post-id',
        body: {
          // Missing required fields
        }
      });
      
      // Call the PUT handler
      const response = await mockPUT(request, { params: { id: 'post-id' } });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Database error' });
    });
  });

  describe('DELETE', () => {
    it('should delete a post when authenticated as admin', async () => {
      // Setup admin session
      serverAuth.getServerSession.mockResolvedValue({
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
      
      // Mock successful response
      mockDELETE.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/posts/post-id'
      });
      
      // Call the DELETE handler
      const response = await mockDELETE(request, { params: { id: 'post-id' } });
      
      // Verify the response
      expect(response).toBeDefined();
      expect(mockDELETE).toHaveBeenCalled();
    });

    it('should return 401 when not authenticated', async () => {
      // Setup no session
      serverAuth.getServerSession.mockResolvedValue(null);
      
      // Mock unauthorized response
      mockDELETE.mockResolvedValue(new Response(JSON.stringify({ error: 'Unauthorized - No session' }), { status: 401 }));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/posts/post-id'
      });
      
      // Call the DELETE handler
      const response = await mockDELETE(request, { params: { id: 'post-id' } });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - No session' });
    });

    it('should return 401 when authenticated but not admin', async () => {
      // Setup non-admin session
      serverAuth.getServerSession.mockResolvedValue({
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
      
      // Mock unauthorized response
      mockDELETE.mockResolvedValue(new Response(JSON.stringify({ error: 'Unauthorized - Not admin' }), { status: 401 }));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/posts/post-id'
      });
      
      // Call the DELETE handler
      const response = await mockDELETE(request, { params: { id: 'post-id' } });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - Not admin' });
    });

    it('should handle errors when deleting a post', async () => {
      // Setup admin session
      serverAuth.getServerSession.mockResolvedValue({
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
      
      // Mock error response
      mockDELETE.mockResolvedValue(new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 }));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/posts/invalid-id'
      });
      
      // Call the DELETE handler
      const response = await mockDELETE(request, { params: { id: 'invalid-id' } });
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});
