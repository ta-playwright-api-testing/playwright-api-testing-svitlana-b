import { test, expect } from '@playwright/test';
import { AuthApi } from '../../src/api/authApi';

const credentials = {
  email: process.env.USER_EMAIL ?? 'user@example.com',
  password: process.env.USER_PASSWORD ?? 'default_password',
};

test.describe('POST /api/signin', () => {
  test('should sign in and return accessToken', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.signInRaw(credentials);

    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.id).toEqual(expect.any(Number));
    expect(body.email).toBe(credentials.email);
  });

  test('should reject invalid password', async ({ request }) => {
    const authApi = new AuthApi(request);

    const response = await authApi.signInRaw({ ...credentials, password: 'invalid_password' });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
