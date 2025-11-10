import { useBlockProps } from '@wordpress/block-editor';

/**
 * Scroll Marquee Block Deprecations
 *
 * Handles old saved formats to prevent "unexpected content" errors.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/
 */

/**
 * v1: Original version - accepts any variation in image count
 * This deprecation doesn't try to migrate, just accepts the old format
 */
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
	save: ({ attributes }) => {
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
			className: 'dsg-scroll-marquee',
			'data-scroll-speed': scrollSpeed,
			style: {
				'--dsg-marquee-gap': gap,
				'--dsg-marquee-row-gap': rowGap,
				'--dsg-marquee-image-height': imageHeight,
				'--dsg-marquee-image-width': imageWidth,
				'--dsg-marquee-border-radius': borderRadius,
			},
		});

		return (
			<div {...blockProps}>
				{rows.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className="dsg-scroll-marquee__row"
						data-direction={row.direction}
					>
						<div className="dsg-scroll-marquee__track">
							{/* Render images 6 times for seamless infinite scroll */}
							{[...Array(6)].map((_, repeatIndex) => (
								<div
									key={repeatIndex}
									className="dsg-scroll-marquee__track-segment"
								>
									{row.images.map((image, imageIndex) => (
										<img
											key={`${repeatIndex}-${imageIndex}`}
											src={image.url}
											alt={image.alt || ''}
											className="dsg-scroll-marquee__image"
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
