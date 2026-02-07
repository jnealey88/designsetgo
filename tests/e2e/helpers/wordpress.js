/**
 * WordPress Helper Functions for Playwright Tests
 *
 * Utilities for interacting with WordPress admin and block editor.
 * Compatible with WordPress 6.4+ which renders the editor inside an iframe.
 */

/**
 * Get the editor canvas frame locator.
 * WordPress 6.4+ renders block content inside an iframe named "editor-canvas".
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @return {import('@playwright/test').FrameLocator} Frame locator for the editor canvas
 */
function getEditorCanvas(page) {
	return page.frameLocator('iframe[name="editor-canvas"]');
}

/**
 * Create a new post in the block editor
 *
 * @param {import('@playwright/test').Page} page     - Playwright page object
 * @param {string}                          postType - Post type (post, page, etc.)
 */
async function createNewPost(page, postType = 'post') {
	await page.goto(`/wp-admin/post-new.php?post_type=${postType}`);

	// WordPress 6.4+ renders the block editor inside an iframe.
	// Wait for the editor canvas iframe to load.
	await page.locator('iframe[name="editor-canvas"]').waitFor({
		timeout: 30000,
	});

	// Ensure the content inside the iframe is ready
	const canvas = getEditorCanvas(page);
	await canvas.locator('body').waitFor({ timeout: 15000 });

	// Close any modal dialogs (welcome guide, etc.)
	// These are rendered in the top-level page, not inside the iframe.
	try {
		const closeButton = page.locator(
			'.components-modal__header button[aria-label="Close"]'
		);
		await closeButton.first().click({ timeout: 2000 });
	} catch {
		// No dialog to close
	}
}

/**
 * Insert a block by name
 *
 * @param {import('@playwright/test').Page} page      - Playwright page object
 * @param {string}                          blockName - Block name (e.g., 'core/paragraph', 'core/group')
 */
async function insertBlock(page, blockName) {
	const blockSlug = blockName.split('/').pop();
	const blockLabel = blockSlug.charAt(0).toUpperCase() + blockSlug.slice(1);

	// Open the global block inserter via the toolbar toggle
	const inserterToggle = page.getByRole('button', {
		name: 'Toggle block inserter',
	});
	await inserterToggle.click();

	// Wait for the inserter panel to appear and search for the block
	const searchInput = page
		.locator(
			'.block-editor-inserter__search input, .components-search-control__input'
		)
		.first();
	await searchInput.waitFor();
	await searchInput.fill(blockLabel);

	// Wait for search results to update
	await page.waitForTimeout(500);

	// Click the first matching block type item
	await page.locator('.block-editor-block-types-list__item').first().click();

	// Wait for the block to be inserted
	await page.waitForTimeout(500);

	// Close the inserter if still open
	const isPressed = await inserterToggle.getAttribute('aria-pressed');
	if (isPressed === 'true') {
		await inserterToggle.click();
	}
}

/**
 * Open block settings sidebar
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function openBlockSettings(page) {
	const settingsButton = page
		.locator('button[aria-label="Settings"]')
		.first();

	// Check if settings sidebar is already open
	const sidebar = page.locator('.editor-sidebar, .edit-post-sidebar');
	const isOpen = await sidebar.first().isVisible().catch(() => false);

	if (!isOpen) {
		await settingsButton.click();
		await sidebar.first().waitFor();
	}

	// Ensure the Block tab is active (not the Post/Page tab)
	const blockTab = page.getByRole('tab', { name: /block/i });
	if (await blockTab.isVisible().catch(() => false)) {
		const isSelected = await blockTab.getAttribute('aria-selected');
		if (isSelected !== 'true') {
			await blockTab.click();
		}
	}
}

/**
 * Save post/page
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function savePost(page) {
	// Click save button
	await page
		.locator(
			'button.editor-post-save-draft, button.editor-post-publish-button__button'
		)
		.first()
		.click();

	// Wait for save to complete
	await page.locator('.editor-post-saved-state.is-saved').waitFor({
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
	await page.locator('.editor-post-publish-panel__toggle').first().click();

	// Wait for publish panel
	await page.locator('.editor-post-publish-panel').waitFor();

	// Click final publish button
	await page
		.locator('.editor-post-publish-panel .editor-post-publish-button')
		.first()
		.click();

	// Wait for the post-publish panel or snackbar confirmation
	await page
		.locator(
			'.editor-post-publish-panel__postpublish, .components-snackbar'
		)
		.first()
		.waitFor({ timeout: 30000 });
}

/**
 * Get the frontend URL of the current post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @return {Promise<string>} Frontend URL
 */
async function getFrontendUrl(page) {
	// After publishing, the post-publish panel contains a view link
	const postPublishPanel = page.locator(
		'.editor-post-publish-panel__postpublish'
	);

	if (await postPublishPanel.isVisible().catch(() => false)) {
		const viewLink = postPublishPanel
			.locator('a[href*="/?p="], a[href*="/?page_id="], a')
			.first();
		const href = await viewLink.getAttribute('href');
		if (href) {
			return href;
		}
	}

	// Fallback: construct URL from the current page's post ID
	const currentUrl = page.url();
	const match = currentUrl.match(/post=(\d+)/);
	if (match) {
		return `/?p=${match[1]}`;
	}

	throw new Error('Could not determine frontend URL');
}

/**
 * Select a block by its data-type attribute.
 * The block content is inside the editor canvas iframe.
 *
 * @param {import('@playwright/test').Page} page      - Playwright page object
 * @param {string}                          blockType - Block type (e.g., 'core/group')
 * @param {number}                          index     - Index of the block (0-based)
 */
async function selectBlock(page, blockType, index = 0) {
	const canvas = getEditorCanvas(page);
	const blocks = canvas.locator(`[data-type="${blockType}"]`);
	await blocks.nth(index).click();
}

/**
 * Check if a block has a specific class.
 * The block content is inside the editor canvas iframe.
 *
 * @param {import('@playwright/test').Page} page      - Playwright page object
 * @param {string}                          blockType - Block type (e.g., 'core/group')
 * @param {string}                          className - Class name to check
 * @param {number}                          index     - Index of the block (0-based)
 * @return {Promise<boolean>} True if the block has the class, false otherwise
 */
async function blockHasClass(page, blockType, className, index = 0) {
	const canvas = getEditorCanvas(page);
	const block = canvas.locator(`[data-type="${blockType}"]`).nth(index);
	const classes = await block.getAttribute('class');
	return classes?.includes(className) || false;
}

module.exports = {
	getEditorCanvas,
	createNewPost,
	insertBlock,
	openBlockSettings,
	savePost,
	publishPost,
	getFrontendUrl,
	selectBlock,
	blockHasClass,
};
