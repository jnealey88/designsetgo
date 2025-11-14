/**
 * Scroll Accordion - Frontend JavaScript
 * Handles sticky stacking card effect with scaling animation
 * Based on scroll position within page
 */

/* global requestAnimationFrame */

/**
 * Initialize all scroll accordions on the page
 */
function initScrollAccordions() {
	const accordions = document.querySelectorAll('.dsgo-scroll-accordion');

	if (!accordions.length) {
		return;
	}

	// Check if user prefers reduced motion
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	accordions.forEach((accordion) => {
		// Get all items
		const items = accordion.querySelectorAll('.dsgo-scroll-accordion-item');

		if (!items.length) {
			return;
		}

		// Ensure parent Sections aren't clipping sticky children
		let stackWrapper = accordion.closest('.dsgo-stack');

		while (stackWrapper) {
			stackWrapper.classList.add('dsgo-stack--allow-overflow');
			stackWrapper = stackWrapper.parentElement
				? stackWrapper.parentElement.closest('.dsgo-stack')
				: null;
		}

		// If reduced motion is preferred, don't animate
		if (prefersReducedMotion) {
			return;
		}

		// Track scroll position and apply scaling
		let ticking = false;

		function updateCards() {
			const viewportCenter = window.innerHeight / 2;

			items.forEach((item) => {
				const itemRect = item.getBoundingClientRect();

				// Calculate how far the item has scrolled relative to viewport center
				const distanceFromCenter = itemRect.top - viewportCenter;

				// Items below center should be scaled down
				// Scale decreases as items approach the center from below
				if (distanceFromCenter > 0) {
					// Item is below center - scale based on distance
					const scaleValue = Math.max(
						0.85,
						1 - (distanceFromCenter / window.innerHeight) * 0.3
					);
					item.style.transform = `scale(${scaleValue})`;
				} else {
					// Item is at or above center - full scale
					item.style.transform = 'scale(1)';
				}
			});

			ticking = false;
		}

		// Throttle scroll events with requestAnimationFrame
		function requestTick() {
			if (!ticking) {
				requestAnimationFrame(updateCards);
				ticking = true;
			}
		}

		// Listen for scroll and resize events
		window.addEventListener('scroll', requestTick, { passive: true });
		window.addEventListener('resize', requestTick, { passive: true });

		// Initial check
		updateCards();
	});
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initScrollAccordions);
} else {
	// DOM is already ready
	initScrollAccordions();
}

/**
 * Reinitialize on dynamic content changes (e.g., AJAX)
 */
document.addEventListener('scroll-accordion:reinit', initScrollAccordions);
