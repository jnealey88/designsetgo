/**
 * Breakpoint utilities
 *
 * @package DesignSetGo
 */

export const breakpoints = {
	mobile: 768,
	tablet: 1024,
	desktop: 1280,
};

export const mediaQueries = {
	mobile: `@media (max-width: ${breakpoints.mobile - 1}px)`,
	tablet: `@media (min-width: ${breakpoints.mobile}px) and (max-width: ${
		breakpoints.tablet - 1
	}px)`,
	desktop: `@media (min-width: ${breakpoints.tablet}px)`,
};

/**
 * Get current device type based on window width.
 *
 * @return {string} Device type (mobile, tablet, desktop).
 */
export function getCurrentDevice() {
	if (typeof window === 'undefined') {
		return 'desktop';
	}

	const width = window.innerWidth;

	if (width < breakpoints.mobile) {
		return 'mobile';
	}

	if (width < breakpoints.tablet) {
		return 'tablet';
	}

	return 'desktop';
}
