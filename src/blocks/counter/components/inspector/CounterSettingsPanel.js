/**
 * Counter Block - Counter Settings Panel Component
 *
 * Provides controls for counter values, decimals, and prefix/suffix.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';

/**
 * Counter Settings Panel - Controls for counter number configuration.
 *
 * @param {Object}   props               - Component props
 * @param {number}   props.startValue    - Start value for animation
 * @param {number}   props.endValue      - End value (final display number)
 * @param {number}   props.decimals      - Number of decimal places (0-3)
 * @param {string}   props.prefix        - Text before number (e.g., '$', '€')
 * @param {string}   props.suffix        - Text after number (e.g., '+', '%', 'K')
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Counter Settings Panel component
 */
export const CounterSettingsPanel = ({
	startValue,
	endValue,
	decimals,
	prefix,
	suffix,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Counter Settings', 'designsetgo')}
			initialOpen={true}
		>
			<RangeControl
				label={__('Start Value', 'designsetgo')}
				value={startValue}
				onChange={(value) => setAttributes({ startValue: value })}
				min={0}
				max={endValue}
				help={__('Number to count from', 'designsetgo')}
			/>

			<TextControl
				label={__('End Value', 'designsetgo')}
				type="number"
				value={endValue}
				onChange={(value) =>
					setAttributes({ endValue: parseFloat(value) || 0 })
				}
				help={__('Final number to display', 'designsetgo')}
			/>

			<RangeControl
				label={__('Decimal Places', 'designsetgo')}
				value={decimals}
				onChange={(value) => setAttributes({ decimals: value })}
				min={0}
				max={3}
				help={__('Number of decimal places', 'designsetgo')}
			/>

			<TextControl
				label={__('Prefix', 'designsetgo')}
				value={prefix}
				onChange={(value) => setAttributes({ prefix: value })}
				placeholder="$"
				help={__('Text before number (e.g., "$", "€")', 'designsetgo')}
			/>

			<TextControl
				label={__('Suffix', 'designsetgo')}
				value={suffix}
				onChange={(value) => setAttributes({ suffix: value })}
				placeholder="+"
				help={__(
					'Text after number (e.g., "+", "%", "K")',
					'designsetgo'
				)}
			/>
		</PanelBody>
	);
};
