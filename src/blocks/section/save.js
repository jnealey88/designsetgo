/**
 * Section Block - Save Component
 *
 * Saves the block content with minimal custom styles.
 * WordPress's layout system handles flex layout through CSS classes.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

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
	} = attributes;

	// Build className with conditional no-width-constraint and overlay classes
	const className = [
		'dsgo-stack',
		!constrainWidth && 'dsgo-no-width-constraint',
		overlayColor && 'dsgo-stack--has-overlay',
	]
		.filter(Boolean)
		.join(' ');

	// Block wrapper props - outer div stays full width
	const TagName = tagName || 'div';
	const blockProps = useBlockProps.save({
		className,
		style: {
			...(hoverBackgroundColor && {
				'--dsgo-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-hover-text-color': hoverTextColor,
			}),
			...(hoverIconBackgroundColor && {
				'--dsgo-parent-hover-icon-bg': hoverIconBackgroundColor,
			}),
			...(hoverButtonBackgroundColor && {
				'--dsgo-parent-hover-button-bg': hoverButtonBackgroundColor,
			}),
			...(overlayColor && {
				'--dsgo-overlay-color': overlayColor,
				'--dsgo-overlay-opacity': '0.8',
			}),
		},
	});

	// Extract padding from blockProps to apply to inner div instead
	// This ensures alignfull/alignwide work correctly without padding interfering with width calculations
	// WordPress spacing support applies padding to blockProps, but we need it on the inner div
	const paddingTop = blockProps.style?.paddingTop;
	const paddingRight = blockProps.style?.paddingRight;
	const paddingBottom = blockProps.style?.paddingBottom;
	const paddingLeft = blockProps.style?.paddingLeft;
	const padding = blockProps.style?.padding;

	// Remove padding from outer div - it should only be on inner div
	if (blockProps.style?.padding) {
		delete blockProps.style.padding;
	}
	if (blockProps.style?.paddingTop) {
		delete blockProps.style.paddingTop;
	}
	if (blockProps.style?.paddingRight) {
		delete blockProps.style.paddingRight;
	}
	if (blockProps.style?.paddingBottom) {
		delete blockProps.style.paddingBottom;
	}
	if (blockProps.style?.paddingLeft) {
		delete blockProps.style.paddingLeft;
	}

	// Inner container props with width constraints AND padding
	// Use custom contentWidth if set, otherwise fallback to theme's contentSize via CSS variable
	const innerStyle = {
		// Apply padding to inner div (extracted from blockProps)
		...(padding && { padding }),
		...(paddingTop && { paddingTop }),
		...(paddingRight && { paddingRight }),
		...(paddingBottom && { paddingBottom }),
		...(paddingLeft && { paddingLeft }),
	};
	if (constrainWidth) {
		innerStyle.maxWidth =
			contentWidth || 'var(--wp--style--global--content-size, 1140px)';
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	// Merge inner blocks props without the outer block props
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-stack__inner',
		style: innerStyle,
	});

	return (
		<TagName {...blockProps}>
			<div {...innerBlocksProps} />
		</TagName>
	);
}
