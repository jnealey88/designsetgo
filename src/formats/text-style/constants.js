/**
 * Text Style Format Constants
 *
 * @since 1.3.0
 */

/**
 * Font size presets (relative units for better scaling)
 */
export const SIZE_PRESETS = [
	{ label: 'S', value: '0.875em', title: 'Small (87.5%)' },
	{ label: 'M', value: null, title: 'Normal (reset)' },
	{ label: 'L', value: '1.25em', title: 'Large (125%)' },
	{ label: 'XL', value: '1.5em', title: 'Extra Large (150%)' },
];

/**
 * Available units for custom font size
 */
export const SIZE_UNITS = [
	{ value: 'em', label: 'em' },
	{ value: 'px', label: 'px' },
	{ value: 'rem', label: 'rem' },
	{ value: '%', label: '%' },
];

/**
 * Padding presets
 */
export const PADDING_PRESETS = [
	{ label: 'None', value: null, title: 'No padding' },
	{ label: 'S', value: '0.1em 0.25em', title: 'Small padding' },
	{ label: 'M', value: '0.25em 0.5em', title: 'Medium padding' },
	{ label: 'L', value: '0.5em 0.75em', title: 'Large padding' },
];

/**
 * Border radius presets
 */
export const BORDER_RADIUS_PRESETS = [
	{ label: 'None', value: null, title: 'No radius' },
	{ label: 'S', value: '0.15em', title: 'Small radius' },
	{ label: 'M', value: '0.3em', title: 'Medium radius' },
	{ label: 'L', value: '0.5em', title: 'Large radius' },
];

/**
 * Format type name
 */
export const FORMAT_NAME = 'designsetgo/text-style';

/**
 * CSS class names
 */
export const CSS_CLASSES = {
	BASE: 'dsgo-text-style',
	GRADIENT_TEXT: 'dsgo-text-style--gradient-text',
	GRADIENT_HIGHLIGHT: 'dsgo-text-style--gradient-highlight',
};
