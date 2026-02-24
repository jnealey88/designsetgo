/**
 * Display Options Inspector Panel
 *
 * Controls for toggling product element visibility and image size.
 *
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

/**
 * Display Options Panel Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @return {JSX.Element} Display options panel
 */
export default function DisplayOptionsPanel({ attributes, setAttributes }) {
	const {
		showPrice,
		showRating,
		showStockStatus,
		showSaleBadge,
		showShortDescription,
		showAddToCart,
		showVariations,
		imageSize,
	} = attributes;

	return (
		<PanelBody
			title={__('Display Options', 'designsetgo')}
			initialOpen={true}
		>
			<ToggleControl
				label={__('Show Price', 'designsetgo')}
				checked={showPrice}
				onChange={(value) => setAttributes({ showPrice: value })}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Show Rating', 'designsetgo')}
				checked={showRating}
				onChange={(value) => setAttributes({ showRating: value })}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Show Stock Status', 'designsetgo')}
				checked={showStockStatus}
				onChange={(value) => setAttributes({ showStockStatus: value })}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Show Sale Badge', 'designsetgo')}
				checked={showSaleBadge}
				onChange={(value) => setAttributes({ showSaleBadge: value })}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Show Short Description', 'designsetgo')}
				checked={showShortDescription}
				onChange={(value) =>
					setAttributes({ showShortDescription: value })
				}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Show Add to Cart', 'designsetgo')}
				checked={showAddToCart}
				onChange={(value) => setAttributes({ showAddToCart: value })}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Show Variations', 'designsetgo')}
				checked={showVariations}
				onChange={(value) => setAttributes({ showVariations: value })}
				__nextHasNoMarginBottom
			/>
			<SelectControl
				label={__('Image Size', 'designsetgo')}
				value={imageSize}
				options={[
					{
						label: __('Medium', 'designsetgo'),
						value: 'medium',
					},
					{
						label: __('Large', 'designsetgo'),
						value: 'large',
					},
					{
						label: __('Full', 'designsetgo'),
						value: 'full',
					},
				]}
				onChange={(value) => setAttributes({ imageSize: value })}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}
