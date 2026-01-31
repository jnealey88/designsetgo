/**
 * DOM Helper Utilities
 *
 * Helper functions for DOM manipulation and querying.
 *
 * @package
 * @since 1.4.0
 */

/**
 * Find the editor header settings container.
 *
 * @return {Element|null} The container element or null.
 */
export function findHeaderSettingsContainer() {
	const selectors = [
		'.editor-header__settings',
		'.edit-post-header__settings',
	];

	for (const selector of selectors) {
		const element = document.querySelector(selector);
		if (element) {
			return element;
		}
	}

	return null;
}
