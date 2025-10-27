/**
 * Icon Block - Style Calculation Utilities
 *
 * Pure functions for calculating icon wrapper and icon styles.
 *
 * @since 1.0.0
 */

/**
 * Calculate icon wrapper styles
 *
 * @param {Object} options - Style options
 * @param {number} options.iconSize - Icon size in pixels
 * @param {string} options.shape - Background shape (none, circle, square, rounded)
 * @param {number} options.shapePadding - Shape padding in pixels
 * @param {string} options.backgroundColor - Background color or gradient from WordPress
 * @return {Object} Icon wrapper styles
 */
export const calculateIconWrapperStyle = ({
	iconSize,
	shape,
	shapePadding,
	backgroundColor,
}) => {
	const styles = {
		fontSize: `${iconSize}px`,
	};

	if (shape !== 'none') {
		styles.padding = `${shapePadding}px`;
		if (backgroundColor) {
			styles.background = backgroundColor;
		}
	}

	return styles;
};

/**
 * Calculate icon element styles
 *
 * @param {Object} options - Style options
 * @param {number} options.rotation - Rotation in degrees (0, 90, 180, 270)
 * @return {Object} Icon element styles
 */
export const calculateIconStyle = ({ rotation }) => {
	const styles = {};

	if (rotation !== 0) {
		styles.transform = `rotate(${rotation}deg)`;
	}

	return styles;
};

/**
 * Get icon wrapper CSS classes
 *
 * @param {string} shape - Background shape (none, circle, square, rounded)
 * @return {string} CSS classes
 */
export const getIconWrapperClasses = (shape) => {
	return `dsg-icon__wrapper shape-${shape}`;
};
