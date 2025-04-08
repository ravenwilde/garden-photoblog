import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { useAuth } from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn().mockReturnValue({
    isAdmin: false,
    loading: false,
    signOut: jest.fn(),
  }),
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog title', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: false,
      loading: false,
    });

    render(<Header />);
    expect(screen.getByText('8325.garden')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: false,
      loading: false,
    });

    render(<Header />);
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });

  it('renders loading state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: false,
      loading: true,
    });

    render(<Header />);
    expect(screen.getByText('8325.garden')).toBeInTheDocument();
    expect(screen.queryByLabelText(/toggle theme/i)).toBeInTheDocument();
  });

  it('returns null for admin state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: true,
      loading: false,
    });

    const { container } = render(<Header />);
    expect(container.firstChild).toBeNull();
  });
});
