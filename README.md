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

    mb-automation-framework/
    │
    ├── .github/
    │   └── workflows/
    │       └── playwright.yml
    │
    ├── config/
    │   └── app.config.ts
    │
    ├── fixtures/
    │
    ├── pages/
    │   ├── AboutUsPage.ts
    │   ├── HomePage.ts
    │   └── SpotTradingPage.ts
    │
    ├── test-data/
    │   ├── company.json
    │   ├── navigation.json
    │   └── trading.json
    │
    ├── tests/
    │   └── navigation-trading.spec.ts
    │
    ├── playwright.config.ts
    ├── tsconfig.json
    ├── package.json
    └── README.md


This structure separates concerns cleanly:

-   Pages contain UI logic
-   Tests contain scenarios
-   Config contains environment-specific settings
-   Test data drives all assertions
-   CI workflow automates execution

------------------------------------------------------------------------

🏗 Architecture Decisions & Rationale

Playwright

Chosen for:

-   Native cross-browser support (Chromium, Firefox, WebKit)
-   Auto-waiting and web-first assertions
-   Built-in tracing, screenshots, and video
-   Parallel execution and retries

Page Object Model (POM)

Each page encapsulates:

-   Locators
-   Actions
-   Assertions

This keeps tests readable and reduces duplication.

Data-Driven Design

All expected values (navigation items, trading categories, table
structure, About Us content, routes) live in JSON files.

This allows:

-   Zero hard-coded assertions
-   Easy updates when UI changes
-   Clear separation between test logic and test data

Region-Agnostic Routing

MB.IO redirects based on user location:

-   Dubai → /en-AE/...
-   CI (GitHub Actions) → /en/...

To avoid false failures, routes.json uses regex patterns:

/en(-AE)?/explore

This matches both variants.

Popup Removal

MB.IO displays marketing popups that block navigation. app.config.ts
defines selectors to remove them automatically.

Cross-Browser Stability

WebKit does not support Chromium flags like --disable-notifications. The
config applies flags only to Chromium/Firefox.

------------------------------------------------------------------------

🚀 Running Tests Locally

Install dependencies

npm install

Run all tests

npx playwright test

Run in headed mode

npx playwright test --headed

Run a specific test

npx playwright test tests/navigation.spec.ts

Run only Chromium

npx playwright test --project=chromium

View HTML report

npx playwright show-report

View trace

npx playwright show-trace test-results/\<trace.zip\>

------------------------------------------------------------------------

🔄 CI/CD Pipeline (GitHub Actions)

This repository includes a fully configured CI workflow:

.github/workflows/playwright.yml

What the pipeline does

-   Installs Node + dependencies
-   Installs Playwright browsers
-   Runs the full cross-browser test suite (Chromium, Firefox, WebKit)
-   Uploads:
    -   HTML report
    -   Screenshots
    -   Videos
    -   Traces

Triggered on:

-   Every push
-   Every pull request

Sample workflow

name: Playwright Tests on: \[push, pull_request\]

jobs: test: runs-on: ubuntu-latest steps: - uses: actions/checkout@v3 -
uses: actions/setup-node@v3 with: node-version: 18 - run: npm install -
run: npx playwright install --with-deps - run: npx playwright test -
uses: actions/upload-artifact@v3 with: name: playwright-report path:
playwright-report

------------------------------------------------------------------------

🧪 Test Coverage

Navigation

-   All top navigation items validated against navigation.json
-   Region-agnostic URL validation using regex
-   Sign-up flow validated with new-tab handling

Trading

-   Multi-row schema validation (first 5 rows)
-   Pair name, price format, chart visibility
-   Category switching
-   Asset existence validation

Content Validation

-   Marketing banner visibility
-   Download section domain validation (Apple/Google/Go.Link)
-   About Us page: hero, stats, sections, pillars, community

Error Handling

-   Popup removal
-   Region-agnostic routing
-   WebKit flag compatibility
-   New-tab handling for Sign-Up

------------------------------------------------------------------------

## 📄 Assumptions & Trade-offs

Assumptions

-   MB.IO may redirect between /en and /en-AE depending on region.
-   Popups must be removed to avoid blocking navigation.
-   Trading table structure is stable and uses consistent ID suffixes.
-   Download links may redirect through tracking URLs (go.link).

Trade-offs

-   Marketing banner content is validated for visibility, not text.
-   Download section validates domain, not full redirect chain.
-   WebKit does not support notification flags, so they are disabled
    only for Chromium/Firefox.
-   Sign-up opens a new tab inconsistently; test handles both cases.

------------------------------------------------------------------------

## 🔧 Maintenance & Extensibility

### Add New Page

1.  Create file in pages/
2.  Add locators & actions
3.  Add test data in test-data/
4.  Write test in tests/

### Add New Trading Categories

Update trading.json only.

### Update Selectors

Modify app.config.ts.

### Extend CI

Add matrix or additional jobs in playwright.yml.

------------------------------------------------------------------------

## 📸 Test Evidence

Included in repo

-   test-results/ → screenshots, videos, traces
-   playwright-report/ → HTML report
-   GitHub Actions artifacts → cross-browser results

Evidence of cross-browser execution

-   Chromium, Firefox, WebKit all run in CI
-   Reports show all 3 browsers
-   Videos and traces confirm execution paths

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

## CI/CD Pipeline (GitHub Actions)

CI pipeline is configured in:

.github/workflows/playwright.yml

Pipeline Executes:

✔ Install dependencies ✔ Install Playwright browsers ✔ Run test suite ✔
Generate reports ✔ Upload artifacts

GitHub Actions Trigger Events

Push to main branch Pull request to main branch

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
