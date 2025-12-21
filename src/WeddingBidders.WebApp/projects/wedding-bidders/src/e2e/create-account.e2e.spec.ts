import { test, expect } from '@playwright/test';

test.describe('Create Account Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create-account');
  });

  test('should display create account form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByLabel('Invitation Token')).toBeVisible();
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('should have disabled submit button when form is empty', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Create Account' });
    await expect(submitButton).toBeDisabled();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').click();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('should show validation error when passwords do not match', async ({ page }) => {
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('different123');
    await page.getByLabel('First Name').click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: 'Already have an account? Sign in' });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL('/login');
  });

  test('should enable submit button when form is valid', async ({ page }) => {
    await page.route('**/api/user/exists/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'false'
      });
    });

    await page.getByLabel('Invitation Token').fill('valid-token');
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john@test.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');

    const submitButton = page.getByRole('button', { name: 'Create Account' });
    await expect(submitButton).toBeEnabled();
  });

  test('should show success message and redirect to login on successful account creation', async ({ page }) => {
    await page.route('**/api/user/exists/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'false'
      });
    });

    await page.route('**/api/profile', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            profileId: '456',
            userId: '123'
          })
        });
      }
    });

    await page.getByLabel('Invitation Token').fill('valid-token');
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john@test.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Account created successfully')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
  });
});
