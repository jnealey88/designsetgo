/**
 * Standalone script to inspect Container block content width
 * Run with: node inspect-container.js
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
	console.log('\n=== CONTAINER CONTENT WIDTH INSPECTION ===\n');

	// Launch browser
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext({
		viewport: { width: 1920, height: 1080 }
	});
	const page = await context.newPage();

	try {
		// 1. Login to WordPress
		console.log('1. Logging in to WordPress...');
		await page.goto('http://localhost:8888/wp-login.php');
		await page.fill('input[name="log"]', 'admin');
		await page.fill('input[name="pwd"]', 'password');
		await page.click('input[name="wp-submit"]');
		await page.waitForURL('**/wp-admin/**');
		console.log('   ✓ Logged in');

		// 2. Create new post
		console.log('\n2. Creating new post...');
		await page.goto('http://localhost:8888/wp-admin/post-new.php');
		await page.waitForSelector('.block-editor-writing-flow', { timeout: 30000 });

		// Close welcome guide if it appears
		const welcomeGuide = page.locator('.edit-post-welcome-guide');
		if (await welcomeGuide.isVisible()) {
			await page.click('button[aria-label="Close"]');
		}
		console.log('   ✓ Editor loaded');

		// 3. Insert Container block
		console.log('\n3. Inserting Container block...');
		await page.click('.edit-post-header-toolbar__inserter-toggle');
		await page.waitForSelector('.block-editor-inserter__menu');
		await page.fill('.block-editor-inserter__search input', 'designsetgo/container');
		await page.waitForTimeout(500);
		await page.click('.block-editor-block-types-list__item[data-id="designsetgo/container"]');
		await page.waitForTimeout(1000);
		console.log('   ✓ Container block inserted');

		// 4. Add content inside
		console.log('\n4. Adding nested content...');
		await page.keyboard.type('Test Heading');
		await page.keyboard.press('Enter');
		await page.keyboard.type('This is a test paragraph.');
		console.log('   ✓ Content added');

		// 5. Select container and enable content width
		console.log('\n5. Enabling content width constraint...');
		const container = page.locator('[data-type="designsetgo/container"]').first();
		await container.click();
		await page.waitForTimeout(500);

		// Open settings sidebar
		const settingsButton = page.locator('button[aria-label="Settings"]');
		const isOpen = await page.locator('.edit-post-sidebar').isVisible();
		if (!isOpen) {
			await settingsButton.click();
			await page.waitForSelector('.edit-post-sidebar');
		}

		// Click Inner blocks panel
		const innerBlocksPanel = page.locator('button:has-text("Inner blocks")');
		await innerBlocksPanel.click();
		await page.waitForTimeout(500);

		// Enable content width
		const contentWidthToggle = page.locator('input[aria-label*="Inner blocks use content width"]');
		await contentWidthToggle.check();
		await page.waitForTimeout(1000);
		console.log('   ✓ Content width enabled');

		// 6. INSPECT EDITOR
		console.log('\n=== EDITOR INSPECTION ===');

		const innerWrapper = container.locator('.dsg-container__inner-wrapper');
		const innerContainer = container.locator('.dsg-container__inner');

		// Get inline styles
		const editorInlineStyle = await innerWrapper.getAttribute('style');
		console.log('Editor wrapper inline styles:', editorInlineStyle);

		const innerContainerInlineStyle = await innerContainer.getAttribute('style');
		console.log('Editor inner container inline styles:', innerContainerInlineStyle);

		// Get computed styles
		const editorComputedStyles = await innerWrapper.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				maxWidth: computed.maxWidth,
				marginLeft: computed.marginLeft,
				marginRight: computed.marginRight,
				width: computed.width,
			};
		});
		console.log('Editor computed styles:', editorComputedStyles);

		// Get bounding box
		const editorBox = await innerWrapper.boundingBox();
		console.log('Editor bounding box:', editorBox);

		// Check style presence
		const editorHasMaxWidth = editorInlineStyle && editorInlineStyle.includes('max-width');
		const editorHasMarginAuto = editorInlineStyle && editorInlineStyle.includes('margin-left: auto');
		console.log('\nEditor Style Checks:');
		console.log('- Has max-width inline style:', editorHasMaxWidth);
		console.log('- Has margin-left: auto:', editorHasMarginAuto);

		// Get HTML structure
		const editorHTML = await container.evaluate((el) => el.outerHTML);
		console.log('\nEditor HTML (first 800 chars):');
		console.log(editorHTML.substring(0, 800));

		// 7. Publish post
		console.log('\n7. Publishing post...');
		await page.click('.editor-post-publish-panel__toggle');
		await page.waitForSelector('.editor-post-publish-panel');
		await page.click('.editor-post-publish-button');
		await page.waitForSelector('.components-snackbar', { timeout: 30000 });
		console.log('   ✓ Post published');

		// Get frontend URL
		const previewButton = page.locator('.edit-post-header-preview__button-external');
		const frontendUrl = await previewButton.getAttribute('href');
		console.log('   Frontend URL:', frontendUrl);

		// 8. INSPECT FRONTEND
		console.log('\n=== FRONTEND INSPECTION ===');

		await page.goto(frontendUrl);
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		const frontendContainer = page.locator('.dsg-container').first();
		const frontendInnerWrapper = frontendContainer.locator('.dsg-container__inner-wrapper');
		const frontendInnerContainer = frontendContainer.locator('.dsg-container__inner');

		const wrapperExists = await frontendInnerWrapper.count() > 0;
		console.log('Inner wrapper exists on frontend:', wrapperExists);

		if (wrapperExists) {
			// Get inline styles
			const frontendInlineStyle = await frontendInnerWrapper.getAttribute('style');
			console.log('\nFrontend wrapper inline styles:', frontendInlineStyle);

			const frontendInnerInlineStyle = await frontendInnerContainer.getAttribute('style');
			console.log('Frontend inner container inline styles:', frontendInnerInlineStyle);

			// Get computed styles
			const frontendComputedStyles = await frontendInnerWrapper.evaluate((el) => {
				const computed = window.getComputedStyle(el);
				return {
					maxWidth: computed.maxWidth,
					marginLeft: computed.marginLeft,
					marginRight: computed.marginRight,
					width: computed.width,
					display: computed.display,
				};
			});
			console.log('Frontend computed styles:', frontendComputedStyles);

			// Get bounding box
			const frontendBox = await frontendInnerWrapper.boundingBox();
			console.log('Frontend bounding box:', frontendBox);

			// Check style presence
			const frontendHasMaxWidth = frontendInlineStyle && frontendInlineStyle.includes('max-width');
			const frontendHasMarginAuto = frontendInlineStyle && frontendInlineStyle.includes('margin-left: auto');
			console.log('\nFrontend Style Checks:');
			console.log('- Has max-width inline style:', frontendHasMaxWidth);
			console.log('- Has margin-left: auto:', frontendHasMarginAuto);

			// Get HTML structure
			const frontendHTML = await frontendContainer.evaluate((el) => el.outerHTML);
			console.log('\nFrontend HTML (first 800 chars):');
			console.log(frontendHTML.substring(0, 800));

			// Check for overriding CSS rules
			const cssRules = await page.evaluate(() => {
				const innerWrapper = document.querySelector('.dsg-container__inner-wrapper');
				if (!innerWrapper) return [];

				const allRules = [];
				for (const sheet of document.styleSheets) {
					try {
						for (const rule of sheet.cssRules) {
							if (rule instanceof CSSStyleRule) {
								if (innerWrapper.matches(rule.selectorText)) {
									const relevantProps = {
										selector: rule.selectorText,
										maxWidth: rule.style.maxWidth,
										width: rule.style.width,
										marginLeft: rule.style.marginLeft,
										marginRight: rule.style.marginRight,
									};

									if (relevantProps.maxWidth || relevantProps.width ||
										relevantProps.marginLeft || relevantProps.marginRight) {
										allRules.push(relevantProps);
									}
								}
							}
						}
					} catch (e) {
						// Skip cross-origin stylesheets
					}
				}
				return allRules;
			});

			console.log('\n=== CSS Rules Affecting .dsg-container__inner-wrapper ===');
			console.log(JSON.stringify(cssRules, null, 2));

			// Width analysis
			const viewportWidth = 1920;
			const actualWidth = frontendBox?.width;
			console.log('\n=== Width Analysis ===');
			console.log('Viewport width:', viewportWidth, 'px');
			console.log('Actual rendered width:', actualWidth, 'px');
			console.log('Expected max-width: 800px (or theme setting)');
			console.log('Is constrained?:', actualWidth < viewportWidth);
			console.log('Constraint effective?:', actualWidth <= 800);

			// Take screenshot
			const screenshotDir = path.join(__dirname, 'artifacts', 'test-results');
			if (!fs.existsSync(screenshotDir)) {
				fs.mkdirSync(screenshotDir, { recursive: true });
			}

			await page.screenshot({
				path: path.join(screenshotDir, 'container-content-width-frontend.png'),
				fullPage: true
			});
			console.log('\nScreenshot saved to artifacts/test-results/container-content-width-frontend.png');
		}

		console.log('\n=== INSPECTION COMPLETE ===\n');

		console.log('=== SUMMARY ===');
		console.log('Editor had max-width inline style:', editorHasMaxWidth ? '✓' : '✗');
		console.log('Editor had margin auto:', editorHasMarginAuto ? '✓' : '✗');

		if (wrapperExists) {
			const frontendInlineStyle = await frontendInnerWrapper.getAttribute('style');
			const frontendHasMaxWidth = frontendInlineStyle && frontendInlineStyle.includes('max-width');
			const frontendHasMarginAuto = frontendInlineStyle && frontendInlineStyle.includes('margin-left: auto');

			console.log('Frontend had max-width inline style:', frontendHasMaxWidth ? '✓' : '✗');
			console.log('Frontend had margin auto:', frontendHasMarginAuto ? '✓' : '✗');
		}

		// Keep browser open for manual inspection
		console.log('\n>>> Browser will stay open for manual inspection. Press Ctrl+C to exit. <<<\n');
		await new Promise(() => {}); // Keep alive

	} catch (error) {
		console.error('Error during inspection:', error);
	} finally {
		// Browser will close on Ctrl+C
	}
})();
