/**
 * Section Block - Save Component
 *
 * Saves the block content with minimal custom styles.
 * WordPress's layout system handles flex layout through CSS classes.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';
import ShapeDivider from './components/ShapeDivider';

/**
 * Section Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function SectionSave({ attributes }) {
	const {
		tagName = 'div',
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		overlayColor,
		// Shape divider attributes
		shapeDividerTop,
		shapeDividerTopColor,
		shapeDividerTopBackgroundColor,
		shapeDividerTopHeight,
		shapeDividerTopWidth,
		shapeDividerTopFlipX,
		shapeDividerTopFlipY,
		shapeDividerTopFront,
		shapeDividerBottom,
		shapeDividerBottomColor,
		shapeDividerBottomBackgroundColor,
		shapeDividerBottomHeight,
		shapeDividerBottomWidth,
		shapeDividerBottomFlipX,
		shapeDividerBottomFlipY,
		shapeDividerBottomFront,
	} = attributes;

	// Build className with conditional no-width-constraint and overlay classes
	const className = [
		'dsgo-stack',
		!constrainWidth && 'dsgo-no-width-constraint',
		overlayColor && 'dsgo-stack--has-overlay',
		(shapeDividerTop || shapeDividerBottom) &&
			'dsgo-stack--has-shape-divider',
	]
		.filter(Boolean)
		.join(' ');

	// Block wrapper props - outer div stays full width
	const TagName = tagName || 'div';
	const blockProps = useBlockProps.save({
		className,
		style: {
			...(hoverBackgroundColor && {
				'--dsgo-hover-bg-color':
					convertPresetToCSSVar(hoverBackgroundColor),
			}),
			...(hoverTextColor && {
				'--dsgo-hover-text-color':
					convertPresetToCSSVar(hoverTextColor),
			}),
			...(hoverIconBackgroundColor && {
				'--dsgo-parent-hover-icon-bg': convertPresetToCSSVar(
					hoverIconBackgroundColor
				),
			}),
			...(hoverButtonBackgroundColor && {
				'--dsgo-parent-hover-button-bg': convertPresetToCSSVar(
					hoverButtonBackgroundColor
				),
			}),
			...(overlayColor && {
				'--dsgo-overlay-color': convertPresetToCSSVar(overlayColor),
				'--dsgo-overlay-opacity': '0.8',
			}),
		},
	});

	// Inner container props with width constraints
	// Use custom contentWidth if set, otherwise fallback to theme's contentSize via CSS variable
	const innerStyle = {};
	if (constrainWidth) {
		innerStyle.maxWidth =
			contentWidth || 'var(--wp--style--global--content-size, 1140px)';
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	// Add padding to clear shape dividers (must match edit.js EXACTLY)
	if (shapeDividerTop) {
		innerStyle.paddingTop = `${shapeDividerTopHeight || 100}px`;
	}
	if (shapeDividerBottom) {
		innerStyle.paddingBottom = `${shapeDividerBottomHeight || 100}px`;
	}

	// Merge inner blocks props without the outer block props
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-stack__inner',
		style: innerStyle,
	});

	return (
		<TagName {...blockProps}>
			<ShapeDivider
				shape={shapeDividerTop}
				color={convertPresetToCSSVar(shapeDividerTopColor)}
				backgroundColor={convertPresetToCSSVar(
					shapeDividerTopBackgroundColor
				)}
				height={shapeDividerTopHeight}
				width={shapeDividerTopWidth}
				flipX={shapeDividerTopFlipX}
				flipY={shapeDividerTopFlipY}
				front={shapeDividerTopFront}
				position="top"
			/>
			<div {...innerBlocksProps} />
			<ShapeDivider
				shape={shapeDividerBottom}
				color={convertPresetToCSSVar(shapeDividerBottomColor)}
				backgroundColor={convertPresetToCSSVar(
					shapeDividerBottomBackgroundColor
				)}
				height={shapeDividerBottomHeight}
				width={shapeDividerBottomWidth}
				flipX={shapeDividerBottomFlipX}
				flipY={shapeDividerBottomFlipY}
				front={shapeDividerBottomFront}
				position="bottom"
			/>
		</TagName>
	);
}
