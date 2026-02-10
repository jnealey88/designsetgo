/**
 * Section Block - Edit Component
 *
 * Vertical stacking container for sections and content areas.
 * Leverages WordPress's native flex layout system.
 *
 * @since 1.0.0
 */

import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
	useSettings,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import ShapeDividerControls from './components/ShapeDividerControls';
import ShapeDivider from './components/ShapeDivider';

/**
 * Section Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Edit component
 */
export default function SectionEdit({ attributes, setAttributes, clientId }) {
	const {
		align,
		className,
		tagName = 'div',
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		overlayColor,
		layout,
		// Shape divider attributes
		shapeDividerTop,
		shapeDividerTopColor,
		shapeDividerTopBackgroundColor,
		shapeDividerTopHeight,
		shapeDividerTopWidth,
		shapeDividerTopFlipX,
		shapeDividerTopFlipY,
		shapeDividerTopFront,
		shapeDividerBottom,
		shapeDividerBottomColor,
		shapeDividerBottomBackgroundColor,
		shapeDividerBottomHeight,
		shapeDividerBottomWidth,
		shapeDividerBottomFlipX,
		shapeDividerBottomFlipY,
		shapeDividerBottomFront,
	} = attributes;

	// Auto-migrate old blocks that use className for alignment
	useEffect(() => {
		// Only run if block doesn't have align attribute but has alignfull/alignwide in className
		if (!align && className) {
			let newAlign;
			if (className.includes('alignfull')) {
				newAlign = 'full';
			} else if (className.includes('alignwide')) {
				newAlign = 'wide';
			}

			if (newAlign) {
				// Remove alignment classes from className
				const cleanClassName = className
					.split(' ')
					.filter((cls) => cls !== 'alignfull' && cls !== 'alignwide')
					.join(' ')
					.trim();

				setAttributes({
					align: newAlign,
					className: cleanClassName || undefined,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run only once on mount

	// Get theme settings (WP 6.5+)
	const [themeContentSize] = useSettings('layout.contentSize');

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Setup custom units for width control
	const units = useCustomUnits({
		availableUnits: ['px', 'em', 'rem', 'vh', 'vw', '%'],
	});

	const { replaceBlock } = useDispatch(blockEditorStore);

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

	// CRITICAL: Auto-convert to Row block when orientation changes to horizontal
	// Section is meant for vertical stacking only
	// If user wants horizontal layout, they should use Row block
	useEffect(() => {
		if (layout?.orientation === 'horizontal') {
			// Create a new Row block with the same attributes and inner blocks
			const rowBlock = createBlock(
				'designsetgo/row',
				{
					hoverBackgroundColor,
					hoverTextColor,
					hoverIconBackgroundColor,
					hoverButtonBackgroundColor,
				},
				innerBlocks
			);

			// Replace this Section block with the Row block
			replaceBlock(clientId, rowBlock);
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

	// Build className (must match save.js)
	const blockClassName = [
		'dsgo-stack',
		!constrainWidth && 'dsgo-no-width-constraint',
		overlayColor && 'dsgo-stack--has-overlay',
		(shapeDividerTop || shapeDividerBottom) &&
			'dsgo-stack--has-shape-divider',
	]
		.filter(Boolean)
		.join(' ');

	// Block wrapper props - outer div stays full width (must match save.js EXACTLY)
	// WordPress handles flex layout through layout support and CSS classes
	// We only add custom CSS variables for hover effects and overlay
	const TagName = tagName || 'div';
	const blockProps = useBlockProps({
		className: blockClassName,
		style: {
			...(hoverBackgroundColor && {
				'--dsgo-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-hover-text-color': hoverTextColor,
			}),
			...(hoverIconBackgroundColor && {
				'--dsgo-parent-hover-icon-bg': hoverIconBackgroundColor,
			}),
			...(hoverButtonBackgroundColor && {
				'--dsgo-parent-hover-button-bg': hoverButtonBackgroundColor,
			}),
			...(overlayColor && {
				'--dsgo-overlay-color': overlayColor,
				'--dsgo-overlay-opacity': '0.8',
			}),
		},
	});

	// Inner container props with width constraints (must match save.js EXACTLY)
	// Use custom contentWidth if set, otherwise fallback to theme's contentSize, then default
	const innerStyle = {};
	if (constrainWidth) {
		innerStyle.maxWidth = contentWidth || themeContentSize || '1140px';
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	// Add padding to clear shape dividers (must match save.js EXACTLY)
	if (shapeDividerTop) {
		innerStyle.paddingTop = `${shapeDividerTopHeight || 100}px`;
	}
	if (shapeDividerBottom) {
		innerStyle.paddingBottom = `${shapeDividerBottomHeight || 100}px`;
	}

	// Merge inner blocks props
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsgo-stack__inner',
			style: innerStyle,
		},
		{
			templateLock: false,
			renderAppender: hasInnerBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<InspectorControls group="advanced">
				<SelectControl
					label={__('HTML Element', 'designsetgo')}
					value={tagName}
					options={[
						{
							label: __('Default (<div>)', 'designsetgo'),
							value: 'div',
						},
						{ label: '<section>', value: 'section' },
						{ label: '<article>', value: 'article' },
						{ label: '<aside>', value: 'aside' },
						{ label: '<header>', value: 'header' },
						{ label: '<footer>', value: 'footer' },
						{ label: '<main>', value: 'main' },
					]}
					onChange={(value) => setAttributes({ tagName: value })}
					help={__(
						'Choose the HTML element for this block. Use semantic elements when appropriate for better accessibility.',
						'designsetgo'
					)}
					__nextHasNoMarginBottom
				/>
			</InspectorControls>

			<InspectorControls>
				<PanelBody
					title={__('Section Settings', 'designsetgo')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Constrain Inner Width', 'designsetgo')}
						checked={constrainWidth}
						onChange={(value) =>
							setAttributes({ constrainWidth: value })
						}
						help={
							constrainWidth
								? __(
										'Inner content is constrained to max width',
										'designsetgo'
									)
								: __(
										'Inner content spans full container width',
										'designsetgo'
									)
						}
						__nextHasNoMarginBottom
					/>
					{constrainWidth && (
						<UnitControl
							label={__('Max Content Width', 'designsetgo')}
							value={contentWidth}
							onChange={(value) =>
								setAttributes({ contentWidth: value })
							}
							placeholder={
								themeContentSize ||
								__('Theme default', 'designsetgo')
							}
							units={units}
							__unstableInputWidth="80px"
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							help={
								!contentWidth && themeContentSize
									? sprintf(
											/* translators: %s: theme content size value */
											__(
												'Using theme default: %s',
												'designsetgo'
											),
											themeContentSize
										)
									: ''
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Hover Settings', 'designsetgo')}
					settings={[
						{
							label: __('Overlay Color', 'designsetgo'),
							colorValue: overlayColor,
							onColorChange: (color) =>
								setAttributes({ overlayColor: color || '' }),
							clearable: true,
						},
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
				{/* Shape Divider Colors - only show when shapes are enabled */}
				{(shapeDividerTop || shapeDividerBottom) && (
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Shape Divider Colors', 'designsetgo')}
						settings={[
							// Top shape colors
							...(shapeDividerTop
								? [
										{
											label: __(
												'Top Shape Color',
												'designsetgo'
											),
											colorValue: shapeDividerTopColor,
											onColorChange: (color) =>
												setAttributes({
													shapeDividerTopColor:
														color || '',
												}),
											clearable: true,
											enableAlpha: true,
										},
										{
											label: __(
												'Top Shape Background',
												'designsetgo'
											),
											colorValue:
												shapeDividerTopBackgroundColor,
											onColorChange: (color) =>
												setAttributes({
													shapeDividerTopBackgroundColor:
														color || '',
												}),
											clearable: true,
											enableAlpha: true,
										},
									]
								: []),
							// Bottom shape colors
							...(shapeDividerBottom
								? [
										{
											label: __(
												'Bottom Shape Color',
												'designsetgo'
											),
											colorValue: shapeDividerBottomColor,
											onColorChange: (color) =>
												setAttributes({
													shapeDividerBottomColor:
														color || '',
												}),
											clearable: true,
											enableAlpha: true,
										},
										{
											label: __(
												'Bottom Shape Background',
												'designsetgo'
											),
											colorValue:
												shapeDividerBottomBackgroundColor,
											onColorChange: (color) =>
												setAttributes({
													shapeDividerBottomBackgroundColor:
														color || '',
												}),
											clearable: true,
											enableAlpha: true,
										},
									]
								: []),
						]}
						{...colorGradientSettings}
					/>
				)}
			</InspectorControls>

			<InspectorControls>
				<ShapeDividerControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<TagName {...blockProps}>
				<ShapeDivider
					shape={shapeDividerTop}
					color={shapeDividerTopColor}
					backgroundColor={shapeDividerTopBackgroundColor}
					height={shapeDividerTopHeight}
					width={shapeDividerTopWidth}
					flipX={shapeDividerTopFlipX}
					flipY={shapeDividerTopFlipY}
					front={shapeDividerTopFront}
					position="top"
				/>
				<div {...innerBlocksProps} />
				<ShapeDivider
					shape={shapeDividerBottom}
					color={shapeDividerBottomColor}
					backgroundColor={shapeDividerBottomBackgroundColor}
					height={shapeDividerBottomHeight}
					width={shapeDividerBottomWidth}
					flipX={shapeDividerBottomFlipX}
					flipY={shapeDividerBottomFlipY}
					front={shapeDividerBottomFront}
					position="bottom"
				/>
			</TagName>
		</>
	);
}
