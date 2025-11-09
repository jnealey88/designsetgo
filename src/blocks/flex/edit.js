/**
 * Flex Container Block - Edit Component
 *
 * Flexible horizontal or vertical layouts with wrapping.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	useSetting,
	store as blockEditorStore,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { useRef } from '@wordpress/element';

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
		direction,
		wrap,
		justifyContent,
		alignItems,
		mobileStack,
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Get content size from theme
	const themeContentWidth = useSetting('layout.contentSize');

	// Calculate effective content width
	const effectiveContentWidth = contentWidth || themeContentWidth || '1200px';

	// Reference to inner container div (where the empty space actually is)
	const innerRef = useRef(null);

	// Get dispatch function to select this block
	const { selectBlock } = useDispatch('core/block-editor');

	// Get inner blocks to determine if container is empty
	const hasInnerBlocks = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
			return block?.innerBlocks?.length > 0;
		},
		[clientId]
	);

	/**
	 * Handle clicks on the container to enable selection when clicking empty space
	 * This allows clicks between flex items to select the container
	 *
	 * @param {MouseEvent} event - The click event.
	 */
	const handleContainerClick = (event) => {
		// Only handle clicks directly on the inner container (empty space between blocks)
		// Don't handle clicks on child blocks themselves
		if (
			event.target === innerRef.current ||
			event.target.classList.contains('dsg-flex__inner')
		) {
			event.stopPropagation();
			selectBlock(clientId);
		}
	};

	// Calculate inner styles declaratively
	// Note: gap is handled by WordPress blockGap support via style.spacing.blockGap
	const innerStyles = {
		display: 'flex',
		flexDirection: direction || 'row',
		flexWrap: wrap ? 'wrap' : 'nowrap',
		justifyContent: justifyContent || 'flex-start',
		alignItems: alignItems || 'center',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props
	// CRITICAL: Use align-self: stretch to fill parent width (must match save.js)
	// align-self: stretch ensures nested containers fill parent without overflow issues
	const blockProps = useBlockProps({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
		style: {
			alignSelf: 'stretch',
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
				'--dsg-hover-button-bg-color': hoverButtonBackgroundColor,
			}),
		},
	});

	// Inner blocks props with declarative styles
	// Show big button only when container is empty, otherwise use default appender
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-flex__inner',
			style: innerStyles,
			ref: innerRef,
			onClick: handleContainerClick,
		},
		{
			orientation: direction === 'column' ? 'vertical' : 'horizontal',
			templateLock: false,
			renderAppender: hasInnerBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Flex Settings', 'designsetgo')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Direction', 'designsetgo')}
						value={direction}
						options={[
							{
								label: __('Row (Horizontal)', 'designsetgo'),
								value: 'row',
							},
							{
								label: __('Column (Vertical)', 'designsetgo'),
								value: 'column',
							},
						]}
						onChange={(value) =>
							setAttributes({ direction: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Wrap Items', 'designsetgo')}
						checked={wrap}
						onChange={(value) => setAttributes({ wrap: value })}
						help={
							wrap
								? __(
										'Items will wrap to next line if needed',
										'designsetgo'
									)
								: __(
										'Items will stay in single line',
										'designsetgo'
									)
						}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Justify Content', 'designsetgo')}
						value={justifyContent}
						options={[
							{
								label: __('Start', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('End', 'designsetgo'),
								value: 'flex-end',
							},
							{
								label: __('Space Between', 'designsetgo'),
								value: 'space-between',
							},
							{
								label: __('Space Around', 'designsetgo'),
								value: 'space-around',
							},
							{
								label: __('Space Evenly', 'designsetgo'),
								value: 'space-evenly',
							},
						]}
						onChange={(value) =>
							setAttributes({ justifyContent: value })
						}
						help={__(
							'Horizontal alignment (main axis)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Align Items', 'designsetgo')}
						value={alignItems}
						options={[
							{
								label: __('Start', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('End', 'designsetgo'),
								value: 'flex-end',
							},
							{
								label: __('Stretch', 'designsetgo'),
								value: 'stretch',
							},
							{
								label: __('Baseline', 'designsetgo'),
								value: 'baseline',
							},
						]}
						onChange={(value) =>
							setAttributes({ alignItems: value })
						}
						help={__(
							'Vertical alignment (cross axis)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

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
