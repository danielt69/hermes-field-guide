import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const chapters = JSON.parse(await readFile(new URL('../src/data/chapters.json', import.meta.url), 'utf8'));
const base = process.env.BASE_URL || 'http://127.0.0.1:5178/hermes-field-guide/';
await mkdir('verification', { recursive: true });
const browser = await chromium.launch(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : { channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', permissions: ['clipboard-read','clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const report = { base, layouts: [], accessibility: [], interactions: [], errors };
try {
  await page.goto(base);
  await expect(page.locator('h1')).toContainText('Your intelligence.');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'verification/desktop-dark.png' });
  for (const theme of ['dark', 'light']) {
    await page.evaluate(t => { document.documentElement.dataset.theme = t; document.documentElement.classList.toggle('dark', t === 'dark'); }, theme);
    for (const chapter of chapters) {
      await page.goto(`${base}#/${chapter.id}`);
      await expect(page.locator('.prose')).not.toBeEmpty();
      for (const width of [320,375,390,768,1024,1280,1440]) {
        await page.setViewportSize({ width, height: 900 });
        const size = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, expected: document.documentElement.clientWidth }));
        expect(size.actual, `${theme} ${chapter.id} at ${width}`).toBeLessThanOrEqual(size.expected);
        report.layouts.push({ theme, chapter: chapter.id, width, ...size });
      }
      const ids = await page.locator('.prose h2,.prose h3').evaluateAll(elements => elements.map(e => e.id));
      expect(ids.every(Boolean)).toBe(true);
      expect(new Set(ids).size).toBe(ids.length);
      if (['overview', 'jarvis', 'startup-team'].includes(chapter.id)) {
        const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
        report.accessibility.push({ theme, chapter: chapter.id, violations: result.violations });
      }
    }
  }
  await page.goto(`${base}#/overview`);
  await page.getByRole('button', { name: 'Search the guide', exact: true }).click();
  const search = page.getByRole('searchbox', { name: 'Search chapters' });
  await expect(search).toBeFocused();
  const searchAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.push({ theme: 'dark', chapter: 'search', violations: searchAxe.violations });
  await search.fill('Porcupine');
  await expect(page.getByRole('menuitem')).toHaveCount(1);
  await search.press('ArrowDown'); await search.press('Enter');
  await expect(page).toHaveURL(/#\/jarvis$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  report.interactions.push('Full-body search, keyboard result selection and modal dismissal');
  await page.getByRole('button', { name: 'Mark as read', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Marked as read', exact: true })).toHaveAttribute('aria-pressed', 'true');
  report.interactions.push('Progress survives reload');
  await page.locator('.code-toolbar button').first().click();
  await expect(page.locator('.code-toolbar button').first()).toHaveAccessibleName('Copied code');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('hermes profile create');
  report.interactions.push('Clipboard copy');
  await page.locator('.page-toc a').filter({ hasText: 'Phase 4' }).click();
  await expect.poll(async () => (await page.locator('#phase-4-memory-retrieval-and-knowledge').boundingBox()).y).toBeGreaterThanOrEqual(75);
  await expect.poll(async () => (await page.locator('#phase-4-memory-retrieval-and-knowledge').boundingBox()).y).toBeLessThan(150);
  report.interactions.push('Deep-link heading offset');
  await page.goto(`${base}#/jarvis`);
  await page.screenshot({ path: 'verification/tutorial-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'verification/tutorial-mobile.png' });
  await page.getByRole('button', { name: 'Chapters', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('link').filter({ hasText: 'Startup team' }).click();
  await expect(page).toHaveURL(/#\/startup-team$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  report.interactions.push('Mobile chapter sheet and navigation');
  await page.getByRole('button', { name: 'Preferences', exact: true }).click();
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.getByRole('button', { name: 'Compact', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-density','compact');
  const sheetAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.push({ theme: 'light', chapter: 'preferences', violations: sheetAxe.violations });
  await page.getByRole('button', { name: 'Reset progress', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm reset', exact: true }).click();
  await page.getByRole('button', { name: 'Close reading preferences', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('hermes-guide-v2-progress')))).toEqual([]);
  report.interactions.push('Theme/density persistence and confirmed progress reset');
  await page.goto(`${base}#/overview`);
  await page.screenshot({ path: 'verification/mobile-light.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'verification/desktop-light.png' });
  await page.getByRole('button', { name: 'Search the guide', exact: true }).click();
  await search.fill('zzzz-no-result');
  await expect(page.getByText('No matching chapter.', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'verification/search-light.png' });
  const emptyAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.push({ theme: 'light', chapter: 'empty-search', violations: emptyAxe.violations });
  await page.keyboard.press('Escape');
  await page.goto(`${base}#tools`);
  await expect(page.locator('h1')).toHaveText('Tools & skills');
  report.interactions.push('Empty search and legacy routes');
  await page.goto(`${base}#/overview`);
  expect(await page.locator('.reactor-orbit').first().evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  report.interactions.push('Reduced-motion preference');
  const allViolations = report.accessibility.flatMap(item => item.violations);
  expect(allViolations, JSON.stringify(allViolations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))).toEqual([]);
  expect(errors).toEqual([]);
  console.log(JSON.stringify({ layoutChecks: report.layouts.length, accessibilityChecks: report.accessibility.length, interactions: report.interactions, errors }, null, 2));
} finally {
  await writeFile('verification/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
