/**
 * Block Name - Edit Component
 *
 * Template for creating new blocks with modern WordPress patterns.
 * Copy this file as a starting point for new blocks.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	// CRITICAL: Always use ColorGradientSettingsDropdown for color controls
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

/**
 * Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {string}   props.clientId      - Block client ID (REQUIRED for color controls)
 * @return {JSX.Element} Edit component
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		textColor,
		backgroundColor,
		someText,
		someToggle,
		someNumber,
		someOption,
	} = attributes;

	// CRITICAL: Always include this hook when using color controls
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Block wrapper props
	const blockProps = useBlockProps({
		className: 'my-block',
		style: {
			color: textColor,
			backgroundColor,
		},
	});

	return (
		<>
			{/* ============================================
			     COLOR CONTROLS - ALWAYS IN STYLES TAB
			    ============================================ */}
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Colors', 'designsetgo')}
					settings={[
						{
							label: __('Text Color', 'designsetgo'),
							colorValue: textColor,
							onColorChange: (color) =>
								setAttributes({ textColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Background Color', 'designsetgo'),
							colorValue: backgroundColor,
							onColorChange: (color) =>
								setAttributes({ backgroundColor: color || '' }),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			{/* ============================================
			     CONDITIONAL COLOR CONTROLS (Optional)
			    ============================================ */}
			{someToggle && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Optional Colors', 'designsetgo')}
						settings={[
							{
								label: __('Optional Color', 'designsetgo'),
								colorValue: attributes.optionalColor,
								onColorChange: (color) =>
									setAttributes({
										optionalColor: color || '',
									}),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
			)}

			{/* ============================================
			     SETTINGS CONTROLS - IN SETTINGS TAB
			    ============================================ */}
			<InspectorControls>
				<PanelBody
					title={__('Block Settings', 'designsetgo')}
					initialOpen={true}
				>
					<TextControl
						label={__('Some Text', 'designsetgo')}
						value={someText}
						onChange={(value) => setAttributes({ someText: value })}
						help={__('Enter some text', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Some Toggle', 'designsetgo')}
						checked={someToggle}
						onChange={(value) =>
							setAttributes({ someToggle: value })
						}
						help={__('Enable or disable something', 'designsetgo')}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Some Number', 'designsetgo')}
						value={someNumber}
						onChange={(value) =>
							setAttributes({ someNumber: value })
						}
						min={0}
						max={100}
						help={__('Adjust a number', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Some Option', 'designsetgo')}
						value={someOption}
						options={[
							{
								label: __('Option 1', 'designsetgo'),
								value: 'opt1',
							},
							{
								label: __('Option 2', 'designsetgo'),
								value: 'opt2',
							},
							{
								label: __('Option 3', 'designsetgo'),
								value: 'opt3',
							},
						]}
						onChange={(value) =>
							setAttributes({ someOption: value })
						}
						help={__('Choose an option', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			{/* ============================================
			     BLOCK CONTENT
			    ============================================ */}
			<div {...blockProps}>
				<p>{someText || __('Add your content here', 'designsetgo')}</p>
			</div>
		</>
	);
}
