import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(public page: Page) {}

  async open() {
    await this.page.goto('https://mb.io/en-AE');
    // Switched from 'networkidle' to 'domcontentloaded' for better stability
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('header')).toBeVisible({ timeout: 15000 });
  }

  async getTopNavigationItems(): Promise<string[]> {
    const navLinks = this.page.locator('header a:visible');
    const texts = await navLinks.allTextContents();
    return texts.map(t => t.trim().replace(/\s+/g, ' '));
  }

  async clickNavigationItem(itemName: string) {
    const navItem = this.page
      .locator('header')
      .getByRole('link', { name: new RegExp(itemName, 'i') })
      .filter({ visible: true }) 
      .first();

    await expect(navItem).toBeVisible({ timeout: 10000 });
    await navItem.click();
  }

  async handleSignUpClick(): Promise<Page> {
    const context = this.page.context();
    const pagePromise = context.waitForEvent('page');
    
    await this.clickNavigationItem('Sign up');

    try {
      const newTab = await pagePromise;
      await newTab.waitForLoadState('load');
      return newTab;
    } catch (e) {
      await this.page.waitForLoadState('load');
      return this.page;
    }
  }

  async verifyUrl(targetPage: Page, pattern: string) {
    // Regex allows for any prefix (like /en-AE/) before the path
    await expect(targetPage).toHaveURL(new RegExp(pattern, 'i'), { timeout: 20000 });
  }
}