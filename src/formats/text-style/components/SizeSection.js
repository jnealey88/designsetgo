/**
 * Size Section Component
 *
 * Font size and padding controls with presets and custom values.
 *
 * @since 1.3.0
 */

import { __ } from '@wordpress/i18n';
import {
	Button,
	ButtonGroup,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import {
	SIZE_PRESETS,
	SIZE_UNITS,
	PADDING_PRESETS,
	BORDER_RADIUS_PRESETS,
} from '../constants';

/**
 * SizeSection Component
 *
 * @param {Object}   props                      - Component props
 * @param {string}   props.fontSize             - Current font size value
 * @param {Function} props.onFontSizeChange     - Callback when size changes
 * @param {string}   props.padding              - Current padding value
 * @param {Function} props.onPaddingChange      - Callback when padding changes
 * @param {string}   props.borderRadius         - Current border radius value
 * @param {Function} props.onBorderRadiusChange - Callback when border radius changes
 * @return {JSX.Element} The size section
 */
export default function SizeSection({
	fontSize,
	onFontSizeChange,
	padding,
	onPaddingChange,
	borderRadius,
	onBorderRadiusChange,
}) {
	/**
	 * Check if a font size preset is active
	 *
	 * @param {string|null} presetValue - The preset value to check
	 * @return {boolean} Whether the preset is active
	 */
	const isSizePresetActive = (presetValue) => {
		if (presetValue === null) {
			// "Normal" preset is active when no font size is set
			return !fontSize;
		}
		return fontSize === presetValue;
	};

	/**
	 * Check if a custom size value is set (not a preset)
	 */
	const isCustomSizeValue = () => {
		if (!fontSize) {
			return false;
		}
		return !SIZE_PRESETS.some((preset) => preset.value === fontSize);
	};

	/**
	 * Check if a padding preset is active
	 *
	 * @param {string|null} presetValue - The preset value to check
	 * @return {boolean} Whether the preset is active
	 */
	const isPaddingPresetActive = (presetValue) => {
		if (presetValue === null) {
			return !padding;
		}
		return padding === presetValue;
	};

	/**
	 * Check if a border radius preset is active
	 *
	 * @param {string|null} presetValue - The preset value to check
	 * @return {boolean} Whether the preset is active
	 */
	const isBorderRadiusPresetActive = (presetValue) => {
		if (presetValue === null) {
			return !borderRadius;
		}
		return borderRadius === presetValue;
	};

	return (
		<div className="dsgo-text-style-popover__section">
			{/* Font Size */}
			<div className="dsgo-text-style-popover__section-title">
				{__('Size', 'designsetgo')}
			</div>

			<div className="dsgo-text-style-popover__size-controls">
				<ButtonGroup className="dsgo-text-style-popover__size-presets">
					{SIZE_PRESETS.map((preset) => (
						<Button
							key={preset.label}
							size="compact"
							variant={
								isSizePresetActive(preset.value)
									? 'primary'
									: 'secondary'
							}
							onClick={() => onFontSizeChange(preset.value || '')}
							title={preset.title}
						>
							{preset.label}
						</Button>
					))}
				</ButtonGroup>

				<UnitControl
					className="dsgo-text-style-popover__size-custom"
					label={__('Custom', 'designsetgo')}
					hideLabelFromVision
					value={isCustomSizeValue() ? fontSize : ''}
					onChange={(value) => onFontSizeChange(value || '')}
					units={SIZE_UNITS}
					placeholder={__('Custom', 'designsetgo')}
					size="__unstable-large"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</div>

			{/* Padding */}
			<div
				className="dsgo-text-style-popover__section-title"
				style={{ marginTop: '12px' }}
			>
				{__('Padding', 'designsetgo')}
			</div>

			<div className="dsgo-text-style-popover__size-controls">
				<ButtonGroup className="dsgo-text-style-popover__size-presets">
					{PADDING_PRESETS.map((preset) => (
						<Button
							key={preset.label}
							size="compact"
							variant={
								isPaddingPresetActive(preset.value)
									? 'primary'
									: 'secondary'
							}
							onClick={() => onPaddingChange(preset.value || '')}
							title={preset.title}
						>
							{preset.label}
						</Button>
					))}
				</ButtonGroup>
			</div>

			{/* Border Radius */}
			<div
				className="dsgo-text-style-popover__section-title"
				style={{ marginTop: '12px' }}
			>
				{__('Radius', 'designsetgo')}
			</div>

			<div className="dsgo-text-style-popover__size-controls">
				<ButtonGroup className="dsgo-text-style-popover__size-presets">
					{BORDER_RADIUS_PRESETS.map((preset) => (
						<Button
							key={preset.label}
							size="compact"
							variant={
								isBorderRadiusPresetActive(preset.value)
									? 'primary'
									: 'secondary'
							}
							onClick={() =>
								onBorderRadiusChange(preset.value || '')
							}
							title={preset.title}
						>
							{preset.label}
						</Button>
					))}
				</ButtonGroup>
			</div>
		</div>
	);
}
