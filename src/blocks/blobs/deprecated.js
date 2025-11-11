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

// Version 2: With wrapper but without align attribute
const v2 = {
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
			default: '',
		},
		overlayOpacity: {
			type: 'number',
			default: 80,
		},
	},
	save({ attributes }) {
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
	},
	migrate(oldAttributes) {
		// Migrate to new version with align attribute
		return {
			...oldAttributes,
			align: undefined, // WordPress will use default from supports
		};
	},
};

export default [v2, v1];
