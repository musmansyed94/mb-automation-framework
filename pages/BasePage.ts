import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = '') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
    await this.disablePushPopup();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  private async disablePushPopup() {
    await this.page.evaluate(() => {
      const popup = document.getElementById('moe-push-div');
      if (popup) popup.remove();
    });
  }
}