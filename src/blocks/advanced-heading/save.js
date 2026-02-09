/**
 * Advanced Heading Block - Save Function
 *
 * Renders the heading element with inner block content.
 * Each heading segment saves its own typography styles.
 *
 * @since 1.5.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Advanced Heading Save Function
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {JSX.Element} Saved advanced heading block markup
 */
export default function AdvancedHeadingSave({ attributes }) {
	const { level, textAlign } = attributes;
	const TagName = `h${level}`;

	const blockProps = useBlockProps.save({
		className: `dsgo-advanced-heading${textAlign ? ` has-text-align-${textAlign}` : ''}`,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-advanced-heading__inner',
	});

	return (
		<div {...blockProps}>
			<TagName {...innerBlocksProps} />
		</div>
	);
}
