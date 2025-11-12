/**
 * Authentication Setup for Playwright Tests
 *
 * This file handles authentication before running tests.
 * It logs in as an admin user and saves the authentication state.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// WordPress admin credentials (from wp-env defaults)
const ADMIN_USER = process.env.WP_ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'password';

test('authenticate as admin', async ({ page, context }) => {
	// Navigate to WordPress login page
	await page.goto('/wp-login.php');

	// Fill in login form
	await page.fill('input[name="log"]', ADMIN_USER);
	await page.fill('input[name="pwd"]', ADMIN_PASSWORD);

	// Click login button
	await page.click('input[name="wp-submit"]');

	// Wait for navigation to complete
	await page.waitForURL('/wp-admin/');

	// Verify we're logged in by checking for admin bar
	await expect(page.locator('#wpadminbar')).toBeVisible();

	// Save authentication state
	const storageStatePath =
		process.env.STORAGE_STATE_PATH ||
		path.join(process.cwd(), 'artifacts/storage-states/admin.json');

	// Ensure directory exists
	const dir = path.dirname(storageStatePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	// Save storage state
	await context.storageState({ path: storageStatePath });

	console.log('✓ Authentication successful - state saved');
});
