import { Page, expect } from '@playwright/test';
import { appConfig } from '../config/app.config';
import navigationData from '../test-data/navigation.json';

export class HomePage {
  constructor(public page: Page) {}

  async open() {
    await this.page.goto(appConfig.baseUrl);
    await this.page.waitForLoadState('domcontentloaded');

    // Remove popups dynamically from config
    await this.page.evaluate((selectors) => {
      selectors.forEach(s => document.querySelector(s)?.remove());
    }, appConfig.popupSelectors);

    await expect(this.page.locator(appConfig.selectors.header)).toBeVisible({ timeout: 15000 });
  }

  async getTopNavigationItems(): Promise<string[]> {
    const navLinks = this.page.locator(`${appConfig.selectors.header} a:visible`);
    const texts = await navLinks.allTextContents();
    return texts.map(t => t.trim().replace(/\s+/g, ' '));
  }

  async clickNavigationItem(itemName: string) {
    const navItem = this.page
      .locator(appConfig.selectors.header)
      .getByRole('link', { name: new RegExp(itemName, 'i') })
      .filter({ visible: true })
      .first();

    await expect(navItem).toBeVisible({ timeout: 10000 });
    await navItem.click();
  }

  async handleSignUpClick(): Promise<Page> {
    const context = this.page.context();
    const pagePromise = context.waitForEvent('page');

    // Data-driven: find "Sign up" from navigation.json
    const signUpLabel = navigationData.topNavigation.find(item =>
      item.toLowerCase().includes("sign up")
    )!;

    await this.clickNavigationItem(signUpLabel);

    try {
      const newTab = await pagePromise;
      await newTab.waitForLoadState('load');
      return newTab;
    } catch {
      await this.page.waitForLoadState('load');
      return this.page;
    }
  }

  async verifyUrl(targetPage: Page, pattern: string) {
    await expect(targetPage).toHaveURL(new RegExp(pattern, 'i'), { timeout: 20000 });
  }

  async validateMarketingBanner() {
    const banner = this.page.locator(appConfig.selectors.marketingBanner).last();
    await expect(banner).toBeVisible({ timeout: 15000 });
  }

  async validateDownloadSection() {
    const downloadButton = this.page.locator(appConfig.selectors.downloadButton);
    await expect(downloadButton).toBeVisible({ timeout: 15000 });

    const href = await downloadButton.getAttribute('href');
    expect(href).not.toBeNull();

    // Validate against all allowed domains (go.link, apple.com, google.com, play.google.com)
    const matches = appConfig.expectations.downloadDomains.some(domain =>
      href!.includes(domain)
    );

    expect(matches).toBeTruthy();
  }
}