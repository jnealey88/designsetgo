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
 * Convert WordPress preset format to CSS variable
 * Converts "var:preset|spacing|md" to "var(--wp--preset--spacing--md)"
 *
 * @param {string} value The preset value
 * @return {string} CSS variable format
 */
function convertPresetToCSSVar(value) {
	if (!value) {
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
		layout,
	} = attributes;

	// Build className with conditional classes
	const className = [
		'dsgo-flex',
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

	// Inner container props with flex layout, width constraints, AND padding
	// CRITICAL: Apply display: flex here, not via WordPress layout support on outer div
	// This ensures flex layout is applied to the element that contains the flex children
	const innerStyle = {
		display: 'flex',
		// Apply layout justifyContent to inner div where flex children are
		justifyContent: layout?.justifyContent || 'left',
		// Apply flex-wrap from layout support
		flexWrap: layout?.flexWrap || 'wrap',
		// Apply gap from blockProps or attributes
		...(gapValue && { gap: gapValue }),
		// Apply padding to inner div (extracted from blockProps)
		...(padding && { padding }),
		...(paddingTop && { paddingTop }),
		...(paddingRight && { paddingRight }),
		...(paddingBottom && { paddingBottom }),
		...(paddingLeft && { paddingLeft }),
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
