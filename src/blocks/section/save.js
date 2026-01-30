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

	// Inner container props with width constraints
	// Use custom contentWidth if set, otherwise fallback to theme's contentSize via CSS variable
	const innerStyle = {};
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
