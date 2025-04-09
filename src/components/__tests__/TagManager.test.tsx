import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock modules before imports
jest.mock('@/lib/csrf-client', () => ({
  getCsrfToken: jest.fn().mockResolvedValue('mock-csrf-token')
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

import TagManager from '../TagManager';

// Mock initial fetch response
const mockTags = [
  { id: '1', name: 'flowers', post_count: 0 },
  { id: '2', name: 'vegetables', post_count: 1 }
];

beforeEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockImplementation((url) => {
    if (url === '/api/tags') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTags)
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    });
  });
});

// Mock fetch
global.fetch = jest.fn();

describe('TagManager', () => {


  it('renders tag list and form', async () => {
    await act(async () => {
      render(<TagManager />);
    });

    // Wait for tags to load
    await waitFor(() => {
      expect(screen.getByText('flowers')).toBeInTheDocument();
      expect(screen.getByText('vegetables')).toBeInTheDocument();
    });

    // Check tag input form
    expect(screen.getByPlaceholderText(/new tag/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add tag/i })).toBeInTheDocument();
  });

  it('adds a new tag', async () => {
    const newTag = { id: '3', name: 'herbs' };
    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      if (url === '/api/tags' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(newTag)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTags)
      });
    });

    await act(async () => {
      render(<TagManager />);
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('flowers')).toBeInTheDocument();
    });

    // Add new tag
    const input = screen.getByPlaceholderText(/new tag/i);
    await userEvent.type(input, 'herbs');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add tag/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'mock-csrf-token'
        },
        body: JSON.stringify({ name: 'herbs' }),
        credentials: 'include',
      });
    }, { timeout: 1000 });
  });

  it('updates a tag', async () => {
    const updatedTag = { id: '1', name: 'spring-flowers' };
    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      if (url === '/api/tags/1' && options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(updatedTag)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTags)
      });
    });

    await act(async () => {
      render(<TagManager />);
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('flowers')).toBeInTheDocument();
    });

    // Start editing
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    });

    // Update tag name
    const input = screen.getByDisplayValue('flowers');
    await userEvent.clear(input);
    await userEvent.type(input, 'spring-flowers');
    
    // Save changes
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tags/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'mock-csrf-token'
        },
        body: JSON.stringify({ name: 'spring-flowers' }),
        credentials: 'include',
      });
    }, { timeout: 1000 });
  });

  it('deletes a tag', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      if (url === '/api/tags/1' && options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTags)
      });
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    
    await act(async () => {
      render(<TagManager />);
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('flowers')).toBeInTheDocument();
    });

    // Delete tag
    const deleteButton = screen.getByRole('button', { name: 'Delete tag' });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tags/1', {
        method: 'DELETE',
        headers: {
          'x-csrf-token': 'mock-csrf-token'
        },
        credentials: 'include'
      });
    }, { timeout: 1000 });

    confirmSpy.mockRestore();
  });

  it('handles error responses', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock successful initial fetch
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTags)
      })
    );

    // Mock failed tag creation
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('Failed to create tag'))
      })
    );

    await act(async () => {
      render(<TagManager />);
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('flowers')).toBeInTheDocument();
    });

    // Try to add new tag
    const input = screen.getByPlaceholderText(/new tag/i);
    await userEvent.type(input, 'herbs');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add tag/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to create tag')).toBeInTheDocument();
    }, { timeout: 1000 });

    consoleSpy.mockRestore();
  });
});
