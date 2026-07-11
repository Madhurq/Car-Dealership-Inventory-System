import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

vi.mock('../api/axios', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}

describe('App', () => {
  it('renders navbar with AutoVault brand', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/AutoVault/i)).toBeInTheDocument();
  });

  it('renders login link when not authenticated', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('renders register link when not authenticated', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it('renders the home page by default', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/AutoVault/i)).toBeInTheDocument();
  });
});
