/**
 * Icon List Block - Edit Component
 *
 * Parent block that contains icon list items with shared settings.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { ListSettingsPanel } from './components/inspector/ListSettingsPanel';

/**
 * Icon List Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Icon List edit component
 */
export default function IconListEdit({ attributes, setAttributes }) {
	const {
		layout,
		iconSize,
		iconColor,
		gap,
		iconPosition,
		columns,
		alignment,
	} = attributes;

	// Calculate alignment value to avoid nested ternary
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

	// Calculate container styles declaratively
	const containerStyles = {
		display: layout === 'grid' ? 'grid' : 'flex',
		flexDirection: layout === 'vertical' ? 'column' : undefined,
		gridTemplateColumns:
			layout === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
		gap,
		alignItems: alignItemsValue,
		width: '100%', // Ensure container fills available space
	};

	// Get block wrapper props
	const blockProps = useBlockProps({
		className: `dsg-icon-list dsg-icon-list--${layout}`,
		style: { width: '100%' }, // Ensure block fills parent width
	});

	// Configure inner blocks
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-icon-list__items',
			style: containerStyles,
		},
		{
			allowedBlocks: ['designsetgo/icon-list-item'],
			template: [
				[
					'designsetgo/icon-list-item',
					{ icon: 'check', title: __('First item', 'designsetgo') },
				],
				[
					'designsetgo/icon-list-item',
					{ icon: 'check', title: __('Second item', 'designsetgo') },
				],
				[
					'designsetgo/icon-list-item',
					{ icon: 'check', title: __('Third item', 'designsetgo') },
				],
			],
			orientation: layout === 'vertical' ? 'vertical' : undefined,
		}
	);

	return (
		<>
			<InspectorControls>
				<ListSettingsPanel
					layout={layout}
					iconSize={iconSize}
					iconColor={iconColor}
					gap={gap}
					iconPosition={iconPosition}
					columns={columns}
					alignment={alignment}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
