/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Save component for Reveal block
 *
 * @param {Object} root0            - Component props.
 * @param {Object} root0.attributes - Block attributes.
 */
export default function Save({ attributes }) {
	const { revealAnimation, revealDuration } = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsg-reveal-container',
		'data-reveal-animation': revealAnimation,
		'data-reveal-duration': revealDuration,
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
