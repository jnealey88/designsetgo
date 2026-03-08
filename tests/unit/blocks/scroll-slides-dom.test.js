/**
 * Scroll Slides - setupDOM Unit Tests
 *
 * Tests for the DOM setup function that builds the pin spacer,
 * navigation, background layers, and aria-live region.
 *
 * @package
 */

import { setupDOM } from '../../../src/blocks/scroll-slides/frontend/setup-dom';

// Mock WordPress i18n — return text as-is, sprintf replaces %d/%s tokens
jest.mock('@wordpress/i18n', () => ({
	__: (text) => text,
	sprintf: (format, ...args) => {
		let result = format;
		args.forEach((arg) => {
			result = result.replace(/%[sd]/, arg);
		});
		return result;
	},
}));

/**
 * Build a scroll-slides DOM fixture for testing.
 *
 * @param {number} slideCount          Number of slides to create.
 * @param {Object} options             Configuration options.
 * @param {string} options.alignment   Alignment class (alignfull, alignwide, or empty).
 * @param {Array}  options.headings    Per-slide nav heading text (data-dsgo-nav-heading).
 * @param {Array}  options.backgrounds Per-slide inline background styles.
 * @return {Object} Object with container, slides NodeList, and wrapper element.
 */
function createScrollSlidesFixture(slideCount = 3, options = {}) {
	const { alignment = '', headings = [], backgrounds = [] } = options;

	// Outer wrapper simulates the parent node in the page
	const wrapper = document.createElement('div');
	wrapper.className = 'entry-content';

	// Block container
	const container = document.createElement('div');
	container.className = 'wp-block-designsetgo-scroll-slides';
	if (alignment) {
		container.classList.add(alignment);
	}

	// Inner container
	const inner = document.createElement('div');
	inner.className = 'dsgo-scroll-slides__inner';

	// Panels wrapper
	const panels = document.createElement('div');
	panels.className = 'dsgo-scroll-slides__panels';

	// Create slides
	for (let i = 0; i < slideCount; i++) {
		const slide = document.createElement('div');
		slide.className = 'dsgo-scroll-slides__slide';

		if (headings[i]) {
			slide.dataset.dsgoNavHeading = headings[i];
		}

		if (backgrounds[i]) {
			const bg = backgrounds[i];
			if (bg.backgroundImage) {
				slide.style.backgroundImage = bg.backgroundImage;
			}
			if (bg.backgroundColor) {
				slide.style.backgroundColor = bg.backgroundColor;
			}
			if (bg.backgroundPosition) {
				slide.style.backgroundPosition = bg.backgroundPosition;
			}
			if (bg.backgroundSize) {
				slide.style.backgroundSize = bg.backgroundSize;
			}
			if (bg.backgroundRepeat) {
				slide.style.backgroundRepeat = bg.backgroundRepeat;
			}
		}

		panels.appendChild(slide);
	}

	inner.appendChild(panels);
	container.appendChild(inner);
	wrapper.appendChild(container);

	// Attach to document so JSDOM can resolve parentNode
	document.body.appendChild(wrapper);

	const slides = panels.querySelectorAll('.dsgo-scroll-slides__slide');

	return { container, slides, wrapper };
}

// Clean up DOM between tests
afterEach(() => {
	document.body.textContent = '';
});

describe('setupDOM', () => {
	describe('desktop mode (isMobile = false)', () => {
		test('creates spacer wrapper with correct height', () => {
			const { container, slides } = createScrollSlidesFixture(4);

			setupDOM(container, slides, '100vh', '', false);

			const spacer = container.parentNode;
			expect(spacer.classList.contains('dsgo-scroll-slides-spacer')).toBe(
				true
			);
			// JSDOM simplifies calc(4 * 100vh) to calc(400vh)
			expect(spacer.style.height).toBe('calc(400vh)');
			expect(spacer.contains(container)).toBe(true);
		});

		test('copies alignfull class to spacer', () => {
			const { container, slides } = createScrollSlidesFixture(2, {
				alignment: 'alignfull',
			});

			setupDOM(container, slides, '100vh', '', false);

			const spacer = container.parentNode;
			expect(spacer.classList.contains('alignfull')).toBe(true);
		});

		test('copies alignwide class to spacer', () => {
			const { container, slides } = createScrollSlidesFixture(2, {
				alignment: 'alignwide',
			});

			setupDOM(container, slides, '100vh', '', false);

			const spacer = container.parentNode;
			expect(spacer.classList.contains('alignwide')).toBe(true);
			expect(spacer.classList.contains('alignfull')).toBe(false);
		});

		test('adds is-pinned class and sets height with minHeight', () => {
			const { container, slides } = createScrollSlidesFixture(3);

			setupDOM(container, slides, '80vh', '', false);

			expect(container.classList.contains('is-pinned')).toBe(true);
			expect(container.style.height).toBe('80vh');
		});

		test('uses min() for height when maxHeight is set', () => {
			const { container, slides } = createScrollSlidesFixture(3);

			setupDOM(container, slides, '100vh', '900px', false);

			expect(container.style.height).toBe('min(100vh, 900px)');
		});
	});

	describe('mobile mode (isMobile = true)', () => {
		test('adds is-tap-mode class and does not create spacer', () => {
			const { container, slides, wrapper } = createScrollSlidesFixture(3);

			setupDOM(container, slides, '100vh', '', true);

			expect(container.classList.contains('is-tap-mode')).toBe(true);
			// Container parent should still be the original wrapper, not a spacer
			expect(container.parentNode).toBe(wrapper);
			expect(
				wrapper.querySelector('.dsgo-scroll-slides-spacer')
			).toBeNull();
		});
	});

	describe('navigation', () => {
		test('builds nav with correct number of buttons', () => {
			const { container, slides } = createScrollSlidesFixture(5);

			setupDOM(container, slides, '100vh', '', false);

			const nav = container.querySelector('.dsgo-scroll-slides__nav');
			expect(nav).not.toBeNull();
			expect(nav.tagName).toBe('NAV');
			expect(nav.getAttribute('aria-label')).toBe('Slide navigation');

			const buttons = nav.querySelectorAll(
				'.dsgo-scroll-slides__nav-item'
			);
			expect(buttons).toHaveLength(5);
		});

		test('uses data-dsgo-nav-heading for button text', () => {
			const { container, slides } = createScrollSlidesFixture(3, {
				headings: ['Intro', 'Features', 'Pricing'],
			});

			setupDOM(container, slides, '100vh', '', false);

			const buttons = container.querySelectorAll(
				'.dsgo-scroll-slides__nav-item'
			);
			expect(buttons[0].textContent).toBe('Intro');
			expect(buttons[1].textContent).toBe('Features');
			expect(buttons[2].textContent).toBe('Pricing');
		});

		test('falls back to "Slide N" when no heading attribute', () => {
			const { container, slides } = createScrollSlidesFixture(3);

			setupDOM(container, slides, '100vh', '', false);

			const buttons = container.querySelectorAll(
				'.dsgo-scroll-slides__nav-item'
			);
			expect(buttons[0].textContent).toBe('Slide 1');
			expect(buttons[1].textContent).toBe('Slide 2');
			expect(buttons[2].textContent).toBe('Slide 3');
		});

		test('first nav button has is-active and aria-current="step"', () => {
			const { container, slides } = createScrollSlidesFixture(3);

			setupDOM(container, slides, '100vh', '', false);

			const buttons = container.querySelectorAll(
				'.dsgo-scroll-slides__nav-item'
			);
			expect(buttons[0].classList.contains('is-active')).toBe(true);
			expect(buttons[0].getAttribute('aria-current')).toBe('step');

			// Other buttons should not be active
			expect(buttons[1].classList.contains('is-active')).toBe(false);
			expect(buttons[1].getAttribute('aria-current')).toBeNull();
			expect(buttons[2].classList.contains('is-active')).toBe(false);
		});

		test('nav is inserted before panels inside inner container', () => {
			const { container, slides } = createScrollSlidesFixture(2);

			setupDOM(container, slides, '100vh', '', false);

			const inner = container.querySelector('.dsgo-scroll-slides__inner');
			const children = Array.from(inner.children);
			const navIndex = children.findIndex((el) =>
				el.classList.contains('dsgo-scroll-slides__nav')
			);
			const panelsIndex = children.findIndex((el) =>
				el.classList.contains('dsgo-scroll-slides__panels')
			);
			expect(navIndex).toBeLessThan(panelsIndex);
		});
	});

	describe('background layers', () => {
		test('extracts background styles from slides to bg layers', () => {
			const { container, slides } = createScrollSlidesFixture(2, {
				backgrounds: [
					{
						backgroundImage: 'url("hero.jpg")',
						backgroundColor: 'rgb(255, 0, 0)',
						backgroundPosition: 'center center',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
					},
					{
						backgroundImage: 'url("second.jpg")',
						backgroundColor: 'rgb(0, 0, 255)',
					},
				],
			});

			setupDOM(container, slides, '100vh', '', false);

			const bgLayers = container.querySelectorAll(
				'.dsgo-scroll-slides__bg'
			);
			expect(bgLayers).toHaveLength(2);

			expect(bgLayers[0].style.backgroundImage).toBe('url("hero.jpg")');
			expect(bgLayers[0].style.backgroundColor).toBe('rgb(255, 0, 0)');
			expect(bgLayers[0].style.backgroundPosition).toBe('center center');
			expect(bgLayers[0].style.backgroundSize).toBe('cover');
			expect(bgLayers[0].style.backgroundRepeat).toBe('no-repeat');

			expect(bgLayers[1].style.backgroundImage).toBe('url("second.jpg")');
			expect(bgLayers[1].style.backgroundColor).toBe('rgb(0, 0, 255)');
		});

		test('clears background styles from slides after extraction', () => {
			const { container, slides } = createScrollSlidesFixture(2, {
				backgrounds: [
					{
						backgroundImage: 'url("hero.jpg")',
						backgroundColor: 'rgb(255, 0, 0)',
						backgroundPosition: 'center center',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
					},
					{
						backgroundColor: 'rgb(0, 128, 0)',
					},
				],
			});

			setupDOM(container, slides, '100vh', '', false);

			// First slide: all background props should be cleared
			expect(slides[0].style.backgroundImage).toBe('none');
			expect(slides[0].style.backgroundColor).toBe('transparent');
			expect(slides[0].style.backgroundPosition).toBe('');
			expect(slides[0].style.backgroundSize).toBe('');
			expect(slides[0].style.backgroundRepeat).toBe('');

			// Second slide: only backgroundColor was set
			expect(slides[1].style.backgroundColor).toBe('transparent');
		});

		test('first bg layer is active', () => {
			const { container, slides } = createScrollSlidesFixture(3, {
				backgrounds: [
					{ backgroundColor: 'red' },
					{ backgroundColor: 'blue' },
					{ backgroundColor: 'green' },
				],
			});

			setupDOM(container, slides, '100vh', '', false);

			const bgLayers = container.querySelectorAll(
				'.dsgo-scroll-slides__bg'
			);
			expect(bgLayers[0].classList.contains('is-active')).toBe(true);
			expect(bgLayers[1].classList.contains('is-active')).toBe(false);
			expect(bgLayers[2].classList.contains('is-active')).toBe(false);
		});

		test('bg container is inserted before inner container', () => {
			const { container, slides } = createScrollSlidesFixture(2, {
				backgrounds: [{ backgroundColor: 'red' }],
			});

			setupDOM(container, slides, '100vh', '', false);

			const children = Array.from(container.children);
			const bgIndex = children.findIndex((el) =>
				el.classList.contains('dsgo-scroll-slides__backgrounds')
			);
			const innerIndex = children.findIndex((el) =>
				el.classList.contains('dsgo-scroll-slides__inner')
			);
			expect(bgIndex).toBeLessThan(innerIndex);
		});
	});

	describe('aria-live region', () => {
		test('creates aria-live region for screen reader announcements', () => {
			const { container, slides } = createScrollSlidesFixture(2);

			setupDOM(container, slides, '100vh', '', false);

			const liveRegion = container.querySelector(
				'.screen-reader-text[aria-live]'
			);
			expect(liveRegion).not.toBeNull();
			expect(liveRegion.getAttribute('aria-live')).toBe('polite');
			expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
		});
	});

	describe('slide activation', () => {
		test('first slide is active, others are inert with aria-hidden', () => {
			const { container, slides } = createScrollSlidesFixture(4);

			setupDOM(container, slides, '100vh', '', false);

			// First slide is active
			expect(slides[0].classList.contains('is-active')).toBe(true);
			expect(slides[0].hasAttribute('inert')).toBe(false);
			expect(slides[0].hasAttribute('aria-hidden')).toBe(false);

			// Remaining slides are inert
			for (let i = 1; i < slides.length; i++) {
				expect(slides[i].classList.contains('is-active')).toBe(false);
				expect(slides[i].hasAttribute('inert')).toBe(true);
				expect(slides[i].getAttribute('aria-hidden')).toBe('true');
			}
		});
	});
});
