/**
 * Counter Group Block - Frontend JavaScript
 *
 * Animated counting using CountUp.js
 * Features:
 * - Lazy-loaded animation with Intersection Observer
 * - Respects prefers-reduced-motion accessibility setting
 * - Easing functions for smooth animations
 */

/* global IntersectionObserver */

import { CountUp } from 'countup.js';

/**
 * Initialize counter animations on page load
 */
document.addEventListener('DOMContentLoaded', () => {
	initCounterAnimations();
});

/**
 * Initialize counter animations with lazy loading
 */
function initCounterAnimations() {
	const counterGroups = document.querySelectorAll('.dsg-counter-group');

	if (!counterGroups.length) {
		return;
	}

	// Check if user prefers reduced motion
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	// If user prefers reduced motion, show final values immediately
	if (prefersReducedMotion) {
		counterGroups.forEach((group) => {
			const counters = group.querySelectorAll('.dsg-counter');
			counters.forEach((counter) => {
				showFinalValue(counter);
			});
		});
		return;
	}

	// Use Intersection Observer for lazy loading
	const counterObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateCountersInGroup(entry.target);
					counterObserver.unobserve(entry.target);
				}
			});
		},
		{
			rootMargin: '0px', // Start animation when element enters viewport
			threshold: 0.1, // 10% visible
		}
	);

	counterGroups.forEach((group) => {
		counterObserver.observe(group);
	});
}

/**
 * Animate all counters in a group
 * @param {HTMLElement} group - Counter group element
 */
function animateCountersInGroup(group) {
	const counters = group.querySelectorAll('.dsg-counter');

	counters.forEach((counter) => {
		animateCounter(counter);
	});
}

/**
 * Animate a single counter
 * @param {HTMLElement} counter - Counter element
 */
function animateCounter(counter) {
	const valueElement = counter.querySelector('.dsg-counter__value');
	if (!valueElement) {
		return;
	}

	// Get counter settings from data attributes
	const startValue = parseFloat(counter.dataset.startValue) || 0;
	const endValue = parseFloat(counter.dataset.endValue) || 100;
	const decimals = parseInt(counter.dataset.decimals, 10) || 0;
	const prefix = counter.dataset.prefix || '';
	const suffix = counter.dataset.suffix || '';
	const duration = parseFloat(counter.dataset.duration) || 2;
	const delay = parseFloat(counter.dataset.delay) || 0;
	const easing = counter.dataset.easing || 'easeOutQuad';
	const useGrouping = counter.dataset.useGrouping === 'true';
	const separator = counter.dataset.separator || ',';
	const decimal = counter.dataset.decimal || '.';

	// CountUp.js options
	const options = {
		startVal: startValue,
		decimalPlaces: decimals,
		duration,
		useEasing: true,
		useGrouping,
		separator,
		decimal,
		prefix,
		suffix,
		enableScrollSpy: false, // We're using our own Intersection Observer
		scrollSpyOnce: true,
	};

	// Map our easing names to CountUp.js easing functions
	const easingFn = getEasingFunction(easing);
	if (easingFn) {
		options.easingFn = easingFn;
	}

	// Create and start counter animation
	const countUp = new CountUp(valueElement, endValue, options);

	if (!countUp.error) {
		// Start after delay
		setTimeout(() => {
			countUp.start();
		}, delay * 1000);
	} else {
		// CountUp initialization failed, show final value as fallback
		showFinalValue(counter);
	}
}

/**
 * Show final value immediately (no animation)
 * @param {HTMLElement} counter - Counter element
 */
function showFinalValue(counter) {
	const valueElement = counter.querySelector('.dsg-counter__value');
	if (!valueElement) {
		return;
	}

	const endValue = parseFloat(counter.dataset.endValue) || 100;
	const decimals = parseInt(counter.dataset.decimals, 10) || 0;
	const useGrouping = counter.dataset.useGrouping === 'true';
	const separator = counter.dataset.separator || ',';
	const decimal = counter.dataset.decimal || '.';

	// Format number
	let formatted = endValue.toFixed(decimals);
	const parts = formatted.split('.');

	// Add thousands separator
	if (useGrouping) {
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	}

	// Join with decimal point
	formatted = parts.join(decimal);

	// Update value
	valueElement.textContent = formatted;
}

/**
 * Get easing function by name
 * @param {string} name - Easing function name
 * @return {Function|null} Easing function
 */
function getEasingFunction(name) {
	const easingFunctions = {
		linear: (t, b, c, d) => {
			return (c * t) / d + b;
		},
		easeOutQuad: (t, b, c, d) => {
			t /= d;
			return -c * t * (t - 2) + b;
		},
		easeOutCubic: (t, b, c, d) => {
			t /= d;
			t--;
			return c * (t * t * t + 1) + b;
		},
		easeInOutQuad: (t, b, c, d) => {
			t /= d / 2;
			if (t < 1) {
				return (c / 2) * t * t + b;
			}
			t--;
			return (-c / 2) * (t * (t - 2) - 1) + b;
		},
	};

	return easingFunctions[name] || null;
}
