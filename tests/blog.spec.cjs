const { test, expect } = require('@playwright/test');
const path = require('node:path');
const postTitle = 'python 各种库不同版本出错采坑记录';

test.beforeEach(async ({ page }) => {
  // The historical MySQL post contains one third-party image; isolate its host in browser tests.
  await page.route('https://img-blog.csdnimg.cn/**', route => route.fulfill({
    path: path.join(__dirname, '../themes/Cxo/source/img/assets/cat.png'), contentType: 'image/png',
  }));
});

test('restores four posts with local assets under the Pages subpath', async ({ page }) => {
  const errors = [];
  const failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: "Sud0x67's Blog", exact: true })).toBeVisible();
  await expect(page.locator('.recent-post-item')).toHaveCount(4);
  await expect(page.getByRole('link', { name: postTitle, exact: true })).toHaveAttribute('href', /\/blog\/2021\/07\/12\//);
  expect(await page.locator('#cxo-intro').evaluate(el => getComputedStyle(el).backgroundImage)).toContain('/blog/img/intro/index-bg.png');
  await expect(page.locator('.intro-social a[title="github"]')).toHaveAttribute('href', /github.com\/sud0x67/);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('opens and refreshes a post, then follows a real tag link', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: postTitle, exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/2021\/07\/12\//);
  await expect(page.locator('#post')).not.toBeEmpty();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: postTitle, exact: true })).toBeVisible();
  await page.locator('.post-intro-tags a').filter({ hasText: 'python' }).click();
  await expect(page).toHaveURL(/\/blog\/tags\/python\//);
  await expect(page.locator('.article-sort-item__title')).toHaveText(postTitle);
});

test('supports the mobile menu, profile and narrow layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await page.getByRole('button', { name: '展开个人资料' }).click();
  await expect(page.getByRole('button', { name: '收起个人资料' })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: '收起个人资料' }).click();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByLabel('展开导航', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'Directory', exact: true })).toHaveAttribute('href', 'https://sud0x67.github.io/');
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/about\/$/);
  await expect(page.getByRole('heading', { name: 'About', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 720 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('opens article images with keyboard dismissal', async ({ page }) => {
  await page.goto('./2021/07/10/mysql-8-0-安装时无设置密码界面/');
  await page.getByRole('link', { name: /查看图片：/ }).click();
  await expect(page.getByRole('dialog', { name: '查看图片' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: '查看图片' })).not.toBeVisible();
});
