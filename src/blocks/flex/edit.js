/**
 * DSG Row Block - Edit Component
 *
 * Flexible horizontal or vertical layouts with wrapping.
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
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

/**
 * Convert WordPress preset format to CSS variable
 * Converts "var:preset|spacing|md" to "var(--wp--preset--spacing--md)"
 *
 * @param {string} value The preset value
 * @return {string} CSS variable format
 */
function convertPresetToCSSVar(value) {
	if (!value) {
		return value;
	}

	// If it's already a CSS variable, return as-is
	if (value.startsWith('var(--')) {
		return value;
	}

	// Convert WordPress preset format: var:preset|spacing|md -> var(--wp--preset--spacing--md)
	if (value.startsWith('var:preset|')) {
		const parts = value.replace('var:preset|', '').split('|');
		return `var(--wp--preset--${parts.join('--')})`;
	}

	return value;
}

/**
 * Flex Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Edit component
 */
export default function FlexEdit({ attributes, setAttributes, clientId }) {
	const {
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		mobileStack,
		layout,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const { replaceBlock, insertBlocks } = useDispatch(blockEditorStore);
	const { getBlocks } = useSelect((select) => select(blockEditorStore), []);

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

	// CRITICAL: Auto-convert to Stack block when orientation changes to vertical
	// Flex is meant for horizontal layouts
	// If user wants vertical layout, they should use Stack block
	useEffect(() => {
		if (layout?.orientation === 'vertical') {
			// Create a new Stack block with the same attributes and inner blocks
			const stackBlock = createBlock(
				'designsetgo/stack',
				{
					hoverBackgroundColor,
					hoverTextColor,
					hoverIconBackgroundColor,
					hoverButtonBackgroundColor,
				},
				innerBlocks
			);

			// Replace this Flex block with the Stack block
			replaceBlock(clientId, stackBlock);
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

	// Block wrapper props - outer div stays full width (must match save.js EXACTLY)
	const blockProps = useBlockProps({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
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

	// Extract gap AFTER creating blockProps, so we can move it to inner div instead (must match save.js EXACTLY)
	// WordPress layout support stores gap in attributes.style.spacing.blockGap
	// Convert from WordPress preset format (var:preset|spacing|md) to CSS var (var(--wp--preset--spacing--md))
	const rawGapValue = attributes.style?.spacing?.blockGap;
	const gapValue = convertPresetToCSSVar(rawGapValue);

	// Remove gap from outer div's inline styles - it should only be on inner div
	// This prevents WordPress from applying gap to the wrong element
	if (blockProps.style?.gap) {
		delete blockProps.style.gap;
	}

	// Inner container props with flex layout and width constraints (must match save.js EXACTLY)
	// CRITICAL: Apply display: flex here, not via WordPress layout support on outer div
	const innerStyle = {
		display: 'flex',
		// Apply layout justifyContent to inner div where flex children are
		justifyContent: layout?.justifyContent || 'left',
		// Apply flex-wrap from layout support
		flexWrap: layout?.flexWrap || 'wrap',
		// Apply gap from blockProps or attributes
		...(gapValue && { gap: gapValue }),
	};

	// Apply width constraints if enabled
	if (constrainWidth) {
		innerStyle.maxWidth = contentWidth || '1200px';
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	// Merge inner blocks props
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-flex__inner',
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
				// Get current inner blocks at time of paste to ensure correct insertion position
				const currentInnerBlocks = getBlocks(clientId);
				// Insert the pasted blocks at the end of the container
				// This ensures paste behavior matches user expectations
				insertBlocks(
					blocks,
					currentInnerBlocks.length,
					clientId,
					false
				);
				// Return false to prevent the default replace behavior
				return false;
			},
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Flex Settings', 'designsetgo')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Stack on Mobile', 'designsetgo')}
						checked={mobileStack}
						onChange={(value) =>
							setAttributes({ mobileStack: value })
						}
						help={
							mobileStack
								? __(
										'Items will stack vertically on mobile devices',
										'designsetgo'
									)
								: __(
										'Items maintain flex layout on all devices',
										'designsetgo'
									)
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

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
