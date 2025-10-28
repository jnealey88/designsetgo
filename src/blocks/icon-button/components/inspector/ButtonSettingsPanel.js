/**
 * Icon Button - Button Settings Panel Component
 *
 * Provides controls for button text, link, and icon settings.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TextControl,
	SelectControl,
	RangeControl,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import {
	URLInput,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import { IconPicker } from '../../../icon/components/IconPicker';

/**
 * Button Settings Panel Component
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.url           - Button URL
 * @param {string}   props.linkTarget    - Link target (_self, _blank)
 * @param {string}   props.rel           - Link rel attribute
 * @param {string}   props.icon          - Selected icon name
 * @param {string}   props.iconPosition  - Icon position (start, end, none)
 * @param {number}   props.iconSize      - Icon size in pixels
 * @param {string}   props.iconGap       - Gap between icon and text
 * @param {string}   props.width         - Button width
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Button Settings Panel component
 */
export const ButtonSettingsPanel = ({
	url,
	linkTarget,
	rel,
	icon,
	iconPosition,
	iconSize,
	iconGap,
	width,
	setAttributes,
}) => {
	return (
		<>
			<PanelBody title={__('Link Settings', 'designsetgo')} initialOpen={true}>
				<TextControl
					label={__('URL', 'designsetgo')}
					value={url}
					onChange={(value) => setAttributes({ url: value })}
					placeholder="https://"
					help={__('Enter the link URL', 'designsetgo')}
				/>

				<ToggleControl
					label={__('Open in new tab', 'designsetgo')}
					checked={linkTarget === '_blank'}
					onChange={(value) =>
						setAttributes({
							linkTarget: value ? '_blank' : '_self',
							rel: value ? 'noopener noreferrer' : '',
						})
					}
				/>

				{linkTarget === '_blank' && (
					<TextControl
						label={__('Link Rel', 'designsetgo')}
						value={rel}
						onChange={(value) => setAttributes({ rel: value })}
						help={__(
							'Rel attribute for security (default: noopener noreferrer)',
							'designsetgo'
						)}
					/>
				)}
			</PanelBody>

			<PanelBody title={__('Icon Settings', 'designsetgo')} initialOpen={true}>
				<SelectControl
					label={__('Icon Position', 'designsetgo')}
					value={iconPosition}
					options={[
						{ label: __('Start', 'designsetgo'), value: 'start' },
						{ label: __('End', 'designsetgo'), value: 'end' },
						{ label: __('None', 'designsetgo'), value: 'none' },
					]}
					onChange={(value) => setAttributes({ iconPosition: value })}
					help={__('Position of icon relative to text', 'designsetgo')}
				/>

				{iconPosition !== 'none' && (
					<>
						<IconPicker
							value={icon}
							onChange={(value) => setAttributes({ icon: value })}
						/>

						<RangeControl
							label={__('Icon Size', 'designsetgo')}
							value={iconSize}
							onChange={(value) => setAttributes({ iconSize: value })}
							min={12}
							max={48}
							help={__('Icon size in pixels', 'designsetgo')}
						/>

						<UnitControl
							label={__('Icon Gap', 'designsetgo')}
							value={iconGap}
							onChange={(value) => setAttributes({ iconGap: value })}
							units={[
								{ value: 'px', label: 'px' },
								{ value: 'em', label: 'em' },
								{ value: 'rem', label: 'rem' },
							]}
							help={__('Space between icon and text', 'designsetgo')}
						/>
					</>
				)}
			</PanelBody>

			<PanelBody title={__('Button Settings', 'designsetgo')}>
				<SelectControl
					label={__('Width', 'designsetgo')}
					value={width}
					options={[
						{ label: __('Auto', 'designsetgo'), value: 'auto' },
						{ label: __('Full Width', 'designsetgo'), value: '100%' },
						{ label: __('50%', 'designsetgo'), value: '50%' },
						{ label: __('25%', 'designsetgo'), value: '25%' },
					]}
					onChange={(value) => setAttributes({ width: value })}
					help={__('Button width', 'designsetgo')}
				/>
			</PanelBody>
		</>
	);
};
