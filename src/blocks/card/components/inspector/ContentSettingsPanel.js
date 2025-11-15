/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Content Settings Panel Component
 * Controls which content elements are visible
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to set attributes
 * @return {Element} Content settings panel
 */
export default function ContentSettingsPanel({ attributes, setAttributes }) {
	const {
		showImage,
		showTitle,
		showSubtitle,
		showBody,
		showBadge,
		showCta,
		layoutPreset,
	} = attributes;

	return (
		<PanelBody title={__('Content Elements', 'designsetgo')} initialOpen={false}>
			{layoutPreset !== 'minimal' && (
				<ToggleControl
					label={__('Show Image', 'designsetgo')}
					checked={showImage}
					onChange={(value) => setAttributes({ showImage: value })}
					help={__('Display the card image.', 'designsetgo')}
					__nextHasNoMarginBottom
				/>
			)}

			<ToggleControl
				label={__('Show Title', 'designsetgo')}
				checked={showTitle}
				onChange={(value) => setAttributes({ showTitle: value })}
				help={__('Display the card title.', 'designsetgo')}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Show Subtitle', 'designsetgo')}
				checked={showSubtitle}
				onChange={(value) => setAttributes({ showSubtitle: value })}
				help={__('Display the card subtitle.', 'designsetgo')}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Show Body Text', 'designsetgo')}
				checked={showBody}
				onChange={(value) => setAttributes({ showBody: value })}
				help={__('Display the card body text.', 'designsetgo')}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Show Badge', 'designsetgo')}
				checked={showBadge}
				onChange={(value) => setAttributes({ showBadge: value })}
				help={__('Display the badge element.', 'designsetgo')}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Show CTA Button', 'designsetgo')}
				checked={showCta}
				onChange={(value) => setAttributes({ showCta: value })}
				help={__('Display the call-to-action button.', 'designsetgo')}
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}
