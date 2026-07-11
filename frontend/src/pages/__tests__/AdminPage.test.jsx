import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AdminPage from '../AdminPage';

vi.mock('../../api/axios', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import api from '../../api/axios';

const mockAdmin = JSON.stringify({ email: 'admin@test.com', role: 'ROLE_ADMIN' });

function renderPage() {
  localStorage.setItem('user', mockAdmin);
  localStorage.setItem('token', 'admin-token');
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <AdminPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('AdminPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders admin heading', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByText(/Admin Panel/i)).toBeInTheDocument();
  });

  it('renders add vehicle form', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByText(/Add Vehicle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model/i)).toBeInTheDocument();
  });

  it('displays vehicles in the list', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      ],
    });
    renderPage();
    expect(await screen.findByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
  });

  it('shows edit and delete buttons for each vehicle', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      ],
    });
    renderPage();
    await screen.findByText('Toyota');
    expect(screen.getByText(/Edit/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });

  it('shows restock input for each vehicle', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      ],
    });
    renderPage();
    await screen.findByText('Toyota');
    expect(screen.getByText(/Restock/i)).toBeInTheDocument();
  });

  it('submits add vehicle form', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({
      data: { id: 2, make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 5 },
    });
    renderPage();
    await screen.findByText(/Add Vehicle/i);

    const { fireEvent: fe } = await import('@testing-library/react');
    fe.change(screen.getByLabelText(/Make/i), { target: { value: 'Honda' } });
    fe.change(screen.getByLabelText(/Model/i), { target: { value: 'Civic' } });
    fe.change(screen.getByLabelText(/Category/i), { target: { value: 'Sedan' } });
    fe.change(screen.getByLabelText(/Price/i), { target: { value: '22000' } });
    fe.change(screen.getByLabelText(/Quantity/i), { target: { value: '5' } });
    fe.click(screen.getByRole('button', { name: /Add Vehicle/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles', {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 5,
      });
    });
  });
});
