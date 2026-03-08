/**
 * Sticky Sections Block - Frontend Unit Tests
 *
 * Tests for the sticky sections view.js frontend script.
 * Since view.js has no exports (side-effect module), each test uses
 * jest.isolateModules() to re-require a fresh instance.
 *
 * @package
 */

/**
 * Create a sticky sections container with child stack sections.
 *
 * @param {number} sectionCount Number of child .dsgo-stack elements.
 * @return {HTMLElement} The container element.
 */
function createContainer(sectionCount = 3) {
	const container = document.createElement('div');
	container.classList.add('dsgo-sticky-sections');

	for (let i = 0; i < sectionCount; i++) {
		const section = document.createElement('div');
		section.classList.add('dsgo-stack');
		container.appendChild(section);
	}

	document.body.appendChild(container);
	return container;
}

/**
 * Track event listeners registered by view.js so we can clean them up.
 */
const registeredListeners = [];
const originalAddEventListener = document.addEventListener.bind(document);

/**
 * Load the view.js module in isolation.
 * Because the module registers event listeners and runs init logic on load,
 * each test gets a clean copy via jest.isolateModules().
 *
 * Wraps document.addEventListener to capture listeners for cleanup.
 */
function loadView() {
	document.addEventListener = (type, handler, options) => {
		registeredListeners.push({ type, handler });
		originalAddEventListener(type, handler, options);
	};

	jest.isolateModules(() => {
		require('../../../src/blocks/sticky-sections/view.js');
	});

	document.addEventListener = originalAddEventListener;
}

/**
 * Clean up DOM, event listeners, and restore defaults between tests.
 */
function cleanup() {
	while (document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	}

	// Remove all listeners registered by previous loadView() calls.
	registeredListeners.forEach(({ type, handler }) => {
		document.removeEventListener(type, handler);
	});
	registeredListeners.length = 0;

	global.setMatchMedia(false);
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: 1024,
	});
}

describe('Sticky Sections - Frontend', () => {
	afterEach(() => {
		cleanup();
	});

	describe('Z-index assignment', () => {
		test('assigns incrementing z-index to child .dsgo-stack sections', () => {
			const container = createContainer(3);
			loadView();

			const sections = container.querySelectorAll('.dsgo-stack');
			expect(sections[0].style.zIndex).toBe('1');
			expect(sections[1].style.zIndex).toBe('2');
			expect(sections[2].style.zIndex).toBe('3');
		});
	});

	describe('Stacking shadow class', () => {
		test('adds stacking class to non-first sections', () => {
			const container = createContainer(3);
			loadView();

			const sections = container.querySelectorAll('.dsgo-stack');
			expect(
				sections[1].classList.contains('dsgo-sticky-sections__stacking')
			).toBe(true);
			expect(
				sections[2].classList.contains('dsgo-sticky-sections__stacking')
			).toBe(true);
		});

		test('does NOT add stacking class to first section', () => {
			const container = createContainer(3);
			loadView();

			const firstSection = container.querySelector('.dsgo-stack');
			expect(
				firstSection.classList.contains(
					'dsgo-sticky-sections__stacking'
				)
			).toBe(false);
		});
	});

	describe('Reduced motion', () => {
		test('skips initialization when reduced motion is preferred', () => {
			const container = createContainer(3);
			global.setMatchMedia(true);
			loadView();

			const sections = container.querySelectorAll('.dsgo-stack');
			expect(sections[0].style.zIndex).toBe('');
			expect(sections[1].style.zIndex).toBe('');
			expect(
				sections[1].classList.contains('dsgo-sticky-sections__stacking')
			).toBe(false);
		});
	});

	describe('Mobile viewport', () => {
		test('skips initialization on mobile viewport (width < 781)', () => {
			const container = createContainer(3);
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 780,
			});
			loadView();

			const sections = container.querySelectorAll('.dsgo-stack');
			expect(sections[0].style.zIndex).toBe('');
			expect(
				sections[1].classList.contains('dsgo-sticky-sections__stacking')
			).toBe(false);
		});
	});

	describe('Minimum sections', () => {
		test('skips initialization when fewer than 2 sections', () => {
			const container = createContainer(1);
			loadView();

			const section = container.querySelector('.dsgo-stack');
			expect(section.style.zIndex).toBe('');
		});
	});

	describe('Double initialization', () => {
		test('does not double-initialize the same container', () => {
			const container = createContainer(3);

			// Load once to initialize and set up the reinit listener.
			loadView();

			const sections = container.querySelectorAll('.dsgo-stack');
			expect(sections[0].style.zIndex).toBe('1');

			// Mutate z-index to detect if reinit overwrites it.
			sections[0].style.zIndex = '99';

			// Dispatch reinit event; the WeakSet guard should skip this container.
			document.dispatchEvent(new Event('sticky-sections:reinit'));

			expect(sections[0].style.zIndex).toBe('99');
		});
	});

	describe('Multiple containers', () => {
		test('handles multiple containers on the page', () => {
			const containerA = createContainer(2);
			const containerB = createContainer(3);
			loadView();

			const sectionsA = containerA.querySelectorAll('.dsgo-stack');
			expect(sectionsA[0].style.zIndex).toBe('1');
			expect(sectionsA[1].style.zIndex).toBe('2');

			const sectionsB = containerB.querySelectorAll('.dsgo-stack');
			expect(sectionsB[0].style.zIndex).toBe('1');
			expect(sectionsB[1].style.zIndex).toBe('2');
			expect(sectionsB[2].style.zIndex).toBe('3');
		});
	});

	describe('Custom reinit event', () => {
		test('responds to custom sticky-sections:reinit event', () => {
			// Load first with no containers so nothing initializes,
			// but the reinit listener gets registered.
			loadView();

			// Now add a container after initial load.
			const container = createContainer(2);

			// Dispatch the reinit event to trigger initialization.
			document.dispatchEvent(new Event('sticky-sections:reinit'));

			const sections = container.querySelectorAll('.dsgo-stack');
			expect(sections[0].style.zIndex).toBe('1');
			expect(sections[1].style.zIndex).toBe('2');
			expect(
				sections[1].classList.contains('dsgo-sticky-sections__stacking')
			).toBe(true);
		});
	});

	describe('DOM already loaded', () => {
		test('works when DOM is already loaded (readyState is not loading)', () => {
			// JSDOM defaults readyState to "complete", so requiring the
			// module triggers initStickySections() synchronously.
			const container = createContainer(2);
			loadView();

			const sections = container.querySelectorAll('.dsgo-stack');
			expect(sections[0].style.zIndex).toBe('1');
			expect(sections[1].style.zIndex).toBe('2');
		});
	});
});
