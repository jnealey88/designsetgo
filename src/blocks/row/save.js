/**
 * Row Block - Save Component
 *
 * Saves the block content with minimal custom styles.
 * WordPress's layout system handles flex layout through CSS classes.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Convert WordPress vertical alignment value to CSS align-items value
 * WordPress stores: stretch, center, top, bottom, space-between
 * CSS align-items needs: stretch, center, flex-start, flex-end, space-between
 *
 * @param {string} value The WordPress vertical alignment value
 * @return {string} CSS align-items value
 */
function getAlignItemsValue(value) {
	if (!value) {
		return undefined;
	}

	const alignMap = {
		stretch: 'stretch',
		center: 'center',
		top: 'flex-start',
		bottom: 'flex-end',
		'space-between': 'space-between',
	};

	return alignMap[value];
}

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
	// For flex layouts, use top value (row gap) as the primary gap
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
 * Row Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function RowSave({ attributes }) {
	const {
		tagName = 'div',
		constrainWidth,
		contentWidth,
		overlayColor,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		mobileStack,
		dsgoBlockStyleId,
		layout,
	} = attributes;

	// Build className with conditional classes
	const className = [
		'dsgo-flex',
		dsgoBlockStyleId,
		mobileStack && 'dsgo-flex--mobile-stack',
		!constrainWidth && 'dsgo-no-width-constraint',
		overlayColor && 'dsgo-flex--has-overlay',
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

	// Extract gap AFTER creating blockProps, so we can move it to inner div instead
	// WordPress layout support stores gap in attributes.style.spacing.blockGap
	// Convert from WordPress preset format (var:preset|spacing|md) to CSS var (var(--wp--preset--spacing--md))
	const rawGapValue = attributes.style?.spacing?.blockGap;
	const gapValue = convertPresetToCSSVar(rawGapValue);

	// Remove gap from outer div's inline styles - it should only be on inner div
	// This prevents WordPress from applying gap to the wrong element
	if (blockProps.style?.gap) {
		delete blockProps.style.gap;
	}

	// Inner container props with flex layout and width constraints
	// CRITICAL: Apply display: flex here, not via WordPress layout support on outer div
	// This ensures flex layout is applied to the element that contains the flex children
	const alignItems = getAlignItemsValue(layout?.verticalAlignment);
	const innerStyle = {
		display: 'flex',
		// Apply layout justifyContent to inner div where flex children are
		justifyContent: layout?.justifyContent || 'left',
		// Apply vertical alignment (align-items) from layout support
		...(alignItems && { alignItems }),
		// Apply flex-wrap from layout support
		flexWrap: layout?.flexWrap || 'wrap',
		// Apply gap from blockProps or attributes
		...(gapValue && { gap: gapValue }),
	};

	// Apply width constraints if enabled
	// Use custom contentWidth if set, otherwise fallback to theme's contentSize via CSS variable
	if (constrainWidth) {
		innerStyle.maxWidth =
			contentWidth || 'var(--wp--style--global--content-size, 1140px)';
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	// Merge inner blocks props
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-flex__inner',
		style: innerStyle,
	});

	return (
		<TagName {...blockProps}>
			<div {...innerBlocksProps} />
		</TagName>
	);
}
