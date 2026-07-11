import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

  it('renders dashboard heading', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
  });

  it('renders add vehicle button', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByRole('button', { name: /Add Vehicle/i })).toBeInTheDocument();
  });

  it('shows vehicle form after clicking Add Vehicle', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: /Add Vehicle/i }));
    expect(await screen.findByLabelText(/Make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model/i)).toBeInTheDocument();
  });

  it('displays vehicles in the table', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      ],
    });
    renderPage();
    const table = await screen.findByRole('table');
    expect(within(table).getByText(/Toyota/)).toBeInTheDocument();
    expect(within(table).getByText(/Camry/)).toBeInTheDocument();
  });

  it('shows edit and delete buttons for each vehicle', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      ],
    });
    renderPage();
    const table = await screen.findByRole('table');
    expect(within(table).getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(within(table).getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('shows restock input for each vehicle', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      ],
    });
    renderPage();
    const table = await screen.findByRole('table');
    expect(within(table).getByRole('button', { name: /Restock/i })).toBeInTheDocument();
  });

  it('submits add vehicle form', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({
      data: { id: 2, make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 5 },
    });
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: /Add Vehicle/i }));
    await screen.findByLabelText(/Make/i);

    fireEvent.change(screen.getByLabelText(/Make/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'Civic' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Sedan' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '22000' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '5' } });

    const submitBtns = screen.getAllByRole('button', { name: /Add Vehicle/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

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
