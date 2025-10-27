/**
 * Block Animations - Frontend JavaScript
 *
 * Handles animation triggers and execution on the frontend
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

/**
 * Initialize animations on page load
 */
document.addEventListener('DOMContentLoaded', () => {
	const animatedElements = document.querySelectorAll('[data-dsg-animation-enabled="true"]');

	if (!animatedElements.length) {
		return;
	}

	// Process each animated element
	animatedElements.forEach((element) => {
		const trigger = element.dataset.dsgAnimationTrigger || 'scroll';
		const duration = element.dataset.dsgAnimationDuration || '600';
		const delay = element.dataset.dsgAnimationDelay || '0';
		const easing = element.dataset.dsgAnimationEasing || 'ease-out';

		// Set animation styles
		element.style.animationDuration = `${duration}ms`;
		element.style.animationDelay = `${delay}ms`;
		element.style.animationTimingFunction = easing;

		// Apply trigger-specific behavior
		switch (trigger) {
			case 'load':
				animateOnLoad(element);
				break;
			case 'scroll':
				animateOnScroll(element);
				break;
			case 'hover':
				animateOnHover(element);
				break;
			case 'click':
				animateOnClick(element);
				break;
			default:
				animateOnScroll(element);
		}
	});
});

/**
 * Animate element on page load
 *
 * @param {HTMLElement} element Element to animate
 */
function animateOnLoad(element) {
	// Trigger entrance animation immediately on page load
	requestAnimationFrame(() => {
		element.classList.add('dsg-entrance-active');
	});
}

/**
 * Animate element when it enters viewport
 *
 * @param {HTMLElement} element Element to animate
 */
function animateOnScroll(element) {
	const offset = parseInt(element.dataset.dsgAnimationOffset) || 100;
	const once = element.dataset.dsgAnimationOnce === 'true';
	const hasExitAnimation = element.dataset.dsgExitAnimation && element.dataset.dsgExitAnimation !== '';
	const duration = parseInt(element.dataset.dsgAnimationDuration) || 600;
	let hasAnimated = false;
	let isAnimating = false;
	let wasIntersecting = false;
	let previousRatio = 0;
	let animationTimeout = null;

	// If exit animation is present, force repeating behavior
	const shouldRepeat = hasExitAnimation || !once;

	// Create intersection observer with multiple thresholds for smooth detection
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const currentRatio = entry.intersectionRatio;
				const isEntering = entry.isIntersecting && !wasIntersecting;
				const isFullyVisible = entry.isIntersecting && currentRatio > 0.8;
				const isStartingToLeave = wasIntersecting && currentRatio < previousRatio && currentRatio < 0.8;

				if (isEntering) {
					// Element is entering viewport - play entrance animation
					if (!hasAnimated || shouldRepeat) {
						// Clear any pending exit animation
						if (animationTimeout) {
							clearTimeout(animationTimeout);
							animationTimeout = null;
						}

						// Force reset state for fast scroll handling
						isAnimating = false;
						element.classList.remove('dsg-exit-active');
						element.classList.add('dsg-entrance-active');
						hasAnimated = true;

						// Set animating flag and schedule reset
						isAnimating = true;
						animationTimeout = setTimeout(() => {
							isAnimating = false;
							animationTimeout = null;
						}, duration);
					}

					// Unobserve if only animating once and no exit animation
					if (once && !hasExitAnimation) {
						observer.unobserve(element);
					}
				} else if (isStartingToLeave && hasExitAnimation && shouldRepeat && hasAnimated) {
					// Element is starting to leave viewport (80% visible threshold)
					// Play exit animation early so user sees it
					if (!isAnimating) {
						if (animationTimeout) {
							clearTimeout(animationTimeout);
							animationTimeout = null;
						}

						isAnimating = true;
						element.classList.remove('dsg-entrance-active');
						element.classList.add('dsg-exit-active');

						// Reset after exit animation completes
						animationTimeout = setTimeout(() => {
							element.classList.remove('dsg-exit-active');
							isAnimating = false;
							animationTimeout = null;
						}, duration);
					}
				} else if (!entry.isIntersecting && wasIntersecting && !hasExitAnimation) {
					// Element left viewport and no exit animation - just clean up
					element.classList.remove('dsg-entrance-active');
				}

				wasIntersecting = entry.isIntersecting;
				previousRatio = currentRatio;
			});
		},
		{
			rootMargin: `${offset}px`,
			threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Granular thresholds for early detection
		}
	);

	observer.observe(element);
}

/**
 * Animate element on hover
 *
 * @param {HTMLElement} element Element to animate
 */
function animateOnHover(element) {
	const duration = parseInt(element.dataset.dsgAnimationDuration) || 600;
	const hasExitAnimation = element.dataset.dsgExitAnimation && element.dataset.dsgExitAnimation !== '';
	let isAnimating = false;

	element.addEventListener('mouseenter', () => {
		if (!isAnimating) {
			isAnimating = true;
			element.classList.remove('dsg-exit-active');
			element.classList.add('dsg-entrance-active');

			// Reset after animation completes
			setTimeout(() => {
				isAnimating = false;
			}, duration);
		}
	});

	element.addEventListener('mouseleave', () => {
		// Trigger exit animation when mouse leaves
		if (hasExitAnimation && !isAnimating) {
			isAnimating = true;
			element.classList.remove('dsg-entrance-active');
			element.classList.add('dsg-exit-active');

			setTimeout(() => {
				element.classList.remove('dsg-exit-active');
				isAnimating = false;
			}, duration);
		} else {
			element.classList.remove('dsg-entrance-active');
		}
	});
}

/**
 * Animate element on click
 *
 * @param {HTMLElement} element Element to animate
 */
function animateOnClick(element) {
	const duration = parseInt(element.dataset.dsgAnimationDuration) || 600;
	let isAnimating = false;

	element.addEventListener('click', (e) => {
		// Don't prevent default or stop propagation for links/buttons
		if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
			return;
		}

		if (!isAnimating) {
			isAnimating = true;
			element.classList.remove('dsg-exit-active');
			element.classList.add('dsg-entrance-active');

			// Reset after animation completes
			setTimeout(() => {
				element.classList.remove('dsg-entrance-active');
				isAnimating = false;
			}, duration + 100);
		}
	});

	// Make element keyboard accessible if clickable
	if (!element.hasAttribute('tabindex')) {
		element.setAttribute('tabindex', '0');
		element.setAttribute('role', 'button');
	}

	// Handle keyboard activation
	element.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			element.click();
		}
	});
}
