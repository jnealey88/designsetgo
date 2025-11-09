/**
 * Color Contrast Checker Utility
 *
 * Provides WCAG 2.1 contrast ratio calculation and validation.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Convert hex color to RGB
 *
 * @param {string} hex - Hex color code (#RRGGBB or #RGB)
 * @return {Object|null} RGB object {r, g, b} or null if invalid
 */
export function hexToRgb(hex) {
	// Remove # if present
	hex = hex.replace(/^#/, '');

	// Handle shorthand hex (#RGB)
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((char) => char + char)
			.join('');
	}

	// Parse hex to RGB
	const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null;
}

/**
 * Parse CSS color string to RGB
 *
 * Supports: hex (#RRGGBB), rgb(), rgba(), CSS color names
 *
 * @param {string} color - CSS color string
 * @return {Object|null} RGB object {r, g, b} or null if invalid
 */
export function parseColor(color) {
	if (!color || typeof color !== 'string') {
		return null;
	}

	// Handle hex colors
	if (color.startsWith('#')) {
		return hexToRgb(color);
	}

	// Handle rgb/rgba
	const rgbMatch = color.match(
		/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
	);
	if (rgbMatch) {
		return {
			r: parseInt(rgbMatch[1], 10),
			g: parseInt(rgbMatch[2], 10),
			b: parseInt(rgbMatch[3], 10),
		};
	}

	// Handle CSS color names (basic set)
	const colorNames = {
		white: { r: 255, g: 255, b: 255 },
		black: { r: 0, g: 0, b: 0 },
		red: { r: 255, g: 0, b: 0 },
		green: { r: 0, g: 128, b: 0 },
		blue: { r: 0, g: 0, b: 255 },
		yellow: { r: 255, g: 255, b: 0 },
		cyan: { r: 0, g: 255, b: 255 },
		magenta: { r: 255, g: 0, b: 255 },
		silver: { r: 192, g: 192, b: 192 },
		gray: { r: 128, g: 128, b: 128 },
		maroon: { r: 128, g: 0, b: 0 },
		olive: { r: 128, g: 128, b: 0 },
		lime: { r: 0, g: 255, b: 0 },
		aqua: { r: 0, g: 255, b: 255 },
		teal: { r: 0, g: 128, b: 128 },
		navy: { r: 0, g: 0, b: 128 },
		fuchsia: { r: 255, g: 0, b: 255 },
		purple: { r: 128, g: 0, b: 128 },
	};

	const lowerColor = color.toLowerCase();
	return colorNames[lowerColor] || null;
}

/**
 * Calculate relative luminance of a color
 *
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *
 * @param {Object} rgb - RGB object {r, g, b}
 * @return {number} Relative luminance (0-1)
 */
export function getLuminance(rgb) {
	// Convert to sRGB
	const rsRGB = rgb.r / 255;
	const gsRGB = rgb.g / 255;
	const bsRGB = rgb.b / 255;

	// Apply gamma correction
	const r =
		rsRGB <= 0.03928
			? rsRGB / 12.92
			: Math.pow((rsRGB + 0.055) / 1.055, 2.4);
	const g =
		gsRGB <= 0.03928
			? gsRGB / 12.92
			: Math.pow((gsRGB + 0.055) / 1.055, 2.4);
	const b =
		bsRGB <= 0.03928
			? bsRGB / 12.92
			: Math.pow((bsRGB + 0.055) / 1.055, 2.4);

	// Calculate luminance
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 *
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 *
 * @param {string} color1 - First color (CSS color string)
 * @param {string} color2 - Second color (CSS color string)
 * @return {number|null} Contrast ratio (1-21) or null if invalid colors
 */
export function getContrastRatio(color1, color2) {
	const rgb1 = parseColor(color1);
	const rgb2 = parseColor(color2);

	if (!rgb1 || !rgb2) {
		return null;
	}

	const lum1 = getLuminance(rgb1);
	const lum2 = getLuminance(rgb2);

	// Ensure lighter color is in numerator
	const lighter = Math.max(lum1, lum2);
	const darker = Math.min(lum1, lum2);

	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 *
 * WCAG 2.1 Requirements:
 * - AA Normal text (< 18pt): 4.5:1
 * - AA Large text (≥ 18pt or ≥ 14pt bold): 3:1
 * - AAA Normal text: 7:1
 * - AAA Large text: 4.5:1
 *
 * @param {number}  ratio       - Contrast ratio
 * @param {string}  level       - WCAG level ('AA' or 'AAA')
 * @param {boolean} isLargeText - Whether text is large (≥ 18pt or ≥ 14pt bold)
 * @return {boolean} True if meets standard
 */
export function meetsWCAG(ratio, level = 'AA', isLargeText = false) {
	if (!ratio || ratio < 1) {
		return false;
	}

	if (level === 'AAA') {
		return isLargeText ? ratio >= 4.5 : ratio >= 7;
	}

	// Default to AA
	return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get contrast validation result with details
 *
 * @param {string}  foreground  - Foreground/text color
 * @param {string}  background  - Background color
 * @param {boolean} isLargeText - Whether text is large
 * @return {Object} Validation result
 */
export function validateContrast(foreground, background, isLargeText = false) {
	const ratio = getContrastRatio(foreground, background);

	if (ratio === null) {
		return {
			isValid: false,
			ratio: null,
			level: 'invalid',
			message: 'Invalid color format',
		};
	}

	const meetsAA = meetsWCAG(ratio, 'AA', isLargeText);
	const meetsAAA = meetsWCAG(ratio, 'AAA', isLargeText);

	let level;
	let message;

	if (meetsAAA) {
		level = 'AAA';
		message = `Excellent contrast (${ratio.toFixed(2)}:1)`;
	} else if (meetsAA) {
		level = 'AA';
		message = `Good contrast (${ratio.toFixed(2)}:1)`;
	} else {
		level = 'fail';
		const required = isLargeText ? 3 : 4.5;
		message = `Low contrast (${ratio.toFixed(2)}:1). Minimum ${required}:1 required for WCAG AA`;
	}

	return {
		isValid: meetsAA,
		ratio: parseFloat(ratio.toFixed(2)),
		level,
		message,
		meetsAA,
		meetsAAA,
	};
}

/**
 * Suggest accessible color adjustments
 *
 * @param {string} foreground - Current foreground color
 * @param {string} background - Current background color
 * @return {Object|null} Suggested adjustments or null
 */
export function suggestAccessibleColors(foreground, background) {
	const fg = parseColor(foreground);
	const bg = parseColor(background);

	if (!fg || !bg) {
		return null;
	}

	const currentRatio = getContrastRatio(foreground, background);

	// If already meets AA, no suggestions needed
	if (currentRatio >= 4.5) {
		return null;
	}

	const bgLum = getLuminance(bg);

	// Suggest either darker or lighter foreground
	const suggestion = {
		message:
			bgLum > 0.5
				? 'Try using a darker text color'
				: 'Try using a lighter text color',
		suggestedColors:
			bgLum > 0.5 ? ['#000000', '#1a1a1a'] : ['#ffffff', '#f0f0f0'],
	};

	return suggestion;
}
