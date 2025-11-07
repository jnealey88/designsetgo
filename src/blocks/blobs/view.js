/**
 * Blobs Block - Frontend JavaScript
 *
 * Handles accessibility and animation initialization
 *
 * @since 1.0.0
 */

/**
 * Initialize blob animations with accessibility support
 */
function initBlobs() {
	const blobs = document.querySelectorAll('.dsg-blobs');

	if (blobs.length === 0) {
		return;
	}

	// Check if user prefers reduced motion
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if (prefersReducedMotion) {
		// Disable all animations by adding a class
		blobs.forEach((blob) => {
			blob.classList.add('dsg-blobs--no-animation');
		});
		return;
	}

	// Initialize each blob
	blobs.forEach(() => {
		// Future: Add SVG-based animation logic here if implementing Phase 2
		// For now, CSS animations handle everything via data-blob-animation attribute
	});
}

// Initialize on DOMContentLoaded or immediately if DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initBlobs);
} else {
	initBlobs();
}

// Re-initialize if user changes motion preferences
if (window.matchMedia) {
	const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	// Modern browsers
	if (motionQuery.addEventListener) {
		motionQuery.addEventListener('change', initBlobs);
	}
	// Legacy browsers
	else if (motionQuery.addListener) {
		motionQuery.addListener(initBlobs);
	}
}
