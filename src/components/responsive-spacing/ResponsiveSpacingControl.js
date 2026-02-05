/**
 * Responsive Spacing Control Component
 *
 * Wraps WordPress BoxControl with device toggle for responsive spacing.
 * Shows inheritance notices and reset functionality.
 *
 * @package
 * @since 1.5.0
 */

import { __, sprintf } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalBoxControl as BoxControl,
	Button,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import DeviceToggle from './DeviceToggle';
import { getEffectiveSpacing } from '../../utils/responsive-spacing';

/**
 * Responsive Spacing Control
 *
 * @param {Object}   props                    Component props
 * @param {string}   props.label              Control label (e.g., "Responsive Padding")
 * @param {string}   props.type               Spacing type: 'padding' or 'margin'
 * @param {Object}   props.desktopValues      Desktop spacing values from style.spacing[type]
 * @param {Object}   props.responsiveValues   Responsive overrides (dsgoResponsiveSpacing)
 * @param {Function} props.onDesktopChange    Callback for desktop value changes
 * @param {Function} props.onResponsiveChange Callback for responsive value changes (device, type, values)
 * @return {JSX.Element} Responsive spacing control
 */
export default function ResponsiveSpacingControl({
	label,
	type,
	desktopValues,
	responsiveValues,
	onDesktopChange,
	onResponsiveChange,
}) {
	const [activeDevice, setActiveDevice] = useState('desktop');

	// Get the effective value for the current device (with inheritance)
	const effectiveValues = getEffectiveSpacing(
		{ [type]: desktopValues },
		responsiveValues,
		activeDevice,
		type
	);

	// Check if current device has its own override
	const hasOverride =
		activeDevice !== 'desktop' &&
		!!responsiveValues?.[activeDevice]?.[type];

	// Determine what device we're inheriting from
	const getInheritSource = () => {
		if (activeDevice === 'tablet') {
			return __('Desktop', 'designsetgo');
		}
		if (activeDevice === 'mobile') {
			if (responsiveValues?.tablet?.[type]) {
				return __('Tablet', 'designsetgo');
			}
			return __('Desktop', 'designsetgo');
		}
		return null;
	};

	const handleChange = (values) => {
		if (activeDevice === 'desktop') {
			onDesktopChange(values);
		} else {
			onResponsiveChange(activeDevice, type, values);
		}
	};

	const handleReset = () => {
		onResponsiveChange(activeDevice, type, undefined);
	};

	return (
		<div className="dsgo-responsive-spacing-control">
			<div className="dsgo-responsive-spacing-control__header">
				<span className="dsgo-responsive-spacing-control__label">
					{label}
				</span>
				<DeviceToggle
					activeDevice={activeDevice}
					onChange={setActiveDevice}
				/>
			</div>

			{activeDevice !== 'desktop' && !hasOverride && (
				<p className="dsgo-responsive-spacing-control__inherit-notice">
					{sprintf(
						/* translators: %s: device name (Desktop or Tablet) */
						__('Inheriting from %s', 'designsetgo'),
						getInheritSource()
					)}
				</p>
			)}

			<BoxControl
				values={effectiveValues}
				onChange={handleChange}
				resetValues={{
					top: undefined,
					right: undefined,
					bottom: undefined,
					left: undefined,
				}}
				__next40pxDefaultSize
			/>

			{hasOverride && (
				<Button
					variant="link"
					isDestructive
					onClick={handleReset}
					className="dsgo-responsive-spacing-control__reset"
				>
					{__('Reset to inherit', 'designsetgo')}
				</Button>
			)}
		</div>
	);
}
