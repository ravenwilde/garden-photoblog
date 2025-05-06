import { Post, NewPost } from '@/types';
import * as supabaseModule from '@/lib/supabase';

// Define the type for our chainable mock
type ChainableMock = {
  // Basic query methods
  select: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  upsert: jest.Mock;

  // Filter methods
  eq: jest.Mock;
  neq: jest.Mock;
  gt: jest.Mock;
  lt: jest.Mock;
  gte: jest.Mock;
  lte: jest.Mock;
  like: jest.Mock;
  ilike: jest.Mock;
  is: jest.Mock;
  in: jest.Mock;
  contains: jest.Mock;
  containedBy: jest.Mock;
  rangeGt: jest.Mock;
  rangeLt: jest.Mock;
  rangeGte: jest.Mock;
  rangeLte: jest.Mock;

  // Result methods
  single: jest.Mock;
  maybeSingle: jest.Mock;

  // Ordering methods
  order: jest.Mock;
  limit: jest.Mock;
  range: jest.Mock;

  // Modifier methods
  onConflict: jest.Mock;
  returning: jest.Mock;

  // Set the response data and error
  mockReturnValue: <T>(data: T, error?: Error | null) => ChainableMock;

  // Response data and error
  data: unknown;
  error: Error | null;
};

// Create a helper function to create chainable mock methods
function createChainableMock(): ChainableMock {
  // Use type assertion to handle the circular reference
  const mock = {} as ChainableMock;

  // Basic query methods
  mock.select = jest.fn(() => mock);
  mock.insert = jest.fn(() => mock);
  mock.update = jest.fn(() => mock);
  mock.delete = jest.fn(() => mock);
  mock.upsert = jest.fn(() => mock);

  // Filter methods
  mock.eq = jest.fn(() => mock);
  mock.neq = jest.fn(() => mock);
  mock.gt = jest.fn(() => mock);
  mock.lt = jest.fn(() => mock);
  mock.gte = jest.fn(() => mock);
  mock.lte = jest.fn(() => mock);
  mock.like = jest.fn(() => mock);
  mock.ilike = jest.fn(() => mock);
  mock.is = jest.fn(() => mock);
  mock.in = jest.fn(() => mock);
  mock.contains = jest.fn(() => mock);
  mock.containedBy = jest.fn(() => mock);
  mock.rangeGt = jest.fn(() => mock);
  mock.rangeLt = jest.fn(() => mock);
  mock.rangeGte = jest.fn(() => mock);
  mock.rangeLte = jest.fn(() => mock);

  // Result methods
  mock.single = jest.fn(() => mock);
  mock.maybeSingle = jest.fn(() => mock);

  // Ordering methods
  mock.order = jest.fn(() => mock);
  mock.limit = jest.fn(() => mock);
  mock.range = jest.fn(() => mock);

  // Modifier methods
  mock.onConflict = jest.fn(() => mock);
  mock.returning = jest.fn(() => mock);

  // Set the response data and error
  mock.mockReturnValue = function <T>(data: T, error: Error | null = null) {
    mock.data = data;
    mock.error = error;
    return mock;
  };

  // Response data and error
  mock.data = null;
  mock.error = null;

  return mock;
}

// We need to mock the modules before importing the functions we want to test
// Mock the Supabase client first
jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: jest.fn().mockImplementation(() => createChainableMock()),
      rpc: jest.fn().mockImplementation(() => ({
        data: null,
        error: null,
      })),
    },
  };
});

// Now mock the posts module to avoid circular dependencies
jest.mock('@/lib/posts', () => {
  // Store original implementation
  const originalModule = jest.requireActual('@/lib/posts');

  // Mock the refreshSchemaCache function to avoid issues
  return {
    ...originalModule,
    refreshSchemaCache: jest.fn().mockResolvedValue(undefined),
  };
});

// Now import the functions we want to test
import { getAllPosts, createPost, deletePost, updatePost } from '@/lib/posts';

describe('Posts Utilities', () => {
  // Use the imported module to access the mocked supabase instance
  // Add type assertion to avoid TypeScript errors with the mock implementation
  const { supabase: mockSupabase } = supabaseModule as unknown as {
    supabase: {
      from: jest.Mock;
      rpc: jest.Mock;
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should return all posts with images and tags', async () => {
      // Setup mock data
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Test Post 1',
          description: 'Description 1',
          notes: 'Notes 1',
          date: '2025-05-01',
          created_at: '2025-05-01T12:00:00Z',
          updated_at: '2025-05-01T12:00:00Z',
          images: [
            {
              id: 'img-1',
              url: 'https://example.com/img1.jpg',
              alt: 'Image 1',
              width: 800,
              height: 600,
            },
          ],
          tags: [{ name: 'tag1' }, { name: 'tag2' }],
        },
        {
          id: 'post-2',
          title: 'Test Post 2',
          description: 'Description 2',
          notes: 'Notes 2',
          date: '2025-05-02',
          created_at: '2025-05-02T12:00:00Z',
          updated_at: '2025-05-02T12:00:00Z',
          images: [],
          tags: [],
        },
      ];

      const mockTags = [
        { id: 'tag-1', name: 'tag1' },
        { id: 'tag-2', name: 'tag2' },
        { id: 'tag-3', name: 'tag3' },
      ];

      // Setup mock responses
      const postsMock = createChainableMock();
      postsMock.select.mockReturnThis();
      postsMock.order.mockReturnThis();
      postsMock.mockReturnValue(mockPosts, null);

      const tagsMock = createChainableMock();
      tagsMock.select.mockReturnThis();
      tagsMock.mockReturnValue(mockTags, null);

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') return postsMock;
        if (table === 'tags') return tagsMock;
        return createChainableMock();
      });

      // Call the function
      const result = await getAllPosts();

      // Assertions
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('post-1');
      expect(result[0].tags).toEqual(['tag1', 'tag2']);
      expect(result[0].images).toHaveLength(1);
      expect(result[1].id).toBe('post-2');
      expect(result[1].tags).toEqual([]);
      expect(result[1].images).toEqual([]);
      expect(mockSupabase.from).toHaveBeenCalledWith('posts');
      expect(mockSupabase.from).toHaveBeenCalledWith('tags');
      expect(postsMock.select).toHaveBeenCalled();
      expect(postsMock.order).toHaveBeenCalledWith('date', { ascending: false });
    });

    it('should throw an error when fetching posts fails', async () => {
      // Setup mock
      const postsMock = createChainableMock();
      postsMock.select.mockReturnThis();
      postsMock.order.mockReturnThis();
      postsMock.mockReturnValue(null, new Error('Database error'));

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') return postsMock;
        return createChainableMock();
      });

      // Call the function and expect error
      await expect(getAllPosts()).rejects.toThrow('Database error');
    });
  });

  describe('createPost', () => {
    it('should create a post with images and tags successfully', async () => {
      // Setup mock data
      const newPost: NewPost = {
        title: 'New Post',
        description: 'New Description',
        notes: 'New Notes',
        date: '2025-05-03',
        images: [{ url: 'https://example.com/img1.jpg', alt: 'Image 1', width: 800, height: 600 }],
        tags: ['tag1', 'tag2'],
      };

      const mockPostId = { id: 'post-123' };
      const mockCompletePost = {
        id: 'post-123',
        title: 'New Post',
        description: 'New Description',
        notes: 'New Notes',
        date: '2025-05-03',
        created_at: '2025-05-03T12:00:00Z',
        updated_at: '2025-05-03T12:00:00Z',
        images: [
          {
            id: 'img-1',
            url: 'https://example.com/img1.jpg',
            alt: 'Image 1',
            width: 800,
            height: 600,
          },
        ],
        tags: [{ name: 'tag1' }, { name: 'tag2' }],
      };

      const mockTags = [
        { id: 'tag-1', name: 'tag1' },
        { id: 'tag-2', name: 'tag2' },
      ];

      // Create mock for posts table - initial insert
      const postsInsertMock = createChainableMock();
      postsInsertMock.select.mockReturnThis();
      postsInsertMock.single.mockReturnThis();
      postsInsertMock.mockReturnValue(mockPostId, null);

      // Create mock for posts table - fetch complete post
      const postsFetchMock = createChainableMock();
      postsFetchMock.select.mockReturnThis();
      postsFetchMock.eq.mockReturnThis();
      postsFetchMock.single.mockReturnThis();
      postsFetchMock.mockReturnValue(mockCompletePost, null);

      // Create mock for tags table - upsert
      const tagsUpsertMock = createChainableMock();
      tagsUpsertMock.onConflict.mockReturnThis();
      tagsUpsertMock.mockReturnValue(null, null);

      // Create mock for tags table - select
      const tagsSelectMock = createChainableMock();
      tagsSelectMock.select.mockReturnThis();
      tagsSelectMock.in.mockReturnThis();
      tagsSelectMock.mockReturnValue(mockTags, null);

      // Create mock for post_tags table
      const postTagsMock = createChainableMock();
      postTagsMock.insert.mockReturnThis();
      postTagsMock.mockReturnValue(null, null);

      // Setup from() mock implementation
      let postsCallCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') {
          // First call for insert, second call for fetch
          if (postsCallCount === 0) {
            postsCallCount++;
            return {
              ...createChainableMock(),
              insert: jest.fn().mockReturnValue(postsInsertMock),
            };
          } else {
            return postsFetchMock;
          }
        } else if (table === 'tags') {
          return {
            ...createChainableMock(),
            upsert: jest.fn().mockReturnValue(tagsUpsertMock),
            select: jest.fn().mockReturnValue(tagsSelectMock),
          };
        } else if (table === 'post_tags') {
          return {
            ...createChainableMock(),
            insert: jest.fn().mockReturnValue(postTagsMock),
          };
        } else if (table === 'images') {
          // For refreshSchemaCache
          return createChainableMock();
        }
        return createChainableMock();
      });

      // Mock RPC call for insert_images
      mockSupabase.rpc.mockReturnValue({
        data: [{ id: 'img-1' }],
        error: null,
      });

      // Call the function
      const result = await createPost(newPost);

      // Assertions
      expect(result).toBeDefined();
      expect(result.id).toBe('post-123');
      expect(result.title).toBe('New Post');
      expect(result.tags).toEqual(['tag1', 'tag2']);
      expect(result.images).toHaveLength(1);
      expect(mockSupabase.from).toHaveBeenCalledWith('posts');
      expect(mockSupabase.from).toHaveBeenCalledWith('tags');
      expect(mockSupabase.from).toHaveBeenCalledWith('post_tags');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('insert_images', expect.any(Object));
    });

    it('should throw an error when post creation fails', async () => {
      // Setup mock data
      const newPost: NewPost = {
        title: 'New Post',
        description: 'New Description',
        notes: 'New Notes',
        date: '2025-05-03',
        images: [],
        tags: [],
      };

      // Create error mock
      const errorMock = createChainableMock();
      errorMock.select.mockReturnThis();
      errorMock.single.mockReturnThis();
      errorMock.mockReturnValue(null, new Error('Database error'));

      // Setup mock responses
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') {
          return {
            ...createChainableMock(),
            insert: jest.fn().mockReturnValue(errorMock),
          };
        } else if (table === 'images') {
          // For refreshSchemaCache
          return createChainableMock();
        }
        return createChainableMock();
      });

      // Call the function and expect error
      await expect(createPost(newPost)).rejects.toThrow('Database error');
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Create delete mock with successful response
      const deleteMock = createChainableMock();
      deleteMock.eq.mockReturnThis();
      deleteMock.mockReturnValue({ count: 1 }, null);

      // Setup mock responses
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') {
          return {
            ...createChainableMock(),
            delete: jest.fn().mockReturnValue(deleteMock),
          };
        }
        return createChainableMock();
      });

      // Call the function
      await deletePost('post-123');

      // Assertions
      expect(mockSupabase.from).toHaveBeenCalledWith('posts');
      expect(deleteMock.eq).toHaveBeenCalledWith('id', 'post-123');
    });

    it('should throw an error when post deletion fails', async () => {
      // Create delete mock with error response
      const deleteMock = createChainableMock();
      deleteMock.eq.mockReturnThis();
      deleteMock.mockReturnValue(null, new Error('Database error'));

      // Setup mock responses
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') {
          return {
            ...createChainableMock(),
            delete: jest.fn().mockReturnValue(deleteMock),
          };
        }
        return createChainableMock();
      });

      // Call the function and expect error
      await expect(deletePost('post-123')).rejects.toThrow('Database error');
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      // Setup mock data
      const updatedPost: Partial<Post> = {
        title: 'Updated Title',
        description: 'Updated Description',
        images: [
          {
            id: 'img-1',
            url: 'https://example.com/img1.jpg',
            alt: 'Image 1',
            width: 800,
            height: 600,
          },
        ],
        tags: ['tag1', 'tag2'],
      };

      const mockPostData = {
        id: 'post-123',
        title: 'Updated Title',
        description: 'Updated Description',
        notes: 'Original Notes',
        date: '2025-05-01',
        created_at: '2025-05-01T12:00:00Z',
        updated_at: '2025-05-03T12:00:00Z',
        images: [
          {
            id: 'img-1',
            url: 'https://example.com/img1.jpg',
            alt: 'Image 1',
            width: 800,
            height: 600,
          },
        ],
        tags: [{ name: 'tag1' }, { name: 'tag2' }],
      };

      const mockTags = [
        { id: 'tag-1', name: 'tag1' },
        { id: 'tag-2', name: 'tag2' },
      ];

      // Create update mock for posts table
      const postsUpdateMock = createChainableMock();
      postsUpdateMock.eq.mockReturnThis();
      postsUpdateMock.select.mockReturnThis();
      postsUpdateMock.single.mockReturnThis();
      postsUpdateMock.mockReturnValue(mockPostData, null);

      // Create mock for tags table - upsert
      const tagsUpsertMock = createChainableMock();
      tagsUpsertMock.onConflict.mockReturnThis();
      tagsUpsertMock.mockReturnValue(null, null);

      // Create mock for tags table - select
      const tagsSelectMock = createChainableMock();
      tagsSelectMock.select.mockReturnThis();
      tagsSelectMock.in.mockReturnThis();
      tagsSelectMock.mockReturnValue(mockTags, null);

      // Create mock for post_tags table - delete
      const postTagsDeleteMock = createChainableMock();
      postTagsDeleteMock.eq.mockReturnThis();
      postTagsDeleteMock.mockReturnValue(null, null);

      // Create mock for post_tags table - insert
      const postTagsInsertMock = createChainableMock();
      postTagsInsertMock.mockReturnValue(null, null);

      // Create mock for images table - delete
      const imagesDeleteMock = createChainableMock();
      imagesDeleteMock.eq.mockReturnThis();
      imagesDeleteMock.mockReturnValue(null, null);

      // Setup from() mock implementation
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') {
          return {
            ...createChainableMock(),
            update: jest.fn().mockReturnValue(postsUpdateMock),
            select: jest.fn().mockReturnThis(),
          };
        } else if (table === 'tags') {
          return {
            ...createChainableMock(),
            upsert: jest.fn().mockReturnValue(tagsUpsertMock),
            select: jest.fn().mockReturnValue(tagsSelectMock),
          };
        } else if (table === 'post_tags') {
          return {
            ...createChainableMock(),
            delete: jest.fn().mockReturnValue(postTagsDeleteMock),
            insert: jest.fn().mockReturnValue(postTagsInsertMock),
          };
        } else if (table === 'images') {
          return {
            ...createChainableMock(),
            delete: jest.fn().mockReturnValue(imagesDeleteMock),
            insert: jest.fn().mockReturnThis(),
          };
        }
        return createChainableMock();
      });

      // Mock RPC call for insert_images
      mockSupabase.rpc.mockReturnValue({
        data: [{ id: 'img-1' }],
        error: null,
      });

      // Call the function
      const result = await updatePost('post-123', updatedPost);

      // Assertions
      expect(result).toBeDefined();
      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated Description');
      expect(mockSupabase.from).toHaveBeenCalledWith('posts');
      expect(mockSupabase.from).toHaveBeenCalledWith('tags');
      expect(mockSupabase.from).toHaveBeenCalledWith('post_tags');
      expect(mockSupabase.from).toHaveBeenCalledWith('images');
      expect(postsUpdateMock.eq).toHaveBeenCalledWith('id', 'post-123');
    });

    it('should throw an error when post update fails', async () => {
      // Setup mock data
      const updatedPost: Partial<Post> = {
        title: 'Updated Title',
      };

      // Create error mock
      const errorMock = createChainableMock();
      errorMock.eq.mockReturnThis();
      errorMock.select.mockReturnThis();
      errorMock.single.mockReturnThis();
      errorMock.mockReturnValue(null, new Error('Database error'));

      // Setup mock responses
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'posts') {
          return {
            ...createChainableMock(),
            update: jest.fn().mockReturnValue(errorMock),
          };
        } else if (table === 'images') {
          // For refreshSchemaCache
          return createChainableMock();
        }
        return createChainableMock();
      });

      // Call the function and expect error
      await expect(updatePost('post-123', updatedPost)).rejects.toThrow('Database error');
    });
  });
});
