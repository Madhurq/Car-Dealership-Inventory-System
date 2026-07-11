import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from '../Navbar';

vi.mock('../../api/axios', () => ({
  default: { post: vi.fn() },
}));

function renderNav({ user } = {}) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.clear();
  }
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders brand name', () => {
    renderNav();
    expect(screen.getByText('AutoVault')).toBeInTheDocument();
  });

  it('shows login and register links when logged out', () => {
    renderNav();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it('hides login/register when logged in', () => {
    renderNav({ user: { email: 'user@test.com', role: 'ROLE_USER' } });
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
  });

  it('shows user email when logged in', () => {
    renderNav({ user: { email: 'user@test.com', role: 'ROLE_USER' } });
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
  });

  it('shows admin link for admin users', () => {
    renderNav({ user: { email: 'admin@test.com', role: 'ROLE_ADMIN' } });
    const link = screen.getByText(/^Admin$/, { selector: 'a' });
    expect(link).toHaveAttribute('href', '/admin');
  });

  it('hides admin link for regular users', () => {
    renderNav({ user: { email: 'user@test.com', role: 'ROLE_USER' } });
    expect(screen.queryByText(/^Admin$/, { selector: 'a' })).not.toBeInTheDocument();
  });

  it('shows logout button when logged in', () => {
    renderNav({ user: { email: 'user@test.com', role: 'ROLE_USER' } });
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
