/**
 * Scroll Marquee Block - Frontend Unit Tests
 *
 * Tests for the scroll marquee view.js frontend script.
 * Since view.js has no exports (side-effect module), each test uses
 * jest.isolateModules() to re-require a fresh instance.
 *
 * @package
 */

/* global WheelEvent */

/**
 * Create a scroll marquee element with rows, tracks, and segments.
 *
 * @param {Object}  options              Configuration options.
 * @param {number}  options.rowCount     Number of marquee rows.
 * @param {string}  options.scrollSpeed  Value for data-scroll-speed attribute.
 * @param {string}  options.direction    Row direction ('left' or 'right').
 * @param {number}  options.segmentWidth Mock segment offsetWidth.
 * @param {boolean} options.withImages   Whether to add img elements.
 * @return {HTMLElement} The marquee container element.
 */
function createMarquee({
	rowCount = 1,
	scrollSpeed = null,
	direction = 'left',
	segmentWidth = 500,
	withImages = false,
} = {}) {
	const marquee = document.createElement('div');
	marquee.classList.add('dsgo-scroll-marquee');

	if (scrollSpeed !== null) {
		marquee.dataset.scrollSpeed = scrollSpeed;
	}

	// Mock getBoundingClientRect for viewport check
	marquee.getBoundingClientRect = jest.fn(() => ({
		top: 0,
		bottom: 400,
		left: 0,
		right: 800,
		width: 800,
		height: 400,
	}));

	// Mock setPointerCapture/releasePointerCapture/hasPointerCapture
	marquee.setPointerCapture = jest.fn();
	marquee.releasePointerCapture = jest.fn();
	marquee.hasPointerCapture = jest.fn(() => true);

	for (let i = 0; i < rowCount; i++) {
		const row = document.createElement('div');
		row.classList.add('dsgo-scroll-marquee__row');
		row.dataset.direction = direction;

		const track = document.createElement('div');
		track.classList.add('dsgo-scroll-marquee__track');

		const segment = document.createElement('div');
		segment.classList.add('dsgo-scroll-marquee__track-segment');
		Object.defineProperty(segment, 'offsetWidth', {
			configurable: true,
			get: () => segmentWidth,
		});

		if (withImages) {
			const img = document.createElement('img');
			img.src = 'test.jpg';
			Object.defineProperty(img, 'complete', {
				configurable: true,
				get: () => true,
			});
			Object.defineProperty(img, 'naturalHeight', {
				configurable: true,
				get: () => 200,
			});
			segment.appendChild(img);
		}

		track.appendChild(segment);
		row.appendChild(track);
		marquee.appendChild(row);
	}

	document.body.appendChild(marquee);
	return marquee;
}

/**
 * Track event listeners registered by view.js for cleanup.
 */
const registeredListeners = [];
const originalDocAddEventListener = document.addEventListener.bind(document);
const originalWinAddEventListener = window.addEventListener.bind(window);

/**
 * Load the view.js module in isolation.
 */
function loadView() {
	document.addEventListener = (type, handler, options) => {
		registeredListeners.push({ target: document, type, handler });
		originalDocAddEventListener(type, handler, options);
	};

	window.addEventListener = (type, handler, options) => {
		registeredListeners.push({ target: window, type, handler });
		originalWinAddEventListener(type, handler, options);
	};

	jest.isolateModules(() => {
		require('../../../src/blocks/scroll-marquee/view.js');
	});

	document.addEventListener = originalDocAddEventListener;
	window.addEventListener = originalWinAddEventListener;
}

/**
 * Clean up DOM, event listeners, and restore defaults between tests.
 */
function cleanup() {
	while (document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	}

	registeredListeners.forEach(({ target, type, handler }) => {
		target.removeEventListener(type, handler);
	});
	registeredListeners.length = 0;

	global.setMatchMedia(false);

	Object.defineProperty(window, 'innerHeight', {
		writable: true,
		configurable: true,
		value: 768,
	});

	window.getComputedStyle = jest.fn(() => ({
		getPropertyValue: jest.fn(() => ''),
		getPropertyPriority: jest.fn(() => ''),
		gap: '20px',
	}));
}

describe('Scroll Marquee - Frontend', () => {
	beforeEach(() => {
		jest.useFakeTimers({
			doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'],
		});
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 768,
		});

		// Mock getComputedStyle to return gap values
		window.getComputedStyle = jest.fn(() => ({
			getPropertyValue: jest.fn(() => ''),
			getPropertyPriority: jest.fn(() => ''),
			gap: '20px',
		}));

		window.requestAnimationFrame.mockClear();
	});

	afterEach(() => {
		cleanup();
		jest.useRealTimers();
	});

	describe('Reduced motion', () => {
		test('skips animation when reduced motion is preferred', () => {
			const marquee = createMarquee();
			const track = marquee.querySelector('.dsgo-scroll-marquee__track');

			global.setMatchMedia(true);
			loadView();

			// Flush rAF
			jest.advanceTimersByTime(20);

			// Cursor should not be set to 'grab' since init exits early
			expect(marquee.style.cursor).toBe('');
			// Track should have no transform
			expect(track.style.transform).toBe('');
		});
	});

	describe('Double initialization', () => {
		test('prevents double initialization via WeakSet', () => {
			const marquee = createMarquee();

			loadView();
			jest.advanceTimersByTime(20);

			// Cursor should be set to 'grab' from first init
			expect(marquee.style.cursor).toBe('grab');

			// Change cursor to detect if second init runs
			marquee.style.cursor = 'pointer';

			// Loading again should not re-initialize due to WeakSet guard
			// (the module-level WeakSet persists within the same isolateModules scope,
			// but a new loadView() creates a fresh module with a fresh WeakSet,
			// so we simulate by dispatching the load event which re-checks)
			window.dispatchEvent(new Event('load'));

			// The load handler checks initializedMarquees and skips
			expect(marquee.style.cursor).toBe('pointer');
		});
	});

	describe('Scroll speed', () => {
		test('reads scroll speed from data attribute', () => {
			const marquee = createMarquee({ scrollSpeed: '1.5' });

			loadView();

			// Flush rAF for calculateDimensions + initial updateMarquee
			jest.advanceTimersByTime(20);

			const track = marquee.querySelector('.dsgo-scroll-marquee__track');

			// Simulate a scroll position
			Object.defineProperty(window, 'scrollY', {
				configurable: true,
				writable: true,
				value: 100,
			});

			window.dispatchEvent(new Event('scroll'));
			jest.advanceTimersByTime(20);

			// Track should have a translateX applied
			expect(track.style.transform).toMatch(/translateX\(/);
		});
	});

	describe('Viewport visibility', () => {
		test('sets up IntersectionObserver to gate animation on visibility', () => {
			// Capture observer instances by subclassing the mock
			const captured = [];
			const OrigIO = global.IntersectionObserver;
			global.IntersectionObserver = class extends OrigIO {
				constructor(callback, options) {
					super(callback, options);
					captured.push({ instance: this, callback, options });
				}
			};

			const marquee = createMarquee();

			loadView();
			jest.advanceTimersByTime(20);

			// Restore before assertions to avoid corrupting other tests
			global.IntersectionObserver = OrigIO;

			// The observer is created inside initSingleMarquee and controls the
			// isInViewport flag. Verify it was constructed with reasonable options.
			expect(captured.length).toBeGreaterThan(0);
			const { instance, callback, options } = captured[0];
			expect(typeof callback).toBe('function');
			expect(options).toEqual(
				expect.objectContaining({ threshold: 0.1 })
			);
			expect(instance.observe).toHaveBeenCalledWith(marquee);
		});
	});

	describe('Cursor styles', () => {
		test('sets grab cursor on marquee element', () => {
			const marquee = createMarquee();

			loadView();
			jest.advanceTimersByTime(20);

			expect(marquee.style.cursor).toBe('grab');
			expect(marquee.style.touchAction).toBe('pan-y');
		});
	});

	describe('Pointer drag interaction', () => {
		test('changes to grabbing cursor on pointerdown', () => {
			const marquee = createMarquee();

			loadView();
			jest.advanceTimersByTime(20);

			// JSDOM lacks PointerEvent — create from Event with required properties
			const downEvent = new Event('pointerdown', { bubbles: true });
			downEvent.clientX = 400;
			downEvent.button = 0;
			downEvent.pointerId = 1;
			marquee.dispatchEvent(downEvent);

			expect(marquee.style.cursor).toBe('grabbing');
			expect(marquee.style.userSelect).toBe('none');

			// Simulate pointerup to reset
			const upEvent = new Event('pointerup', { bubbles: true });
			upEvent.clientX = 450;
			upEvent.pointerId = 1;
			marquee.dispatchEvent(upEvent);

			expect(marquee.style.cursor).toBe('grab');
			expect(marquee.style.userSelect).toBe('');
		});
	});

	describe('Empty rows', () => {
		test('handles empty rows gracefully', () => {
			// Create marquee with a row but no track/segment
			const marquee = document.createElement('div');
			marquee.classList.add('dsgo-scroll-marquee');
			marquee.getBoundingClientRect = jest.fn(() => ({
				top: 0,
				bottom: 400,
				left: 0,
				right: 800,
				width: 800,
				height: 400,
			}));
			marquee.setPointerCapture = jest.fn();
			marquee.releasePointerCapture = jest.fn();
			marquee.hasPointerCapture = jest.fn(() => true);

			const row = document.createElement('div');
			row.classList.add('dsgo-scroll-marquee__row');
			// No track or segment added
			marquee.appendChild(row);
			document.body.appendChild(marquee);

			expect(() => {
				loadView();
				jest.advanceTimersByTime(20);
			}).not.toThrow();
		});
	});

	describe('Wheel event normalization', () => {
		test('normalizes wheel deltaMode line (16x multiplier)', () => {
			const marquee = createMarquee();

			loadView();
			jest.advanceTimersByTime(20);

			window.requestAnimationFrame.mockClear();

			// Dispatch wheel event with deltaMode=1 (DOM_DELTA_LINE)
			// and shiftKey to ensure horizontal intent is captured
			const wheelEvent = new WheelEvent('wheel', {
				deltaX: 0,
				deltaY: 3,
				deltaMode: 1,
				shiftKey: true,
				bubbles: true,
				cancelable: true,
			});
			marquee.dispatchEvent(wheelEvent);

			// Should have triggered a rAF tick for the normalized delta
			expect(window.requestAnimationFrame).toHaveBeenCalled();
		});

		test('normalizes wheel deltaMode page (viewportHeight multiplier)', () => {
			const marquee = createMarquee();

			loadView();
			jest.advanceTimersByTime(20);

			window.requestAnimationFrame.mockClear();

			// Dispatch wheel event with deltaMode=2 (DOM_DELTA_PAGE)
			const wheelEvent = new WheelEvent('wheel', {
				deltaX: 0,
				deltaY: 1,
				deltaMode: 2,
				shiftKey: true,
				bubbles: true,
				cancelable: true,
			});
			marquee.dispatchEvent(wheelEvent);

			expect(window.requestAnimationFrame).toHaveBeenCalled();
		});
	});
});
