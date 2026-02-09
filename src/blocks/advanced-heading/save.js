/**
 * Advanced Heading Block - Save Function
 *
 * Renders the heading element with inner block content.
 * Each heading segment saves its own typography styles.
 *
 * @since 2.0.0
 */

import classnames from 'classnames';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

/**
 * Advanced Heading Save Function
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {JSX.Element} Saved advanced heading block markup
 */
export default function AdvancedHeadingSave({ attributes }) {
	const { level = 2, textAlign } = attributes;
	const validLevel = HEADING_LEVELS.includes(level) ? level : 2;
	const TagName = `h${validLevel}`;

	const blockProps = useBlockProps.save({
		className: classnames('dsgo-advanced-heading', {
			[`has-text-align-${textAlign}`]: textAlign,
		}),
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
