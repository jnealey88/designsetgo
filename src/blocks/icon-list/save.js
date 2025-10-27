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
	if (layout === 'vertical') {
		if (alignment === 'center') {
			alignItemsValue = 'center';
		} else if (alignment === 'right') {
			alignItemsValue = 'flex-end';
		} else {
			alignItemsValue = 'flex-start';
		}
	}

	// Calculate container styles (must match edit.js)
	const containerStyles = {
		display: layout === 'grid' ? 'grid' : 'flex',
		flexDirection: layout === 'vertical' ? 'column' : undefined,
		gridTemplateColumns:
			layout === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
		gap,
		alignItems: alignItemsValue,
	};

	// Get block wrapper props
	const blockProps = useBlockProps.save({
		className: `dsg-icon-list dsg-icon-list--${layout}`,
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
