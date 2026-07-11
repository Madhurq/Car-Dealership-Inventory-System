import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import HomePage from '../HomePage';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import api from '../../api/axios';

function renderPage(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the page heading', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByText(/Vehicle Inventory/i)).toBeInTheDocument();
  });

  it('renders search bar', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByPlaceholderText(/Make/i)).toBeInTheDocument();
  });

  it('displays vehicles from API', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
        { id: 2, make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 5 },
      ],
    });
    renderPage();
    expect(await screen.findByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Honda')).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('$22,000')).toBeInTheDocument();
  });

  it('shows out of stock badge', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Ford', model: 'Mustang', category: 'Sports', price: 35000, quantity: 0 },
      ],
    });
    renderPage();
    expect(await screen.findByText(/Out of Stock/i)).toBeInTheDocument();
  });

  it('disables purchase button when out of stock', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Ford', model: 'Mustang', category: 'Sports', price: 35000, quantity: 0 },
      ],
    });
    renderPage();
    const btn = await screen.findByRole('button', { name: /Unavailable/i });
    expect(btn).toBeDisabled();
  });

  it('shows loading spinner initially', () => {
    api.get.mockReturnValue(new Promise(() => {})); // never resolves
    renderPage();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty state when no vehicles', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByText(/No vehicles found/i)).toBeInTheDocument();
  });
});
