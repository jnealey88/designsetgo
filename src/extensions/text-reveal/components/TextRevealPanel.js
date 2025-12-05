/**
 * Text Reveal Extension - Settings Panel
 *
 * Panel component for configuring text reveal effect
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
} from '@wordpress/components';
import {
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { SPLIT_MODE_OPTIONS, TRANSITION_DURATION_OPTIONS } from '../constants';

/**
 * Text Reveal Settings Panel
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @param {string}   props.clientId      Block client ID for color controls
 * @return {JSX.Element} Text reveal panel component
 */
export default function TextRevealPanel({
	attributes,
	setAttributes,
	clientId,
}) {
	const {
		dsgoTextRevealEnabled,
		dsgoTextRevealColor,
		dsgoTextRevealSplitMode,
		dsgoTextRevealTransition,
	} = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<>
			{/* Main settings panel */}
			<InspectorControls>
				<PanelBody
					title={__('Text Reveal', 'designsetgo')}
					initialOpen={false}
					icon="visibility"
				>
					<ToggleControl
						label={__('Enable Text Reveal', 'designsetgo')}
						checked={dsgoTextRevealEnabled}
						onChange={(value) =>
							setAttributes({ dsgoTextRevealEnabled: value })
						}
						help={__(
							'Reveal text color progressively as users scroll',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					{dsgoTextRevealEnabled && (
						<>
							<SelectControl
								label={__('Split Mode', 'designsetgo')}
								value={dsgoTextRevealSplitMode}
								options={SPLIT_MODE_OPTIONS}
								onChange={(value) =>
									setAttributes({
										dsgoTextRevealSplitMode: value,
									})
								}
								help={__(
									'Reveal by word or character',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label={__('Transition Speed', 'designsetgo')}
								value={dsgoTextRevealTransition}
								options={TRANSITION_DURATION_OPTIONS}
								onChange={(value) =>
									setAttributes({
										dsgoTextRevealTransition: parseInt(
											value,
											10
										),
									})
								}
								help={__(
									'How fast each word/character transitions',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<RangeControl
								label={__(
									'Custom Transition (ms)',
									'designsetgo'
								)}
								value={dsgoTextRevealTransition}
								onChange={(value) =>
									setAttributes({
										dsgoTextRevealTransition: value,
									})
								}
								min={50}
								max={500}
								step={10}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			{/* Color controls in the Colors group */}
			{dsgoTextRevealEnabled && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Text Reveal', 'designsetgo')}
						settings={[
							{
								label: __('Reveal Color', 'designsetgo'),
								colorValue: dsgoTextRevealColor,
								onColorChange: (color) =>
									setAttributes({
										dsgoTextRevealColor: color || '',
									}),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
			)}
		</>
	);
}
