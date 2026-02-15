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

/**
 * Convert a WordPress spacing value to a CSS value.
 *
 * @param {string|Object|undefined} value - Gap value from attributes
 * @return {string|undefined} CSS-ready gap value
 */
function getGapCSSValue(value) {
	if (!value) {
		return undefined;
	}
	const raw = typeof value === 'object' ? value.left || value.top : value;
	if (!raw) {
		return undefined;
	}
	if (typeof raw === 'string' && raw.startsWith('var:')) {
		return `var(--wp--${raw.slice(4).replace(/\|/g, '--')})`;
	}
	return raw;
}

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

	const blockGap = getGapCSSValue(attributes.style?.spacing?.blockGap);

	const blockProps = useBlockProps.save({
		className: classnames('dsgo-advanced-heading', {
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-advanced-heading__inner',
		style: blockGap ? { '--dsgo-segment-gap': blockGap } : undefined,
	});

	return (
		<div {...blockProps}>
			<TagName {...innerBlocksProps} />
		</div>
	);
}
