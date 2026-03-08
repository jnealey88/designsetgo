/**
 * Scroll Slides - Scroll Engine
 * Scroll-driven animation for desktop
 */

/* global requestAnimationFrame */

import { __, sprintf } from '@wordpress/i18n';

/**
 * Clamp a value between min and max
 *
 * @param {number} min   Minimum value
 * @param {number} value Value to clamp
 * @param {number} max   Maximum value
 * @return {number} Clamped value
 */
function clamp(min, value, max) {
	return Math.min(Math.max(value, min), max);
}

/**
 * Set up the scroll-driven animation engine
 *
 * @param {HTMLElement}     container  Container element
 * @param {NodeList}        slides     Slide elements
 * @param {AbortController} controller AbortController for cleanup on removal or reduced-motion
 */
export function setupScrollEngine(container, slides, controller) {
	const { signal } = controller;
	const spacer = container.parentNode; // .dsgo-scroll-slides-spacer
	const navItems = container.querySelectorAll(
		'.dsgo-scroll-slides__nav-item'
	);
	const bgLayers = container.querySelectorAll('.dsgo-scroll-slides__bg');
	const liveRegion = container.querySelector('[aria-live]');
	const slideCount = slides.length;

	// Cache viewport dimensions
	let viewportHeight = window.innerHeight;

	function updateViewportDimensions() {
		viewportHeight = window.innerHeight;
	}

	let ticking = false;
	let currentSlideIndex = 0;

	/**
	 * Main update loop — calculate progress and update active states
	 */
	function update() {
		const totalRange = spacer.offsetHeight - viewportHeight;

		if (totalRange <= 0) {
			ticking = false;
			return;
		}

		const spacerRect = spacer.getBoundingClientRect();

		// Progress: 0 (top of spacer at viewport top) to 1 (bottom of spacer at viewport bottom)
		const progress = clamp(0, -spacerRect.top / totalRange, 1);

		// Which slide should be active?
		// Last slide stays active for the final segment
		const newIndex = Math.min(
			Math.floor(progress * slideCount),
			slideCount - 1
		);

		if (newIndex !== currentSlideIndex) {
			// Deactivate old slide
			slides[currentSlideIndex].classList.remove('is-active');
			slides[currentSlideIndex].setAttribute('inert', '');
			slides[currentSlideIndex].setAttribute('aria-hidden', 'true');
			navItems[currentSlideIndex].classList.remove('is-active');
			navItems[currentSlideIndex].removeAttribute('aria-current');
			bgLayers[currentSlideIndex].classList.remove('is-active');

			// Activate new slide
			slides[newIndex].classList.add('is-active');
			slides[newIndex].removeAttribute('inert');
			slides[newIndex].removeAttribute('aria-hidden');
			navItems[newIndex].classList.add('is-active');
			navItems[newIndex].setAttribute('aria-current', 'step');
			bgLayers[newIndex].classList.add('is-active');

			// Announce slide change to screen readers
			if (liveRegion) {
				liveRegion.textContent = sprintf(
					/* translators: 1: current slide number, 2: total slides, 3: slide heading */
					__('Slide %1$d of %2$d: %3$s', 'designsetgo'),
					newIndex + 1,
					slideCount,
					navItems[newIndex]?.textContent?.trim() || ''
				);
			}

			currentSlideIndex = newIndex;
		}

		ticking = false;
	}

	function requestTick() {
		// Clean up if container was removed from DOM (e.g. client-side navigation)
		if (signal.aborted || !spacer.isConnected) {
			controller.abort();
			return;
		}
		if (!ticking) {
			requestAnimationFrame(update);
			ticking = true;
		}
	}

	// Resize handler with debounce
	let resizeTimer;
	function handleResize() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			updateViewportDimensions();
			requestTick();
		}, 150);
	}

	// Nav click handler — scroll to center of target slide's range
	// Using (index + 0.5) avoids landing on exact boundaries where
	// floating point precision could keep us on the wrong slide
	navItems.forEach((button, index) => {
		button.addEventListener(
			'click',
			() => {
				const totalRange = spacer.offsetHeight - viewportHeight;
				const targetScroll =
					spacer.getBoundingClientRect().top +
					window.scrollY +
					((index + 0.5) / slideCount) * totalRange;
				window.scrollTo({ top: targetScroll, behavior: 'smooth' });
			},
			{ signal }
		);
	});

	// Bind events — signal auto-removes listeners when controller is aborted
	window.addEventListener('scroll', requestTick, { passive: true, signal });
	window.addEventListener('resize', handleResize, { passive: true, signal });

	// Initial update
	update();
}
