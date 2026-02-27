import { Page, Locator, expect } from '@playwright/test';

export class NavigationComponent {
  private page: Page;
  private navLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLinks = page.locator('header a');
  }

  async verifyNavigationVisible() {
    await expect(this.page.locator('header')).toBeVisible();
  }

  async getNavTexts(): Promise<string[]> {
    const texts = await this.navLinks.allTextContents();
    return texts
      .map(t => t.trim().replace('🔥', ''))
      .filter(t => ['Explore', 'Features', 'Company', '$MBG'].includes(t));
  }

  async clickNavItemByText(text: string) {
    const link = this.page.locator('header a', { hasText: text });

    await expect(link).toBeVisible();

    if (text === '$MBG') {
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        link.click(),
      ]);

      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL(/token\.multibankgroup\.com/);
      await newPage.close();
    } else {
      await Promise.all([
        this.page.waitForNavigation(),
        link.click(),
      ]);

      await expect(this.page).not.toHaveURL(/\/en-AE$/);
    }
  }
}