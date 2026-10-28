import { test, expect } from '@playwright/test';
import { AuthApi } from '../../src/api/authApi';
import { UserProfileApi } from '../../src/api/userProfileApi';

const credentials = {
  email: process.env.USER_EMAIL ?? 'user@example.com',
  password: process.env.USER_PASSWORD ?? 'default_password',
};

test.describe('PUT /api/user/{id}', () => {
  let accessToken = '';
  let userId = 0;

  test.beforeEach(async ({ request }) => {
    const authApi = new AuthApi(request);
    const login = await authApi.signIn(credentials);
    accessToken = login.accessToken;
    userId = login.id;
  });

  test('should update phone via PUT and verify via GET', async ({ request }) => {
    const userProfileApi = new UserProfileApi(request);
    const profile = await userProfileApi.getById(accessToken, userId);
    const originalPhone = profile.phone ?? '';
    const newPhone = `+38067${String(Date.now()).slice(-7)}`;

    const baseProfile = {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      roleName: profile.roleName,
      status: profile.status,
    };

    try {
      const updatedPhone = await userProfileApi.updateUserProfile(accessToken, userId, {
        ...baseProfile,
        phone: newPhone,
      });

      expect(updatedPhone).toBe(newPhone);

      const afterUpdate = await userProfileApi.getById(accessToken, userId);
      expect(afterUpdate.phone).toBe(newPhone);
    } finally {
      await userProfileApi.updateUserProfile(accessToken, userId, {
        ...baseProfile,
        phone: originalPhone,
      });
    }
  });
});
