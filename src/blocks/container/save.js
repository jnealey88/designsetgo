/**
 * Container Block - Save Function
 *
 * WordPress Best Practice Approach:
 * - Uses useInnerBlocksProps.save() for proper inner blocks integration
 * - Declarative style application (matches edit.js exactly)
 * - Data attributes only for frontend JavaScript features (video, clickable)
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// Import style calculator utilities (must match edit.js for consistency)
import {
	calculateInnerStyles,
	calculateContainerClasses,
	calculateContainerStyles,
} from './utils/style-calculator';

export default function ContainerSave({ attributes }) {
	const {
		videoUrl,
		videoPoster,
		videoAutoplay,
		videoLoop,
		videoMuted,
		enableOverlay,
		overlayColor,
		linkUrl,
		linkTarget,
		linkRel,
	} = attributes;

	// ========================================
	// Calculate styles using utilities (MUST match edit.js for editor/frontend parity)
	// ========================================
	const innerStyles = calculateInnerStyles(attributes);
	const containerClasses = calculateContainerClasses(attributes);
	const containerStyles = calculateContainerStyles(attributes);

	// ========================================
	// Block wrapper props
	// IMPORTANT: useBlockProps.save() automatically handles attributes.style
	// We just need to pass our custom styles via the style prop
	// WordPress will merge them correctly
	// ========================================
	const blockProps = useBlockProps.save({
		className: containerClasses,
		style: containerStyles,
		// Data attributes ONLY for frontend JavaScript features
		...(videoUrl && {
			'data-video-url': videoUrl,
			...(videoPoster && { 'data-video-poster': videoPoster }),
			'data-video-autoplay': videoAutoplay ? 'true' : 'false',
			'data-video-loop': videoLoop ? 'true' : 'false',
			'data-video-muted': videoMuted ? 'true' : 'false',
		}),
		...(linkUrl && {
			'data-link-url': linkUrl,
			...(linkTarget && { 'data-link-target': linkTarget }),
			...(linkRel && { 'data-link-rel': linkRel }),
		}),
	});

	// ========================================
	// Inner blocks props (WordPress best practice)
	// ========================================
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-container__inner',
		style: innerStyles,
	});

	return (
		<div {...blockProps}>
			{/* Overlay */}
			{enableOverlay && (
				<div
					className="dsg-overlay"
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: overlayColor || 'rgba(0, 0, 0, 0.5)',
						zIndex: 1,
						pointerEvents: 'none',
					}}
				/>
			)}

			{/* Inner Blocks - WordPress best practice: NO wrapper div, spread props directly */}
			<div {...innerBlocksProps} />
		</div>
	);
}
