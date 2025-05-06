import { createTag, getAllTags, updateTag, deleteTag } from '../tags';
import * as supabaseServer from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => {
  return {
    createClient: jest.fn(),
  };
});

// Helper function to create a detailed mock Supabase client
function createMockSupabaseClient() {
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockOrder = jest.fn();
  const mockEq = jest.fn();
  const mockNeq = jest.fn();
  const mockSingle = jest.fn();
  const mockUpsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  // Configure the mock methods to be chainable
  mockFrom.mockReturnValue({
    select: mockSelect,
    upsert: mockUpsert,
    update: mockUpdate,
    delete: mockDelete,
  });

  mockSelect.mockReturnValue({
    eq: mockEq,
    order: mockOrder,
  });

  mockEq.mockReturnValue({
    neq: mockNeq,
    single: mockSingle,
  });

  mockNeq.mockReturnValue({
    single: mockSingle,
  });

  const mockSupabase = {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
  };

  // Return the configured mock
  return mockSupabase;
}

describe('Tags Utilities', () => {
  // Increase the timeout for all tests in this describe block
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTag', () => {
    it('should create a new tag successfully', async () => {
      // Setup mock
      const mockTag = { id: 'tag-123', name: 'test-tag' };
      const mockSupabase = createMockSupabaseClient();
      const mockUpsert = jest.fn();
      const mockSelect = jest.fn();

      // Configure the mock chain
      mockUpsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        data: [mockTag],
        error: null,
      });

      // Configure the from method to return our mock chain for 'tags' table
      mockSupabase.from.mockImplementation(table => {
        if (table === 'tags') {
          return {
            upsert: mockUpsert,
          };
        }
        return {};
      });

      // Set the createClient mock to return our configured mockSupabase
      (supabaseServer.createClient as jest.Mock).mockReturnValue(mockSupabase);

      // Call the function
      const result = await createTag('test-tag');

      // Assertions
      expect(result).toEqual({
        id: 'tag-123',
        name: 'test-tag',
        post_count: 0,
      });
      expect(mockSupabase.from).toHaveBeenCalledWith('tags');
      expect(mockUpsert).toHaveBeenCalledWith([{ name: 'test-tag' }], expect.any(Object));
    });

    it('should throw an error when tag creation fails', async () => {
      // Setup mock
      const mockSupabase = createMockSupabaseClient();
      const mockUpsert = jest.fn();
      const mockSelect = jest.fn();

      // Configure the mock chain
      mockUpsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockImplementation(() => {
        throw new Error('Database error');
      });

      // Configure the from method to return our mock chain for 'tags' table
      mockSupabase.from.mockImplementation(table => {
        if (table === 'tags') {
          return {
            upsert: mockUpsert,
          };
        }
        return {};
      });

      // Set the createClient mock to return our configured mockSupabase
      (supabaseServer.createClient as jest.Mock).mockReturnValue(mockSupabase);

      // Call the function and expect error
      await expect(createTag('test-tag')).rejects.toThrow('Database error');
    });

    it('should throw an error when no tag is returned', async () => {
      // Setup mock
      const mockSupabase = createMockSupabaseClient();
      const mockUpsert = jest.fn();
      const mockSelect = jest.fn();

      // Configure the mock chain
      mockUpsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        data: [],
        error: null,
      });

      // Configure the from method to return our mock chain for 'tags' table
      mockSupabase.from.mockImplementation(table => {
        if (table === 'tags') {
          return {
            upsert: mockUpsert,
          };
        }
        return {};
      });

      // Set the createClient mock to return our configured mockSupabase
      (supabaseServer.createClient as jest.Mock).mockReturnValue(mockSupabase);

      // Call the function and expect error
      await expect(createTag('test-tag')).rejects.toThrow('Failed to create tag');
    });
  });

  describe('getAllTags', () => {
    it('should return all tags with post counts', async () => {
      // Setup mock
      const mockTags = [
        { id: 'tag-1', name: 'tag-1', post_tags: [{ post_id: 'post-1' }, { post_id: 'post-2' }] },
        { id: 'tag-2', name: 'tag-2', post_tags: [{ post_id: 'post-1' }] },
        { id: 'tag-3', name: 'tag-3', post_tags: [] },
      ];
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();

      // Mock the from function to return a specific implementation for 'tags' table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((_query: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                order: jest.fn().mockImplementation((_field: string, _options: unknown) => {
                  return {
                    data: mockTags,
                    error: null,
                  };
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function
      const result = await getAllTags();

      // Assertions
      expect(result).toEqual([
        { id: 'tag-1', name: 'tag-1', post_count: 2 },
        { id: 'tag-2', name: 'tag-2', post_count: 1 },
        { id: 'tag-3', name: 'tag-3', post_count: 0 },
      ]);
      expect(mockSupabase.from).toHaveBeenCalledWith('tags');
    });

    it('should return an empty array when no tags are found', async () => {
      // Setup mock
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();

      // Mock the from function to return a specific implementation for 'tags' table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((_query: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                order: jest.fn().mockImplementation((_field: string, _options: unknown) => {
                  return {
                    data: null,
                    error: null,
                  };
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function
      const result = await getAllTags();

      // Assertions
      expect(result).toEqual([]);
    });

    it('should throw an error when fetching tags fails', async () => {
      // Setup mock
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();

      // Mock the from function to return a specific implementation for 'tags' table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((_query: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                order: jest.fn().mockImplementation((_field: string, _options: unknown) => {
                  throw new Error('Database error');
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function and expect error
      await expect(getAllTags()).rejects.toThrow('Database error');
    });
  });

  describe('updateTag', () => {
    it('should update a tag successfully', async () => {
      // Setup mock
      const mockTag = { id: 'tag-123', name: 'new-name' };
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();

      // Mock the from function to return a specific implementation for 'tags' table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((fields: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                  return {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    neq: jest.fn().mockImplementation((_field: string, _value: string) => {
                      return {
                        single: jest.fn().mockReturnValue({
                          data: null,
                          error: null,
                        }),
                      };
                    }),
                  };
                }),
              };
            }),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            update: jest.fn().mockImplementation((data: unknown) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                  return {
                    select: jest.fn().mockReturnValue({
                      single: jest.fn().mockReturnValue({
                        data: mockTag,
                        error: null,
                      }),
                    }),
                  };
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function
      const result = await updateTag('tag-123', 'new-name');

      // Assertions
      expect(result).toEqual({
        id: 'tag-123',
        name: 'new-name',
        post_count: 0,
      });
    });

    it('should throw an error when a tag with the new name already exists', async () => {
      // Setup mock
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();

      // Mock the from function to return a specific implementation for 'tags' table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((fields: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                  return {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    neq: jest.fn().mockImplementation((_field: string, _value: string) => {
                      return {
                        single: jest.fn().mockReturnValue({
                          data: { id: 'existing-tag' },
                          error: null,
                        }),
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function and expect error
      await expect(updateTag('tag-123', 'new-name')).rejects.toThrow(
        'A tag with this name already exists'
      );
    });

    it('should throw an error when tag update fails', async () => {
      // Setup mock
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();

      // Mock the from function to return a specific implementation for 'tags' table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((fields: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                  return {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    neq: jest.fn().mockImplementation((_field: string, _value: string) => {
                      return {
                        single: jest.fn().mockReturnValue({
                          data: null,
                          error: null,
                        }),
                      };
                    }),
                  };
                }),
              };
            }),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            update: jest.fn().mockImplementation((data: unknown) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                  return {
                    select: jest.fn().mockReturnValue({
                      single: jest.fn().mockReturnValue({
                        data: null,
                        error: new Error('Database error'),
                      }),
                    }),
                  };
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function and expect error
      await expect(updateTag('tag-123', 'new-name')).rejects.toThrow('Database error');
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag successfully', async () => {
      // Setup mock
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();
      let callCount = 0;

      // Mock the from function to return different implementations based on the table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          // First call is for getting the tag name
          // Second call is for deleting the tag
          if (callCount === 0) {
            callCount++;
            return {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              select: jest.fn().mockImplementation((fields: string) => {
                return {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                    return {
                      single: jest.fn().mockReturnValue({
                        data: { name: 'test-tag' },
                        error: null,
                      }),
                    };
                  }),
                };
              }),
            };
          } else {
            return {
              delete: jest.fn().mockImplementation(() => {
                return {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                    return {
                      data: null,
                      error: null,
                    };
                  }),
                };
              }),
            };
          }
        } else if (table === 'post_tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((fields: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                  return {
                    data: [],
                    error: null,
                  };
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function
      await deleteTag('tag-123');

      // Assertions
      expect(mockSupabase.from).toHaveBeenCalledWith('tags');
      expect(mockSupabase.from).toHaveBeenCalledWith('post_tags');
    });

    it('should throw an error when tag deletion fails', async () => {
      // Setup mock
      const mockSupabase = (supabaseServer.createClient as jest.Mock)();
      let callCount = 0;

      // Mock the from function to return different implementations based on the table
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'tags') {
          // First call is for getting the tag name
          // Second call is for deleting the tag
          if (callCount === 0) {
            callCount++;
            return {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              select: jest.fn().mockImplementation((fields: string) => {
                return {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                    return {
                      single: jest.fn().mockReturnValue({
                        data: { name: 'test-tag' },
                        error: null,
                      }),
                    };
                  }),
                };
              }),
            };
          } else {
            return {
              delete: jest.fn().mockImplementation(() => {
                return {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                    return {
                      data: null,
                      error: new Error('Database error'),
                    };
                  }),
                };
              }),
            };
          }
        } else if (table === 'post_tags') {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select: jest.fn().mockImplementation((fields: string) => {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                eq: jest.fn().mockImplementation((_field: string, _value: string) => {
                  return {
                    data: [],
                    error: null,
                  };
                }),
              };
            }),
          };
        }
        return {};
      });

      // Call the function and expect error
      await expect(deleteTag('tag-123')).rejects.toThrow('Database error');
    });
  });
});
