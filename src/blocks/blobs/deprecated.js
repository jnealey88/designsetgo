/**
 * Blobs Block - Deprecated Versions
 *
 * Handles backwards compatibility for old blob block markup
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

// Version 1: Original structure without wrapper
const v1 = {
	attributes: {
		blobShape: {
			type: 'string',
			default: 'shape-1',
		},
		blobAnimation: {
			type: 'string',
			default: 'none',
		},
		animationDuration: {
			type: 'string',
			default: '8s',
		},
		animationEasing: {
			type: 'string',
			default: 'ease-in-out',
		},
		size: {
			type: 'string',
			default: '300px',
		},
		enableOverlay: {
			type: 'boolean',
			default: false,
		},
		overlayColor: {
			type: 'string',
			default: '#000000',
		},
		overlayOpacity: {
			type: 'number',
			default: 50,
		},
	},
	save: ({ attributes }) => {
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

		const blobClasses = classnames('dsg-blobs', {
			[`dsg-blobs--${blobShape}`]: blobShape,
			[`dsg-blobs--${blobAnimation}`]:
				blobAnimation && blobAnimation !== 'none',
		});

		const customStyles = {
			'--dsg-blob-size': size,
			'--dsg-blob-animation-duration': animationDuration,
			'--dsg-blob-animation-easing': animationEasing,
		};

		const blockProps = useBlockProps.save({
			className: blobClasses,
			style: customStyles,
			'data-blob-animation': blobAnimation,
		});

		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsg-blobs__content',
		});

		return (
			<div {...blockProps}>
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
		);
	},
};

export default [v1];
