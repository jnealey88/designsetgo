/**
 * Overlay Extension - Frontend
 *
 * Handles overlay initialization on the frontend.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

(function () {
	'use strict';

	/**
	 * Initialize overlays
	 */
	function initOverlays() {
		const overlayBlocks = document.querySelectorAll('.dsg-has-overlay');

		overlayBlocks.forEach((block) => {
			const overlayColor = block.getAttribute('data-overlay-color');
			const overlayOpacity = parseInt(block.getAttribute('data-overlay-opacity') || '75', 10);

			// Check if overlay already exists
			if (block.querySelector('.dsg-overlay')) {
				return;
			}

			// Use custom color or default to black
			const defaultColor = '#000000';
			const effectiveColor = overlayColor || defaultColor;

			// Convert hex to rgba
			const hex = effectiveColor.replace('#', '');
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			const a = overlayOpacity / 100;
			const overlayRgba = `rgba(${r}, ${g}, ${b}, ${a})`;

			// Create overlay element
			const overlay = document.createElement('div');
			overlay.className = 'dsg-overlay';
			overlay.style.position = 'absolute';
			overlay.style.top = '0';
			overlay.style.left = '0';
			overlay.style.width = '100%';
			overlay.style.height = '100%';
			overlay.style.backgroundColor = overlayRgba;
			overlay.style.zIndex = '1';
			overlay.style.pointerEvents = 'none';

			// Ensure block has position relative
			const blockPosition = window.getComputedStyle(block).position;
			if (blockPosition === 'static') {
				block.style.position = 'relative';
			}

			// Insert overlay as first child
			block.insertBefore(overlay, block.firstChild);

			// Ensure content is above overlay
			Array.from(block.children).forEach((child) => {
				if (child !== overlay) {
					const childPosition = window.getComputedStyle(child).position;
					if (childPosition === 'static') {
						child.style.position = 'relative';
						child.style.zIndex = '2';
					}
				}
			});
		});
	}

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initOverlays);
	} else {
		initOverlays();
	}
})();
