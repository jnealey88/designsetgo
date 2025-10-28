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
		layoutType,
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
	// Note: We can't detect parent context in save function, but flexItemWidth
	// will only take effect if parent is actually a flex container.
	// ========================================
	const innerStyles = calculateInnerStyles(attributes);
	const containerClasses = calculateContainerClasses(attributes);
	// Pass true for hasParentFlex to always apply flexItemWidth if set
	// The browser will use it only when parent is actually flex
	const containerStyles = calculateContainerStyles(attributes, true);

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
	// Remove WordPress's layout classes ONLY for flex/grid layouts
	// For stack layout (default), keep .is-layout-constrained so WordPress's
	// margin rules work correctly (matching Group block behavior)
	// ========================================
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-container__inner',
		style: innerStyles,
	});

	const shouldRemoveLayoutClasses = layoutType === 'flex' || layoutType === 'grid';

	const cleanedClassName = (innerBlocksProps.className || '')
		.split(' ')
		.filter(
			(cls) => {
				// Always remove WordPress container classes (wp-block-, wp-container-)
				if (cls.includes('wp-block-') || cls.includes('wp-container-')) {
					return false;
				}

				// Remove layout classes ONLY for flex/grid layouts
				// Keep them for stack layout (is-layout-constrained needed for margins)
				if (shouldRemoveLayoutClasses) {
					return !cls.includes('is-layout-') && !cls.includes('has-global-padding');
				}

				// For stack layout, keep all WordPress layout classes
				return true;
			}
		)
		.join(' ');

	const finalInnerBlocksProps = {
		...innerBlocksProps,
		className: cleanedClassName,
	};

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
			<div {...finalInnerBlocksProps} />
		</div>
	);
}
