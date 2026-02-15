/**
 * Fifty Fifty Block - Save Component
 *
 * Saves full-width 50/50 split with edge-to-edge media and constrained content.
 *
 * @since 1.5.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

/**
 * Validates image URL to prevent XSS attacks.
 *
 * @param {string} url URL to validate
 * @return {boolean} True if URL is safe
 */
const isValidImageUrl = (url) => {
	if (!url || typeof url !== 'string') {
		return false;
	}
	return /^(https?:\/\/|data:image\/)/.test(url);
};

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

	const blockClassName = [
		'dsgo-fifty-fifty',
		`dsgo-fifty-fifty--media-${mediaPosition}`,
	].join(' ');

	const blockProps = useBlockProps.save({
		className: blockClassName,
		style: {
			'--dsgo-fifty-fifty-min-height': minHeight || undefined,
			'--dsgo-fifty-fifty-align-items':
				alignItemsMap[verticalAlignment] || 'center',
			'--dsgo-fifty-fifty-content-padding':
				convertPresetToCSSVar(contentPadding) || undefined,
		},
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-fifty-fifty__content-inner',
	});

	// Focal point as object-position
	const objectPosition = focalPoint
		? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
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
