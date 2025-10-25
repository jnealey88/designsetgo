/**
 * Container Block - Save Function
 *
 * WordPress Best Practice Approach:
 * - Uses useInnerBlocksProps.save() for proper inner blocks integration
 * - Declarative style application (matches edit.js exactly)
 * - Data attributes only for frontend JavaScript features (video, clickable)
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function ContainerSave({ attributes }) {
	const {
		layoutType,
		constrainWidth,
		contentWidth,
		gridColumns,
		gap,
		videoUrl,
		videoPoster,
		videoAutoplay,
		videoLoop,
		videoMuted,
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		enableOverlay,
		overlayColor,
		linkUrl,
		linkTarget,
		linkRel,
		textAlign,
	} = attributes;

	// ========================================
	// Calculate inner blocks styles declaratively
	// (MUST match edit.js for editor/frontend parity)
	// ========================================
	const innerStyles = {
		position: 'relative',
		zIndex: 2,
	};

	// Apply layout based on type
	if (layoutType === 'grid') {
		innerStyles.display = 'grid';
		innerStyles.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
		innerStyles.gap = gap;
	} else if (layoutType === 'flex') {
		innerStyles.display = 'flex';
		innerStyles.flexDirection = 'row';
		innerStyles.flexWrap = 'wrap';
		innerStyles.gap = gap;
	} else {
		// Stack (default)
		innerStyles.display = 'flex';
		innerStyles.flexDirection = 'column';
		innerStyles.gap = gap;
	}

	// Apply width constraint if enabled (works for ALL layouts)
	if (constrainWidth) {
		innerStyles.maxWidth = contentWidth;
		innerStyles.marginLeft = 'auto';
		innerStyles.marginRight = 'auto';
	}

	// ========================================
	// Block wrapper props
	// ========================================
	const blockProps = useBlockProps.save({
		className: classnames('dsg-container', {
			'has-video-background': videoUrl,
			'has-dsg-overlay': enableOverlay,
			'dsg-hide-desktop': hideOnDesktop,
			'dsg-hide-tablet': hideOnTablet,
			'dsg-hide-mobile': hideOnMobile,
			'is-clickable': linkUrl,
			[`has-text-align-${textAlign}`]: textAlign,
		}),
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
