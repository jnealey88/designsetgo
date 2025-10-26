/**
 * Counter Block - Label Settings Panel Component
 *
 * Provides control for counter label text.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';

/**
 * Label Settings Panel - Control for label text below counter.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text to display below counter
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Label Settings Panel component
 */
export const LabelSettingsPanel = ({ label, setAttributes }) => {
	return (
		<PanelBody title={__('Label Settings', 'designsetgo')} initialOpen={true}>
			<TextControl
				label={__('Label', 'designsetgo')}
				value={label}
				onChange={(value) => setAttributes({ label: value })}
				placeholder={__('Enter label...', 'designsetgo')}
				help={__('Description text below counter', 'designsetgo')}
			/>
		</PanelBody>
	);
};
