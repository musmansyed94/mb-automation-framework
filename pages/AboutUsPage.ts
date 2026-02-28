import { Page, expect } from '@playwright/test';
import companyData from '../test-data/company.json';

export class AboutUsPage {
  constructor(public page: Page) {}

  async validateCompanyPageStructure() {
    await this.validateHero();
    await this.validateStats();
    await this.validateSections();
    await this.validatePillars();
    await this.validateCommunity();
  }

  async validateHero() {
    const heading = this.page.locator('h1, h2').first();
    await expect(heading).toHaveText(companyData.heroHeading);

    const paragraph = this.page.locator('p').first();
    await expect(paragraph).toBeVisible();
    expect((await paragraph.innerText()).length).toBeGreaterThan(20);
  }

  async validateStats() {
    for (const stat of companyData.stats) {
      await expect(this.page.locator(`text="${stat.value}"`)).toBeVisible();
      await expect(this.page.locator(`text="${stat.label}"`)).toBeVisible();
    }
  }

  async validateSections() {
    for (const title of companyData.sections) {
      const sectionTitle = this.page.locator(`text="${title}"`).first();
      await expect(sectionTitle).toBeVisible();

      const paragraph = sectionTitle.locator('xpath=following::p[1]');
      await expect(paragraph).toBeVisible();
      expect((await paragraph.innerText()).length).toBeGreaterThan(10);
    }
  }

  async validatePillars() {
    for (const pillar of companyData.pillars) {
      const title = this.page.locator(`text="${pillar}"`).first();
      await expect(title).toBeVisible();

      const paragraph = title.locator('xpath=following::p[1]');
      await expect(paragraph).toBeVisible();
      expect((await paragraph.innerText()).length).toBeGreaterThan(5);
    }
  }

  async validateCommunity() {
    const title = this.page.locator(`text="${companyData.communityTitle}"`).first();
    await expect(title).toBeVisible();
  }
}