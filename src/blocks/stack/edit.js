/**
 * Stack Container Block - Edit Component
 *
 * Simple vertical stacking container with consistent gaps.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	BlockControls,
	AlignmentControl,
	InspectorControls,
	useSetting,
	store as blockEditorStore,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

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
		alignItems,
		textAlign,
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Get theme content size
	const themeContentWidth = useSetting('layout.contentSize');

	// Get inner blocks to determine if container is empty
	const hasInnerBlocks = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
			return block?.innerBlocks?.length > 0;
		},
		[clientId]
	);

	// Calculate effective content width
	const effectiveContentWidth = contentWidth || themeContentWidth || '1200px';

	// Calculate inner styles declaratively
	// Note: gap is handled by WordPress blockGap support via style.spacing.blockGap
	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: alignItems || 'flex-start',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props with merged inner blocks props
	// CRITICAL: Merge blockProps and innerBlocksProps into single div to fix paste behavior
	// This prevents paste operations from replacing the container instead of adding blocks inside
	const blockProps = useBlockProps({
		className: 'dsg-stack',
		style: {
			alignSelf: 'stretch',
			// Merge inner styles with block styles
			...innerStyles,
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

	// Merge block props with inner blocks props
	// Show big button only when container is empty, otherwise use default appender
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		orientation: 'vertical',
		templateLock: false,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<>
			<BlockControls>
				<AlignmentControl
					value={textAlign}
					onChange={(newAlign) =>
						setAttributes({ textAlign: newAlign })
					}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody
					title={__('Stack Settings', 'designsetgo')}
					initialOpen={true}
				>
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
						]}
						onChange={(value) =>
							setAttributes({ alignItems: value })
						}
						help={__(
							'Horizontal alignment of stacked items',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Constrain Content Width', 'designsetgo')}
						checked={constrainWidth}
						onChange={(value) =>
							setAttributes({ constrainWidth: value })
						}
						help={__(
							'Limit content to a maximum width and center it',
							'designsetgo'
						)}
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

			<div {...innerBlocksProps} />
		</>
	);
}
