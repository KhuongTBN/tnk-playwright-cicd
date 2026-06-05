# Playwright CI/CD Portfolio

![Playwright Tests](https://github.com/KhuongTBN/tnk-playwright-cicd/actions/workflows/playwright.yml/badge.svg)

## Tech Stack
- Playwright Test Framework with TypeScript
- GitHub Actions CI/CD pipeline
- Marketplace E2E tests (login, browse, sort, cart, checkout)
- Cross-browser testing (Chromium, Firefox, WebKit)
- HTML report as CI artifact

## How to Run

```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

## View Report

```bash
npx playwright show-report
```