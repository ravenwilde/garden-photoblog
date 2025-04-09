import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock modules before imports
jest.mock('@/lib/csrf-client', () => ({
  getCsrfToken: jest.fn().mockResolvedValue('mock-csrf-token')
}));

import ImageUpload from '../ImageUpload';

describe('ImageUpload', () => {
  const mockOnImagesUploaded = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Mock fetch for image upload
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 'test-id',
        url: 'https://example.com/test.png',
        alt: 'test.png'
      })
    });
    
    // Mock URL.createObjectURL
    Object.defineProperty(global, 'URL', {
      value: {
        createObjectURL: jest.fn(() => 'mock-url'),
        revokeObjectURL: jest.fn(),
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('renders upload area', () => {
    render(<ImageUpload onImagesUploaded={mockOnImagesUploaded} />);
    
    expect(screen.getByText(/drag and drop your images here/i)).toBeInTheDocument();
    expect(screen.getByText(/browse/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum file size: 10mb/i)).toBeInTheDocument();
  });

  it('handles file selection through browse button', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    render(<ImageUpload onImagesUploaded={mockOnImagesUploaded} />);
    
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(input, file);
    
    expect(input.files?.[0]).toBe(file);
  });

  it('handles drag and drop', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    render(<ImageUpload onImagesUploaded={mockOnImagesUploaded} />);
    
    const dropzone = screen.getByTestId('dropzone');
    
    // Simulate drag events
    fireEvent.dragEnter(dropzone, {
      dataTransfer: {
        files: [file],
        types: ['Files']
      }
    });
    
    fireEvent.dragOver(dropzone, {
      dataTransfer: {
        files: [file],
        types: ['Files']
      }
    });
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
        types: ['Files']
      }
    });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        headers: {
          'x-csrf-token': 'mock-csrf-token'
        },
        body: expect.any(FormData)
      });
      expect(mockOnImagesUploaded).toHaveBeenCalledWith([{
        id: 'test-id',
        url: 'https://example.com/test.png',
        alt: 'test.png'
      }]);
    }, { timeout: 1000 });
  });

  it('validates file type', async () => {
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    render(<ImageUpload onImagesUploaded={mockOnImagesUploaded} />);
    
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [invalidFile] } });
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid file type:', 'text/plain');
      expect(global.fetch).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('validates file size', async () => {
    // Create a file larger than 10MB
    const tenMBInBytes = 10 * 1024 * 1024;
    const largeFile = new File(['x'.repeat(tenMBInBytes + 1)], 'large.png', { type: 'image/png' });
    
    render(<ImageUpload onImagesUploaded={mockOnImagesUploaded} />);
    
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [largeFile] } });
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('File too large:', largeFile.size);
      expect(global.fetch).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });
});
