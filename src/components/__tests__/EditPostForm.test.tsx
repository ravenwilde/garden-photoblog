import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function createFetchResponse(data: any) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    // add other Response methods/properties as needed
  } as Response;
}

// Mock modules before imports
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock('@/lib/csrf-client', () => ({
  getCsrfToken: jest.fn().mockResolvedValue('mock-csrf-token')
}));

// Import after mocks
import EditPostForm from '../EditPostForm';

// Mock fetch
global.fetch = jest.fn();

// Mock window.alert to avoid not implemented error
beforeAll(() => {
  window.alert = jest.fn();
});

describe('EditPostForm', () => {
  const mockPost = {
    id: '123',
    title: 'Test Post',
    description: 'Test Description',
    date: '2025-04-08',
    notes: 'Test Notes',
    tags: ['test', 'garden'],
    images: [],
    created_at: '2025-04-08T00:00:00Z',
    updated_at: '2025-04-08T00:00:00Z'
  };

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url === '/api/tags') {
        return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
      }
      return Promise.resolve(createFetchResponse({}));
    });
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    // Default fetch mock for /api/tags
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/tags')) {
        return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
      }
      // fallback for other fetches
      return Promise.resolve(createFetchResponse({}));
    });
  });

  it('renders form with post data', () => {
    const mockProps = {
      post: mockPost,
      onClose: jest.fn(),
      onSuccess: jest.fn(),
    };
    render(<EditPostForm {...mockProps} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue(mockPost.title);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockPost.description);
    expect(screen.getByLabelText(/date/i)).toHaveValue(mockPost.date);
    expect(screen.getByLabelText(/notes/i)).toHaveValue(mockPost.notes);
    mockPost.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('handles tag input', async () => {
    const mockProps = {
      post: mockPost,
      onClose: jest.fn(),
      onSuccess: jest.fn(),
    };
    render(<EditPostForm {...mockProps} />);
    const tagInput = await screen.findByPlaceholderText(/add a tag/i);

    // Add tag with Enter key
    await userEvent.type(tagInput, 'newtag{enter}');
    expect(screen.getByText('newtag')).toBeInTheDocument();

    // Add tag with comma
    await userEvent.type(tagInput, 'another,');
    expect(screen.getByText('another')).toBeInTheDocument();

    // Remove tag
    const removeButton = screen.getAllByRole('button', { name: /remove tag/i })[2];
    await act(async () => {
      fireEvent.click(removeButton);
    });

    // Wait for tag to be removed
    await waitFor(() => {
      expect(screen.queryByText('newtag')).not.toBeInTheDocument();
    });
  });

  it('submits form with updated data', async () => {
    const mockProps = {
      post: mockPost,
      onClose: jest.fn(),
      onSuccess: jest.fn(),
    };

    // Mock fetch for post update
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    render(<EditPostForm {...mockProps} />);

    // Update form fields
    await userEvent.clear(screen.getByLabelText(/title/i));
    await userEvent.type(screen.getByLabelText(/title/i), 'Updated Title');
    
    await userEvent.clear(screen.getByLabelText(/description/i));
    await userEvent.type(screen.getByLabelText(/description/i), 'Updated Description');

    // Submit form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      // Should be called with the CSRF token from the mock
      expect(global.fetch).toHaveBeenCalledWith('/api/posts/123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'mock-csrf-token'
        },
        body: JSON.stringify({
          title: 'Updated Title',
          description: 'Updated Description',
          date: mockPost.date,
          notes: mockPost.notes,
          tags: mockPost.tags,
        }),
      });
      expect(mockProps.onSuccess).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('handles form submission error', async () => {
    const mockProps = {
      post: mockPost,
      onClose: jest.fn(),
      onSuccess: jest.fn(),
    };
    const errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Robust fetch mock: return tags for /api/tags, error for PUT
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (typeof url === 'string' && url.includes('/api/tags')) {
        return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
      }
      if (
        typeof url === 'string' &&
        url.includes('/api/posts/') &&
        options &&
        options.method === 'PUT'
      ) {
        return Promise.reject(new Error('Network error'));
      }
      // Default: return a generic successful fetch for any other request
      return Promise.resolve(createFetchResponse({}));
    });

    render(<EditPostForm {...mockProps} />);

await waitFor(() => expect(screen.getByTestId('tag-input')).toBeInTheDocument());

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(errorMock).toHaveBeenCalled();
    });

    errorMock.mockRestore();
  });

  it('handles form submission error with alert', async () => {
    const mockProps = {
      post: mockPost,
      onClose: jest.fn(),
      onSuccess: jest.fn(),
    };
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // Robust fetch mock: return tags for /api/tags, error for PUT
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (typeof url === 'string' && url.includes('/api/tags')) {
        return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
      }
      if (
        typeof url === 'string' &&
        url.includes('/api/posts/') &&
        options &&
        options.method === 'PUT'
      ) {
        return Promise.reject(new Error('Network error'));
      }
      // Default: return a generic successful fetch for any other request
      return Promise.resolve(createFetchResponse({}));
    });

    render(<EditPostForm {...mockProps} />);

await waitFor(() => expect(screen.getByTestId('tag-input')).toBeInTheDocument());

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Failed to update post');
      expect(mockProps.onSuccess).not.toHaveBeenCalled();
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
    alertMock.mockRestore();
  });
});
