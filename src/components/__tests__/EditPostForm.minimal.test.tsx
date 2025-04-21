import { render, screen, waitFor } from '@testing-library/react';
import EditPostForm from '../EditPostForm';

function createFetchResponse(data: any) {
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
  global.fetch = jest.fn((url) => {
    if (url === '/api/tags') {
      return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
    }
    return Promise.resolve(createFetchResponse({}));
  });
});

describe('EditPostForm minimal', () => {
  it('renders EditPostForm and TagInput', async () => {
    render(
      <EditPostForm
        post={mockPost}
        onClose={() => {}}
        onSuccess={() => {}}
      />
    );
    
    await waitFor(() => expect(screen.getByTestId('tag-input')).toBeInTheDocument());
  });
});
