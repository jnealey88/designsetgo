/**
 * Grid Preview Component
 *
 * Editor preview of the product categories grid layout.
 * Mirrors the frontend BEM structure from render.php so the
 * editor preview matches the final frontend output.
 *
 * @since 2.1.0
 */

import { __, sprintf, _n } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Placeholder SVG icon shown when a category has no image.
 * A simple 2x2 grid icon using currentColor strokes.
 *
 * @return {JSX.Element} SVG element
 */
function PlaceholderIcon() {
	return (
		<span className="dsgo-product-categories-grid__placeholder-icon">
			<svg
				className="dsgo-product-categories-grid__placeholder-svg"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				focusable="false"
			>
				<rect x="3" y="3" width="8" height="8" rx="1" />
				<rect x="13" y="3" width="8" height="8" rx="1" />
				<rect x="3" y="13" width="8" height="8" rx="1" />
				<rect x="13" y="13" width="8" height="8" rx="1" />
			</svg>
		</span>
	);
}

/**
 * Grid Preview Component
 *
 * @param {Object}   props              Component props
 * @param {Array}    props.categories   Array of category objects from WC Store API
 * @param {Object}   props.attributes   Block attributes
 * @param {Array}    props.featuredIds  Array of category IDs that are featured (manual mode)
 * @return {JSX.Element} Grid preview
 */
export default function GridPreview({ categories, attributes, featuredIds }) {
	const { columns, showProductCount, imageAspectRatio } = attributes;

	const gridClass = `dsgo-product-categories-grid dsgo-product-categories-grid--cols-${columns}`;

	const gridStyle = {
		'--dsgo-pcg-aspect-ratio': imageAspectRatio,
	};

	const hasMissingImages = categories.some(
		(category) => !category.image?.src
	);

	return (
		<>
			<div className={gridClass} style={gridStyle}>
				{categories.map((category) => {
					const isFeatured = featuredIds.includes(category.id);
					const cardClass = [
						'dsgo-product-categories-grid__card',
						isFeatured
							? 'dsgo-product-categories-grid__card--featured'
							: '',
					]
						.filter(Boolean)
						.join(' ');

					const count = category.count || 0;
					const countText = sprintf(
						/* translators: %d: number of products in category */
						_n(
							'%d product',
							'%d products',
							count,
							'designsetgo'
						),
						count
					);

					return (
						<div
							key={category.id}
							className={cardClass}
							role="img"
							aria-label={decodeEntities(category.name)}
						>
							<div className="dsgo-product-categories-grid__image-wrapper">
								{category.image?.src ? (
									<img
										className="dsgo-product-categories-grid__image"
										src={category.image.src}
										alt=""
									/>
								) : (
									<PlaceholderIcon />
								)}
							</div>

							<div className="dsgo-product-categories-grid__info">
								<h3 className="dsgo-product-categories-grid__name">
									{decodeEntities(category.name)}
								</h3>

								{showProductCount && (
									<span className="dsgo-product-categories-grid__count">
										{countText}
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{hasMissingImages && (
				<p className="dsgo-product-categories-grid__editor-notice">
					{__(
						'Add images to your categories for best results',
						'designsetgo'
					)}
				</p>
			)}
		</>
	);
}
