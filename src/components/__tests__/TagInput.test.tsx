import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagInput from '../TagInput';

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

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn((url) => {
    if (url === '/api/tags') {
      return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
    }
    return Promise.resolve(createFetchResponse({}));
  });
});

describe('TagInput', () => {
  it('renders the tag input field', async () => {
    await act(async () => {
      render(
        <TagInput
          value={[]}
          onChange={() => {}}
          label="Tags"
          placeholder="Add a tag"
        />
      );
    });
    
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
    expect(screen.getByLabelText('Add tag')).toBeInTheDocument(); // Check for Add button
  });

  it('adds a tag when clicking the Add button', async () => {
    const mockOnChange = jest.fn();
    await act(async () => {
      render(
        <TagInput
          value={[]}
          onChange={mockOnChange}
          label="Tags"
        />
      );
    });

    // Type in the input
    const input = screen.getByTestId('tag-input');
    await act(async () => {
      await userEvent.type(input, 'newtag');
    });
    
    // Click the Add button
    const addButton = screen.getByLabelText('Add tag');
    await act(async () => {
      fireEvent.click(addButton);
    });
    
    // Check if onChange was called with the new tag
    expect(mockOnChange).toHaveBeenCalledWith(['newtag']);
  });

  it('adds a tag when pressing Enter', async () => {
    const mockOnChange = jest.fn();
    await act(async () => {
      render(
        <TagInput
          value={[]}
          onChange={mockOnChange}
        />
      );
    });

    // Type in the input and press Enter
    const input = screen.getByTestId('tag-input');
    await act(async () => {
      await userEvent.type(input, 'newtag');
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    
    // Check if onChange was called with the new tag
    expect(mockOnChange).toHaveBeenCalledWith(['newtag']);
  });

  it('removes a tag when clicking the remove button', async () => {
    const mockOnChange = jest.fn();
    await act(async () => {
      render(
        <TagInput
          value={['existing']}
          onChange={mockOnChange}
        />
      );
    });

    // Find and click the remove button
    const removeButton = screen.getByLabelText('Remove tag existing');
    await act(async () => {
      fireEvent.click(removeButton);
    });
    
    // Check if onChange was called with an empty array
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('shows suggestions when typing', async () => {
    await act(async () => {
      render(
        <TagInput
          value={[]}
          onChange={() => {}}
        />
      );
    });

    // Type in the input to trigger suggestions
    const input = screen.getByTestId('tag-input');
    await act(async () => {
      await userEvent.type(input, 't');
      // Force show suggestions since we're in a test environment
      fireEvent.focus(input);
    });
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('adds a tag when clicking a suggestion', async () => {
    const mockOnChange = jest.fn();
    await act(async () => {
      render(
        <TagInput
          value={[]}
          onChange={mockOnChange}
        />
      );
    });

    // Type to show suggestions
    const input = screen.getByTestId('tag-input');
    await act(async () => {
      await userEvent.type(input, 't');
      // Force show suggestions since we're in a test environment
      fireEvent.focus(input);
    });
    
    // Wait for suggestions and click on one
    await waitFor(async () => {
      const suggestion = screen.getByText('test');
      await act(async () => {
        fireEvent.mouseDown(suggestion);
      });
    }, { timeout: 1000 });
    
    // Check if onChange was called with the selected tag
    expect(mockOnChange).toHaveBeenCalledWith(['test']);
  });

  it('does not show the Add button when showAddButton is false', async () => {
    await act(async () => {
      render(
        <TagInput
          value={[]}
          onChange={() => {}}
          showAddButton={false}
        />
      );
    });
    
    // Check that the Add button is not rendered
    expect(screen.queryByLabelText('Add tag')).not.toBeInTheDocument();
  });

  it('shows loading state while fetching tags', async () => {
    // Delay the fetch response to test loading state
    global.fetch = jest.fn().mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(createFetchResponse([{ name: 'test' }]));
        }, 100);
      });
    });

    await act(async () => {
      render(
        <TagInput
          value={[]}
          onChange={() => {}}
        />
      );
    });

    // Loading spinner should be visible initially
    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });
});
