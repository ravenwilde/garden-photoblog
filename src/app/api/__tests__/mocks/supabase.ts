import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

// Create a mock Supabase client with all the methods we use
export const mockSupabaseClient = {
  // Auth methods
  auth: {
    getSession: jest.fn(),
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
  },
  
  // Database methods
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    then: jest.fn(),
    data: null,
    error: null,
  }),
  
  // Storage methods
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
      remove: jest.fn(),
    }),
  },
  
  // RPC methods
  rpc: jest.fn().mockReturnValue({
    data: null,
    error: null,
  }),
};

/**
 * Configure mock responses for Supabase queries
 * @param responses The mock responses to configure
 */
export function setupSupabaseMocks(responses: {
  auth?: {
    getSession?: any;
    getUser?: any;
  };
  data?: {
    [table: string]: any[];
  };
  errors?: {
    [operation: string]: any;
  };
}) {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Configure auth responses
  if (responses.auth) {
    if (responses.auth.getSession) {
      mockSupabaseClient.auth.getSession.mockResolvedValue(responses.auth.getSession);
    }
    if (responses.auth.getUser) {
      mockSupabaseClient.auth.getUser.mockResolvedValue(responses.auth.getUser);
    }
  }
  
  // Configure data responses
  if (responses.data) {
    Object.entries(responses.data).forEach(([table, data]) => {
      const mockFrom = mockSupabaseClient.from as jest.Mock;
      
      // Configure the from(table).select() chain
      mockFrom.mockImplementation((tableName: string) => {
        if (tableName === table) {
          return {
            select: jest.fn().mockReturnValue({
              data,
              error: null,
              then: jest.fn().mockImplementation((callback) => Promise.resolve(callback({ data, error: null }))),
            }),
            insert: jest.fn().mockReturnValue({
              data: { ...data[0], id: 'new-id' },
              error: responses.errors?.insert || null,
              then: jest.fn().mockImplementation((callback) => 
                Promise.resolve(callback({ 
                  data: { ...data[0], id: 'new-id' }, 
                  error: responses.errors?.insert || null 
                }))
              ),
            }),
            update: jest.fn().mockReturnValue({
              data: data[0],
              error: responses.errors?.update || null,
              then: jest.fn().mockImplementation((callback) => 
                Promise.resolve(callback({ 
                  data: data[0], 
                  error: responses.errors?.update || null 
                }))
              ),
            }),
            delete: jest.fn().mockReturnValue({
              data: {},
              error: responses.errors?.delete || null,
              then: jest.fn().mockImplementation((callback) => 
                Promise.resolve(callback({ 
                  data: {}, 
                  error: responses.errors?.delete || null 
                }))
              ),
            }),
            eq: jest.fn().mockReturnThis(),
            match: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnValue({
              data: data[0] || null,
              error: null,
              then: jest.fn().mockImplementation((callback) => 
                Promise.resolve(callback({ 
                  data: data[0] || null, 
                  error: null 
                }))
              ),
            }),
          };
        }
        
        // Default mock for other tables
        return {
          select: jest.fn().mockReturnValue({
            data: [],
            error: null,
            then: jest.fn().mockImplementation((callback) => Promise.resolve(callback({ data: [], error: null }))),
          }),
        };
      });
    });
  }
}
