/**
 * E2E Tests for Group Block Enhancements
 *
 * Tests the DesignSetGo enhancements to the core Group block:
 * - Responsive visibility
 * - Clickable groups with links
 */

const { test, expect } = require('@playwright/test');
const {
	createNewPost,
	insertBlock,
	openBlockSettings,
	savePost,
	publishPost,
	getFrontendUrl,
	selectBlock,
	blockHasClass,
} = require('./helpers/wordpress');

test.describe('Group Block - Responsive Grid', () => {
	// Grid Columns (Desktop/Tablet/Mobile) is a feature of the designsetgo/grid
	// block, not an extension on core/group. Skip until a group grid extension
	// is implemented.
	test.skip('should allow setting responsive grid columns', async ({
		page,
	}) => {
		await createNewPost(page, 'post');
		await insertBlock(page, 'core/group');
		await selectBlock(page, 'core/group');
		await page.click('[aria-label="Grid"]');
		await openBlockSettings(page);
		const gridPanel = page.locator('text=Grid Columns');
		await expect(gridPanel).toBeVisible();
	});

	test.skip('should hide WordPress column controls when DSG grid is active', async ({
		page,
	}) => {
		await createNewPost(page, 'post');
		await insertBlock(page, 'core/group');
		await selectBlock(page, 'core/group');
		await page.click('[aria-label="Grid"]');
		await openBlockSettings(page);
	});
});

test.describe('Group Block - Responsive Visibility', () => {
	test('should allow hiding group on specific devices', async ({ page }) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Open block settings
		await openBlockSettings(page);

		// Look for Responsive Visibility panel
		const visibilityPanel = page.locator('text=Responsive Visibility');
		await expect(visibilityPanel).toBeVisible();

		// Open the panel
		await visibilityPanel.click();

		// Hide on mobile — ToggleControl renders as a checkbox with a <label>
		await page.getByLabel(/Hide on Mobile/i).check();

		// Verify class is applied
		const hasMobileHiddenClass = await blockHasClass(
			page,
			'core/group',
			'dsgo-hide-mobile'
		);
		expect(hasMobileHiddenClass).toBeTruthy();

		// Save the post
		await savePost(page);
	});

	test('should work with multiple visibility options', async ({ page }) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Open block settings
		await openBlockSettings(page);

		// Open visibility panel
		await page.click('text=Responsive Visibility');

		// Hide on tablet and mobile — ToggleControl renders as a checkbox
		await page.getByLabel(/Hide on Tablet/i).check();
		await page.getByLabel(/Hide on Mobile/i).check();

		// Verify both classes are applied
		const hasTabletHidden = await blockHasClass(
			page,
			'core/group',
			'dsgo-hide-tablet'
		);
		const hasMobileHidden = await blockHasClass(
			page,
			'core/group',
			'dsgo-hide-mobile'
		);

		expect(hasTabletHidden).toBeTruthy();
		expect(hasMobileHidden).toBeTruthy();
	});
});

test.describe('Group Block - Clickable with Link', () => {
	test('should allow making group clickable', async ({ page }) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Open block settings
		await openBlockSettings(page);

		// Look for Link Settings panel
		const linkPanel = page.locator('text=Link Settings');
		await expect(linkPanel).toBeVisible();

		// Open the panel
		await linkPanel.click();

		// Enter a URL — no separate "enable" toggle; URL field is always visible
		const urlInput = page.locator('input[placeholder*="https://"]');
		await urlInput.fill('https://example.com');

		// Set to open in new tab — ToggleControl renders as checkbox
		await page.getByLabel(/Open in new tab/i).check();

		// Save the post
		await savePost(page);

		// Publish the post
		await publishPost(page);

		// Get frontend URL
		const previewUrl = await getFrontendUrl(page);

		// Visit the frontend
		await page.goto(previewUrl);

		// Verify the group has the link attributes (class is dsgo-clickable)
		const clickableGroup = page.locator('.wp-block-group.dsgo-clickable');
		await expect(clickableGroup).toBeVisible();

		const linkUrl = await clickableGroup.getAttribute('data-link-url');
		expect(linkUrl).toBe('https://example.com');

		const linkTarget =
			await clickableGroup.getAttribute('data-link-target');
		expect(linkTarget).toBe('_blank');
	});
});

test.describe('Group Block - Overlay', () => {
	// Overlay is not implemented as an extension on core/group.
	// Individual blocks (section, card, slide) have their own overlay support.
	test.skip('should allow adding overlay to group', async ({ page }) => {
		await createNewPost(page, 'post');
		await insertBlock(page, 'core/group');
		await selectBlock(page, 'core/group');
		await openBlockSettings(page);
	});

	test.skip('should apply white text color with overlay', async ({
		page,
	}) => {
		await createNewPost(page, 'post');
	});
});

test.describe('Group Block - Frontend Behavior', () => {
	test('should apply responsive visibility classes on frontend', async ({
		page,
		context,
	}) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Set to hide on mobile
		await openBlockSettings(page);
		await page.click('text=Responsive Visibility');
		await page.getByLabel(/Hide on Mobile/i).check();

		// Save and publish
		await savePost(page);
		await publishPost(page);

		// Get frontend URL
		const previewUrl = await getFrontendUrl(page);

		// Visit on desktop (default viewport)
		await page.goto(previewUrl);
		const desktopGroup = page.locator('.wp-block-group.dsgo-hide-mobile');
		await expect(desktopGroup).toBeVisible();

		// Create a new page with mobile viewport
		const mobilePage = await context.newPage();
		await mobilePage.setViewportSize({ width: 375, height: 667 });
		await mobilePage.goto(previewUrl);

		// Group should be hidden on mobile
		const mobileGroup = mobilePage.locator(
			'.wp-block-group.dsgo-hide-mobile'
		);
		await expect(mobileGroup).toBeHidden();

		await mobilePage.close();
	});
});
