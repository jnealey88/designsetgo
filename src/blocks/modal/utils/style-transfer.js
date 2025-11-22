/**
 * Modal Block - Style Transfer Utilities
 *
 * Utilities for transferring WordPress block support styles from the wrapper
 * to the modal content element.
 *
 * @package
 */

/**
 * Extract and transfer block support styles to modal content
 *
 * WordPress applies block support styles (background, color, border, etc.) to the
 * wrapper element, but for modals, we want these styles on the content div instead.
 * This function extracts those styles and classes for transfer.
 *
 * @param {Object} blockProps           - The block props object from useBlockProps()
 * @param {Object} dimensions           - Modal-specific dimension overrides
 * @param {string} dimensions.width     - Modal width
 * @param {string} dimensions.maxWidth  - Modal max width
 * @param {string} dimensions.height    - Modal height
 * @param {string} dimensions.maxHeight - Modal max height
 * @return {Object} Object with contentStyle, wrapperProps, and contentClasses
 */
export function transferStylesToContent(blockProps, dimensions = {}) {
	const { style: blockStyle, className, ...wrapperProps } = blockProps;

	// Transfer ALL block support styles from wrapper to content
	const contentStyle = {
		// Spread all block support styles first
		...(blockStyle || {}),
		// Then override with modal-specific dimensions
		width: dimensions.width,
		maxWidth: dimensions.maxWidth,
		height: dimensions.height !== 'auto' ? dimensions.height : undefined,
		maxHeight:
			dimensions.height !== 'auto' ? dimensions.maxHeight : undefined,
	};

	// Extract WordPress block support classes that should be transferred to content
	// Classes starting with 'has-' are typically block support classes
	// Exception: 'has-inside-close-button' is a modal-specific class that stays on wrapper
	const blockSupportClasses = className
		.split(' ')
		.filter(
			(cls) => cls.startsWith('has-') && cls !== 'has-inside-close-button'
		);

	// Filter out WordPress block support classes from wrapper
	// Keep modal-specific classes like 'has-inside-close-button'
	const filteredClassName = className
		.split(' ')
		.filter(
			(cls) =>
				!cls.startsWith('has-') || cls === 'has-inside-close-button'
		)
		.join(' ');

	wrapperProps.className = filteredClassName;

	return {
		contentStyle,
		wrapperProps,
		contentClasses: blockSupportClasses,
	};
}
