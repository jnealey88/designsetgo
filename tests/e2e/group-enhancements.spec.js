/**
 * E2E Tests for Group Block Enhancements
 *
 * Tests the DesignSetGo enhancements to the core Group block:
 * - Responsive grid columns
 * - Responsive visibility
 * - Clickable groups with links
 * - Overlay functionality
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
	test('should allow setting responsive grid columns', async ({ page }) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Switch to Grid layout using the toolbar
		await page.click('[aria-label="Grid"]');

		// Open block settings
		await openBlockSettings(page);

		// Look for Grid Columns panel (DesignSetGo enhancement)
		const gridPanel = page.locator('text=Grid Columns');
		await expect(gridPanel).toBeVisible();

		// Set desktop columns to 3
		await page.click('text=Grid Columns');
		const desktopInput = page
			.locator('input[aria-label*="Desktop"]')
			.first();
		await desktopInput.fill('3');

		// Set tablet columns to 2
		const tabletInput = page.locator('input[aria-label*="Tablet"]').first();
		await tabletInput.fill('2');

		// Set mobile columns to 1
		const mobileInput = page.locator('input[aria-label*="Mobile"]').first();
		await mobileInput.fill('1');

		// Verify classes are applied
		const hasGridClass = await blockHasClass(
			page,
			'core/group',
			'dsgo-grid-cols-3'
		);
		expect(hasGridClass).toBeTruthy();

		// Save the post
		await savePost(page);
	});

	test('should hide WordPress column controls when DSG grid is active', async ({
		page,
	}) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Switch to Grid layout
		await page.click('[aria-label="Grid"]');

		// Open block settings
		await openBlockSettings(page);

		// Enable DSG grid by setting columns
		await page.click('text=Grid Columns');
		const desktopInput = page
			.locator('input[aria-label*="Desktop"]')
			.first();
		await desktopInput.fill('3');

		// WordPress column control should be hidden
		const wpColumnControl = page.locator(
			'.block-editor-hooks__layout-controls input[aria-label*="Columns" i]'
		);
		await expect(wpColumnControl).toBeHidden();
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

		// Hide on mobile
		const hideOnMobile = page.locator(
			'input[aria-label*="Hide on mobile"]'
		);
		await hideOnMobile.check();

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

		// Hide on tablet and mobile
		await page.check('input[aria-label*="Hide on tablet"]');
		await page.check('input[aria-label*="Hide on mobile"]');

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

		// Enable clickable group
		const enableClick = page.locator(
			'input[aria-label*="Make group clickable"]'
		);
		await enableClick.check();

		// Enter a URL
		const urlInput = page.locator('input[placeholder*="https://"]');
		await urlInput.fill('https://example.com');

		// Set to open in new tab
		const newTabCheckbox = page.locator(
			'input[aria-label*="Open in new tab"]'
		);
		await newTabCheckbox.check();

		// Save the post
		await savePost(page);

		// Publish the post
		await publishPost(page);

		// Get frontend URL
		const previewUrl = await getFrontendUrl(page);

		// Visit the frontend
		await page.goto(previewUrl);

		// Verify the group has the link attributes
		const clickableGroup = page.locator(
			'.wp-block-group.dsgo-clickable-group'
		);
		await expect(clickableGroup).toBeVisible();

		const linkUrl = await clickableGroup.getAttribute('data-link-url');
		expect(linkUrl).toBe('https://example.com');

		const linkTarget =
			await clickableGroup.getAttribute('data-link-target');
		expect(linkTarget).toBe('_blank');
	});
});

test.describe('Group Block - Overlay', () => {
	test('should allow adding overlay to group', async ({ page }) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Open block settings
		await openBlockSettings(page);

		// Look for Overlay panel
		const overlayPanel = page.locator('text=Overlay');
		await expect(overlayPanel).toBeVisible();

		// Open the panel
		await overlayPanel.click();

		// Enable overlay
		const enableOverlay = page.locator(
			'input[aria-label*="Enable overlay"]'
		);
		await enableOverlay.check();

		// Verify class is applied
		const hasOverlayClass = await blockHasClass(
			page,
			'core/group',
			'has-dsgo-overlay'
		);
		expect(hasOverlayClass).toBeTruthy();

		// Save the post
		await savePost(page);
	});

	test('should apply white text color with overlay', async ({ page }) => {
		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Group block
		await insertBlock(page, 'core/group');

		// Add a paragraph inside the group
		await page.keyboard.press('Enter');
		await page.keyboard.type('This is test text');

		// Select the group block
		await selectBlock(page, 'core/group');

		// Open block settings and enable overlay
		await openBlockSettings(page);
		await page.click('text=Overlay');
		await page.check('input[aria-label*="Enable overlay"]');

		// Save and publish
		await savePost(page);
		await publishPost(page);

		// Get frontend URL
		const previewUrl = await getFrontendUrl(page);

		// Visit the frontend
		await page.goto(previewUrl);

		// Check that text inside overlay group is white
		const overlayGroup = page.locator('.wp-block-group.has-dsgo-overlay');
		await expect(overlayGroup).toBeVisible();

		const textElement = overlayGroup.locator('p').first();
		const color = await textElement.evaluate(
			(el) => window.getComputedStyle(el).color
		);

		// White color is rgb(255, 255, 255)
		expect(color).toContain('255');
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
		await page.check('input[aria-label*="Hide on mobile"]');

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
