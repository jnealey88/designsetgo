/**
 * SVG Patterns Extension - Constants
 *
 * @package
 */

/**
 * Blocks that support the SVG pattern background
 */
export const SUPPORTED_BLOCKS = ['core/group', 'designsetgo/section'];

/**
 * Default attribute values
 */
export const DEFAULTS = {
	enabled: false,
	pattern: '',
	color: '#9c92ac',
	opacity: 0.4,
	scale: 1,
};

/**
 * Control ranges
 */
export const RANGES = {
	opacity: {
		min: 0.05,
		max: 1,
		step: 0.05,
	},
	scale: {
		min: 0.25,
		max: 4,
		step: 0.25,
	},
};
