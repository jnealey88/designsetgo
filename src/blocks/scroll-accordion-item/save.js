/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Save component for the Scroll Accordion Item block.
 * Simple container that outputs inner blocks.
 *
 * @return {Element} Element to render.
 */
export default function Save() {
	const blockProps = useBlockProps.save({
		className: 'dsg-scroll-accordion-item',
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
