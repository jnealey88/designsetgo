/**
 * Icon Block - Link Settings Panel Component
 *
 * Provides controls for adding and configuring links on icons.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { link } from '@wordpress/icons';

/**
 * Link Settings Panel - Controls for icon links.
 *
 * Allows adding a link to the icon, setting target (same/new tab),
 * and configuring rel attribute for security.
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.linkUrl       - Link URL
 * @param {string}   props.linkTarget    - Link target (_self or _blank)
 * @param {string}   props.linkRel       - Link rel attribute
 * @param {Function} props.setAttributes - Function to update block attributes
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
			<Button
				icon={link}
				variant={linkUrl ? 'primary' : 'secondary'}
				onClick={() => {
					// Toggle link: if exists, clear it; if not, set empty string to show fields
					if (linkUrl) {
						setAttributes({
							linkUrl: '',
							linkTarget: '_self',
							linkRel: '',
						});
					} else {
						setAttributes({ linkUrl: 'https://' });
					}
				}}
				style={{ width: '100%' }}
			>
				{linkUrl
					? __('Remove Link', 'designsetgo')
					: __('Add Link', 'designsetgo')}
			</Button>

			{linkUrl && (
				<div style={{ marginTop: '12px' }}>
					<TextControl
						label={__('URL', 'designsetgo')}
						value={linkUrl}
						onChange={(value) => setAttributes({ linkUrl: value })}
						placeholder="https://"
					/>
					<SelectControl
						label={__('Open in', 'designsetgo')}
						value={linkTarget}
						options={[
							{
								label: __('Same Tab', 'designsetgo'),
								value: '_self',
							},
							{
								label: __('New Tab', 'designsetgo'),
								value: '_blank',
							},
						]}
						onChange={(value) =>
							setAttributes({ linkTarget: value })
						}
					/>
					{linkTarget === '_blank' && (
						<TextControl
							label={__('Link Rel', 'designsetgo')}
							value={linkRel}
							onChange={(value) =>
								setAttributes({ linkRel: value })
							}
							help={__(
								'Recommended: "noopener noreferrer"',
								'designsetgo'
							)}
						/>
					)}
				</div>
			)}
		</PanelBody>
	);
};
