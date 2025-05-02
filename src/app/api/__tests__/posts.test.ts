import './setup';
import { GET, POST, PUT, DELETE } from '../posts/route';
import { createMockRequest, parseResponse } from './test-utils';
import { setupSupabaseMocks } from './mocks/supabase';
import * as postsLib from '@/lib/posts';
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

// Mock the posts library
jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn()
}));

describe('API: /api/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all posts', async () => {
      // Mock the getAllPosts function to return test data
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post 1',
          description: 'Test Description 1',
          date: '2025-05-01',
          notes: 'Test Notes 1',
          images: [{ id: '1', url: 'test1.jpg', alt: 'Test Image 1', width: 800, height: 600 }],
          tags: ['test', 'garden'],
          created_at: '2025-05-01T00:00:00Z',
          updated_at: '2025-05-01T00:00:00Z'
        },
        {
          id: '2',
          title: 'Test Post 2',
          description: 'Test Description 2',
          date: '2025-04-30',
          notes: 'Test Notes 2',
          images: [{ id: '2', url: 'test2.jpg', alt: 'Test Image 2', width: 800, height: 600 }],
          tags: ['garden'],
          created_at: '2025-04-30T00:00:00Z',
          updated_at: '2025-04-30T00:00:00Z'
        }
      ];
      
      (postsLib.getAllPosts as jest.Mock).mockResolvedValue(mockPosts);
      
      // Call the GET handler
      const response = await GET();
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(200);
      expect(data).toEqual(mockPosts);
      expect(postsLib.getAllPosts).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching posts', async () => {
      // Mock the getAllPosts function to throw an error
      (postsLib.getAllPosts as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Call the GET handler
      const response = await GET();
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Failed to get posts' });
    });
  });

  describe('POST', () => {
    it('should create a new post when authenticated as admin', async () => {
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
      
      // Mock the createPost function
      const newPost = {
        title: 'New Post',
        description: 'New Description',
        date: '2025-05-01',
        notes: 'New Notes',
        images: [{ url: 'new.jpg', alt: 'New Image', width: 800, height: 600 }],
        tags: ['new', 'test']
      };
      
      const createdPost = {
        id: 'new-id',
        ...newPost,
        created_at: '2025-05-01T00:00:00Z',
        updated_at: '2025-05-01T00:00:00Z'
      };
      
      (postsLib.createPost as jest.Mock).mockResolvedValue(createdPost);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/posts',
        body: newPost
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(201);
      expect(data).toEqual(createdPost);
      expect(postsLib.createPost).toHaveBeenCalledWith(newPost);
    });

    it('should return 401 when not authenticated', async () => {
      // Setup no session
      (serverAuth.getServerSession as jest.Mock).mockResolvedValue(null);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/posts',
        body: {
          title: 'New Post',
          description: 'New Description',
          date: '2025-05-01',
          images: [{ url: 'new.jpg', alt: 'New Image', width: 800, height: 600 }]
        }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - No session' });
      expect(postsLib.createPost).not.toHaveBeenCalled();
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
      
      // Mock environment variable
      process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
      
      // Create a mock request
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/posts',
        body: {
          title: 'New Post',
          description: 'New Description',
          date: '2025-05-01',
          images: [{ url: 'new.jpg', alt: 'New Image', width: 800, height: 600 }]
        }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized - Not admin' });
      expect(postsLib.createPost).not.toHaveBeenCalled();
    });

    it('should return 400 when required fields are missing', async () => {
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
      
      // Mock environment variable
      process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@example.com';
      
      // Create a mock request with missing fields
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/posts',
        body: {
          title: 'New Post',
          // Missing description, date, and images
        }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Missing required fields' });
      expect(postsLib.createPost).not.toHaveBeenCalled();
    });

    it('should handle errors when creating a post', async () => {
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
      
      // Mock the createPost function to throw an error
      (postsLib.createPost as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/posts',
        body: {
          title: 'New Post',
          description: 'New Description',
          date: '2025-05-01',
          images: [{ url: 'new.jpg', alt: 'New Image', width: 800, height: 600 }]
        }
      });
      
      // Call the POST handler
      const response = await POST(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create post' });
    });
  });

  describe('PUT', () => {
    it('should update a post', async () => {
      // Mock the updatePost function
      const updatedPost = {
        id: '1',
        title: 'Updated Post',
        description: 'Updated Description',
        date: '2025-05-01',
        notes: 'Updated Notes',
        images: [{ id: '1', url: 'updated.jpg', alt: 'Updated Image', width: 800, height: 600 }],
        tags: ['updated', 'test'],
        created_at: '2025-05-01T00:00:00Z',
        updated_at: '2025-05-01T00:00:00Z'
      };
      
      (postsLib.updatePost as jest.Mock).mockResolvedValue(updatedPost);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/posts',
        body: {
          id: '1',
          title: 'Updated Post',
          description: 'Updated Description',
          notes: 'Updated Notes',
          date: '2025-05-01',
          tags: ['updated', 'test']
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(200);
      expect(data).toEqual(updatedPost);
      expect(postsLib.updatePost).toHaveBeenCalledWith('1', {
        title: 'Updated Post',
        description: 'Updated Description',
        notes: 'Updated Notes',
        date: '2025-05-01',
        tags: ['updated', 'test']
      });
    });

    it('should return 400 when post ID is missing', async () => {
      // Create a mock request without an ID
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/posts',
        body: {
          title: 'Updated Post',
          description: 'Updated Description',
          date: '2025-05-01'
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Post ID is required' });
      expect(postsLib.updatePost).not.toHaveBeenCalled();
    });

    it('should handle errors when updating a post', async () => {
      // Mock the updatePost function to throw an error
      (postsLib.updatePost as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/posts',
        body: {
          id: '1',
          title: 'Updated Post',
          description: 'Updated Description',
          date: '2025-05-01'
        }
      });
      
      // Call the PUT handler
      const response = await PUT(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Failed to update post' });
    });
  });

  describe('DELETE', () => {
    it('should delete a post', async () => {
      // Mock the deletePost function
      (postsLib.deletePost as jest.Mock).mockResolvedValue(undefined);
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/posts',
        body: { id: '1' }
      });
      
      // Call the DELETE handler
      const response = await DELETE(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(postsLib.deletePost).toHaveBeenCalledWith('1');
    });

    it('should return 400 when post ID is missing', async () => {
      // Create a mock request without an ID
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/posts',
        body: {}
      });
      
      // Call the DELETE handler
      const response = await DELETE(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Post ID is required' });
      expect(postsLib.deletePost).not.toHaveBeenCalled();
    });

    it('should handle errors when deleting a post', async () => {
      // Mock the deletePost function to throw an error
      (postsLib.deletePost as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Create a mock request
      const request = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/posts',
        body: { id: '1' }
      });
      
      // Call the DELETE handler
      const response = await DELETE(request);
      const { status, data } = await parseResponse(response);
      
      // Verify the response
      expect(status).toBe(500);
      expect(data).toEqual({ error: 'Failed to delete post' });
    });
  });
});
