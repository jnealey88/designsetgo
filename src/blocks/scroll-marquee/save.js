import { useBlockProps } from '@wordpress/block-editor';

export default function ScrollMarqueeSave({ attributes }) {
	const { rows, scrollSpeed, imageHeight, imageWidth, gap, rowGap, borderRadius } = attributes;

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
							<div key={repeatIndex} className="dsg-scroll-marquee__track-segment">
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
}
