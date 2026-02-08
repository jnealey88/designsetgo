/**
 * Convert WordPress preset format to CSS variable.
 *
 * Converts "var:preset|spacing|md" to "var(--wp--preset--spacing--md)".
 * Also handles WordPress 6.1+ object format {top, left} for separate row/column gaps.
 *
 * @param {string|Object} value The preset value or gap object
 * @return {string|undefined} CSS variable format, coerced string, or undefined if no valid value
 */
export function convertPresetToCSSVar(value) {
	if (!value) {
		return undefined;
	}

	// Handle object format (WordPress 6.1+ for separate row/column gaps)
	// For flex layouts, use top value (row gap) as the primary gap
	if (typeof value === 'object') {
		value = value.top || value.left;
		if (!value) {
			return undefined;
		}
	}

	// Ensure value is a string before using string methods
	if (typeof value !== 'string') {
		return String(value);
	}

	// If it's already a CSS variable, return as-is
	if (value.startsWith('var(--')) {
		return value;
	}

	// Convert WordPress preset format: var:preset|spacing|md -> var(--wp--preset--spacing--md)
	if (value.startsWith('var:preset|')) {
		const parts = value.replace('var:preset|', '').split('|');
		return `var(--wp--preset--${parts.join('--')})`;
	}

	return value;
}
