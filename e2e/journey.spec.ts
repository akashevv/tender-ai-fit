import { test, expect, startDemoAnalysis, expectCounts, openCard } from './fixtures';

test('homepage loads and both hero buttons work', async ({ page, errors }) => {
  void errors;
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make Smarter Tender Decisions');
  await expect(page.getByText('Demo prototype:', { exact: false })).toBeVisible();
  await page.getByRole('link', { name: 'How It Works' }).click();
  await expect(page).toHaveURL(/#how$/);
  await expect(page.getByRole('heading', { name: 'Prepare company information' })).toBeInViewport();
  await page.getByRole('link', { name: 'Try the Demo' }).first().click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
});

test('main navigation reaches every core page', async ({ page, errors }) => {
  void errors;
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  for (const [link, heading] of [
    ['Dashboard', 'Dashboard'],
    ['Company Profile', 'Company Profile'],
    ['Select Tender', 'Select Tender'],
    ['Feedback', 'Feedback'],
    ['Home', 'Make Smarter Tender Decisions'],
  ]) {
    await nav.getByRole('link', { name: link, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
  }
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('original demo scenario: 2 Met, 2 Missing, 1 Unclear, 40% — and the expired ISO certificate is rejected', async ({ page, errors }) => {
  void errors;
  await startDemoAnalysis(page);
  await expect(page.getByTestId('count-total')).toHaveText('5');
  await expectCounts(page, 2, 2, 1, 40);

  const iso = page.getByTestId('requirement-req-2');
  await expect(iso).toHaveAttribute('data-status', 'MISSING');
  await openCard(iso);
  await expect(iso.getByTestId('reason')).toContainText('expired on 30.06.2025');
  await expect(iso.getByText('ISO9001_Expired_DEMO.pdf', { exact: true })).toBeVisible();
  await expect(iso.getByText('Not accepted')).toBeVisible();

  // Filter shows only Missing requirements
  await page.getByRole('button', { name: 'Missing', exact: true, pressed: false }).first().click();
  await expect(page.locator('[data-testid^="requirement-"]')).toHaveCount(2);
});

test('human review: override requires a note, report shows both automated and reviewed values, confirmation works', async ({ page, errors }) => {
  void errors;
  await startDemoAnalysis(page);
  const projects = page.getByTestId('requirement-req-3');
  await openCard(projects);
  await projects.getByRole('button', { name: 'Met', exact: true }).click();
  await expect(projects.getByRole('alert')).toContainText('Write a reviewer note');
  await projects.getByLabel('Reviewer note').fill('Completion acts compared with the tender scope.');
  await projects.getByRole('button', { name: 'Met', exact: true }).click();
  await expect(projects).toHaveAttribute('data-status', 'MET');

  // Mark every requirement as reviewed
  for (const id of ['req-1', 'req-2', 'req-4', 'req-5']) {
    const card = page.getByTestId(`requirement-${id}`);
    await openCard(card);
    await card.getByRole('button', { name: 'Mark as reviewed' }).click();
  }
  await page.getByRole('link', { name: 'View readiness report' }).first().click();
  await expect(page.getByTestId('report-readiness')).toHaveText('40%');
  await expect(page.getByTestId('report-after-review')).toContainText('60%');
  await expect(page.getByText('Completion acts compared with the tender scope.')).toBeVisible();

  await page.getByLabel(/I have reviewed every requirement/).check();
  await page.getByRole('button', { name: 'Confirm review' }).click();
  await expect(page.getByText(/Review confirmed on 12.11.2026/)).toBeVisible();
  await expect(page.getByText('not legal verification', { exact: false })).toBeVisible();
});

test('editing the profile changes the evaluation and persists; reset restores the demo', async ({ page, errors }) => {
  void errors;
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.locator('#cert-cert-1-exp').fill('2028-01-31');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Profile saved in this browser.')).toBeVisible();
  await expect(page.getByText('Valid until 31.01.2028')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Valid until 31.01.2028')).toBeVisible();

  await startDemoAnalysis(page);
  await expectCounts(page, 3, 1, 1, 60);
  await expect(page.getByTestId('requirement-req-2')).toHaveAttribute('data-status', 'MET');

  await page.goto('/profile');
  await page.getByRole('button', { name: 'Reset demo data' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('Demo data restored.')).toBeVisible();
  await expect(page.getByText('Expired on 30.06.2025')).toBeVisible();
  await startDemoAnalysis(page);
  await expectCounts(page, 2, 2, 1, 40);
});

test('profile validation blocks invalid saves', async ({ page, errors }) => {
  void errors;
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByLabel(/Company name/).fill('');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('alert').first()).toContainText('Please correct the highlighted fields');
  await expect(page.getByLabel(/Company name/)).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Discard changes' }).click();
  await expect(page.getByRole('heading', { name: 'Astana Build Solutions LLP' })).toBeVisible();
});

test('boundary case A: an incomplete profile blocks the analysis with an explanation', async ({ page, errors }) => {
  void errors;
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Incomplete profile (boundary case)' }).click();
  await expect(page.getByRole('alert').first()).toContainText('The company name is missing');
  await page.goto('/tender');
  await expect(page.getByRole('alert').first()).toContainText('The company name is missing');
  await expect(page.getByRole('button', { name: 'Start Analysis' })).toBeDisabled();
  await page.goto('/dashboard');
  await expect(page.getByText('Complete the company profile: the company name is missing.')).toBeVisible();
});

test('renewed scenario shows the effect of fixing the evidence', async ({ page, errors }) => {
  void errors;
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Renewed ISO 9001 and audited statement' }).click();
  await startDemoAnalysis(page);
  await expectCounts(page, 4, 0, 1, 80);
});
