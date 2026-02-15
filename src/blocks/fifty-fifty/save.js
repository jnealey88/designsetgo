/**
 * Fifty Fifty Block - Save Component
 *
 * Saves full-width 50/50 split with edge-to-edge media and constrained content.
 *
 * @since 1.5.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';
import { isValidImageUrl } from '../../utils/is-valid-image-url';

/**
 * Fifty Fifty Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function FiftyFiftySave({ attributes }) {
	const {
		mediaPosition,
		mediaUrl,
		mediaAlt,
		focalPoint,
		minHeight,
		verticalAlignment,
		contentPadding,
	} = attributes;

	// Map verticalAlignment to CSS
	const alignItemsMap = {
		top: 'flex-start',
		center: 'center',
		bottom: 'flex-end',
	};

	// Validate mediaPosition to prevent class name injection
	const safeMediaPosition = mediaPosition === 'right' ? 'right' : 'left';

	const blockClassName = [
		'dsgo-fifty-fifty',
		`dsgo-fifty-fifty--media-${safeMediaPosition}`,
	].join(' ');

	// Sanitize minHeight: only allow valid CSS length values
	const safeMinHeight =
		minHeight && /^[\d.]+(px|vh|vw|em|rem|%)$/.test(minHeight)
			? minHeight
			: undefined;

	const blockProps = useBlockProps.save({
		className: blockClassName,
		style: {
			'--dsgo-fifty-fifty-min-height': safeMinHeight,
			'--dsgo-fifty-fifty-content-justify':
				alignItemsMap[verticalAlignment] || 'center',
			'--dsgo-fifty-fifty-content-padding':
				convertPresetToCSSVar(contentPadding) || undefined,
		},
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-fifty-fifty__content-inner',
	});

	// Focal point as object-position (coerce to Number to prevent CSS injection)
	const objectPosition = focalPoint
		? `${Number(focalPoint.x) * 100}% ${Number(focalPoint.y) * 100}%`
		: undefined;

	return (
		<div {...blockProps}>
			<div className="dsgo-fifty-fifty__media">
				{mediaUrl && isValidImageUrl(mediaUrl) && (
					<img
						src={mediaUrl}
						alt={mediaAlt || ''}
						style={objectPosition ? { objectPosition } : undefined}
						loading="lazy"
						{...(!mediaAlt ? { 'aria-hidden': 'true' } : {})}
					/>
				)}
			</div>

			<div className="dsgo-fifty-fifty__content">
				<div {...innerBlocksProps} />
			</div>
		</div>
	);
}
