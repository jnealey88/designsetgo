/**
 * DSG Grid Block - Save Component
 *
 * Saves the block content with declarative styles.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Convert WordPress preset format to CSS variable
 * Converts "var:preset|spacing|md" to "var(--wp--preset--spacing--md)"
 * Also handles WordPress 6.1+ object format {top, left} for separate row/column gaps
 *
 * @param {string|Object} value The preset value or gap object
 * @return {string|undefined} CSS variable format or undefined if no valid value
 */
function convertPresetToCSSVar(value) {
	if (!value) {
		return value;
	}

	// Handle object format (WordPress 6.1+ for separate row/column gaps)
	if (typeof value === 'object') {
		value = value.top || value.left;
		if (!value) {
			return undefined;
		}
	}

	// Ensure value is a string before using string methods
	if (typeof value !== 'string') {
		return value;
	}

	// If it's already a CSS variable, return as-is
	if (value.startsWith('var(--')) {
		return value;
	}

	// Convert WordPress preset format: var:preset|spacing|md -> var(--wp--preset--spacing--md)
	if (value.startsWith('var:preset|')) {
		const parts = value.replace('var:preset|', '').split('|');
		return `var(--wp--preset--${parts.join('--')})`;
	}

	return value;
}

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

	// Calculate inner styles declaratively (must match edit.js EXACTLY)
	// IMPORTANT: Always provide a default gap to prevent overlapping items
	// Priority: blockGap (WordPress spacing) → custom rowGap/columnGap → preset fallback
	// WordPress 6.1+ stores blockGap as object {top, left} for separate row/column gaps
	// Also need to convert preset format (var:preset|spacing|X) to CSS variable
	const blockGapValue = style?.spacing?.blockGap;
	const isBlockGapObject =
		typeof blockGapValue === 'object' && blockGapValue !== null;
	const blockGapRow = convertPresetToCSSVar(
		isBlockGapObject ? blockGapValue?.top : blockGapValue
	);
	const blockGapColumn = convertPresetToCSSVar(
		isBlockGapObject ? blockGapValue?.left : blockGapValue
	);
	const defaultGap = 'var(--wp--preset--spacing--50)';

	const innerStyles = {
		display: 'grid',
		gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
		alignItems: alignItems || 'stretch',
		rowGap: blockGapRow || rowGap || defaultGap,
		columnGap: blockGapColumn || columnGap || defaultGap,
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
