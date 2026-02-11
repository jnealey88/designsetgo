import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

export default function SlideSave({ attributes }) {
	const {
		backgroundImage,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		overlayColor,
		overlayOpacity,
		contentVerticalAlign,
		contentHorizontalAlign,
		minHeight,
	} = attributes;

	// Same classes as edit.js - MUST MATCH EXACTLY
	const slideClasses = classnames('dsgo-slide', {
		'dsgo-slide--has-background': backgroundImage?.url,
		'dsgo-slide--has-overlay': overlayColor, // Show overlay if color is set
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

	// Overlay styles - only apply if overlayColor is set
	const overlayStyles = overlayColor
		? {
				'--dsgo-slide-overlay-color':
					convertPresetToCSSVar(overlayColor),
				'--dsgo-slide-overlay-opacity': String(overlayOpacity / 100),
			}
		: {};

	// Content alignment styles
	const alignmentStyles = {
		'--dsgo-slide-content-vertical-align': contentVerticalAlign,
		'--dsgo-slide-content-horizontal-align': contentHorizontalAlign,
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
		className: 'dsgo-slide__content',
	});

	return (
		<div {...blockProps}>
			{overlayColor && (
				<div
					className="dsgo-slide__overlay"
					style={{
						backgroundColor: convertPresetToCSSVar(overlayColor),
						opacity: overlayOpacity / 100,
					}}
				/>
			)}
			<div {...innerBlocksProps} />
		</div>
	);
}
