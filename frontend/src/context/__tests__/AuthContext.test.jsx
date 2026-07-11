import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

vi.mock('../../api/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '../../api/axios';

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts with no user and loading true', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('loads user from localStorage on mount', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@test.com', role: 'ROLE_USER' }));
    localStorage.setItem('token', 'existing-token');

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toEqual({ email: 'test@test.com', role: 'ROLE_USER' });
    expect(result.current.isAdmin).toBe(false);
  });

  it('login stores token and user', async () => {
    api.post.mockResolvedValue({
      data: { token: 'jwt-123', email: 'a@b.com', role: 'ROLE_USER' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('a@b.com', 'pass');
    });

    expect(result.current.user).toEqual({ email: 'a@b.com', role: 'ROLE_USER' });
    expect(localStorage.getItem('token')).toBe('jwt-123');
  });

  it('register stores token and user', async () => {
    api.post.mockResolvedValue({
      data: { token: 'jwt-456', email: 'new@b.com', role: 'ROLE_USER' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register('new@b.com', 'pass123');
    });

    expect(result.current.user).toEqual({ email: 'new@b.com', role: 'ROLE_USER' });
    expect(localStorage.getItem('token')).toBe('jwt-456');
  });

  it('logout clears user and token', async () => {
    localStorage.setItem('user', JSON.stringify({ email: 'x@y.com', role: 'ROLE_USER' }));
    localStorage.setItem('token', 'tok');

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('isAdmin returns true for ROLE_ADMIN', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'a@b.com', role: 'ROLE_ADMIN' }));

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAdmin).toBe(true);
  });

  it('handles corrupt localStorage gracefully', () => {
    localStorage.setItem('user', 'not-json');

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });
});
