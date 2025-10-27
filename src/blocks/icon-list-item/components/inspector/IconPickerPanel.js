/**
 * Icon List Item - Icon Picker Panel Component
 *
 * Provides icon selection interface.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { IconPicker } from '../../../icon/components/IconPicker';

/**
 * Icon Picker Panel Component
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.icon          - Currently selected icon
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Icon Picker Panel component
 */
export const IconPickerPanel = ({ icon, setAttributes }) => {
	return (
		<PanelBody title={__('Icon', 'designsetgo')} initialOpen={true}>
			<IconPicker
				value={icon}
				onChange={(newIcon) => setAttributes({ icon: newIcon })}
			/>
		</PanelBody>
	);
};
