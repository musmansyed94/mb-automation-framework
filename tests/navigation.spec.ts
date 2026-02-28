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

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    spotPage = new SpotTradingPage(page);
    aboutPage = new AboutUsPage(page);

    await homePage.open();
  });

  // ---------------------------------------------------------
  // TOP NAVIGATION VALIDATION
  // ---------------------------------------------------------
  test('Top navigation displays all expected options', async () => {
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

  // Correct expectation using routes.json
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

    // Use routes.json
    await expect(page).toHaveURL(new RegExp(routes["Company"], 'i'));

    await aboutPage.validateCompanyPageStructure();
  });

  // ---------------------------------------------------------
  // SIGN UP FLOW VALIDATION
  // ---------------------------------------------------------
  test('Sign up button navigates to registration portal', async () => {
  const targetPage = await homePage.handleSignUpClick();

  // Data-driven URL validation
  await homePage.verifyUrl(targetPage, routes["Sign up"]);

  const signUpIndicator = targetPage.locator(
    'input[type="email"], h1, h2'
  );

  await expect(signUpIndicator.first()).toBeVisible();
});

});