/**
 * WordPress Helper Functions for Playwright Tests
 *
 * Utilities for interacting with WordPress admin and block editor.
 */

/**
 * Create a new post in the block editor
 *
 * @param {import('@playwright/test').Page} page     - Playwright page object
 * @param {string}                          postType - Post type (post, page, etc.)
 */
async function createNewPost(page, postType = 'post') {
	await page.goto(`/wp-admin/post-new.php?post_type=${postType}`);

	// Wait for editor to load
	await page.waitForSelector('.block-editor-writing-flow', {
		timeout: 30000,
	});

	// Close welcome guide if it appears
	const welcomeGuide = page.locator('.edit-post-welcome-guide');
	if (await welcomeGuide.isVisible()) {
		await page.click('button[aria-label="Close"]');
	}

	// Close any other modal dialogs
	const closeButtons = page.locator(
		'.components-modal__screen-overlay button[aria-label="Close"]'
	);
	const count = await closeButtons.count();
	for (let i = 0; i < count; i++) {
		await closeButtons.nth(i).click();
	}
}

/**
 * Insert a block by name
 *
 * @param {import('@playwright/test').Page} page      - Playwright page object
 * @param {string}                          blockName - Block name (e.g., 'core/paragraph', 'core/group')
 */
async function insertBlock(page, blockName) {
	// Click the block inserter
	await page.click('.edit-post-header-toolbar__inserter-toggle');

	// Wait for inserter panel
	await page.waitForSelector('.block-editor-inserter__menu');

	// Search for the block
	await page.fill('.block-editor-inserter__search input', blockName);

	// Wait for search results
	await page.waitForTimeout(500);

	// Click the first result
	await page.click(
		`.block-editor-block-types-list__item[data-id="${blockName}"]`
	);

	// Wait for block to be inserted
	await page.waitForTimeout(500);
}

/**
 * Open block settings sidebar
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function openBlockSettings(page) {
	const settingsButton = page.locator('button[aria-label="Settings"]');

	// Check if settings sidebar is already open
	const isOpen = await page.locator('.edit-post-sidebar').isVisible();

	if (!isOpen) {
		await settingsButton.click();
		await page.waitForSelector('.edit-post-sidebar');
	}
}

/**
 * Save post/page
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function savePost(page) {
	// Click save button
	await page.click(
		'.editor-post-publish-button__button, .editor-post-save-draft'
	);

	// Wait for save to complete
	await page.waitForSelector('.editor-post-saved-state.is-saved', {
		timeout: 30000,
	});
}

/**
 * Publish post/page
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function publishPost(page) {
	// Click publish button
	await page.click('.editor-post-publish-panel__toggle');

	// Wait for publish panel
	await page.waitForSelector('.editor-post-publish-panel');

	// Click final publish button
	await page.click('.editor-post-publish-button');

	// Wait for success message
	await page.waitForSelector('.components-snackbar', { timeout: 30000 });
}

/**
 * Get the frontend URL of the current post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @return {Promise<string>} Frontend URL
 */
async function getFrontendUrl(page) {
	// Wait for post to be saved/published
	await page.waitForSelector(
		'.editor-post-saved-state.is-saved, .editor-post-publish-panel__postpublish'
	);

	// Get the preview link
	const previewButton = page.locator('.editor-post-preview__button-resize');
	await previewButton.click();

	const previewLink = page.locator(
		'.edit-post-header-preview__grouping-external a'
	);
	const href = await previewLink.getAttribute('href');

	return href;
}

/**
 * Select a block by its data-type attribute
 *
 * @param {import('@playwright/test').Page} page      - Playwright page object
 * @param {string}                          blockType - Block type (e.g., 'core/group')
 * @param {number}                          index     - Index of the block (0-based)
 */
async function selectBlock(page, blockType, index = 0) {
	const blocks = page.locator(`[data-type="${blockType}"]`);
	await blocks.nth(index).click();
}

/**
 * Check if a block has a specific class
 *
 * @param {import('@playwright/test').Page} page      - Playwright page object
 * @param {string}                          blockType - Block type (e.g., 'core/group')
 * @param {string}                          className - Class name to check
 * @param {number}                          index     - Index of the block (0-based)
 * @return {Promise<boolean>} True if the block has the class, false otherwise
 */
async function blockHasClass(page, blockType, className, index = 0) {
	const block = page.locator(`[data-type="${blockType}"]`).nth(index);
	const classes = await block.getAttribute('class');
	return classes?.includes(className) || false;
}

module.exports = {
	createNewPost,
	insertBlock,
	openBlockSettings,
	savePost,
	publishPost,
	getFrontendUrl,
	selectBlock,
	blockHasClass,
};
