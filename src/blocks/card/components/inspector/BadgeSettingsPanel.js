/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

/**
 * Badge Settings Panel Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to set attributes
 * @return {Element} Badge settings panel
 */
export default function BadgeSettingsPanel({ attributes, setAttributes }) {
	const {
		badgeText,
		badgeStyle,
		badgeFloatingPosition,
		badgeInlinePosition,
	} = attributes;

	const styleOptions = [
		{ label: __('Floating (Over Card)', 'designsetgo'), value: 'floating' },
		{ label: __('Inline (In Content)', 'designsetgo'), value: 'inline' },
	];

	const floatingPositionOptions = [
		{ label: __('Top Left', 'designsetgo'), value: 'top-left' },
		{ label: __('Top Right', 'designsetgo'), value: 'top-right' },
		{ label: __('Bottom Left', 'designsetgo'), value: 'bottom-left' },
		{ label: __('Bottom Right', 'designsetgo'), value: 'bottom-right' },
	];

	const inlinePositionOptions = [
		{ label: __('Above Title', 'designsetgo'), value: 'above-title' },
		{ label: __('Below Title', 'designsetgo'), value: 'below-title' },
	];

	return (
		<PanelBody title={__('Badge', 'designsetgo')} initialOpen={false}>
			<TextControl
				label={__('Badge Text', 'designsetgo')}
				value={badgeText}
				onChange={(value) => setAttributes({ badgeText: value })}
				placeholder={__('NEW', 'designsetgo')}
				help={__('Leave empty to hide the badge.', 'designsetgo')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{badgeText && (
				<>
					<SelectControl
						label={__('Badge Style', 'designsetgo')}
						value={badgeStyle}
						options={styleOptions}
						onChange={(value) =>
							setAttributes({ badgeStyle: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{badgeStyle === 'floating' && (
						<SelectControl
							label={__('Floating Position', 'designsetgo')}
							value={badgeFloatingPosition}
							options={floatingPositionOptions}
							onChange={(value) =>
								setAttributes({ badgeFloatingPosition: value })
							}
							help={__(
								'Position the badge over the card.',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					{badgeStyle === 'inline' && (
						<SelectControl
							label={__('Inline Position', 'designsetgo')}
							value={badgeInlinePosition}
							options={inlinePositionOptions}
							onChange={(value) =>
								setAttributes({ badgeInlinePosition: value })
							}
							help={__(
								'Position the badge in the content flow.',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}
				</>
			)}
		</PanelBody>
	);
}
