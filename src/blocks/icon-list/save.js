/**
 * Icon List Block - Save Component
 *
 * Renders the frontend output for the icon list.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Icon List Save Component
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {JSX.Element} Icon List save component
 */
export default function IconListSave({ attributes }) {
	const { layout, gap, columns, alignment } = attributes;

	// Calculate alignment value to avoid nested ternary (must match edit.js)
	let alignItemsValue;
	let justifyContentValue;

	if (layout === 'vertical') {
		// For vertical layout, alignItems controls horizontal alignment
		if (alignment === 'center') {
			alignItemsValue = 'center';
		} else if (alignment === 'right') {
			alignItemsValue = 'flex-end';
		} else {
			alignItemsValue = 'flex-start';
		}
	} else if (layout === 'horizontal') {
		// For horizontal layout, justifyContent controls horizontal distribution
		if (alignment === 'center') {
			justifyContentValue = 'center';
		} else if (alignment === 'right') {
			justifyContentValue = 'flex-end';
		} else {
			justifyContentValue = 'flex-start';
		}
	}

	// Determine flex direction based on layout (must match edit.js)
	let flexDirection;
	if (layout === 'vertical') {
		flexDirection = 'column';
	} else if (layout === 'horizontal') {
		flexDirection = 'row';
	}

	// Calculate container styles (must match edit.js)
	const containerStyles = {
		display: layout === 'grid' ? 'grid' : 'flex',
		flexDirection,
		gridTemplateColumns:
			layout === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
		gap,
		alignItems: alignItemsValue,
		justifyContent: justifyContentValue,
		width: '100%', // Ensure container fills available space
	};

	// Get block wrapper props
	const blockProps = useBlockProps.save({
		className: `dsg-icon-list dsg-icon-list--${layout}`,
		style: { width: '100%' }, // Ensure block fills parent width
	});

	// Get inner blocks props
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-icon-list__items',
		style: containerStyles,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
