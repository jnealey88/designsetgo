/**
 * Blobs Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function BlobsSave({ attributes }) {
	const {
		blobShape,
		blobAnimation,
		animationDuration,
		animationEasing,
		size,
		height,
		enableOverlay,
		overlayColor,
		overlayOpacity,
	} = attributes;

	// Same classes as edit.js - MUST MATCH
	const blobClasses = classnames('dsgo-blobs', {
		[`dsgo-blobs--${blobShape}`]: blobShape,
		[`dsgo-blobs--${blobAnimation}`]:
			blobAnimation && blobAnimation !== 'none',
	});

	// Apply animation settings as CSS custom properties - MUST MATCH edit.js
	const customStyles = {
		'--dsgo-blob-size': size,
		...(height ? { '--dsgo-blob-height': height } : {}),
		'--dsgo-blob-animation-duration': animationDuration,
		'--dsgo-blob-animation-easing': animationEasing,
	};

	// Get block props with our wrapper class
	const blockProps = useBlockProps.save({
		className: 'dsgo-blobs-wrapper',
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-blobs__content',
	});

	return (
		<div {...blockProps}>
			<div
				className={blobClasses}
				style={customStyles}
				data-blob-animation={blobAnimation}
			>
				{enableOverlay && (
					<div
						className="dsgo-blobs__overlay"
						style={{
							backgroundColor: overlayColor,
							opacity: overlayOpacity / 100,
						}}
					/>
				)}
				<div className="dsgo-blobs__shape">
					<div {...innerBlocksProps} />
				</div>
			</div>
		</div>
	);
}
