/**
 * Text Style Format Utilities
 *
 * @since 1.3.0
 */

import { CSS_CLASSES } from './constants';

/**
 * Check if a value is a gradient (linear or radial)
 *
 * @param {string} value - Color or gradient value
 * @return {boolean} True if the value is a gradient
 */
export function isGradient(value) {
	if (!value) {
		return false;
	}
	return (
		value.includes('linear-gradient') ||
		value.includes('radial-gradient') ||
		value.includes('conic-gradient')
	);
}

/**
 * Generate inline style string and CSS classes for the format
 *
 * @param {Object} options                   - Style options
 * @param {string} options.textColor         - Solid text color
 * @param {string} options.textGradient      - Gradient for text fill
 * @param {string} options.highlightColor    - Solid highlight background
 * @param {string} options.highlightGradient - Gradient for highlight background
 * @param {string} options.fontSize          - Font size value
 * @param {string} options.padding           - Padding value
 * @param {string} options.borderRadius      - Border radius value
 * @return {Object} Object with style and class properties
 */
export function generateStyleString({
	textColor,
	textGradient,
	highlightColor,
	highlightGradient,
	fontSize,
	padding,
	borderRadius,
}) {
	const styles = [];
	const classes = [CSS_CLASSES.BASE];

	// Text color/gradient (mutually exclusive with gradient highlight for background-image)
	if (textGradient) {
		styles.push(`background-image: ${textGradient}`);
		classes.push(CSS_CLASSES.GRADIENT_TEXT);
	} else if (textColor) {
		styles.push(`color: ${textColor}`);
	}

	// Highlight color/gradient
	// Note: Gradient highlight conflicts with gradient text (both use background-image)
	// Gradient text takes priority if both are set
	if (highlightGradient && !textGradient) {
		styles.push(`background: ${highlightGradient}`);
		classes.push(CSS_CLASSES.GRADIENT_HIGHLIGHT);
	} else if (highlightColor) {
		styles.push(`background-color: ${highlightColor}`);
	}

	// Font size
	if (fontSize) {
		styles.push(`font-size: ${fontSize}`);
	}

	// Padding
	if (padding) {
		styles.push(`padding: ${padding}`);
	}

	// Border radius
	if (borderRadius) {
		styles.push(`border-radius: ${borderRadius}`);
	}

	return {
		style: styles.join('; '),
		class: classes.join(' '),
	};
}

/**
 * Parse style string back into individual properties
 *
 * @param {string} styleString - Inline style string
 * @param {string} className   - CSS class string
 * @return {Object} Parsed style properties
 */
export function parseStyleString(styleString, className) {
	const result = {
		textColor: '',
		textGradient: '',
		highlightColor: '',
		highlightGradient: '',
		fontSize: '',
		padding: '',
		borderRadius: '',
	};

	if (!styleString) {
		return result;
	}

	const isGradientText = className?.includes(CSS_CLASSES.GRADIENT_TEXT);
	const isGradientHighlight = className?.includes(
		CSS_CLASSES.GRADIENT_HIGHLIGHT
	);

	// Split style string into individual declarations
	const declarations = styleString.split(';').map((s) => s.trim());

	declarations.forEach((declaration) => {
		if (!declaration) {
			return;
		}

		const colonIndex = declaration.indexOf(':');
		if (colonIndex === -1) {
			return;
		}

		const property = declaration.substring(0, colonIndex).trim();
		const value = declaration.substring(colonIndex + 1).trim();

		switch (property) {
			case 'color':
				result.textColor = value;
				break;
			case 'background-image':
				if (isGradientText) {
					result.textGradient = value;
				}
				break;
			case 'background':
				if (isGradientHighlight) {
					result.highlightGradient = value;
				}
				break;
			case 'background-color':
				result.highlightColor = value;
				break;
			case 'font-size':
				result.fontSize = value;
				break;
			case 'padding':
				result.padding = value;
				break;
			case 'border-radius':
				result.borderRadius = value;
				break;
		}
	});

	return result;
}

/**
 * Check if any styles are applied
 *
 * @param {Object} styles - Style properties object
 * @return {boolean} True if any style is set
 */
export function hasAnyStyle(styles) {
	return Object.values(styles).some((value) => Boolean(value));
}
