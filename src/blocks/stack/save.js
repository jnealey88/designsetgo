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
	const { alignItems, constrainWidth, contentWidth } = attributes;

	// Calculate effective content width (must match edit.js logic for frontend)
	// Note: Can't use useSetting in save, so use contentWidth or fallback
	const effectiveContentWidth = contentWidth || '1200px';

	// Calculate inner styles declaratively (must match edit.js)
	// Note: gap is handled by WordPress blockGap support via style.spacing.blockGap
	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: alignItems || 'flex-start',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props
	// CRITICAL: Set width: 100% AND align-self: stretch (must match edit.js)
	// align-self: stretch ensures nested containers fill parent width even when parent has alignItems: flex-start
	const blockProps = useBlockProps.save({
		className: 'dsg-stack',
		style: {
			width: '100%',
			alignSelf: 'stretch',
		},
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
