const {defineConfig, devices} = require('@playwright/test');

const phoneChromium = {
  viewport: {width: 390, height: 844},
  screen: {width: 390, height: 844},
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true
};
const tabletPortraitChromium = {
  viewport: {width: 820, height: 1180},
  screen: {width: 820, height: 1180},
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
};
const tabletLandscapeChromium = {
  viewport: {width: 1180, height: 820},
  screen: {width: 1180, height: 820},
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
};

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 60_000,
  expect: {timeout: 10_000},
  reporter: [['list'], ['html', {outputFolder: 'playwright-report', open: 'never'}]],
  outputDir: 'test-results/device-usability',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {name: 'desktop-chromium', use: {browserName: 'chromium', viewport: {width: 1440, height: 1000}}},
    {name: 'iphone-chromium-emulation', use: {browserName: 'chromium', ...phoneChromium}},
    {name: 'ipad-portrait-chromium-emulation', use: {browserName: 'chromium', ...tabletPortraitChromium}},
    {name: 'ipad-landscape-chromium-emulation', use: {browserName: 'chromium', ...tabletLandscapeChromium}},
    {name: 'desktop-webkit', use: {browserName: 'webkit', viewport: {width: 1440, height: 1000}}},
    {name: 'iphone-webkit-emulation', use: {browserName: 'webkit', ...devices['iPhone 17']}},
    {name: 'ipad-portrait-webkit-emulation', use: {browserName: 'webkit', ...devices['iPad Pro 11']}},
    {name: 'ipad-landscape-webkit-emulation', use: {browserName: 'webkit', ...devices['iPad Pro 11 landscape']}}
  ],
  webServer: {
    command: 'node usability/harness.mjs serve --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
    stdout: 'ignore',
    stderr: 'pipe'
  }
});
