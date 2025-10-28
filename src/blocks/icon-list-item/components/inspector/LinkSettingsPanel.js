/**
 * Icon List Item - Link Settings Panel Component
 *
 * Provides link configuration interface.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

/**
 * Link Settings Panel Component
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.linkUrl       - Link URL
 * @param {string}   props.linkTarget    - Link target (_self or _blank)
 * @param {string}   props.linkRel       - Link rel attribute
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Link Settings Panel component
 */
export const LinkSettingsPanel = ({
	linkUrl,
	linkTarget,
	linkRel,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Link Settings', 'designsetgo')}
			initialOpen={false}
		>
			<TextControl
				label={__('URL', 'designsetgo')}
				value={linkUrl}
				onChange={(value) => setAttributes({ linkUrl: value })}
				placeholder="https://"
				help={__('Make the entire list item clickable', 'designsetgo')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{linkUrl && (
				<>
					<ToggleControl
						label={__('Open in new tab', 'designsetgo')}
						checked={linkTarget === '_blank'}
						onChange={(value) =>
							setAttributes({
								linkTarget: value ? '_blank' : '_self',
								linkRel: value ? 'noopener noreferrer' : '',
							})
						}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Link Rel', 'designsetgo')}
						value={linkRel}
						options={[
							{ label: __('None', 'designsetgo'), value: '' },
							{ label: 'noopener', value: 'noopener' },
							{ label: 'noreferrer', value: 'noreferrer' },
							{
								label: 'noopener noreferrer',
								value: 'noopener noreferrer',
							},
							{ label: 'nofollow', value: 'nofollow' },
						]}
						onChange={(value) => setAttributes({ linkRel: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</>
			)}
		</PanelBody>
	);
};
