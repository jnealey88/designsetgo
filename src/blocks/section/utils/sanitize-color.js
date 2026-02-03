/**
 * Color Sanitization Utility
 *
 * Validates and sanitizes color values to prevent XSS attacks.
 *
 * @since 1.4.2
 */

/**
 * Validate and sanitize color values to prevent XSS
 * Allows: hex colors, rgb/rgba, hsl/hsla, CSS variables, and named colors
 *
 * @param {string} color - Color value to validate
 * @return {string|null} Sanitized color or null if invalid
 */
export function sanitizeColor(color) {
	if (!color || typeof color !== 'string') {
		return null;
	}

	// Trim whitespace
	const trimmed = color.trim();

	// Allow CSS custom properties (variables)
	if (/^var\(--[\w-]+(?:,\s*[^)]+)?\)$/i.test(trimmed)) {
		return trimmed;
	}

	// Allow hex colors (3, 4, 6, or 8 digits)
	if (/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(trimmed)) {
		return trimmed;
	}

	// Allow rgb/rgba
	if (
		/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[\d.]+)?\s*\)$/i.test(
			trimmed
		)
	) {
		return trimmed;
	}

	// Allow hsl/hsla with required % on saturation and lightness
	if (
		/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*[\d.]+)?\s*\)$/i.test(
			trimmed
		)
	) {
		return trimmed;
	}

	// Allow named colors (basic validation - alphanumeric only)
	if (/^[a-z]+$/i.test(trimmed)) {
		return trimmed;
	}

	// Reject anything else
	return null;
}
