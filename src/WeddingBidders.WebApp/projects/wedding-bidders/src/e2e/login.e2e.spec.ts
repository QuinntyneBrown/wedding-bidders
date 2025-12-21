import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should have disabled submit button when form is empty', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await expect(submitButton).toBeDisabled();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').click();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('should enable submit button when form is valid', async ({ page }) => {
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Password').fill('password123');

    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await expect(submitButton).toBeEnabled();
  });

  test('should have link to create account page', async ({ page }) => {
    const createAccountLink = page.getByRole('link', { name: 'Create an account' });
    await expect(createAccountLink).toBeVisible();
    await createAccountLink.click();
    await expect(page).toHaveURL('/create-account');
  });

  test('should show error message on failed login', async ({ page }) => {
    await page.route('**/api/user/token', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid username or password' })
      });
    });

    await page.getByLabel('Email').fill('wrong@test.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('should redirect to workspace on successful login', async ({ page }) => {
    await page.route('**/api/user/token', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: '123',
          token: 'jwt-token',
          refreshToken: 'refresh-token'
        })
      });
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

    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/workspace');
  });
});
