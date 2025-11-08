/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	Notice,
} from '@wordpress/components';

/**
 * Layout options
 */
const LAYOUT_OPTIONS = [
	{
		label: __('Boxed (Default)', 'designsetgo'),
		value: 'boxed',
	},
	{
		label: __('Inline', 'designsetgo'),
		value: 'inline',
	},
	{
		label: __('Compact', 'designsetgo'),
		value: 'compact',
	},
];

/**
 * Display Panel component
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Panel component
 */
export default function DisplayPanel({ attributes, setAttributes }) {
	const { showDays, showHours, showMinutes, showSeconds, layout } =
		attributes;

	// Check if at least one unit is visible
	const hasVisibleUnit = showDays || showHours || showMinutes || showSeconds;

	return (
		<PanelBody title={__('Display Options', 'designsetgo')}>
			<SelectControl
				label={__('Layout Style', 'designsetgo')}
				value={layout}
				options={LAYOUT_OPTIONS}
				onChange={(newLayout) => setAttributes({ layout: newLayout })}
				help={__(
					'Choose how the countdown units are displayed.',
					'designsetgo'
				)}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<div style={{ marginTop: '16px' }}>
				<h3 style={{ marginBottom: '8px', fontSize: '13px' }}>
					{__('Visible Units', 'designsetgo')}
				</h3>

				<ToggleControl
					label={__('Show Days', 'designsetgo')}
					checked={showDays}
					onChange={(value) => setAttributes({ showDays: value })}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Show Hours', 'designsetgo')}
					checked={showHours}
					onChange={(value) => setAttributes({ showHours: value })}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Show Minutes', 'designsetgo')}
					checked={showMinutes}
					onChange={(value) => setAttributes({ showMinutes: value })}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Show Seconds', 'designsetgo')}
					checked={showSeconds}
					onChange={(value) => setAttributes({ showSeconds: value })}
					__nextHasNoMarginBottom
				/>
			</div>

			{!hasVisibleUnit && (
				<Notice status="warning" isDismissible={false}>
					{__(
						'At least one time unit should be visible.',
						'designsetgo'
					)}
				</Notice>
			)}
		</PanelBody>
	);
}
