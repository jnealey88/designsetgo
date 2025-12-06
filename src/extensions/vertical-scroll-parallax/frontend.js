/**
 * Scroll Parallax - Frontend
 *
 * Handles scroll-based parallax effects on the frontend.
 * Supports vertical (up/down) and horizontal (left/right) movement.
 *
 * @package
 * @since 1.0.0
 */

/* global IntersectionObserver, requestAnimationFrame */

import { BREAKPOINTS } from './constants';

/**
 * Get current device type based on viewport width
 *
 * @return {string} 'desktop', 'tablet', or 'mobile'
 */
function getDeviceType() {
	const width = window.innerWidth;
	if (width >= BREAKPOINTS.desktop) {
		return 'desktop';
	}
	if (width >= BREAKPOINTS.tablet) {
		return 'tablet';
	}
	return 'mobile';
}

/**
 * Check if effect should be applied on current device
 *
 * @param {HTMLElement} element Element with parallax
 * @return {boolean} Whether to apply effect
 */
function shouldApplyOnDevice(element) {
	const deviceType = getDeviceType();
	const enableDesktop = element.dataset.dsgoParallaxDesktop !== 'false';
	const enableTablet = element.dataset.dsgoParallaxTablet !== 'false';
	const enableMobile = element.dataset.dsgoParallaxMobile === 'true';

	switch (deviceType) {
		case 'desktop':
			return enableDesktop;
		case 'tablet':
			return enableTablet;
		case 'mobile':
			return enableMobile;
		default:
			return true;
	}
}

/**
 * Parse settings from data attributes
 *
 * @param {HTMLElement} element Element with parallax
 * @return {Object} Parsed settings
 */
function parseSettings(element) {
	return {
		direction: element.dataset.dsgoParallaxDirection || 'up',
		speed: parseInt(element.dataset.dsgoParallaxSpeed, 10) || 5,
		viewportStart:
			parseInt(element.dataset.dsgoParallaxViewportStart, 10) || 0,
		viewportEnd:
			parseInt(element.dataset.dsgoParallaxViewportEnd, 10) || 100,
		relativeTo: element.dataset.dsgoParallaxRelativeTo || 'viewport',
	};
}

/**
 * Clamp a value between min and max
 *
 * @param {number} value Value to clamp
 * @param {number} min   Minimum value
 * @param {number} max   Maximum value
 * @return {number} Clamped value
 */
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

/**
 * Calculate parallax offset for an element
 *
 * @param {HTMLElement} element        Element with parallax
 * @param {Object}      settings       Parsed settings
 * @param {number}      scrollY        Current scroll position
 * @param {number}      viewportHeight Viewport height
 * @return {Object} Object with x and y offset values in pixels
 */
function calculateParallaxOffset(element, settings, scrollY, viewportHeight) {
	const rect = element.getBoundingClientRect();
	const elementTop = rect.top + scrollY;
	const elementHeight = rect.height;

	// Calculate scroll range based on relativeTo setting
	let scrollStart, scrollEnd;

	if (settings.relativeTo === 'viewport') {
		// Effect relative to when element enters/exits viewport
		scrollStart = elementTop - viewportHeight;
		scrollEnd = elementTop + elementHeight;
	} else {
		// Effect relative to entire page
		scrollStart = 0;
		scrollEnd = document.body.scrollHeight - viewportHeight;
	}

	// Apply viewport range limits (user-defined start/end percentages)
	// Ensure viewportStart is not greater than viewportEnd
	const viewportStart = Math.min(
		settings.viewportStart,
		settings.viewportEnd
	);
	const viewportEnd = Math.max(settings.viewportStart, settings.viewportEnd);

	const totalRange = scrollEnd - scrollStart;
	const adjustedStart = scrollStart + (totalRange * viewportStart) / 100;
	const adjustedEnd = scrollStart + (totalRange * viewportEnd) / 100;

	// Calculate progress within range (0 to 1), guard against division by zero
	const rangeDiff = adjustedEnd - adjustedStart;
	const progress =
		rangeDiff === 0
			? 0.5
			: clamp((scrollY - adjustedStart) / rangeDiff, 0, 1);

	// Convert speed (0-10) to max pixel offset
	// Speed 10 = 200px max movement, Speed 0 = 0px
	const maxOffset = settings.speed * 20;

	// Calculate base offset
	// Progress 0.5 = center position (no offset)
	const baseOffset = (progress - 0.5) * maxOffset * 2;

	// Calculate x and y offsets based on direction
	let offsetX = 0;
	let offsetY = 0;

	switch (settings.direction) {
		case 'up':
			offsetY = -baseOffset;
			break;
		case 'down':
			offsetY = baseOffset;
			break;
		case 'left':
			offsetX = -baseOffset;
			break;
		case 'right':
			offsetX = baseOffset;
			break;
		default:
			offsetY = -baseOffset;
	}

	return { x: offsetX, y: offsetY };
}

/**
 * Initialize parallax effects
 */
function initParallax() {
	// Prevent multiple initializations
	if (window.dsgoParallaxInitialized) {
		return;
	}
	window.dsgoParallaxInitialized = true;

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if (prefersReducedMotion) {
		return;
	}

	// Find all elements with parallax enabled
	const parallaxElements = document.querySelectorAll(
		'[data-dsgo-parallax-enabled="true"]'
	);

	if (parallaxElements.length === 0) {
		return;
	}

	// Cache viewport height
	let viewportHeight = window.innerHeight;
	let ticking = false;

	// Track visible elements for performance
	const visibleElements = new Set();

	// Create IntersectionObserver to track visibility
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					visibleElements.add(entry.target);
				} else {
					visibleElements.delete(entry.target);
					// Reset transform when out of view
					entry.target.style.transform = '';
				}
			});
		},
		{
			rootMargin: '50% 0px 50% 0px', // Extend observation area (top, right, bottom, left)
			threshold: 0,
		}
	);

	// Observe all parallax elements
	parallaxElements.forEach((element) => {
		// Add will-change for performance
		element.style.willChange = 'transform';
		observer.observe(element);
	});

	/**
	 * Update parallax transforms
	 */
	function updateParallax() {
		const scrollY = window.scrollY;

		visibleElements.forEach((element) => {
			// Check if effect should apply on current device
			if (!shouldApplyOnDevice(element)) {
				element.style.transform = '';
				return;
			}

			const settings = parseSettings(element);
			const offset = calculateParallaxOffset(
				element,
				settings,
				scrollY,
				viewportHeight
			);

			// Apply transform using translate3d for GPU acceleration
			element.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
		});

		ticking = false;
	}

	/**
	 * Request animation frame throttling
	 */
	function requestTick() {
		if (!ticking) {
			requestAnimationFrame(updateParallax);
			ticking = true;
		}
	}

	// Add scroll listener with passive flag for performance
	window.addEventListener('scroll', requestTick, { passive: true });

	// Update viewport height on resize (debounced)
	let resizeTimeout;
	window.addEventListener(
		'resize',
		() => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				viewportHeight = window.innerHeight;
				requestTick();
			}, 150);
		},
		{ passive: true }
	);

	// Initial update
	requestTick();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initParallax);
} else {
	initParallax();
}
