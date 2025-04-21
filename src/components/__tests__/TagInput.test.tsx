import { render, screen, waitFor } from '@testing-library/react';
import TagInput from '../TagInput';

function createFetchResponse(data: any) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    // add other Response methods/properties as needed
  } as Response;
}

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === '/api/tags') {
      return Promise.resolve(createFetchResponse([{ name: 'test' }, { name: 'garden' }]));
    }
    return Promise.resolve(createFetchResponse({}));
  });
});

describe('TagInput', () => {
  it('renders the tag input field', async () => {
    render(
      <TagInput
        value={[]}
        onChange={() => {}}
        label="Tags"
        placeholder="Add a tag"
      />
    );
    
    await waitFor(() => expect(screen.getByTestId('tag-input')).toBeInTheDocument());
  });
});
