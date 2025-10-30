/**
 * Flex Container Block - Save Component
 *
 * Saves the block content with declarative styles.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Flex Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function FlexSave({ attributes }) {
	const {
		direction,
		wrap,
		justifyContent,
		alignItems,
		gap,
		mobileStack,
	} = attributes;

	// Calculate inner styles declaratively (must match edit.js)
	const innerStyles = {
		display: 'flex',
		flexDirection: direction || 'row',
		flexWrap: wrap ? 'wrap' : 'nowrap',
		justifyContent: justifyContent || 'flex-start',
		alignItems: alignItems || 'center',
		gap: gap || 'var(--wp--preset--spacing--50)',
	};

	// Block wrapper props
	const blockProps = useBlockProps.save({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
	});

	// Inner blocks props with declarative styles
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-flex__inner',
		style: innerStyles,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
