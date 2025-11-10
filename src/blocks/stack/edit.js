/**
 * DSG Section Block - Edit Component
 *
 * Vertical stacking container for sections and content areas.
 * Leverages WordPress's native flex layout system.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

/**
 * Stack Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Edit component
 */
export default function StackEdit({ attributes, setAttributes, clientId }) {
	const {
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		layout,
		contentWidth, // Legacy attribute from before layout support
	} = attributes;

	// Extract contentSize with fallback priority:
	// 1. WordPress layout support (layout.contentSize) - if explicitly set
	// 2. Legacy custom attribute (contentWidth) - for backward compatibility
	// 3. Plugin default (1200px) - as last resort
	// Note: If user explicitly disabled width constraint in Layout panel, layout.contentSize will be ''
	// and we should NOT apply fallbacks (respect user's choice for full width)
	let contentSize;
	if (layout && 'contentSize' in layout) {
		// User has interacted with Layout panel - respect their choice
		contentSize = layout.contentSize; // Could be a value or '' (disabled)
	} else {
		// User hasn't set layout.contentSize - use fallbacks
		contentSize = contentWidth || '1200px';
	}

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const { replaceBlock, insertBlocks } = useDispatch(blockEditorStore);

	// Get inner blocks to determine if container is empty
	const { hasInnerBlocks, innerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
			return {
				hasInnerBlocks: block?.innerBlocks?.length > 0,
				innerBlocks: block?.innerBlocks || [],
			};
		},
		[clientId]
	);

	// CRITICAL: Auto-convert to Flex block when orientation changes to horizontal
	// Stack is meant for vertical stacking only
	// If user wants horizontal layout, they should use Flex block
	useEffect(() => {
		if (layout?.orientation === 'horizontal') {
			// Create a new Flex block with the same attributes and inner blocks
			const flexBlock = createBlock(
				'designsetgo/flex',
				{
					hoverBackgroundColor,
					hoverTextColor,
					hoverIconBackgroundColor,
					hoverButtonBackgroundColor,
				},
				innerBlocks
			);

			// Replace this Stack block with the Flex block
			replaceBlock(clientId, flexBlock);
		}
	}, [
		layout?.orientation,
		clientId,
		replaceBlock,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		innerBlocks,
	]);

	// Build className - add indicator when no width constraints
	const className = ['dsg-stack', !contentSize && 'dsg-no-width-constraint']
		.filter(Boolean)
		.join(' ');

	// Block wrapper props - outer div stays full width (must match save.js EXACTLY)
	// WordPress handles flex layout through layout support and CSS classes
	// We only add custom CSS variables for hover effects
	const blockProps = useBlockProps({
		className,
		style: {
			...(hoverBackgroundColor && {
				'--dsg-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsg-hover-text-color': hoverTextColor,
			}),
			...(hoverIconBackgroundColor && {
				'--dsg-parent-hover-icon-bg': hoverIconBackgroundColor,
			}),
			...(hoverButtonBackgroundColor && {
				'--dsg-parent-hover-button-bg': hoverButtonBackgroundColor,
			}),
		},
	});

	// Inner container props with width constraints (must match save.js EXACTLY)
	const innerStyle = {};
	if (contentSize) {
		innerStyle.maxWidth = contentSize;
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	// Merge inner blocks props
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-stack__inner',
			style: innerStyle,
		},
		{
			templateLock: false,
			renderAppender: hasInnerBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
			// CRITICAL: Prevent paste from replacing container
			// When user pastes while container is focused, insert content inside instead of replacing
			onReplace: (blocks) => {
				// Insert the pasted blocks at the end of the container
				// This ensures paste behavior matches user expectations
				insertBlocks(blocks, innerBlocks.length, clientId, false);
				// Return false to prevent the default replace behavior
				return false;
			},
		}
	);

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Hover Settings', 'designsetgo')}
					settings={[
						{
							label: __('Hover Background Color', 'designsetgo'),
							colorValue: hoverBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									hoverBackgroundColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Hover Text Color', 'designsetgo'),
							colorValue: hoverTextColor,
							onColorChange: (color) =>
								setAttributes({ hoverTextColor: color || '' }),
							clearable: true,
						},
						// Only show icon background control if hover background is set
						...(hoverBackgroundColor
							? [
									{
										label: __(
											'Hover Icon Background Color',
											'designsetgo'
										),
										colorValue: hoverIconBackgroundColor,
										onColorChange: (color) =>
											setAttributes({
												hoverIconBackgroundColor:
													color || '',
											}),
										clearable: true,
									},
								]
							: []),
						// Only show button background control if hover background is set
						...(hoverBackgroundColor
							? [
									{
										label: __(
											'Hover Button Background Color',
											'designsetgo'
										),
										colorValue: hoverButtonBackgroundColor,
										onColorChange: (color) =>
											setAttributes({
												hoverButtonBackgroundColor:
													color || '',
											}),
										clearable: true,
									},
								]
							: []),
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
