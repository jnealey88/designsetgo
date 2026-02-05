/**
 * Device Toggle Component
 *
 * Allows switching between Desktop, Tablet, and Mobile views
 * for responsive spacing controls.
 *
 * @package
 * @since 1.5.0
 */

import { __ } from '@wordpress/i18n';
import { ButtonGroup, Button, Tooltip } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

const DEVICE_CONFIG = [
	{
		value: 'desktop',
		label: __('Desktop', 'designsetgo'),
		icon: desktop,
	},
	{
		value: 'tablet',
		label: __('Tablet', 'designsetgo'),
		icon: tablet,
	},
	{
		value: 'mobile',
		label: __('Mobile', 'designsetgo'),
		icon: mobile,
	},
];

/**
 * Device toggle button group.
 *
 * @param {Object}   props              Component props
 * @param {string}   props.activeDevice Current active device
 * @param {Function} props.onChange     Callback when device changes
 * @return {JSX.Element} Device toggle component
 */
export default function DeviceToggle({ activeDevice, onChange }) {
	return (
		<ButtonGroup className="dsgo-device-toggle">
			{DEVICE_CONFIG.map(({ value, label, icon }) => (
				<Tooltip key={value} text={label}>
					<Button
						icon={icon}
						isPressed={activeDevice === value}
						onClick={() => onChange(value)}
						aria-label={label}
						size="small"
					/>
				</Tooltip>
			))}
		</ButtonGroup>
	);
}
