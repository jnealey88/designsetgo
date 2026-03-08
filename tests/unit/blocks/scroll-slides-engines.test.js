/**
 * Scroll Slides - Engine Unit Tests
 *
 * Tests for the scroll engine (desktop scroll-driven animation)
 * and tap engine (mobile click-to-navigate) frontend modules.
 *
 * @package
 */

import { setupScrollEngine } from '../../../src/blocks/scroll-slides/frontend/scroll-engine';
import { setupTapEngine } from '../../../src/blocks/scroll-slides/frontend/tap-engine';

// Mock WordPress i18n — __ returns text as-is, sprintf substitutes positional args
jest.mock('@wordpress/i18n', () => ({
	__: (text) => text,
	sprintf: (format, ...args) => {
		let i = 0;
		return format
			.replace(/%(\d+)\$[ds]/g, (_, index) => {
				return args[parseInt(index, 10) - 1];
			})
			.replace(/%[ds]/g, () => args[i++]);
	},
}));

/**
 * Build a full DOM fixture matching the scroll-slides block markup.
 *
 * @param {number} slideCount Number of slides to create.
 * @return {Object} Fixture elements: container, slides, navItems, bgLayers, liveRegion, spacer.
 */
function createEngineFixture(slideCount = 3) {
	// Spacer wraps the sticky container (scroll engine reads container.parentNode)
	const spacer = document.createElement('div');
	spacer.className = 'dsgo-scroll-slides-spacer';
	Object.defineProperty(spacer, 'offsetHeight', {
		configurable: true,
		get: () => 3000,
	});
	spacer.getBoundingClientRect = jest.fn(() => ({
		top: 0,
		bottom: 3000,
		left: 0,
		right: 800,
		width: 800,
		height: 3000,
	}));
	// isConnected must be true for requestTick guard
	Object.defineProperty(spacer, 'isConnected', {
		configurable: true,
		get: () => true,
	});

	const container = document.createElement('div');
	container.className = 'dsgo-scroll-slides';
	spacer.appendChild(container);

	// Slide panels
	const slideElements = [];
	for (let i = 0; i < slideCount; i++) {
		const slide = document.createElement('div');
		slide.className = 'dsgo-scroll-slides__slide';
		slide.textContent = `Slide ${i + 1}`;
		if (i === 0) {
			slide.classList.add('is-active');
		} else {
			slide.setAttribute('inert', '');
			slide.setAttribute('aria-hidden', 'true');
		}
		container.appendChild(slide);
		slideElements.push(slide);
	}

	// Navigation items
	const nav = document.createElement('nav');
	nav.className = 'dsgo-scroll-slides__nav';
	const navItems = [];
	for (let i = 0; i < slideCount; i++) {
		const btn = document.createElement('button');
		btn.className = 'dsgo-scroll-slides__nav-item';
		btn.textContent = `Slide ${i + 1}`;
		if (i === 0) {
			btn.classList.add('is-active');
			btn.setAttribute('aria-current', 'step');
		}
		nav.appendChild(btn);
		navItems.push(btn);
	}
	container.appendChild(nav);

	// Background layers
	const bgLayers = [];
	for (let i = 0; i < slideCount; i++) {
		const bg = document.createElement('div');
		bg.className = 'dsgo-scroll-slides__bg';
		if (i === 0) {
			bg.classList.add('is-active');
		}
		container.appendChild(bg);
		bgLayers.push(bg);
	}

	// Live region for screen reader announcements
	const liveRegion = document.createElement('div');
	liveRegion.setAttribute('aria-live', 'polite');
	liveRegion.className = 'dsgo-scroll-slides__live-region';
	container.appendChild(liveRegion);

	// Attach spacer to document so queries work
	document.body.appendChild(spacer);

	const slides = container.querySelectorAll('.dsgo-scroll-slides__slide');

	return {
		container,
		slides,
		navItems,
		bgLayers,
		liveRegion,
		spacer,
	};
}

/**
 * Remove all fixture elements from the DOM.
 */
function cleanupFixtures() {
	document
		.querySelectorAll('.dsgo-scroll-slides-spacer')
		.forEach((el) => el.remove());
}

/**
 * Simulate a spacer position that activates a specific slide index.
 *
 * With 3 slides and spacer height 3000 / viewport 768:
 *   totalRange = 3000 - 768 = 2232
 *   progress = -spacerRect.top / totalRange
 *   newIndex = floor(progress * slideCount)
 *
 * To land on slide N (0-based) with slideCount slides, we set
 *   spacerRect.top = -(( N + 0.5 ) / slideCount) * totalRange
 *
 * @param {HTMLElement} spacer     Spacer element.
 * @param {number}      slideIndex Target slide index (0-based).
 * @param {number}      slideCount Total slide count.
 */
function positionForSlide(spacer, slideIndex, slideCount = 3) {
	const spacerHeight = 3000;
	const viewportHeight = 768;
	const totalRange = spacerHeight - viewportHeight;
	const top = -((slideIndex + 0.5) / slideCount) * totalRange;

	spacer.getBoundingClientRect = jest.fn(() => ({
		top,
		bottom: top + spacerHeight,
		left: 0,
		right: 800,
		width: 800,
		height: spacerHeight,
	}));
}

// ─── Scroll Engine Tests ────────────────────────────────────────────────────

describe('setupScrollEngine', () => {
	let controller;

	beforeEach(() => {
		jest.useFakeTimers();
		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			writable: true,
			value: 768,
		});
		window.scrollTo.mockClear();
		controller = new AbortController();
	});

	afterEach(() => {
		if (controller) {
			controller.abort();
		}
		cleanupFixtures();
		jest.useRealTimers();
	});

	test('activates first slide on initial update', () => {
		const { container, slides, navItems, bgLayers } =
			createEngineFixture(3);

		// Position at very top so slide 0 stays active
		positionForSlide(container.parentNode, 0, 3);

		setupScrollEngine(container, slides, controller);

		// Flush requestAnimationFrame from initial update()
		jest.advanceTimersByTime(20);

		expect(slides[0].classList.contains('is-active')).toBe(true);
		expect(navItems[0].classList.contains('is-active')).toBe(true);
		expect(bgLayers[0].classList.contains('is-active')).toBe(true);
	});

	test('deactivates previous slide when new slide becomes active', () => {
		const { container, slides, navItems, bgLayers } =
			createEngineFixture(3);
		const spacer = container.parentNode;

		// Start at slide 0
		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		// Move to slide 1
		positionForSlide(spacer, 1, 3);
		window.dispatchEvent(new Event('scroll'));
		jest.advanceTimersByTime(20);

		// Slide 0 should be deactivated
		expect(slides[0].classList.contains('is-active')).toBe(false);
		expect(navItems[0].classList.contains('is-active')).toBe(false);
		expect(bgLayers[0].classList.contains('is-active')).toBe(false);

		// Slide 1 should be active
		expect(slides[1].classList.contains('is-active')).toBe(true);
		expect(navItems[1].classList.contains('is-active')).toBe(true);
		expect(bgLayers[1].classList.contains('is-active')).toBe(true);
	});

	test('sets aria-hidden and inert on inactive slides', () => {
		const { container, slides } = createEngineFixture(3);
		const spacer = container.parentNode;

		// Activate slide 1
		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		positionForSlide(spacer, 1, 3);
		window.dispatchEvent(new Event('scroll'));
		jest.advanceTimersByTime(20);

		// Inactive slide 0 should have inert and aria-hidden
		expect(slides[0].hasAttribute('inert')).toBe(true);
		expect(slides[0].getAttribute('aria-hidden')).toBe('true');

		// Active slide 1 should NOT have inert or aria-hidden
		expect(slides[1].hasAttribute('inert')).toBe(false);
		expect(slides[1].hasAttribute('aria-hidden')).toBe(false);
	});

	test('sets aria-current="step" on active nav item', () => {
		const { container, slides, navItems } = createEngineFixture(3);
		const spacer = container.parentNode;

		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		positionForSlide(spacer, 2, 3);
		window.dispatchEvent(new Event('scroll'));
		jest.advanceTimersByTime(20);

		expect(navItems[2].getAttribute('aria-current')).toBe('step');
		expect(navItems[0].hasAttribute('aria-current')).toBe(false);
		expect(navItems[1].hasAttribute('aria-current')).toBe(false);
	});

	test('updates background layer active states', () => {
		const { container, slides, bgLayers } = createEngineFixture(3);
		const spacer = container.parentNode;

		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		// Move to slide 2
		positionForSlide(spacer, 2, 3);
		window.dispatchEvent(new Event('scroll'));
		jest.advanceTimersByTime(20);

		expect(bgLayers[0].classList.contains('is-active')).toBe(false);
		expect(bgLayers[1].classList.contains('is-active')).toBe(false);
		expect(bgLayers[2].classList.contains('is-active')).toBe(true);
	});

	test('announces slide changes to live region', () => {
		const { container, slides, liveRegion } = createEngineFixture(3);
		const spacer = container.parentNode;

		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		positionForSlide(spacer, 1, 3);
		window.dispatchEvent(new Event('scroll'));
		jest.advanceTimersByTime(20);

		// sprintf format: 'Slide %1$d of %2$d: %3$s'
		// Nav item 1 text is "Slide 2"
		expect(liveRegion.textContent).toContain('2');
		expect(liveRegion.textContent).toContain('3');
	});

	test('nav click calls window.scrollTo', () => {
		const { container, slides, navItems } = createEngineFixture(3);
		const spacer = container.parentNode;

		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		// Click second nav item
		navItems[1].click();

		expect(window.scrollTo).toHaveBeenCalledWith(
			expect.objectContaining({ behavior: 'smooth' })
		);
	});

	test('cleans up on abort signal', () => {
		const { container, slides } = createEngineFixture(3);
		const spacer = container.parentNode;

		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		// Abort the controller
		controller.abort();

		// Scrolling after abort should not trigger updates.
		// The requestTick guard checks signal.aborted.
		positionForSlide(spacer, 2, 3);
		window.dispatchEvent(new Event('scroll'));
		jest.advanceTimersByTime(20);

		// Slide 0 should remain active (no update ran)
		expect(slides[0].classList.contains('is-active')).toBe(true);
	});

	test('handles resize with debounce', () => {
		const {
			container,
			slides,
			navItems: _navItems,
		} = createEngineFixture(3);
		const spacer = container.parentNode;

		positionForSlide(spacer, 0, 3);
		setupScrollEngine(container, slides, controller);
		jest.advanceTimersByTime(20);

		// Position spacer so slide 2 should become active on next update
		positionForSlide(spacer, 2, 3);

		// Fire multiple resize events quickly
		window.dispatchEvent(new Event('resize'));
		window.dispatchEvent(new Event('resize'));
		window.dispatchEvent(new Event('resize'));

		// Before the 150ms debounce completes, slide should NOT have updated
		jest.advanceTimersByTime(100);
		expect(slides[0].classList.contains('is-active')).toBe(true);
		expect(slides[2].classList.contains('is-active')).toBe(false);

		// Advance past the 150ms debounce + rAF (16ms)
		jest.advanceTimersByTime(70);

		// After debounce fires, the update should activate slide 2
		expect(slides[2].classList.contains('is-active')).toBe(true);
		expect(slides[0].classList.contains('is-active')).toBe(false);
	});
});

// ─── Tap Engine Tests ───────────────────────────────────────────────────────

describe('setupTapEngine', () => {
	let controller;

	beforeEach(() => {
		controller = new AbortController();
	});

	afterEach(() => {
		controller.abort();
		cleanupFixtures();
	});

	test('clicking nav item activates corresponding slide', () => {
		const { container, slides, navItems, bgLayers } =
			createEngineFixture(3);

		setupTapEngine(container, slides, controller);

		// Click second nav item
		navItems[1].click();

		expect(slides[1].classList.contains('is-active')).toBe(true);
		expect(navItems[1].classList.contains('is-active')).toBe(true);
		expect(bgLayers[1].classList.contains('is-active')).toBe(true);
	});

	test('clicking same slide index does nothing (early return)', () => {
		const { container, slides, navItems, liveRegion } =
			createEngineFixture(3);

		setupTapEngine(container, slides, controller);

		// Click the first nav item (already active at index 0)
		navItems[0].click();

		// Slide 0 should still be active, and live region should be empty
		// (no announcement since activateSlide returned early)
		expect(slides[0].classList.contains('is-active')).toBe(true);
		expect(liveRegion.textContent).toBe('');
	});

	test('deactivates previous slide on nav click', () => {
		const { container, slides, navItems, bgLayers } =
			createEngineFixture(3);

		setupTapEngine(container, slides, controller);

		// Navigate to slide 2
		navItems[2].click();

		// Slide 0 should be deactivated
		expect(slides[0].classList.contains('is-active')).toBe(false);
		expect(navItems[0].classList.contains('is-active')).toBe(false);
		expect(bgLayers[0].classList.contains('is-active')).toBe(false);
	});

	test('updates aria-hidden and inert correctly', () => {
		const { container, slides, navItems } = createEngineFixture(3);

		setupTapEngine(container, slides, controller);

		// Navigate to slide 1
		navItems[1].click();

		// Old slide 0 should have inert and aria-hidden
		expect(slides[0].hasAttribute('inert')).toBe(true);
		expect(slides[0].getAttribute('aria-hidden')).toBe('true');

		// Active slide 1 should not have inert or aria-hidden
		expect(slides[1].hasAttribute('inert')).toBe(false);
		expect(slides[1].hasAttribute('aria-hidden')).toBe(false);
	});

	test('updates aria-current on nav items', () => {
		const { container, slides, navItems } = createEngineFixture(3);

		setupTapEngine(container, slides, controller);

		// Navigate to slide 2
		navItems[2].click();

		expect(navItems[2].getAttribute('aria-current')).toBe('step');
		expect(navItems[0].hasAttribute('aria-current')).toBe(false);
		expect(navItems[1].hasAttribute('aria-current')).toBe(false);
	});

	test('updates background layers', () => {
		const { container, slides, navItems, bgLayers } =
			createEngineFixture(3);

		setupTapEngine(container, slides, controller);

		navItems[2].click();

		expect(bgLayers[0].classList.contains('is-active')).toBe(false);
		expect(bgLayers[1].classList.contains('is-active')).toBe(false);
		expect(bgLayers[2].classList.contains('is-active')).toBe(true);
	});

	test('announces slide change to live region', () => {
		const { container, slides, navItems, liveRegion } =
			createEngineFixture(3);

		setupTapEngine(container, slides, controller);

		navItems[1].click();

		// sprintf format: 'Slide %1$d of %2$d: %3$s'
		// Index 1 => slide number 2, total 3, nav text "Slide 2"
		expect(liveRegion.textContent).toContain('2');
		expect(liveRegion.textContent).toContain('3');
	});
});
