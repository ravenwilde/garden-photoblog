import { render, screen, act } from '@testing-library/react';
import EditPostForm from '../EditPostForm';

// Mock the getCsrfToken function
jest.mock('@/lib/csrf-client', () => ({
  getCsrfToken: jest.fn().mockResolvedValue('mock-csrf-token')
}));

function createFetchResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    // add other Response methods/properties as needed
  } as Response;
}

const mockPost = {
  id: '1',
  title: 'Test Post',
  description: 'Description',
  date: '2025-04-21',
  notes: '',
  tags: ['test'],
  images: [],
  created_at: '2025-04-21T00:00:00Z',
  updated_at: '2025-04-21T00:00:00Z'
};


beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn((url) => {
    if (url === '/api/tags') {
      return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
    }
    return Promise.resolve(createFetchResponse({}));
  });
});

describe('EditPostForm minimal', () => {
  it('renders EditPostForm and TagInput', async () => {
    await act(async () => {
      render(
        <EditPostForm
          post={mockPost}
          onClose={() => {}}
          onSuccess={() => {}}
        />
      );
    });
    
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
  });
});
