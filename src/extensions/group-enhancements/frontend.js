/**
 * Group Block Enhancements - Frontend
 *
 * Handles dynamic overlay rendering on the frontend
 *
 * @package DesignSetGo
 */

document.addEventListener('DOMContentLoaded', function () {
	// Find all Group blocks with overlay
	const groupsWithOverlay = document.querySelectorAll('.has-dsg-overlay');

	groupsWithOverlay.forEach((group) => {
		const overlayColor = group.getAttribute('data-overlay-color');
		const overlayOpacity = group.getAttribute('data-overlay-opacity');

		if (overlayColor) {
			// Convert opacity from 0-100 to 0-1
			const opacityValue = overlayOpacity ? overlayOpacity / 100 : 0.5;

			// Set CSS custom properties
			group.style.setProperty('--dsg-overlay-color', overlayColor);
			group.style.setProperty('--dsg-overlay-opacity', opacityValue);
		}
	});
});
