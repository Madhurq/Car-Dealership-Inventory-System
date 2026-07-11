import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../LoginPage';

vi.mock('../../api/axios', () => ({
  default: { post: vi.fn() },
}));

import api from '../../api/axios';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders heading and form fields', () => {
    renderPage();
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('renders link to register page', () => {
    renderPage();
    expect(screen.getByText(/Create one/i)).toHaveAttribute('href', '/register');
  });

  it('calls login API on valid submit', async () => {
    api.post.mockResolvedValue({
      data: { token: 'jwt', email: 'test@test.com', role: 'ROLE_USER' },
    });
    renderPage();

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });

  it('does not navigate on API failure', async () => {
    api.post.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });
    renderPage();

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
    // Button should re-enable after failed login
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign In/i })).not.toBeDisabled();
    });
  });
});
