import { test, expect, startDemoAnalysis } from './fixtures';

const WIDTHS = [1440, 1024, 768, 390];
const PAGES = ['/', '/dashboard', '/profile', '/tender', '/analysis', '/report', '/feedback', '/privacy'];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px (EN and KZ)`, async ({ page, errors }) => {
    void errors;
    await page.setViewportSize({ width, height: 900 });
    await startDemoAnalysis(page);
    for (const lang of ['English', 'Қазақша']) {
      if (lang === 'Қазақша') await page.getByRole('button', { name: 'Қазақша' }).click();
      for (const path of PAGES) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} at ${width}px (${lang})`).toBeLessThanOrEqual(0);
      }
    }
  });
}

test('mobile menu opens, navigates and closes', async ({ page, errors }) => {
  void errors;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-nav').getByRole('link', { name: 'Company Profile' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Company Profile');
  await expect(page.locator('#mobile-nav')).toHaveCount(0);
});

test('keyboard: skip link and visible focus', async ({ page, errors }) => {
  void errors;
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  const outline = await skip.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
});
