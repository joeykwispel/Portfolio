import { expect, test, type Page } from '@playwright/test';

/** Collects CSP violations and uncaught errors, so a test fails if the policy blocks something. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && /Content Security Policy|Refused to/i.test(m.text())) errors.push(m.text());
  });
  return errors;
}

async function loadAll(page: Page) {
  // Lazy sections grow the page as they load; keep stepping down until the height stops changing at the bottom.
  let last = 0;
  for (let i = 0; i < 200; i++) {
    const { height, atBottom } = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      const h = document.documentElement.scrollHeight;
      return { height: h, atBottom: window.scrollY + window.innerHeight >= h - 2 };
    });
    await page.waitForTimeout(100);
    if (atBottom && height === last) break;
    last = height;
  }
}

test('English home page renders with hreflang alternates', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Joey');
  await expect(page.locator('link[rel=alternate][hreflang=nl]')).toHaveAttribute('href', /\/nl\/$/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/$/);
  await loadAll(page);
  await expect(page.locator('#contact h2')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Dutch home page is prerendered in Dutch', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/nl/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/nl\/$/);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'nl_NL');
  expect(errors).toEqual([]);
});

test('language switch goes to the other URL and is remembered', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the switch is the same component on mobile');
  await page.goto('/');
  await page.getByRole('link', { name: 'NL', exact: true }).first().click();
  await expect(page).toHaveURL(/\/nl\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  // A later visit to the English root sends the reader back to Dutch
  await page.goto('/');
  await expect(page).toHaveURL(/\/nl\/$/);
  await page.getByRole('link', { name: 'EN', exact: true }).first().click();
  await expect(page).toHaveURL(/localhost:4173\/$/);
});

test('theme toggle switches and persists', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /light theme/i }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('command palette opens with the keyboard', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut');
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: /command/i });
  await expect(dialog).toBeVisible();
  await page.keyboard.type('cv');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/cv\/$/);
});

test('skills section links to DevCity and keeps the full list one click away', async ({ page }) => {
  await page.goto('/#skills');
  await loadAll(page);
  await expect(page.locator('#skills a[href^="https://devcity.joeyoosenbrug.nl/en/"]')).toBeVisible();
  await expect(page.locator('#skills details')).toHaveCount(0);
  await page
    .locator('#skills')
    .getByRole('button', { name: /browse them as a list/i })
    .click();
  const area = page.locator('#skills details').first();
  await expect(area).not.toHaveAttribute('open', '');
  await area.locator('summary').click();
  await expect(area).toHaveAttribute('open', '');
  const chip = area.locator('.chip').first();
  // The popover closes on scroll, so let the scroll into view settle before clicking
  await chip.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await chip.click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('CV page works in both languages', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/cv/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Joey');
  await page.goto('/nl/cv/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  expect(errors).toEqual([]);
});

test('unknown pages show the 404 page', async ({ page }) => {
  const res = await page.goto('/does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/coffee not found/i).first()).toBeVisible();
});

test('sitemap lists both languages', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('https://joeyoosenbrug.nl/</loc>');
  expect(xml).toContain('https://joeyoosenbrug.nl/nl/</loc>');
  expect(xml).toContain('https://joeyoosenbrug.nl/nl/cv/</loc>');
});

test('published case studies and posts open from the home page', async ({ page }) => {
  await page.goto('/');
  await loadAll(page);
  const links = await page
    .locator('a[href*="/work/"], a[href*="/writing/"]')
    .evaluateAll((els) => [...new Set(els.map((e) => (e as HTMLAnchorElement).pathname))]);
  for (const href of links) {
    const res = await page.goto(href);
    expect(res?.status(), href).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('back link from a post returns to the writing section on the home page', async ({ page }) => {
  await page.goto('/');
  await loadAll(page);
  const post = page.locator('#writing a[href*="/writing/"]').first();
  test.skip((await post.count()) === 0, 'no published posts');
  await post.click();
  await page.locator('a.back').click();
  await expect(page).toHaveURL(/\/#writing$/);
  await expect(page.locator('#writing h2')).toBeInViewport();
  await expect(page.locator('#hero')).toBeAttached();
});
