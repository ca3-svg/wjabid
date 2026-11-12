const {test, expect} = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs/promises');

const sampleBid = `TRIP #258 M302W (OL) [1,1,0,0] YUL: _2_____ effective DEC 08-DEC 29 except DEC 22
 RPT 08:00
 Tu 1 02986 YUL RIH 09:00 15:10 6h10
 ---- RIH hotel TBD / Hotel Shuttle ---- 73h00
 Fr 4 02987 RIH YUL 17:25 23:15 5h50
 RLS 23:30
 TAFB: 87h30 Credit Time: 23h20(T) PERDIEM: 789.25
TRIP #258 M302W (OL) [1,1,0,0] YUL: _2_____ effective DEC 22-DEC 22 no exceptions.
 RPT 08:00
 Tu 1 02986 YUL RIH 09:00 15:10 6h10
 ---- RIH hotel TBD / Hotel Shuttle ---- 73h00
 Fr 4 02987 RIH YUL 17:25 23:15 5h50
 RLS 23:30
 TAFB: 87h30 Credit Time: 23h20(T) PERDIEM: 789.25`;

test('date-specific pairing tasks stay usable at phone and tablet sizes', async ({page}, testInfo) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await page.evaluate((scheduleText) => {
    allPairings = parseFullText(scheduleText);
    pdfTextLayoutVersion = 2;
    saveData();
    loadData();
  }, sampleBid);
  const rows = page.locator('#pairing-table .tabulator-row');
  await expect(rows).toHaveCount(4);
  for (const date of ['2026-12-08', '2026-12-15', '2026-12-22', '2026-12-29']) {
    await expect(page.getByRole('button', {name: `View original schedule for M302W on ${date}`})).toBeVisible();
  }
  const viewport = await page.evaluate(() => ({width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth}));
  const favoriteToggle = page.getByRole('button', {name: 'Add M302W on 2026-12-08 to favorites'});
  await expect(favoriteToggle).toHaveAttribute('aria-pressed', 'false');
  await favoriteToggle.click();
  await expect(page.getByRole('button', {name: 'Remove M302W on 2026-12-08 from favorites'})).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', {name: 'Add M302W on 2026-12-15 to favorites'})).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', {name: 'Favorites, 1 saved'})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', {name: 'Remove M302W on 2026-12-08 from favorites'})).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', {name: 'Favorites, 1 saved'}).click();
  const favoritesDialog = page.getByRole('dialog', {name: 'Saved favorites'});
  await expect(favoritesDialog).toBeVisible();
  await expect(page.getByRole('button', {name: 'Close favorites'})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(favoritesDialog).toBeHidden();
  await expect(page.getByRole('button', {name: 'Favorites, 1 saved'})).toBeFocused();
  await page.getByRole('button', {name: 'Favorites, 1 saved'}).click();
  await expect(favoritesDialog).toBeVisible();
  await expect(favoritesDialog).toContainText('2026-12-08');
  await expect(favoritesDialog).toContainText('YUL-RIH | RIH-YUL');
  await expect(page.getByRole('button', {name: 'View details for M302W on 2026-12-08'})).toBeVisible();
  const favoritesBounds = await favoritesDialog.locator('section').boundingBox();
  expect(favoritesBounds.width).toBeLessThanOrEqual(viewport.width);
  expect(favoritesBounds.height).toBeLessThanOrEqual(viewport.height);
  await page.screenshot({path: testInfo.outputPath('favorites.png'), fullPage: true});
  const favoritesAxe = await new AxeBuilder({page})
    .include('#favorites-modal')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(favoritesAxe.violations.map(issue => `${issue.impact}: ${issue.id}`)).toEqual([]);
  await favoritesDialog.getByRole('button', {name: 'Remove M302W on 2026-12-08 from favorites'}).click();
  await expect(favoritesDialog).toContainText('Star a pairing date in the table to save it here.');
  await expect(page.getByRole('button', {name: 'Favorites, 0 saved'})).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', {name: 'Close favorites'}).click();

  await page.getByRole('button', {name: 'Add M302W on 2026-12-08 to favorites'}).click();
  await page.getByRole('button', {name: 'Favorites, 1 saved'}).click();
  await page.getByRole('button', {name: 'View details for M302W on 2026-12-08'}).click();
  await expect(page.getByRole('dialog', {name: /Trip 258 · M302W/})).toBeVisible();
  await page.getByRole('button', {name: 'Close pairing details'}).click();
  await expect(page.locator('#pairing-table .tabulator-header-filter input[aria-label="Filter Pairing"]')).toBeAttached();

  expect(viewport.documentWidth, `Page overflows at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 1);
  if (viewport.width < 640) {
    await expect(page.locator('#nav-right')).toBeHidden();
    await expect(page.getByText('Swipe the table to see more columns.')).toBeVisible();
    await expect(page.locator('#pairing-table-scroll')).toHaveCSS('overflow-x', 'auto');
  }
  await page.screenshot({path: testInfo.outputPath('viewer.png'), fullPage: true});

  const originalButton = page.getByRole('button', {name: 'View original schedule for M302W on 2026-12-08'});
  await originalButton.click();
  const originalDialog = page.getByRole('dialog', {name: /Trip 258 · M302W/});
  await expect(originalDialog).toBeVisible();
  await expect(originalDialog).toContainText('Selected operating date: 2026-12-08');
  await page.screenshot({path: testInfo.outputPath('original-schedule.png'), fullPage: true});
  await page.getByRole('button', {name: 'Close original schedule'}).click();

  await page.getByRole('button', {name: 'View formatted details for M302W on 2026-12-08'}).click();
  const detailsDialog = page.getByRole('dialog', {name: /Trip 258 · M302W/});
  await expect(detailsDialog).toBeVisible();
  await expect(detailsDialog).toContainText('Day-by-day itinerary');
  await expect(detailsDialog).toContainText('Duty days · legs');
  await page.screenshot({path: testInfo.outputPath('pairing-details.png'), fullPage: true});

  const axe = await new AxeBuilder({page})
    .include('#pairing-details-modal')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const accessibilityReport = JSON.stringify({violations: axe.violations.map(({id, impact, help, nodes}) => ({
      id, impact, help, affectedElements: nodes.map(({target, failureSummary, html}) => ({target, failureSummary, html}))
  }))}, null, 2);
  const accessibilityPath = testInfo.outputPath('accessibility-findings.json');
  await fs.writeFile(accessibilityPath, accessibilityReport);
  await testInfo.attach('accessibility-findings.json', {path: accessibilityPath, contentType: 'application/json'});
  expect(axe.violations.map(issue => `${issue.impact}: ${issue.id}`)).toEqual([]);
  await page.getByRole('button', {name: 'Close pairing details'}).click();

  await page.getByRole('button', {name: 'Add M302W on 2026-12-15 to bid list'}).click();
  await expect(page.locator('#bid-count')).toHaveText('1/16 slots');
  await expect(rows).toHaveCount(4);
  await expect(page.locator('#pairing-source-modal')).toBeHidden();
  await expect(page.locator('#pairing-details-modal')).toBeHidden();
  expect(pageErrors).toEqual([]);
});
