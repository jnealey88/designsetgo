/**
 * Scroll Marquee Block - Deprecations
 *
 * v1: Original save that rendered images inside track segments.
 * The current save is identical, but this deprecation handles
 * validation mismatches when saved content has images but
 * re-serialized attributes produce empty segments (e.g. attribute
 * round-trip issues in WP 7.0).
 *
 * @package
 */

import { useBlockProps } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		rows: {
			type: 'array',
			default: [{ images: [], direction: 'left' }],
		},
		scrollSpeed: {
			type: 'number',
			default: 0.5,
		},
		imageHeight: {
			type: 'string',
			default: '200px',
		},
		imageWidth: {
			type: 'string',
			default: '300px',
		},
		gap: {
			type: 'string',
			default: '20px',
		},
		rowGap: {
			type: 'string',
			default: '20px',
		},
		borderRadius: {
			type: 'string',
			default: '8px',
		},
	},
	supports: {
		anchor: true,
		align: false,
		html: false,
		spacing: {
			margin: false,
			padding: false,
			blockGap: true,
		},
		color: {
			background: true,
			text: true,
			gradients: true,
		},
	},
	save({ attributes }) {
		const {
			rows,
			scrollSpeed,
			imageHeight,
			imageWidth,
			gap,
			rowGap,
			borderRadius,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: 'dsgo-scroll-marquee',
			'data-scroll-speed': scrollSpeed,
			style: {
				'--dsgo-marquee-gap': gap,
				'--dsgo-marquee-row-gap': rowGap,
				'--dsgo-marquee-image-height': imageHeight,
				'--dsgo-marquee-image-width': imageWidth,
				'--dsgo-marquee-border-radius': borderRadius,
			},
		});

		return (
			<div {...blockProps}>
				{rows.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className="dsgo-scroll-marquee__row"
						data-direction={row.direction}
					>
						<div className="dsgo-scroll-marquee__track">
							{[...Array(6)].map((_, repeatIndex) => (
								<div
									key={repeatIndex}
									className="dsgo-scroll-marquee__track-segment"
								>
									{row.images.map((image, imageIndex) => (
										<img
											key={`${repeatIndex}-${imageIndex}`}
											src={image.url}
											alt={image.alt || ''}
											className="dsgo-scroll-marquee__image"
											loading="lazy"
										/>
									))}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	},
};

export default [v1];
