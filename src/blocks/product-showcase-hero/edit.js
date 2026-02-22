/**
 * Product Showcase Hero Block - Edit Component
 *
 * Full-width hero section showcasing a WooCommerce product.
 *
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Placeholder,
	SelectControl,
	ToggleControl,
	FocalPointPicker,
	Button,
	ToolbarButton,
	ToolbarGroup,
	Spinner,
	Notice,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

import ProductPicker from './components/ProductPicker';
import ProductPreview from './components/ProductPreview';

/**
 * Product Showcase Hero Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @return {JSX.Element} Edit component
 */
export default function ProductShowcaseHeroEdit({
	attributes,
	setAttributes,
}) {
	const {
		productId,
		layout,
		imageSize,
		showPrice,
		showRating,
		showStockStatus,
		showSaleBadge,
		showShortDescription,
		showAddToCart,
		showVariations,
		minHeight,
		mediaFocalPoint,
		contentVerticalAlignment,
	} = attributes;

	const [productData, setProductData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [wcAvailable, setWcAvailable] = useState(true);

	const units = useCustomUnits({
		availableUnits: ['px', 'vh', 'vw', 'em', 'rem'],
	});

	// Check WooCommerce Store API availability on mount.
	useEffect(() => {
		apiFetch({ path: '/wc/store/v1/products?per_page=1' })
			.catch(() => setWcAvailable(false));
	}, []);

	// Fetch product data when productId changes.
	useEffect(() => {
		if (!productId) {
			setProductData(null);
			return;
		}

		setIsLoading(true);
		setError(null);

		apiFetch({ path: `/wc/store/v1/products/${productId}` })
			.then((data) => setProductData(data))
			.catch(() => {
				setError(
					__('Product not found or unavailable.', 'designsetgo')
				);
				setProductData(null);
			})
			.finally(() => setIsLoading(false));
	}, [productId]);

	const blockProps = useBlockProps({
		className: 'dsgo-product-showcase-hero-wrapper',
	});

	// WooCommerce not available.
	if (!wcAvailable) {
		return (
			<div {...blockProps}>
				<Placeholder
					icon="cart"
					label={__('Product Showcase Hero', 'designsetgo')}
				>
					<p>
						{__(
							'This block requires WooCommerce to be installed and active.',
							'designsetgo'
						)}
					</p>
				</Placeholder>
			</div>
		);
	}

	// No product selected — show picker.
	if (!productId) {
		return (
			<div {...blockProps}>
				<Placeholder
					icon="cart"
					label={__('Product Showcase Hero', 'designsetgo')}
					instructions={__(
						'Search for a WooCommerce product to showcase.',
						'designsetgo'
					)}
				>
					<ProductPicker
						onSelect={(id) => setAttributes({ productId: id })}
					/>
				</Placeholder>
			</div>
		);
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="image-flip-horizontal"
						label={__('Flip Layout', 'designsetgo')}
						onClick={() =>
							setAttributes({
								layout:
									layout === 'media-left'
										? 'media-right'
										: 'media-left',
							})
						}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						icon="update"
						label={__('Replace Product', 'designsetgo')}
						onClick={() => setAttributes({ productId: 0 })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody
					title={__('Product', 'designsetgo')}
					initialOpen={true}
				>
					{productData && (
						<>
							<p>
								<strong>
									{productData.name}
								</strong>
							</p>
							<Button
								variant="secondary"
								onClick={() =>
									setAttributes({ productId: 0 })
								}
								__next40pxDefaultSize
							>
								{__('Replace Product', 'designsetgo')}
							</Button>
						</>
					)}
				</PanelBody>

				<PanelBody
					title={__('Display Options', 'designsetgo')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Show Price', 'designsetgo')}
						checked={showPrice}
						onChange={(value) =>
							setAttributes({ showPrice: value })
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Show Rating', 'designsetgo')}
						checked={showRating}
						onChange={(value) =>
							setAttributes({ showRating: value })
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Show Stock Status', 'designsetgo')}
						checked={showStockStatus}
						onChange={(value) =>
							setAttributes({ showStockStatus: value })
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Show Sale Badge', 'designsetgo')}
						checked={showSaleBadge}
						onChange={(value) =>
							setAttributes({ showSaleBadge: value })
						}
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
						onChange={(value) =>
							setAttributes({ showAddToCart: value })
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Show Variations', 'designsetgo')}
						checked={showVariations}
						onChange={(value) =>
							setAttributes({ showVariations: value })
						}
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
						onChange={(value) =>
							setAttributes({ imageSize: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Layout', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Media Position', 'designsetgo')}
						value={layout}
						options={[
							{
								label: __('Left', 'designsetgo'),
								value: 'media-left',
							},
							{
								label: __('Right', 'designsetgo'),
								value: 'media-right',
							},
						]}
						onChange={(value) =>
							setAttributes({ layout: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__(
							'Content Vertical Alignment',
							'designsetgo'
						)}
						value={contentVerticalAlignment}
						options={[
							{
								label: __('Top', 'designsetgo'),
								value: 'top',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Bottom', 'designsetgo'),
								value: 'bottom',
							},
						]}
						onChange={(value) =>
							setAttributes({
								contentVerticalAlignment: value,
							})
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<UnitControl
						label={__('Min Height', 'designsetgo')}
						value={minHeight}
						onChange={(value) =>
							setAttributes({ minHeight: value })
						}
						units={units}
						__next40pxDefaultSize
					/>
					{productData?.images?.[0]?.src && (
						<FocalPointPicker
							label={__('Focal Point', 'designsetgo')}
							url={productData.images[0].src}
							value={mediaFocalPoint}
							onChange={(value) =>
								setAttributes({ mediaFocalPoint: value })
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{isLoading && (
					<Placeholder
						icon="cart"
						label={__('Product Showcase Hero', 'designsetgo')}
					>
						<Spinner />
					</Placeholder>
				)}

				{error && (
					<Placeholder
						icon="cart"
						label={__('Product Showcase Hero', 'designsetgo')}
					>
						<Notice status="error" isDismissible={false}>
							{error}
						</Notice>
						<Button
							variant="secondary"
							onClick={() => setAttributes({ productId: 0 })}
							__next40pxDefaultSize
						>
							{__('Select Another Product', 'designsetgo')}
						</Button>
					</Placeholder>
				)}

				{!isLoading && !error && productData && (
					<ProductPreview
						productData={productData}
						attributes={attributes}
					/>
				)}
			</div>
		</>
	);
}
