/**
 * CSS Generation Utilities
 *
 * @package
 */

import { breakpoints } from './breakpoints';

/**
 * Generate responsive CSS for a property.
 *
 * @param {string} selector CSS selector.
 * @param {string} property CSS property.
 * @param {Object} values   Responsive values {desktop, tablet, mobile}.
 * @return {string} Generated CSS.
 */
export function generateResponsiveCSS(selector, property, values) {
	let css = '';

	// Desktop (default).
	if (values.desktop) {
		css += `${selector} { ${property}: ${values.desktop}; }`;
	}

	// Tablet.
	if (values.tablet) {
		css += `@media (max-width: ${breakpoints.tablet - 1}px) { ${selector} { ${property}: ${values.tablet}; } }`;
	}

	// Mobile.
	if (values.mobile) {
		css += `@media (max-width: ${breakpoints.mobile - 1}px) { ${selector} { ${property}: ${values.mobile}; } }`;
	}

	return css;
}

/**
 * Generate spacing CSS (margin/padding).
 *
 * @param {string} selector CSS selector.
 * @param {string} type     Spacing type (margin/padding).
 * @param {Object} values   Spacing values {top, right, bottom, left}.
 * @return {string} Generated CSS.
 */
export function generateSpacingCSS(selector, type, values) {
	let css = '';

	if (values.top) {
		css += `${selector} { ${type}-top: ${values.top}; }`;
	}
	if (values.right) {
		css += `${selector} { ${type}-right: ${values.right}; }`;
	}
	if (values.bottom) {
		css += `${selector} { ${type}-bottom: ${values.bottom}; }`;
	}
	if (values.left) {
		css += `${selector} { ${type}-left: ${values.left}; }`;
	}

	return css;
}

/**
 * Generate unique ID for blocks.
 *
 * @return {string} Unique ID.
 */
export function generateUniqueId() {
	return `dsgo-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize CSS unit value.
 *
 * @param {string|number} value CSS value.
 * @return {string} Sanitized value with unit.
 */
export function sanitizeCSSUnit(value) {
	if (!value) {
		return '';
	}

	if (typeof value === 'number') {
		return `${value}px`;
	}

	return value;
}
