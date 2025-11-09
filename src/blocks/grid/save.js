/**
 * Grid Container Block - Save Component
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
		desktopColumns,
		tabletColumns,
		mobileColumns,
		rowGap,
		columnGap,
		alignItems,
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
	} = attributes;

	// Calculate effective content width (must match edit.js logic for frontend)
	// Note: Can't use useSetting in save, so use contentWidth or fallback
	const effectiveContentWidth = contentWidth || '1200px';

	// Calculate inner styles declaratively (must match edit.js EXACTLY)
	// IMPORTANT: Always provide a default gap to prevent overlapping items
	// Custom gaps override the default when set
	const innerStyles = {
		display: 'grid',
		gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
		alignItems: alignItems || 'start',
		// Apply gaps: custom values OR default (24px / --wp--preset--spacing--50)
		rowGap: rowGap || 'var(--wp--preset--spacing--50)',
		columnGap: columnGap || 'var(--wp--preset--spacing--50)',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props with merged inner blocks props (must match edit.js)
	// CRITICAL: Merge blockProps and innerBlocksProps into single div to fix paste behavior
	const blockProps = useBlockProps.save({
		className: `dsg-grid dsg-grid-cols-${desktopColumns} dsg-grid-cols-tablet-${tabletColumns} dsg-grid-cols-mobile-${mobileColumns}`,
		style: {
			alignSelf: 'stretch',
			// Merge inner styles with block styles
			...innerStyles,
			...(hoverBackgroundColor && {
				'--dsg-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsg-hover-text-color': hoverTextColor,
			}),
			...(attributes.hoverIconBackgroundColor && {
				'--dsg-parent-hover-icon-bg':
					attributes.hoverIconBackgroundColor,
			}),
			...(attributes.hoverButtonBackgroundColor && {
				'--dsg-parent-hover-button-bg':
					attributes.hoverButtonBackgroundColor,
			}),
		},
	});

	// Merge block props with inner blocks props
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
