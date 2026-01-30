/**
 * DSG Grid Block - Save Component
 *
 * Saves the block content with declarative styles.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Grid Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function GridSave({ attributes }) {
	const {
		tagName = 'div',
		constrainWidth,
		contentWidth,
		desktopColumns,
		tabletColumns,
		mobileColumns,
		rowGap,
		columnGap,
		alignItems,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		style,
	} = attributes;

	// Build className with conditional classes
	const className = [
		'dsgo-grid',
		`dsgo-grid-cols-${desktopColumns}`,
		`dsgo-grid-cols-tablet-${tabletColumns}`,
		`dsgo-grid-cols-mobile-${mobileColumns}`,
		!constrainWidth && 'dsgo-no-width-constraint',
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

	// Calculate inner styles declaratively with padding (must match edit.js EXACTLY)
	// IMPORTANT: Always provide a default gap to prevent overlapping items
	// Priority: blockGap (WordPress spacing) → custom rowGap/columnGap → preset fallback
	const blockGap = style?.spacing?.blockGap;
	const defaultGap = 'var(--wp--preset--spacing--50)';

	const innerStyles = {
		display: 'grid',
		gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
		alignItems: alignItems || 'start',
		rowGap: blockGap || rowGap || defaultGap,
		columnGap: blockGap || columnGap || defaultGap,
		// Apply padding to inner div (extracted from blockProps)
		...(padding && { padding }),
		...(paddingTop && { paddingTop }),
		...(paddingRight && { paddingRight }),
		...(paddingBottom && { paddingBottom }),
		...(paddingLeft && { paddingLeft }),
	};

	// Apply width constraints to inner container
	// Use custom contentWidth if set, otherwise fallback to theme's contentSize via CSS variable
	if (constrainWidth) {
		innerStyles.maxWidth =
			contentWidth || 'var(--wp--style--global--content-size, 1140px)';
		innerStyles.marginLeft = 'auto';
		innerStyles.marginRight = 'auto';
	}

	// Merge inner blocks props
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-grid__inner',
		style: innerStyles,
	});

	return (
		<TagName {...blockProps}>
			<div {...innerBlocksProps} />
		</TagName>
	);
}
