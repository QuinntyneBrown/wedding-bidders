import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await page.goto('/workspace');
    await expect(page).toHaveURL('/login');
  });

  test('should allow access to workspace when authenticated', async ({ page }) => {
    // Set up auth token
    await page.addInitScript(() => {
      localStorage.setItem('weddingbidders:accessToken', 'valid-token');
    });

    await page.route('**/api/user/current', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: '123',
          username: 'test@test.com',
          roles: ['Member']
        })
      });
    });

    await page.route('**/api/profile/current', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profileId: '456',
          userId: '123',
          firstname: 'John',
          lastname: 'Doe'
        })
      });
    });

    await page.goto('/workspace');
    await expect(page).toHaveURL('/workspace');
    await expect(page.getByText('test@test.com')).toBeVisible();
  });

  test('should logout and redirect to login', async ({ page }) => {
    // Set up auth token
    await page.addInitScript(() => {
      localStorage.setItem('weddingbidders:accessToken', 'valid-token');
    });

    await page.route('**/api/user/current', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: '123',
          username: 'test@test.com',
          roles: ['Member']
        })
      });
    });

    await page.route('**/api/profile/current', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profileId: '456',
          userId: '123',
          firstname: 'John',
          lastname: 'Doe'
        })
      });
    });

    await page.goto('/workspace');
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL('/login');
  });

  test('should redirect to login when token is expired (401 response)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('weddingbidders:accessToken', 'expired-token');
    });

    await page.route('**/api/user/current', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Token expired' })
      });
    });

    await page.goto('/workspace');

    // After getting 401, should be redirected to login
    await expect(page).toHaveURL('/login');
  });
});
