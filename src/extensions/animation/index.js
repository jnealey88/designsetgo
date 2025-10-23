/**
 * Animation Extension
 *
 * Handles animation functionality for blocks.
 *
 * @package DesignSetGo
 */

// Simple load-based animations for Phase 1.
document.addEventListener('DOMContentLoaded', () => {
	const animatedElements = document.querySelectorAll('[data-dsg-animation]');

	animatedElements.forEach((element) => {
		const animation = element.dataset.dsgAnimation;
		const duration = element.dataset.dsgAnimationDuration || '500';
		const delay = element.dataset.dsgAnimationDelay || '0';
		const easing = element.dataset.dsgAnimationEasing || 'ease-in-out';

		// Apply styles.
		element.style.animationDuration = `${duration}ms`;
		element.style.animationDelay = `${delay}ms`;
		element.style.animationTimingFunction = easing;

		// Add animation class.
		element.classList.add('dsg-animate', `dsg-animate-${animation}`);
	});
});
