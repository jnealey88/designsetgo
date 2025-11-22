/**
 * Overlay Settings Panel Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl } from '@wordpress/components';

export default function OverlaySettings({ attributes, setAttributes }) {
	const { overlayOpacity, overlayBlur } = attributes;

	return (
		<PanelBody title={__('Overlay', 'designsetgo')} initialOpen={false}>
			<RangeControl
				label={__('Overlay Opacity (%)', 'designsetgo')}
				value={overlayOpacity}
				onChange={(value) => setAttributes({ overlayOpacity: value })}
				min={0}
				max={100}
				step={5}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<RangeControl
				label={__('Backdrop Blur (px)', 'designsetgo')}
				value={overlayBlur}
				onChange={(value) => setAttributes({ overlayBlur: value })}
				min={0}
				max={20}
				step={1}
				help={__(
					'Blurs the background content when modal is open.',
					'designsetgo'
				)}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}
