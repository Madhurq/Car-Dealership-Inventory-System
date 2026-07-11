import { describe, it, expect, vi } from 'vitest';

vi.mock('axios', () => {
  const interceptors = { request: [], response: [] };
  const instance = {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: (success, error) => interceptors.request.push({ success, error }) },
      response: { use: (success, error) => interceptors.response.push({ success, error }) },
    },
  };
  return { default: { create: vi.fn(() => instance) } };
});

describe('axios module', () => {
  it('creates instance with /api baseURL', async () => {
    const axios = (await import('axios')).default;
    await import('../axios');
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: '/api' })
    );
  });

  it('exports a configured instance', async () => {
    const api = (await import('../axios')).default;
    expect(api).toBeDefined();
  });
});
