/**
 * Validation utilities for Table of Contents block
 */

/**
 * Parse and validate heading levels from data attribute.
 *
 * @param {string} levelsString - Comma-separated heading levels (e.g., "h2,h3,h4")
 * @return {string[]} Array of valid heading levels
 */
export function parseHeadingLevels(levelsString) {
	const VALID_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	const DEFAULT_LEVELS = ['h2', 'h3'];

	if (!levelsString) {
		return DEFAULT_LEVELS;
	}

	const rawLevels = levelsString
		.split(',')
		.map((level) => level.trim().toLowerCase());
	const validLevels = rawLevels.filter((level) =>
		VALID_LEVELS.includes(level)
	);

	// If no valid levels found, return defaults
	return validLevels.length > 0 ? validLevels : DEFAULT_LEVELS;
}

/**
 * Parse and validate display mode from data attribute.
 *
 * @param {string} mode - Display mode ("hierarchical" or "flat")
 * @return {string} Valid display mode
 */
export function parseDisplayMode(mode) {
	const VALID_MODES = ['hierarchical', 'flat'];
	const DEFAULT_MODE = 'hierarchical';

	if (!mode || !VALID_MODES.includes(mode.toLowerCase())) {
		return DEFAULT_MODE;
	}

	return mode.toLowerCase();
}

/**
 * Parse and validate scroll offset from data attribute.
 *
 * @param {string} offsetString - Scroll offset in pixels
 * @return {number} Valid scroll offset (0-500px)
 */
export function parseScrollOffset(offsetString) {
	const DEFAULT_OFFSET = 0;
	const MIN_OFFSET = 0;
	const MAX_OFFSET = 500;

	const offset = parseInt(offsetString, 10);

	if (isNaN(offset)) {
		return DEFAULT_OFFSET;
	}

	// Clamp offset to valid range
	return Math.max(MIN_OFFSET, Math.min(MAX_OFFSET, offset));
}

/**
 * Get responsive scroll offset based on viewport width.
 * Uses mobile offset (60px) on screens < 782px, otherwise uses base offset.
 *
 * @param {number} baseOffset - The desktop scroll offset from block settings
 * @return {number} Adjusted scroll offset for current viewport
 */
export function getResponsiveScrollOffset(baseOffset) {
	const MOBILE_BREAKPOINT = 782; // WordPress admin bar breakpoint
	const MOBILE_OFFSET = 60;

	// Use mobile offset on small screens, desktop offset otherwise
	if (window.innerWidth < MOBILE_BREAKPOINT) {
		return MOBILE_OFFSET;
	}

	return baseOffset;
}
