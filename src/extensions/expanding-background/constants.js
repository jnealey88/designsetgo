/**
 * Expanding Background Extension - Constants
 *
 * @package
 */

/**
 * Blocks that support the expanding background effect
 */
export const SUPPORTED_BLOCKS = ['core/group', 'designsetgo/section'];

/**
 * Default attribute values
 */
export const DEFAULTS = {
	enabled: false,
	color: '#e8e8e8', // Light gray that works well with black text
	initialSize: 50, // Initial circle radius in pixels
	blur: 30, // Initial blur amount in pixels
	speed: 1, // Animation speed multiplier
	triggerOffset: 0, // Scroll offset percentage (0-100)
	completionPoint: 80, // Percentage of scroll where effect reaches 100% (0-100)
};

/**
 * Control ranges
 */
export const RANGES = {
	initialSize: {
		min: 20,
		max: 300,
		step: 10,
	},
	blur: {
		min: 0,
		max: 50,
		step: 1,
	},
	speed: {
		min: 0.5,
		max: 2,
		step: 0.1,
	},
	triggerOffset: {
		min: 0,
		max: 100,
		step: 5,
	},
	completionPoint: {
		min: 50,
		max: 100,
		step: 5,
	},
};
