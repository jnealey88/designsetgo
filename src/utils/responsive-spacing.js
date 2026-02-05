/**
 * Responsive Spacing Utilities
 *
 * Shared utilities for responsive spacing controls.
 * Handles value inheritance cascade and CSS generation.
 *
 * @package
 * @since 1.5.0
 */

export const DEVICES = ['desktop', 'tablet', 'mobile'];

export const BREAKPOINTS = {
	tablet: 1024,
	mobile: 768,
};

/**
 * Get effective spacing value with desktop-down inheritance cascade.
 *
 * Cascade: desktop -> tablet -> mobile
 * Tablet inherits from desktop unless overridden.
 * Mobile inherits from tablet (or desktop) unless overridden.
 *
 * @param {Object|undefined} desktopSpacing    Desktop spacing from style.spacing
 * @param {Object|undefined} responsiveSpacing Responsive overrides (dsgoResponsiveSpacing)
 * @param {string}           device            Target device: 'desktop', 'tablet', or 'mobile'
 * @param {string}           type              Spacing type: 'padding' or 'margin'
 * @return {Object|undefined} Spacing values {top, right, bottom, left} or undefined
 */
export function getEffectiveSpacing(
	desktopSpacing,
	responsiveSpacing,
	device,
	type
) {
	if (device === 'desktop') {
		return desktopSpacing?.[type];
	}

	const deviceValue = responsiveSpacing?.[device]?.[type];
	if (deviceValue) {
		return deviceValue;
	}

	// Cascade: mobile inherits tablet, tablet inherits desktop
	if (device === 'mobile') {
		return responsiveSpacing?.tablet?.[type] || desktopSpacing?.[type];
	}

	return desktopSpacing?.[type];
}

/**
 * Generate a unique block style ID for CSS targeting.
 *
 * @return {string} Unique ID in format "dsgo-rs-xxxxxxxxx"
 */
export function generateBlockStyleId() {
	return `dsgo-rs-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert a WordPress preset value to a CSS variable.
 * Handles: "var:preset|spacing|md" -> "var(--wp--preset--spacing--md)"
 *
 * @param {string} value The spacing value
 * @return {string} CSS-ready value
 */
function convertPresetValue(value) {
	if (!value || typeof value !== 'string') {
		return value;
	}

	if (value.startsWith('var(--')) {
		return value;
	}

	if (value.startsWith('var:preset|')) {
		const parts = value.replace('var:preset|', '').split('|');
		return `var(--wp--preset--${parts.join('--')})`;
	}

	return value;
}

/**
 * Build a CSS declaration string for spacing properties.
 *
 * @param {string} type   'padding' or 'margin'
 * @param {Object} values {top, right, bottom, left}
 * @return {string} CSS declarations
 */
function buildSpacingDeclarations(type, values) {
	if (!values) {
		return '';
	}

	const sides = ['top', 'right', 'bottom', 'left'];
	let css = '';

	for (const side of sides) {
		const value = convertPresetValue(values[side]);
		if (value) {
			css += `\t${type}-${side}: ${value} !important;\n`;
		}
	}

	return css;
}

/**
 * Build complete responsive spacing CSS with media queries.
 *
 * @param {string}           blockId           The block's unique style ID (CSS class)
 * @param {Object|undefined} desktopSpacing    Desktop spacing from style.spacing
 * @param {Object|undefined} responsiveSpacing Responsive overrides (dsgoResponsiveSpacing)
 * @return {string} Complete CSS string with media queries
 */
export function buildResponsiveSpacingCSS(
	blockId,
	desktopSpacing,
	responsiveSpacing
) {
	if (!blockId || !responsiveSpacing) {
		return '';
	}

	let css = '';
	const selector = `.${blockId}`;

	// Tablet styles (max-width: 1023px)
	const tabletPadding = responsiveSpacing?.tablet?.padding;
	const tabletMargin = responsiveSpacing?.tablet?.margin;

	if (tabletPadding || tabletMargin) {
		css += `@media (max-width: ${BREAKPOINTS.tablet - 1}px) {\n`;
		css += `${selector} {\n`;
		css += buildSpacingDeclarations('padding', tabletPadding);
		css += buildSpacingDeclarations('margin', tabletMargin);
		css += `}\n`;
		css += `}\n`;
	}

	// Mobile styles (max-width: 767px)
	const mobilePadding = responsiveSpacing?.mobile?.padding;
	const mobileMargin = responsiveSpacing?.mobile?.margin;

	if (mobilePadding || mobileMargin) {
		css += `@media (max-width: ${BREAKPOINTS.mobile - 1}px) {\n`;
		css += `${selector} {\n`;
		css += buildSpacingDeclarations('padding', mobilePadding);
		css += buildSpacingDeclarations('margin', mobileMargin);
		css += `}\n`;
		css += `}\n`;
	}

	return css;
}
