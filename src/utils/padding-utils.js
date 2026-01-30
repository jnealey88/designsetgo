/**
 * Padding extraction utilities for container blocks
 *
 * WordPress spacing support applies padding to blockProps, but for alignfull/alignwide
 * to work correctly, we need padding on the inner div instead of the outer div.
 * This prevents box-sizing: border-box from interfering with full-width calculations.
 *
 * @package
 */

/**
 * Extract padding from blockProps and return padding values + modified blockProps
 *
 * This utility extracts all padding-related inline styles from blockProps
 * and returns them separately so they can be applied to an inner container.
 *
 * @param {Object} blockProps The blockProps object from useBlockProps()
 * @return {Object} Object containing { paddingStyles, blockProps }
 *
 * @example
 * const blockProps = useBlockProps({ ... });
 * const { paddingStyles, blockProps: modifiedBlockProps } = extractPaddingFromBlockProps(blockProps);
 *
 * // Use modifiedBlockProps on outer div (no padding)
 * <div {...modifiedBlockProps}>
 *   {/* Use paddingStyles on inner div *\/}
 *   <div style={{ ...innerStyles, ...paddingStyles }}>
 *     ...
 *   </div>
 * </div>
 */
export function extractPaddingFromBlockProps(blockProps) {
	// Extract all padding values before deletion
	const paddingTop = blockProps.style?.paddingTop;
	const paddingRight = blockProps.style?.paddingRight;
	const paddingBottom = blockProps.style?.paddingBottom;
	const paddingLeft = blockProps.style?.paddingLeft;
	const padding = blockProps.style?.padding;

	// Remove padding from blockProps (modifies in place for backward compatibility)
	if (blockProps.style?.padding) {
		delete blockProps.style.padding;
	}
	if (blockProps.style?.paddingTop) {
		delete blockProps.style.paddingTop;
	}
	if (blockProps.style?.paddingRight) {
		delete blockProps.style.paddingRight;
	}
	if (blockProps.style?.paddingBottom) {
		delete blockProps.style.paddingBottom;
	}
	if (blockProps.style?.paddingLeft) {
		delete blockProps.style.paddingLeft;
	}

	// Build padding styles object with only defined values
	const paddingStyles = {
		...(padding && { padding }),
		...(paddingTop && { paddingTop }),
		...(paddingRight && { paddingRight }),
		...(paddingBottom && { paddingBottom }),
		...(paddingLeft && { paddingLeft }),
	};

	return {
		paddingStyles,
		blockProps, // Return the modified blockProps for convenience
	};
}
