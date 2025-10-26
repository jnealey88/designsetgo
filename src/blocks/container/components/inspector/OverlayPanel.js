/**
 * Container Block - Overlay Panel Component
 *
 * Provides controls for background overlay color with transparency.
 * Only visible when video or background image is set.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __experimentalPanelColorGradientSettings as PanelColorGradientSettings } from '@wordpress/block-editor';

/**
 * Overlay Panel - Controls for background overlay.
 *
 * Adds a color overlay over the background for better text contrast.
 * Only displays when video background or background image is present.
 *
 * @param {Object} props - Component props
 * @param {string} props.videoUrl - Video URL (if present)
 * @param {Object} props.style - Block style object (may contain backgroundImage)
 * @param {boolean} props.enableOverlay - Whether overlay is enabled
 * @param {string} props.overlayColor - Overlay color (supports rgba)
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element|null} Overlay Panel component or null if no background
 */
export const OverlayPanel = ({
	videoUrl,
	style,
	enableOverlay,
	overlayColor,
	setAttributes,
}) => {
	// Only show when video or background image is present
	if (!videoUrl && !style?.background?.backgroundImage) {
		return null;
	}

	return (
		<PanelBody
			title={__('Background Overlay', 'designsetgo')}
			initialOpen={false}
		>
			<ToggleControl
				label={__('Enable Overlay', 'designsetgo')}
				checked={enableOverlay}
				onChange={(value) => setAttributes({ enableOverlay: value })}
				help={__(
					'Add a color overlay over the background for better text contrast',
					'designsetgo'
				)}
			/>

			{enableOverlay && (
				<>
					<PanelColorGradientSettings
						__experimentalIsRenderedInSidebar
						settings={[
							{
								colorValue: overlayColor,
								onColorChange: (value) =>
									setAttributes({
										overlayColor: value || 'rgba(0, 0, 0, 0.5)',
									}),
								label: __('Overlay Color', 'designsetgo'),
								enableAlpha: true,
							},
						]}
						panelId="overlay-color"
					/>
					<p
						className="components-base-control__help"
						style={{ marginTop: '10px' }}
					>
						{__(
							'Tip: Use the opacity slider to adjust how much of the background shows through.',
							'designsetgo'
						)}
					</p>
				</>
			)}
		</PanelBody>
	);
};
