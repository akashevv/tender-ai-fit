import { readFileSync } from 'node:fs';
import { test, expect, startDemoAnalysis, expectCounts } from './fixtures';

const pdf = (body: string) => ({ name: 'tender.pdf', mimeType: 'application/pdf', buffer: Buffer.from(body) });

test('PDF upload: unsupported, corrupt and empty files show errors with a recovery option', async ({ page, errors }) => {
  void errors;
  await page.goto('/tender');
  const input = page.getByTestId('tender-file-input');

  await input.setInputFiles({ name: 'tender.docx', mimeType: 'application/msword', buffer: Buffer.from('x') });
  await expect(page.getByText('Unsupported file type.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Use the demo tender instead' })).toBeVisible();

  await input.setInputFiles(pdf('not really a pdf'));
  await expect(page.getByText('does not look like a valid PDF', { exact: false })).toBeVisible();

  await input.setInputFiles(pdf(''));
  await expect(page.getByText('The file is empty', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'Start manual analysis' }).click();
  await expect(page.getByText('Select the tender PDF you are reviewing.')).toBeVisible();

  await page.getByRole('button', { name: 'Use the demo tender instead' }).click();
  await expect(page).toHaveURL(/\/analysis$/);
});

test('manual tender: valid PDF + typed requirements are checked by the chosen rule or marked Unclear', async ({ page, errors }) => {
  void errors;
  await page.goto('/tender');
  await page.getByTestId('tender-file-input').setInputFiles(pdf('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n'));
  await expect(page.getByText('Selected file: tender.pdf')).toBeVisible();
  await page.getByLabel('Requirement 1', { exact: true }).fill('ISO 9001 quality certificate');
  await page.getByLabel('Matching rule for requirement 1').selectOption('iso9001');
  await page.getByRole('button', { name: 'Add requirement' }).click();
  await page.getByLabel('Requirement 2', { exact: true }).fill('Bank guarantee of 3%');
  await page.getByRole('button', { name: 'Start manual analysis' }).click();
  await expect(page).toHaveURL(/\/analysis$/);
  await expect(page.getByText('Manually entered tender')).toBeVisible();
  await expect(page.getByTestId('requirement-m-1')).toHaveAttribute('data-status', 'MISSING');
  await expect(page.getByTestId('requirement-m-2')).toHaveAttribute('data-status', 'UNCLEAR');
});

test('boundary case E: blocked browser storage shows a warning and the app still works', async ({ page, errors }) => {
  void errors;
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/');
  await expect(page.getByText('Browser storage is unavailable', { exact: false })).toBeVisible();
  await startDemoAnalysis(page);
  await expectCounts(page, 2, 2, 1, 40);
  await page.goto('/feedback');
  await page.getByText('Yes, on my own').click();
  for (const name of ['usefulness', 'easeOfUse', 'statusClarity', 'trust']) await page.locator(`input[name="${name}"][value="4"]`).check({ force: true });
  await page.getByLabel(/I agree that my anonymous answers/).check();
  await page.getByRole('button', { name: 'Save feedback' }).click();
  await expect(page.getByText('Could not save: browser storage is unavailable.', { exact: false })).toBeVisible();
});

test('corrupted stored data falls back to the demo profile', async ({ page, errors }) => {
  void errors;
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('taf_profile_v2', '{not json');
    localStorage.setItem('taf_analysis_v2', JSON.stringify({ hello: 'world' }));
  });
  await page.goto('/profile');
  await expect(page.getByRole('heading', { name: 'Astana Build Solutions LLP' })).toBeVisible();
  await page.goto('/report');
  await expect(page.getByText('No analysis yet. Select a tender to start.')).toBeVisible();
});

test('feedback: validation, local save, CSV export and deletion', async ({ page, errors }) => {
  void errors;
  await page.goto('/feedback');
  await page.getByRole('button', { name: 'Save feedback' }).click();
  await expect(page.getByRole('alert').first()).toContainText('Please answer all required questions.');
  await page.getByLabel(/Participant code/).fill('Aida');
  await page.getByText('Yes, with help').click();
  for (const name of ['usefulness', 'easeOfUse', 'statusClarity', 'trust']) await page.locator(`input[name="${name}"][value="5"]`).check({ force: true });
  await page.getByLabel('Comments').fill('Түсінікті, "жақсы"');
  await page.getByLabel(/I agree that my anonymous answers/).check();
  await page.getByRole('button', { name: 'Save feedback' }).click();
  await expect(page.getByText('Use the format P01–P99.')).toBeVisible();
  await page.getByLabel(/Participant code/).fill('P01');
  await page.getByRole('button', { name: 'Save feedback' }).click();
  await expect(page.getByText('Thank you! Your feedback was saved in this browser.')).toBeVisible();
  await expect(page.getByTestId('feedback-count')).toHaveText('1 responses saved in this browser');

  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export CSV' }).click()]);
  const csv = readFileSync((await download.path())!, 'utf8');
  expect(csv).toContain('P01');
  expect(csv).toContain('with_help');
  expect(csv).toContain('Түсінікті');

  await page.reload();
  await expect(page.getByTestId('feedback-count')).toHaveText('1 responses saved in this browser');
  await page.getByRole('button', { name: 'Delete all responses' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByTestId('feedback-count')).toHaveText('0 responses saved in this browser');
});

test('report export: print layout hides navigation and the PDF renders English and Kazakh text', async ({ page, errors }) => {
  void errors;
  await startDemoAnalysis(page);
  await page.getByRole('link', { name: 'View readiness report' }).first().click();
  await expect(page.getByTestId('report-company')).toHaveText('Astana Build Solutions LLP');

  // The button really opens the browser print dialog
  await page.evaluate(() => {
    (window as unknown as { __printed: boolean }).__printed = false;
    window.print = () => ((window as unknown as { __printed: boolean }).__printed = true);
  });
  await page.getByRole('button', { name: 'Download Report (PDF)' }).click();
  expect(await page.evaluate(() => (window as unknown as { __printed: boolean }).__printed)).toBe(true);

  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('header')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Download Report (PDF)' })).toBeHidden();
  await expect(page.getByText('Not yet confirmed by a reviewer.')).toBeVisible();
  const en = await page.pdf({ format: 'A4' });
  expect(en.byteLength).toBeGreaterThan(20_000);

  await page.emulateMedia({ media: 'screen' });
  await page.getByRole('button', { name: 'Қазақша' }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('heading', { name: /Жетіспейтін талаптар/ })).toBeVisible();
  const kk = await page.pdf({ format: 'A4', path: 'test-results/report-kk.pdf' });
  expect(kk.byteLength).toBeGreaterThan(20_000);
});

test('privacy page deletes all local data', async ({ page, errors }) => {
  void errors;
  await startDemoAnalysis(page);
  await page.goto('/privacy');
  await page.getByRole('button', { name: 'Delete all local data' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('All local data deleted.', { exact: false })).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('taf_')));
  expect(keys).toEqual([]);
});
