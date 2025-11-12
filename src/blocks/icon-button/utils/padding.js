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
