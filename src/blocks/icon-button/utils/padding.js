/**
 * Split padding-related declarations from a style object.
 *
 * We can then apply padding to the inner button wrapper while keeping the block wrapper styles intact.
 *
 * @param {Object} [style={}] Original style object from useBlockProps.
 * @return {{paddingStyles: Object, remainingStyles: Object}} Split styles.
 */
export const splitPaddingStyles = (style = {}) => {
	const paddingStyles = {};
	const remainingStyles = {};

	Object.entries(style).forEach(([key, value]) => {
		if (key.toLowerCase().startsWith('padding')) {
			paddingStyles[key] = value;
		} else {
			remainingStyles[key] = value;
		}
	});

	return { paddingStyles, remainingStyles };
};

/**
 * Convert WordPress internal padding format to CSS.
 *
 * WordPress stores padding in format like "var:preset|spacing|50"
 * which needs to be converted to "var(--wp--preset--spacing--50)"
 *
 * @param {string} value - WordPress padding value
 * @return {string} CSS-formatted padding value
 */
export const convertPaddingValue = (value) => {
	if (!value) {
		return undefined;
	}

	// Check if it's a WordPress preset format (var:preset|type|slug)
	if (typeof value === 'string' && value.startsWith('var:preset|')) {
		// Convert "var:preset|spacing|50" to "var(--wp--preset--spacing--50)"
		const parts = value.split('|');
		if (parts.length === 3) {
			return `var(--wp--preset--${parts[1]}--${parts[2]})`;
		}
	}

	// Return as-is for direct values like "20px", "1.5rem", etc.
	return value;
};
