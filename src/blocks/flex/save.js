/**
 * DSG Row Block - Save Component
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
 * Flex Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function FlexSave({ attributes }) {
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

	// Extract gap BEFORE creating blockProps, so we can apply it to inner div instead
	// WordPress layout support stores gap in attributes.style.spacing.blockGap
	// Convert from WordPress preset format (var:preset|spacing|md) to CSS var (var(--wp--preset--spacing--md))
	const rawGapValue = attributes.style?.spacing?.blockGap;
	const gapValue = convertPresetToCSSVar(rawGapValue);

	// Block wrapper props - outer div stays full width
	// CRITICAL: Suppress gap on outer div by passing empty object, we'll apply it to inner div instead
	const blockProps = useBlockProps.save({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
		style: {
			// Suppress gap from being applied to outer div
			gap: undefined,
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
	if (constrainWidth) {
		innerStyle.maxWidth = contentWidth || '1200px';
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
