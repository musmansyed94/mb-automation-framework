import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SpotTradingPage } from '../pages/SpotTradingPage';
import { AboutUsPage } from '../pages/AboutUsPage';

import navigationData from '../test-data/navigation.json';
import tradingData from '../test-data/trading.json';
import routes from '../test-data/routes.json';

test.describe.configure({ mode: 'parallel' });

test.describe('Navigation & Trading Tests - MB.IO', () => {
  let homePage: HomePage;
  let spotPage: SpotTradingPage;
  let aboutPage: AboutUsPage;

  // ---------------------------------------------------------
  // BEFORE EACH (with Sign‑Up test excluded)
  // ---------------------------------------------------------
  test.beforeEach(async ({ page }, testInfo) => {
    // Skip open() for Sign Up test to avoid header check on trade.mb.io
    if (testInfo.title.includes('Sign up')) return;

    homePage = new HomePage(page);
    spotPage = new SpotTradingPage(page);
    aboutPage = new AboutUsPage(page);

    await homePage.open();
  });

  // ---------------------------------------------------------
  // TOP NAVIGATION VALIDATION
  // ---------------------------------------------------------
  test('Top navigation displays all expected options', async ({ page }) => {
    homePage = new HomePage(page);
    const navItems = await homePage.getTopNavigationItems();

    for (const item of navigationData.topNavigation) {
      const found = navItems.some(n =>
        n.toLowerCase().includes(item.toLowerCase())
      );

      expect.soft(found, `Missing "${item}"`).toBeTruthy();
    }
  });

  // ---------------------------------------------------------
  // TRADING PAGE VALIDATION
  // ---------------------------------------------------------
  test('Spot Trading - Categories, Structure, and Data Validation', async ({ page }) => {
    await homePage.clickNavigationItem('Explore');

    // Region-agnostic URL validation
    await expect(page).toHaveURL(new RegExp(routes["Explore"], 'i'));

    await page.waitForLoadState('networkidle');

    await spotPage.validateTradingTableStructure();
    await spotPage.verifyRowsExist();

    for (const asset of tradingData.assets) {
      await spotPage.verifyAssetExists(asset);
    }

    for (const category of tradingData.categories) {
      await spotPage.selectCategory(category);
      await spotPage.validateTradingTableStructure();
      await spotPage.verifyRowsExist();
    }
  });

  // ---------------------------------------------------------
  // HOME PAGE CONTENT VALIDATION
  // ---------------------------------------------------------
  test('Home page marketing banner and download section', async () => {
    await homePage.validateMarketingBanner();
    await homePage.validateDownloadSection();
  });

  // ---------------------------------------------------------
  // ABOUT US PAGE VALIDATION
  // ---------------------------------------------------------
  test('About Us → Company page renders all expected components', async ({ page }) => {
    await homePage.clickNavigationItem('Company');

    // Region-agnostic URL validation
    await expect(page).toHaveURL(new RegExp(routes["Company"], 'i'));

    await aboutPage.validateCompanyPageStructure();
  });

  // ---------------------------------------------------------
  // SIGN UP FLOW VALIDATION (no beforeEach)
  // ---------------------------------------------------------
  test('Sign up button navigates to registration portal', async ({ page }) => {
    // Manually initialize HomePage because beforeEach is skipped
    homePage = new HomePage(page);
    await homePage.open();

    const targetPage = await homePage.handleSignUpClick();

    // Region-agnostic + redirect-safe URL validation
    await homePage.verifyUrl(targetPage, routes["Sign up"]);

    const signUpIndicator = targetPage.locator(
      'input[type="email"], h1, h2'
    );

    await expect(signUpIndicator.first()).toBeVisible();
  });

});