import { type Page } from '@playwright/test';

export class ProfilePage {
  constructor(private readonly page: Page) {
    void this.page;
  }

  async open(_userId: number): Promise<void> {
    await this.page.goto(`/user/${_userId}/page`);
  }

  async getPhoneValue(): Promise<string> {
    return this.page.locator('.user-phone-data').innerText();
  }
}
