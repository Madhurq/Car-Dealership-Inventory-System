import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';

vi.mock('../api/axios', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  it('renders landing page with AutoVault brand', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByRole('link', { name: /AutoVault/i })).toBeInTheDocument();
  });

  it('renders landing page hero heading', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByText(/Inventory Management/i)).toBeInTheDocument();
  });

  it('renders Get Started CTA on landing page', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByRole('link', { name: /^Get Started$/i })).toBeInTheDocument();
  });

  it('renders vehicles page at /vehicles', async () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@test.com', role: 'ROLE_USER' }));
    renderWithRouter(<App />, { route: '/vehicles' });
    expect(await screen.findByText(/Vehicle Inventory/i)).toBeInTheDocument();
  });
});
