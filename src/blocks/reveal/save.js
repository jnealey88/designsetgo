/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Save component for Reveal block
 * @param root0
 * @param root0.attributes
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
