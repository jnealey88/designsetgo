import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function SlideSave({ attributes }) {
	const {
		backgroundImage,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		enableOverlay,
		overlayColor,
		overlayOpacity,
		contentVerticalAlign,
		contentHorizontalAlign,
		minHeight,
	} = attributes;

	// Same classes as edit.js - MUST MATCH EXACTLY
	const slideClasses = classnames('dsg-slide', {
		'dsg-slide--has-background': backgroundImage?.url,
		'dsg-slide--has-overlay': enableOverlay,
	});

	// Background image styles - MUST MATCH edit.js
	const backgroundStyles = backgroundImage?.url
		? {
				backgroundImage: `url(${backgroundImage.url})`,
				backgroundSize,
				backgroundPosition,
				backgroundRepeat,
			}
		: {};

	// Overlay styles
	const overlayStyles = enableOverlay
		? {
				'--dsg-slide-overlay-color': overlayColor,
				'--dsg-slide-overlay-opacity': String(overlayOpacity / 100),
			}
		: {};

	// Content alignment styles
	const alignmentStyles = {
		'--dsg-slide-content-vertical-align': contentVerticalAlign,
		'--dsg-slide-content-horizontal-align': contentHorizontalAlign,
	};

	// Min height override
	const heightStyles = minHeight ? { minHeight } : {};

	// Use .save() variant for save function
	const blockProps = useBlockProps.save({
		className: slideClasses,
		style: {
			...backgroundStyles,
			...overlayStyles,
			...alignmentStyles,
			...heightStyles,
		},
		role: 'group',
		'aria-roledescription': 'slide',
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-slide__content',
	});

	return (
		<div {...blockProps}>
			{enableOverlay && (
				<div
					className="dsg-slide__overlay"
					style={{
						backgroundColor: overlayColor,
						opacity: overlayOpacity / 100,
					}}
				/>
			)}
			<div {...innerBlocksProps} />
		</div>
	);
}
