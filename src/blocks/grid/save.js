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
	} = attributes;

	// Calculate effective content width (must match edit.js logic for frontend)
	// Note: Can't use useSetting in save, so use contentWidth or fallback
	const effectiveContentWidth = contentWidth || '1200px';

	// Calculate effective gaps (must match edit.js)
	// Note: gap is handled by WordPress blockGap support via style.spacing.blockGap
	const effectiveRowGap = rowGap || 'var(--wp--preset--spacing--50)';
	const effectiveColumnGap = columnGap || 'var(--wp--preset--spacing--50)';

	// Calculate inner styles declaratively (must match edit.js)
	const innerStyles = {
		display: 'grid',
		gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
		rowGap: effectiveRowGap,
		columnGap: effectiveColumnGap,
		alignItems: alignItems || 'start',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props with responsive column classes
	const blockProps = useBlockProps.save({
		className: `dsg-grid dsg-grid-cols-${desktopColumns} dsg-grid-cols-tablet-${tabletColumns} dsg-grid-cols-mobile-${mobileColumns}`,
	});

	// Inner blocks props with declarative styles
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-grid__inner',
		style: innerStyles,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
