/**
 * Container Block - Content Width Panel Component
 *
 * Provides controls for constraining content width (centering with max-width).
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';

/**
 * Content Width Panel - Controls for width constraints.
 *
 * When enabled, centers content with a maximum width. Works with all layout types.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.constrainWidth - Whether to constrain content width
 * @param {string} props.contentWidth - Maximum content width (e.g., '1200px', '60rem')
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Content Width Panel component
 */
export const ContentWidthPanel = ({ constrainWidth, contentWidth, setAttributes }) => {
	return (
		<PanelBody title={__('Content Width', 'designsetgo')} initialOpen={false}>
			<ToggleControl
				label={__('Constrain Width', 'designsetgo')}
				checked={constrainWidth}
				onChange={(value) => setAttributes({ constrainWidth: value })}
				help={
					constrainWidth
						? __('Content is centered with max-width', 'designsetgo')
						: __('Content uses full width', 'designsetgo')
				}
			/>

			{constrainWidth && (
				<TextControl
					label={__('Max Width', 'designsetgo')}
					value={contentWidth}
					onChange={(value) => setAttributes({ contentWidth: value })}
					help={__('Maximum content width (e.g., 800px, 60rem)', 'designsetgo')}
				/>
			)}
		</PanelBody>
	);
};
