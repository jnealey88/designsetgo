/**
 * Expanding Background Extension - Panel Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	Notice,
} from '@wordpress/components';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { RANGES } from '../constants';

/**
 * Expanding Background Panel Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Panel component
 */
export default function ExpandingBackgroundPanel({
	attributes,
	setAttributes,
	clientId,
}) {
	const {
		dsgoExpandingBgEnabled,
		dsgoExpandingBgColor,
		dsgoExpandingBgInitialSize,
		dsgoExpandingBgBlur,
		dsgoExpandingBgSpeed,
		dsgoExpandingBgTriggerOffset,
		dsgoExpandingBgCompletionPoint,
	} = attributes;

	// Get color gradient settings for the color picker
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<Fragment>
			{/* Color Settings - In Styles > Color Panel */}
			{dsgoExpandingBgEnabled && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Expanding Background Color', 'designsetgo')}
						settings={[
							{
								label: __('Background Color', 'designsetgo'),
								colorValue: dsgoExpandingBgColor,
								onColorChange: (value) =>
									setAttributes({
										dsgoExpandingBgColor: value || '',
									}),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
			)}

			{/* Other Settings - In PanelBody */}
			<InspectorControls>
				<PanelBody
					title={__('Expanding Background', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable expanding background', 'designsetgo')}
						checked={dsgoExpandingBgEnabled}
						onChange={(value) =>
							setAttributes({ dsgoExpandingBgEnabled: value })
						}
						help={__(
							'Creates a scroll-driven background that expands from a small circle to fill the section.',
							'designsetgo'
						)}
					/>

					{dsgoExpandingBgEnabled && (
						<>
							<Notice status="info" isDismissible={false}>
								{__(
									'The expanding effect will be visible on the frontend as you scroll.',
									'designsetgo'
								)}
							</Notice>

							<RangeControl
								label={__('Initial Circle Size', 'designsetgo')}
								value={dsgoExpandingBgInitialSize}
								onChange={(value) =>
									setAttributes({
										dsgoExpandingBgInitialSize: value,
									})
								}
								min={RANGES.initialSize.min}
								max={RANGES.initialSize.max}
								step={RANGES.initialSize.step}
								help={__(
									'Starting radius of the circle in pixels.',
									'designsetgo'
								)}
							/>

							<RangeControl
								label={__('Blur Amount', 'designsetgo')}
								value={dsgoExpandingBgBlur}
								onChange={(value) =>
									setAttributes({
										dsgoExpandingBgBlur: value,
									})
								}
								min={RANGES.blur.min}
								max={RANGES.blur.max}
								step={RANGES.blur.step}
								help={__(
									'Initial blur that fades as the circle expands.',
									'designsetgo'
								)}
							/>

							<RangeControl
								label={__('Animation Speed', 'designsetgo')}
								value={dsgoExpandingBgSpeed}
								onChange={(value) =>
									setAttributes({
										dsgoExpandingBgSpeed: value,
									})
								}
								min={RANGES.speed.min}
								max={RANGES.speed.max}
								step={RANGES.speed.step}
								help={__(
									'Speed multiplier for the expansion effect.',
									'designsetgo'
								)}
							/>

							<RangeControl
								label={__('Trigger Offset', 'designsetgo')}
								value={dsgoExpandingBgTriggerOffset}
								onChange={(value) =>
									setAttributes({
										dsgoExpandingBgTriggerOffset: value,
									})
								}
								min={RANGES.triggerOffset.min}
								max={RANGES.triggerOffset.max}
								step={RANGES.triggerOffset.step}
								help={__(
									'Percentage of scroll progress before effect starts (0–100%).',
									'designsetgo'
								)}
							/>

							<RangeControl
								label={__('Completion Point', 'designsetgo')}
								value={dsgoExpandingBgCompletionPoint}
								onChange={(value) =>
									setAttributes({
										dsgoExpandingBgCompletionPoint: value,
									})
								}
								min={RANGES.completionPoint.min}
								max={RANGES.completionPoint.max}
								step={RANGES.completionPoint.step}
								help={__(
									'Percentage of scroll through section where effect reaches 100% (50–100%).',
									'designsetgo'
								)}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}
