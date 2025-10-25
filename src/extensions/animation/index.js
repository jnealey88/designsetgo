/**
 * Animation Extension - Frontend Only
 *
 * Handles simple load-based animations for blocks.
 *
 * NOTE: This is a placeholder for future animation functionality.
 * Currently only supports data attributes added manually:
 * - data-dsg-animation: Animation type
 * - data-dsg-animation-duration: Duration in milliseconds (default: 500)
 * - data-dsg-animation-delay: Delay in milliseconds (default: 0)
 * - data-dsg-animation-easing: Timing function (default: ease-in-out)
 *
 * TODO: Add block editor controls for animation settings
 * TODO: Add scroll-triggered animations
 * TODO: Add animation presets (fade, slide, etc.)
 *
 * @package
 */

// Simple load-based animations
document.addEventListener('DOMContentLoaded', () => {
	const animatedElements = document.querySelectorAll('[data-dsg-animation]');

	animatedElements.forEach((element) => {
		const animation = element.dataset.dsgAnimation;
		const duration = element.dataset.dsgAnimationDuration || '500';
		const delay = element.dataset.dsgAnimationDelay || '0';
		const easing = element.dataset.dsgAnimationEasing || 'ease-in-out';

		// Apply animation styles
		element.style.animationDuration = `${duration}ms`;
		element.style.animationDelay = `${delay}ms`;
		element.style.animationTimingFunction = easing;

		// Add animation classes
		element.classList.add('dsg-animate', `dsg-animate-${animation}`);
	});
});
