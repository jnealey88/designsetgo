/**
 * Icon Injector
 *
 * Finds all icons with data-icon-name attributes and injects
 * the appropriate SVG markup from the global icon library.
 *
 * Icons are provided by PHP via wp_localize_script to avoid
 * bundling the 51KB icon library into every block's JS bundle.
 *
 * @since 1.2.0
 */

/**
 * Initialize icon injection on page load.
 */
function initIconInjection() {
	// Check if icon library is available (provided by PHP)
	if (typeof window.dsgoIcons === 'undefined') {
		return;
	}

	// Find all icon placeholders
	const iconPlaceholders = document.querySelectorAll(
		'.dsgo-lazy-icon[data-icon-name]'
	);

	if (iconPlaceholders.length === 0) {
		return;
	}

	// Inject icons into all placeholders
	iconPlaceholders.forEach((placeholder) => {
		const iconName = placeholder.dataset.iconName;

		if (!iconName || !window.dsgoIcons[iconName]) {
			return;
		}

		try {
			// Inject SVG markup
			placeholder.innerHTML = window.dsgoIcons[iconName];
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(`Failed to inject icon "${iconName}":`, error);
		}
	});
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initIconInjection);
} else {
	initIconInjection();
}
