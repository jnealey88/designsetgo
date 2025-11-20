/**
 * Gallery Settings Panel Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';

export default function GallerySettings({ attributes, setAttributes }) {
	const { galleryGroupId, galleryIndex, showGalleryNavigation, navigationStyle, navigationPosition } =
		attributes;

	const isGalleryEnabled = !!galleryGroupId;

	return (
		<PanelBody title={__('Gallery Navigation', 'designsetgo')} initialOpen={false}>
			<TextControl
				label={__('Gallery Group ID', 'designsetgo')}
				value={galleryGroupId}
				onChange={(value) => setAttributes({ galleryGroupId: value })}
				help={__(
					'Enter a group ID to link this modal with others (e.g., "product-gallery"). Leave empty to disable gallery navigation.',
					'designsetgo'
				)}
				placeholder="e.g., product-gallery"
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{isGalleryEnabled && (
				<>
					<RangeControl
						label={__('Gallery Index', 'designsetgo')}
						value={galleryIndex}
						onChange={(value) => setAttributes({ galleryIndex: value })}
						min={0}
						max={50}
						help={__(
							'Position of this modal in the gallery sequence (0-based).',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Show Navigation', 'designsetgo')}
						checked={showGalleryNavigation}
						onChange={(value) =>
							setAttributes({ showGalleryNavigation: value })
						}
						help={__(
							'Display previous/next navigation buttons.',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					{showGalleryNavigation && (
						<>
							<SelectControl
								label={__('Navigation Style', 'designsetgo')}
								value={navigationStyle}
								options={[
									{ label: __('Arrows', 'designsetgo'), value: 'arrows' },
									{ label: __('Chevrons', 'designsetgo'), value: 'chevrons' },
									{ label: __('Text', 'designsetgo'), value: 'text' },
								]}
								onChange={(value) =>
									setAttributes({ navigationStyle: value })
								}
								help={__(
									'Choose how navigation buttons appear.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label={__('Navigation Position', 'designsetgo')}
								value={navigationPosition}
								options={[
									{
										label: __('Sides', 'designsetgo'),
										value: 'sides',
									},
									{
										label: __('Bottom', 'designsetgo'),
										value: 'bottom',
									},
									{
										label: __('Top', 'designsetgo'),
										value: 'top',
									},
								]}
								onChange={(value) =>
									setAttributes({ navigationPosition: value })
								}
								help={__(
									'Position of navigation buttons.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}

					<p className="components-base-control__help">
						{__(
							'💡 Tip: Use keyboard arrows (← →) to navigate between modals in a gallery.',
							'designsetgo'
						)}
					</p>
				</>
			)}
		</PanelBody>
	);
}
