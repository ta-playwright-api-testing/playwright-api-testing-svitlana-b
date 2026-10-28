import { request as apiRequest, test, expect } from '@playwright/test';
import { AuthApi } from '../../src/api/authApi';
import { UserProfileApi } from '../../src/api/userProfileApi';
import { ProfilePage } from '../../src/pages/profilePage';

const credentials = {
  email: process.env.USER_EMAIL ?? 'user@example.com',
  password: process.env.USER_PASSWORD ?? 'default_password',
};

test.describe('API + UI: update phone and verify in browser', () => {
  test('should show API-updated phone on the profile page', async ({ page }) => {
    const api = await apiRequest.newContext({
      baseURL: process.env.BASE_URL ?? 'http://localhost:8080',
    });
    const authApi = new AuthApi(api);
    const userProfileApi = new UserProfileApi(api);
    const profilePage = new ProfilePage(page);

    const login = await authApi.signIn(credentials);
    const profile = await userProfileApi.getById(login.accessToken, login.id);
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
      const updatedPhone = await userProfileApi.updateUserProfile(login.accessToken, login.id, {
        ...baseProfile,
        phone: newPhone,
      });

      await page.addInitScript(
        ({ accessToken, id, role }) => {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('id', id);
          localStorage.setItem('role', role);
        },
        { accessToken: login.accessToken, id: String(login.id), role: login.roleName },
      );

      await profilePage.open(login.id);
      expect((await profilePage.getPhoneValue()).trim()).toBe(updatedPhone);
    } finally {
      await userProfileApi.updateUserProfile(login.accessToken, login.id, {
        ...baseProfile,
        phone: originalPhone,
      });
      await api.dispose();
    }
  });
});
