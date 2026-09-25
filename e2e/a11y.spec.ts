import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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
  // let reveal animations finish so contrast is measured on the final colors
  await page.waitForTimeout(1200);
}

// Every page in the built sitemap: home, CV, case studies and posts, in both languages.
// Build with VITE_SHOW_DRAFTS=1 to include drafts.
const sitemap = readFileSync(new URL('../build/sitemap.xml', import.meta.url), 'utf8');
const pages = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);

// axe on the full home page is slow
test.describe.configure({ timeout: 90_000 });

for (const theme of ['dark', 'light'] as const) {
  for (const path of pages) {
    test(`${path} has no serious accessibility issues (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await loadAll(page);
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(
        serious.map(
          (v) =>
            `${v.id}: ${v.nodes
              .map((n) => n.target.join(' '))
              .slice(0, 5)
              .join(', ')}`
        )
      ).toEqual([]);
    });
  }
}
