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
  it('renders navbar with AutoVault brand', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByText(/AutoVault/i)).toBeInTheDocument();
  });

  it('renders login link when not authenticated', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByText(/Login/i)).toBeInTheDocument();
  });

  it('renders register link when not authenticated', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByText(/Register/i)).toBeInTheDocument();
  });

  it('renders the home page by default', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByText(/Vehicle Inventory/i)).toBeInTheDocument();
  });
});
