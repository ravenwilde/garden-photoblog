import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { useAuth } from '@/lib/auth';

// Mock useAuth hook
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

describe('Navbar', () => {
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when user is not admin', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: false,
      loading: false,
      signOut: mockSignOut,
    });

    const { container } = render(<Navbar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render during loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: true,
      loading: true,
      signOut: mockSignOut,
    });

    const { container } = render(<Navbar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render for admin users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: true,
      loading: false,
      signOut: mockSignOut,
    });

    render(<Navbar />);
    expect(screen.getByText('8325.garden')).toBeInTheDocument();
    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('should handle sign out', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: true,
      loading: false,
      signOut: mockSignOut,
    });

    render(<Navbar />);
    const signOutButton = screen.getByText('Sign Out');
    
    await fireEvent.click(signOutButton);
    
    expect(mockSignOut).toHaveBeenCalled();
  });
});
