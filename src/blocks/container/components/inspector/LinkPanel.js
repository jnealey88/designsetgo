/**
 * Container Block - Link Panel Component
 *
 * Provides controls for making the entire container clickable.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

/**
 * Link Panel - Controls for clickable container.
 *
 * Allows the entire container to be a clickable link, while preserving
 * interactive elements inside (buttons, links) via frontend JavaScript.
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.linkUrl       - Link URL
 * @param {string}   props.linkTarget    - Link target ('_self' or '_blank')
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Link Panel component
 */
export const LinkPanel = ({ linkUrl, linkTarget, setAttributes }) => {
	return (
		<PanelBody
			title={__('Link Settings', 'designsetgo')}
			initialOpen={false}
		>
			<TextControl
				label={__('Link URL', 'designsetgo')}
				value={linkUrl}
				onChange={(value) => setAttributes({ linkUrl: value })}
				placeholder="https://example.com"
				help={__('Make entire container clickable', 'designsetgo')}
			/>

			{linkUrl && (
				<SelectControl
					label={__('Link Target', 'designsetgo')}
					value={linkTarget}
					options={[
						{
							label: __('Same Window', 'designsetgo'),
							value: '_self',
						},
						{
							label: __('New Window', 'designsetgo'),
							value: '_blank',
						},
					]}
					onChange={(value) => setAttributes({ linkTarget: value })}
				/>
			)}
		</PanelBody>
	);
};
