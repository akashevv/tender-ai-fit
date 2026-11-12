import { test as base, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/** Expands a requirement card if it is collapsed. */
export async function openCard(card: Locator) {
  const toggle = card.locator('h2 > button');
  if ((await toggle.getAttribute('aria-expanded')) === 'false') await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
}

/** Every test runs on a fixed date so the demo regression values are deterministic,
 *  and fails if the page logs a console error or throws. */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.clock.setFixedTime(new Date('2026-11-12T10:00:00'));
    await provide(errors);
    expect(errors, 'browser console errors').toEqual([]);
  },
});
export { expect };

export async function startDemoAnalysis(page: Page) {
  await page.goto('/tender');
  await page.getByRole('button', { name: /Start Analysis|Талдауды бастау/ }).first().click();
  await expect(page).toHaveURL(/\/analysis$/);
}

export async function expectCounts(page: Page, met: number, missing: number, unclear: number, readiness: number) {
  await expect(page.getByTestId('count-MET')).toHaveText(String(met));
  await expect(page.getByTestId('count-MISSING')).toHaveText(String(missing));
  await expect(page.getByTestId('count-UNCLEAR')).toHaveText(String(unclear));
  await expect(page.getByTestId('readiness')).toHaveText(`${readiness}%`);
}
