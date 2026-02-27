import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Navigation & Layout Tests - MB.IO', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('Top navigation displays all expected options', async () => {
    const navItems = await homePage.getTopNavigationItems();
    const expected = ['Explore', 'Features', 'Company', 'Sign in', 'Sign up'];

    for (const item of expected) {
      const found = navItems.some(n => n.toLowerCase().includes(item.toLowerCase()));
      expect.soft(found, `Missing "${item}"`).toBeTruthy();
    }
  });

  test('Navigation items link to correct URLs', async () => {
    // UPDATED: 'Company' now maps to 'company' instead of 'about-us'
    const map: Record<string, string> = {
      'Explore': 'explore',
      'Features': 'features',
      'Company': 'company' 
    };

    for (const [nav, path] of Object.entries(map)) {
      await homePage.clickNavigationItem(nav);
      await homePage.verifyUrl(homePage.page, path);
      // Return to home to click the next item
      await homePage.open(); 
    }
  });

  test('Sign up button navigates to registration portal', async () => {
    const targetPage = await homePage.handleSignUpClick();
    
    // Check for common registration keywords in the URL
    await homePage.verifyUrl(targetPage, 'onboarding|register|signup|identity|mb');

    // Verify a visible UI element on the destination page
    const signUpIndicator = targetPage.locator('input[type="email"], h1, h2');
    await expect(signUpIndicator.first()).toBeVisible({ timeout: 15000 });
  });
});