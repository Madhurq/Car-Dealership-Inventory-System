import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import RegisterPage from '../RegisterPage';

vi.mock('../../api/axios', () => ({
  default: { post: vi.fn() },
}));

import api from '../../api/axios';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders heading and form fields', async () => {
    renderPage();
    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderPage();
    expect(screen.getByText(/Sign in/i)).toHaveAttribute('href', '/login');
  });

  it('calls register API on valid submit', async () => {
    api.post.mockResolvedValue({
      data: { token: 'jwt', email: 'new@user.com', role: 'ROLE_USER' },
    });
    renderPage();

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@user.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create account/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'new@user.com',
        password: 'password123',
      });
    });
  });

  it('shows error on API failure', async () => {
    api.post.mockRejectedValue({
      response: { data: { error: 'Email already registered' } },
    });
    renderPage();

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'dup@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
    });
  });
});
