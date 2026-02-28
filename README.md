# MultiBank (MB.IO) Web UI Automation Framework

Production-grade Playwright automation framework for validating critical
user flows on the MultiBank (MB.IO) trading platform.

Website: https://mb.io/en-AE

------------------------------------------------------------------------

## Objective

This framework validates:

-   Navigation & Layout
-   Trading Functionality (Spot Trading)
-   Marketing & Download Sections
-   Company → Why MultiLink page content
-   Cross-browser consistency
-   Stable, production-ready automation design

The solution demonstrates:

-   Clean architecture
-   Page Object Model (POM)
-   Externalized test data
-   Flake-resistant wait strategies
-   Cross-browser execution
-   HTML reporting with diagnostics
-   CI-ready structure

------------------------------------------------------------------------

## Project Structure

    project-root/
    │
    ├── config/
    │   └── app.config.ts
    │
    ├── pages/
    │   ├── HomePage.ts
    │   ├── SpotTradingPage.ts
    │   └── AboutUsPage.ts
    │
    ├── test-data/
    │   ├── navigation.json
    │   ├── trading.json
    │   └── company.json
    │
    ├── tests/
    │   └── navigation-trading.spec.ts
    │
    ├── playwright.config.ts
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## Architecture & Design Principles

### 1. Page Object Model (POM)

Each page encapsulates its logic:

-   HomePage.ts → Navigation + marketing validation
-   SpotTradingPage.ts → Trading table structure & categories
-   AboutUsPage.ts → Company/Why MultiLink validation

This ensures:

-   Reusability
-   Maintainability
-   Clear separation of concerns

------------------------------------------------------------------------

### 2. Externalized Test Data (No Hardcoding)

All assertions are data-driven via:

-   navigation.json
-   trading.json
-   company.json

Benefits:

-   Easy updates when UI text changes
-   Clean test logic
-   Production-grade maintainability

------------------------------------------------------------------------

### 3. Robust Wait Strategy

No fixed sleeps are used.

Instead:

-   waitForLoadState('networkidle')
-   expect(locator).toBeVisible({ timeout })
-   Smart locator targeting

This minimizes flakiness.

------------------------------------------------------------------------

### 4. Cross-Browser Support

Configured in playwright.config.ts:

-   Chromium
-   Firefox
-   WebKit

Tests are isolated and deterministic.

------------------------------------------------------------------------

### 5. Failure Diagnostics

Enabled:

-   HTML Reporter
-   Trace on first retry
-   Screenshot on failure
-   Video on failure

To open report:

    npx playwright show-report

------------------------------------------------------------------------

## Test Coverage

### Navigation & Layout

-   Top navigation displays expected options
-   Navigation links function correctly
-   Sign Up redirects to onboarding portal

------------------------------------------------------------------------

### Trading Functionality

-   Spot trading categories: Hot, Gainers, Losers
-   Trading pairs visible
-   Table structure validation:
    -   Pair name cell
    -   Price cell (validated numeric)
    -   Chart cell
-   Multiple assets verified (BTC, ETH, SOL, XRP)

------------------------------------------------------------------------

### Content Validation

-   Marketing banner visible at bottom
-   Download section link validation (Apple / Google domains)
-   Company → Why MultiLink:
    -   Hero section
    -   Stats validation
    -   Section content
    -   Pillars validation
    -   Community section

------------------------------------------------------------------------

## Setup Instructions

### 1. Install Dependencies

    npm install

### 2. Install Playwright Browsers

    npx playwright install

### 3. Run Tests

Run all browsers:

    npx playwright test

Run specific browser:

    npx playwright test --project=chromium

Run headed mode:

    npx playwright test --headed

Run specific test:

    npx playwright test navigation-trading.spec.ts

------------------------------------------------------------------------

## Reporting

After execution:

    npx playwright show-report

Includes:

-   Screenshots
-   Trace viewer
-   Videos (on failure)
-   Detailed error logs

------------------------------------------------------------------------

## Technical Highlights

-   Modern Tool: Playwright
-   Architecture: Page Object Model
-   Data Driven: JSON-based test data
-   Cross Browser: Chromium, Firefox, WebKit
-   No Hard Sleeps: Proper wait strategies
-   Test Isolation: Independent test cases
-   Debuggable Failures: Trace + Screenshots
-   Build Tool: npm
-   Deterministic Execution

------------------------------------------------------------------------

## Stability Measures

-   Network idle waits
-   Visibility assertions
-   Regex-based navigation matching
-   Popup auto-removal from config
-   Single-responsibility page methods

------------------------------------------------------------------------

## CI/CD Ready

For CI environments:

    npx playwright install --with-deps
    npx playwright test

Artifacts generated:

-   playwright-report/
-   test-results/

------------------------------------------------------------------------

## Assignment Compliance

This framework satisfies:

-   Clean architecture
-   Reusable POM design
-   Data-driven validation
-   Cross-browser capability
-   Proper wait strategies
-   No hard-coded assertions
-   Deterministic execution
-   Maintainable structure
-   Professional reporting

------------------------------------------------------------------------

## Author

QA Automation Framework built using Playwright + TypeScript. Designed
for production-grade scalability and maintainability.
