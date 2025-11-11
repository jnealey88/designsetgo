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
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		mobileStack,
		layout,
	} = attributes;

	// Block wrapper props - outer div stays full width
	const blockProps = useBlockProps.save({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
		style: {
			...(hoverBackgroundColor && {
				'--dsg-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsg-hover-text-color': hoverTextColor,
			}),
			...(hoverIconBackgroundColor && {
				'--dsg-parent-hover-icon-bg': hoverIconBackgroundColor,
			}),
			...(hoverButtonBackgroundColor && {
				'--dsg-parent-hover-button-bg': hoverButtonBackgroundColor,
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
	const innerStyle = {
		display: 'flex',
		// Apply layout justifyContent to inner div where flex children are
		justifyContent: layout?.justifyContent || 'left',
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
		className: 'dsg-flex__inner',
		style: innerStyle,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
