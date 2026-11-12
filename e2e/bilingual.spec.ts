import { test, expect, expectCounts, openCard } from './fixtures';

test('Kazakh can be selected, sets lang="kk" and persists across navigation and refresh', async ({ page, errors }) => {
  void errors;
  await page.goto('/');
  await page.getByRole('button', { name: 'Қазақша' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Тендерлік шешімдерді');
  await expect(page.getByRole('link', { name: 'Демоны байқап көру' }).first()).toBeVisible();

  await page.getByRole('navigation', { name: 'Негізгі навигация' }).getByRole('link', { name: 'Компания профилі' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Компания профилі');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Компания профилі');

  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Company Profile');
});

test('complete core journey in Kazakh, with the same results as in English', async ({ page, errors }) => {
  void errors;
  await page.goto('/');
  await page.getByRole('button', { name: 'Қазақша' }).click();
  await page.getByRole('link', { name: 'Демоны байқап көру' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Басқару тақтасы');
  await page.getByRole('navigation', { name: 'Негізгі навигация' }).getByRole('link', { name: 'Тендерді таңдау' }).click();
  await expect(page.getByRole('heading', { name: 'Тендер талаптары' })).toBeVisible();
  await page.getByRole('button', { name: 'Талдауды бастау', exact: true }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Тендерлік талдау');
  await expectCounts(page, 2, 2, 1, 40);
  const iso = page.getByTestId('requirement-req-2');
  await expect(iso.getByText('Жетіспейді').first()).toBeVisible();
  await openCard(iso);
  await expect(iso.getByTestId('reason')).toContainText('мерзімі 30.06.2025 өткен');
  await expect(page.getByText('Түпкілікті сәйкестік пен қатысу туралы шешімдерді білікті маман тексеруі тиіс.').first()).toBeVisible();

  // Work is not lost when switching language mid-review
  await iso.getByLabel('Тексерушінің ескертпесі').fill('Сертификат жаңартылуда');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(iso.getByLabel('Reviewer note')).toHaveValue('Сертификат жаңартылуда');
  await expect(iso.getByTestId('reason')).toContainText('expired on 30.06.2025');
  await page.getByRole('button', { name: 'Қазақша' }).click();

  await page.getByRole('link', { name: 'Дайындық есебін көру' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Дайындық есебі');
  await expect(page.getByRole('heading', { name: /Жетіспейтін талаптар/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Тексеруді қажет етеді/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Есепті жүктеп алу/ })).toBeVisible();
  await expect(page.getByText('Формула: Сәйкес (2) ÷ Барлығы (5) × 100 = 40%')).toBeVisible();

  await page.getByRole('link', { name: 'Кері байланыс қалдыру' }).click();
  await page.getByRole('button', { name: 'Пікірді сақтау' }).click();
  await expect(page.getByRole('alert').first()).toContainText('Барлық міндетті сұрақтарға жауап беріңіз.');
});

test('Kazakh validation and upload error messages', async ({ page, errors }) => {
  void errors;
  await page.goto('/tender');
  await page.getByRole('button', { name: 'Қазақша' }).click();
  await page.getByTestId('tender-file-input').setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  await expect(page.getByText('Қолдау көрсетілмейтін файл түрі. PDF құжатын (.pdf) таңдаңыз.')).toBeVisible();
  await page.getByRole('button', { name: 'Қолмен талдауды бастау' }).click();
  await expect(page.getByText('Кемінде бір талапты енгізіңіз.')).toBeVisible();
});
