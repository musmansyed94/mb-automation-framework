import { Page, expect, Locator } from '@playwright/test';
import tradingData from '../test-data/trading.json';

export class SpotTradingPage {
  readonly page: Page;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('table tbody tr');
  }

  async selectCategory(categoryName: string) {
    const tab = this.page.getByRole('button', { name: categoryName });

    await expect(tab).toBeVisible({ timeout: 15000 });
    await tab.click();

    await this.page.waitForLoadState('networkidle');
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
  }

  async validateTradingTableStructure() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });

    const rowCount = await this.rows.count();
    const rowsToCheck = Math.min(rowCount, 5); // validate first 5 rows

    for (let i = 0; i < rowsToCheck; i++) {
      const row = this.rows.nth(i);

      // Pair name cell
      const pairCell = row.locator(`[id$="${tradingData.tableStructure.pairCell}"]`);
      await expect(pairCell).toBeVisible();
      const pairText = (await pairCell.innerText()).trim();
      expect(pairText.length).toBeGreaterThan(0);

      // Price cell
      const priceCell = row.locator(`[id$="${tradingData.tableStructure.priceCell}"]`);
      await expect(priceCell).toBeVisible();
      const priceText = (await priceCell.innerText()).trim();
      expect(priceText).toMatch(/\$/);

      // Validate price parses to a number
      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      expect(numericPrice).not.toBeNaN();

      // Chart cell
      const chartCell = row.locator(`[id$="${tradingData.tableStructure.chartCell}"]`);
      await expect(chartCell).toBeVisible();
    }
  }

  async verifyRowsExist() {
    const count = await this.rows.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyAssetExists(asset: string) {
    const tableText = await this.page.innerText('table');
    expect(tableText).toContain(asset);
  }

  async validateAllCategories() {
    for (const category of tradingData.categories) {
      await this.selectCategory(category);
      await this.verifyRowsExist();
      await this.validateTradingTableStructure();
    }
  }
}