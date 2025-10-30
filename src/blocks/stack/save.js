/**
 * Stack Container Block - Save Component
 *
 * Saves the block content with declarative styles.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Stack Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function StackSave({ attributes }) {
	const { gap, textAlign, constrainWidth, contentWidth } = attributes;

	// Calculate effective content width (must match edit.js logic for frontend)
	// Note: Can't use useSetting in save, so use contentWidth or fallback
	const effectiveContentWidth = contentWidth || '1200px';

	// Calculate inner styles declaratively (must match edit.js)
	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		gap: gap || 'var(--wp--preset--spacing--50)',
		...(textAlign && { textAlign }),
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props
	const blockProps = useBlockProps.save({
		className: 'dsg-stack',
	});

	// Inner blocks props with declarative styles
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-stack__inner',
		style: innerStyles,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
