import { render, screen, fireEvent } from '@testing-library/react';
import ImageThumbnail from '../ImageThumbnail';

// Define the props type for the Image component
type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  width?: number;
  height?: number;
  unoptimized?: boolean;
};

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={props.src}
        alt={props.alt}
        className={props.className}
        data-testid="next-image"
        onError={props.onError}
      />
    );
  },
}));

describe('ImageThumbnail', () => {
  const mockImage = {
    id: '123',
    url: 'https://example.com/test.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
  };

  it('renders the image with correct props', () => {
    render(<ImageThumbnail image={mockImage} />);

    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockImage.url);
    expect(image).toHaveAttribute('alt', mockImage.alt);
    expect(image).toHaveAttribute('class', expect.stringContaining('object-cover'));
  });

  it('renders with custom className', () => {
    const customClass = 'custom-class';
    render(<ImageThumbnail image={mockImage} className={customClass} />);

    const container = screen.getByTestId('next-image').parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('uses default alt text if none provided', () => {
    const imageWithoutAlt = { ...mockImage, alt: undefined };
    render(<ImageThumbnail image={imageWithoutAlt} />);

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('alt', 'Garden photo');
  });

  it('displays fallback UI when image fails to load', () => {
    render(<ImageThumbnail image={mockImage} />);

    // Get the image and simulate an error
    const image = screen.getByTestId('next-image');
    fireEvent.error(image);

    // Check that the fallback UI is displayed
    const fallbackText = screen.getByText('Image unavailable');
    expect(fallbackText).toBeInTheDocument();
    expect(image).not.toBeInTheDocument();
  });
});
