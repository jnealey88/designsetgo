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
		enableOverlay,
		overlayColor,
		overlayOpacity,
	} = attributes;

	// Same classes as edit.js - MUST MATCH
	const blobClasses = classnames('dsg-blobs', {
		[`dsg-blobs--${blobShape}`]: blobShape,
		[`dsg-blobs--${blobAnimation}`]:
			blobAnimation && blobAnimation !== 'none',
	});

	// Apply animation settings as CSS custom properties - MUST MATCH edit.js
	const customStyles = {
		'--dsg-blob-size': size,
		'--dsg-blob-animation-duration': animationDuration,
		'--dsg-blob-animation-easing': animationEasing,
	};

	// Get block props with our wrapper class
	const blockProps = useBlockProps.save({
		className: 'dsg-blobs-wrapper',
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-blobs__content',
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
						className="dsg-blobs__overlay"
						style={{
							backgroundColor: overlayColor,
							opacity: overlayOpacity / 100,
						}}
					/>
				)}
				<div className="dsg-blobs__shape">
					<div {...innerBlocksProps} />
				</div>
			</div>
		</div>
	);
}
