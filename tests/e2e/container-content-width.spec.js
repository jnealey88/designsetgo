/**
 * E2E Test - Container Block Content Width Inspection
 *
 * This test inspects the Container block to determine why "Inner blocks use content width"
 * is not working correctly on the frontend.
 */

const { test, expect } = require('@playwright/test');
const {
	createNewPost,
	insertBlock,
	openBlockSettings,
	savePost,
	publishPost,
	selectBlock,
} = require('./helpers/wordpress');

test.describe('Container Block - Content Width Investigation', () => {
	test('inspect content width rendering in editor and frontend', async ({
		page,
	}) => {
		console.log('\n=== STARTING CONTAINER CONTENT WIDTH INSPECTION ===\n');

		// Create a new post
		await createNewPost(page, 'post');

		// Insert a Container block
		console.log('1. Inserting Container block...');
		await insertBlock(page, 'designsetgo/container');

		// Wait for block to be inserted
		await page.waitForTimeout(1000);

		// Select the container block
		await selectBlock(page, 'designsetgo/container');

		// Add some inner blocks (heading and paragraph)
		console.log('2. Adding nested blocks...');
		await page.keyboard.type('Test Heading');
		await page.keyboard.press('Enter');
		await page.keyboard.type(
			'This is a test paragraph to see if content width is working correctly.'
		);

		// Select the container block again
		await selectBlock(page, 'designsetgo/container');

		// Open block settings
		await openBlockSettings(page);

		// Enable "Inner blocks use content width"
		console.log('3. Enabling "Inner blocks use content width"...');

		// Click on "Inner blocks" panel
		const innerBlocksPanel = page.locator(
			'button:has-text("Inner blocks")'
		);
		if (await innerBlocksPanel.isVisible()) {
			await innerBlocksPanel.click();
			await page.waitForTimeout(500);
		}

		// Find and enable the toggle
		const contentWidthToggle = page.locator(
			'input[aria-label*="Inner blocks use content width"]'
		);
		await contentWidthToggle.check();
		await page.waitForTimeout(1000);

		// INSPECT EDITOR RENDERING
		console.log('\n=== EDITOR INSPECTION ===');

		// Find the container block
		const containerBlock = page
			.locator('[data-type="designsetgo/container"]')
			.first();

		// Find the inner wrapper + container
		const innerWrapper = containerBlock.locator(
			'.dsg-container__inner-wrapper'
		);
		const innerContainer = containerBlock.locator('.dsg-container__inner');

		// Get computed styles
		const innerWrapperBox = await innerWrapper.boundingBox();
		const innerWrapperStyles = await innerWrapper.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				maxWidth: computed.maxWidth,
				marginLeft: computed.marginLeft,
				marginRight: computed.marginRight,
				width: computed.width,
				display: computed.display,
				position: computed.position,
				zIndex: computed.zIndex,
			};
		});

		// Get inline styles
		const innerWrapperInlineStyle =
			await innerWrapper.getAttribute('style');

		console.log('Inner Wrapper Bounding Box:', innerWrapperBox);
		console.log('Inner Wrapper Computed Styles:', innerWrapperStyles);
		console.log('Inner Wrapper Inline Styles:', innerWrapperInlineStyle);

		// Get the actual HTML structure
		const containerHTML = await containerBlock.evaluate(
			(el) => el.outerHTML
		);
		console.log(
			'\nContainer Block HTML (first 1000 chars):\n',
			containerHTML.substring(0, 1000)
		);

		// Check if the inner container has the expected inline styles
		const hasMaxWidth =
			innerWrapperInlineStyle &&
			innerWrapperInlineStyle.includes('max-width');
		const hasMarginAuto =
			innerWrapperInlineStyle &&
			innerWrapperInlineStyle.includes('margin-left: auto');

		console.log('\nEditor Style Checks:');
		console.log('- Has max-width inline style:', hasMaxWidth);
		console.log('- Has margin-left: auto:', hasMarginAuto);

		// Take screenshot of editor
		await page.screenshot({
			path: 'artifacts/test-results/container-content-width-editor.png',
			fullPage: true,
		});
		console.log('\nScreenshot saved: container-content-width-editor.png');

		// Save and publish the post
		console.log('\n4. Publishing post...');
		await savePost(page);
		await publishPost(page);

		// Get the frontend URL
		const previewButton = page.locator(
			'.edit-post-header-preview__button-external'
		);
		const frontendUrl = await previewButton.getAttribute('href');
		console.log('Frontend URL:', frontendUrl);

		// INSPECT FRONTEND RENDERING
		console.log('\n=== FRONTEND INSPECTION ===');

		// Navigate to frontend
		await page.goto(frontendUrl);
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		// Find the container block on frontend
		const frontendContainer = page.locator('.dsg-container').first();
		const frontendInnerWrapper = frontendContainer.locator(
			'.dsg-container__inner-wrapper'
		);
		const frontendInnerContainer = frontendContainer.locator(
			'.dsg-container__inner'
		);

		// Check if it exists
		const wrapperExists = (await frontendInnerWrapper.count()) > 0;
		console.log('Inner wrapper exists on frontend:', wrapperExists);

		if (wrapperExists) {
			// Get computed styles on frontend
			const frontendBox = await frontendInnerWrapper.boundingBox();
			const frontendStyles = await frontendInnerWrapper.evaluate((el) => {
				const computed = window.getComputedStyle(el);
				return {
					maxWidth: computed.maxWidth,
					marginLeft: computed.marginLeft,
					marginRight: computed.marginRight,
					width: computed.width,
					display: computed.display,
					position: computed.position,
					zIndex: computed.zIndex,
					boxSizing: computed.boxSizing,
				};
			});

			// Get inline styles on frontend
			const frontendInlineStyle =
				await frontendInnerWrapper.getAttribute('style');

			console.log('Frontend Inner Wrapper Bounding Box:', frontendBox);
			console.log(
				'Frontend Inner Wrapper Computed Styles:',
				frontendStyles
			);
			console.log(
				'Frontend Inner Wrapper Inline Styles:',
				frontendInlineStyle
			);

			// Get the HTML structure on frontend
			const frontendHTML = await frontendContainer.evaluate(
				(el) => el.outerHTML
			);
			console.log(
				'\nFrontend Container Block HTML (first 1000 chars):\n',
				frontendHTML.substring(0, 1000)
			);

			// Check if the inline styles are present on frontend
			const frontendHasMaxWidth =
				frontendInlineStyle &&
				frontendInlineStyle.includes('max-width');
			const frontendHasMarginAuto =
				frontendInlineStyle &&
				frontendInlineStyle.includes('margin-left: auto');

			console.log('\nFrontend Style Checks:');
			console.log('- Has max-width inline style:', frontendHasMaxWidth);
			console.log('- Has margin-left: auto:', frontendHasMarginAuto);

			// Check for CSS rules that might override
			const overridingRules = await page.evaluate(() => {
				const innerWrapper = document.querySelector(
					'.dsg-container__inner-wrapper'
				);
				if (!innerWrapper) {
					return [];
				}

				const allRules = [];
				for (const sheet of document.styleSheets) {
					try {
						for (const rule of sheet.cssRules) {
							if (rule instanceof CSSStyleRule) {
								// Check if rule applies to inner container
								if (innerWrapper.matches(rule.selectorText)) {
									const relevantProps = {
										selector: rule.selectorText,
										maxWidth: rule.style.maxWidth,
										width: rule.style.width,
										marginLeft: rule.style.marginLeft,
										marginRight: rule.style.marginRight,
									};

									// Only include if it has relevant properties
									if (
										relevantProps.maxWidth ||
										relevantProps.width ||
										relevantProps.marginLeft ||
										relevantProps.marginRight
									) {
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

			console.log('\nCSS Rules Affecting .dsg-container__inner-wrapper:');
			console.log(JSON.stringify(overridingRules, null, 2));

			// Get the actual rendered width
			const actualWidth = frontendBox?.width;
			const viewportWidth = await page
				.viewportSize()
				.then((v) => v.width);
			console.log('\nWidth Analysis:');
			console.log('- Viewport width:', viewportWidth);
			console.log('- Actual rendered width:', actualWidth);
			console.log('- Expected max-width: 800px (or theme setting)');
			console.log('- Is constrained?:', actualWidth < viewportWidth);
		}

		// Take screenshot of frontend
		await page.screenshot({
			path: 'artifacts/test-results/container-content-width-frontend.png',
			fullPage: true,
		});
		console.log('\nScreenshot saved: container-content-width-frontend.png');

		console.log('\n=== INSPECTION COMPLETE ===\n');

		// ASSERTIONS
		// These will fail if the feature is broken, helping us identify the issue

		// Editor should have inline styles
		expect(
			hasMaxWidth,
			'Editor: Inner wrapper should have max-width inline style'
		).toBeTruthy();
		expect(
			hasMarginAuto,
			'Editor: Inner wrapper should have margin-left: auto inline style'
		).toBeTruthy();

		// Frontend should have inline styles
		if (wrapperExists) {
			const frontendInlineStyle =
				await frontendInnerWrapper.getAttribute('style');
			const frontendHasMaxWidth =
				frontendInlineStyle &&
				frontendInlineStyle.includes('max-width');
			const frontendHasMarginAuto =
				frontendInlineStyle &&
				frontendInlineStyle.includes('margin-left: auto');

			expect(
				frontendHasMaxWidth,
				'Frontend: Inner wrapper should have max-width inline style'
			).toBeTruthy();
			expect(
				frontendHasMarginAuto,
				'Frontend: Inner wrapper should have margin-left: auto inline style'
			).toBeTruthy();
		}
	});
});
