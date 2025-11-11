/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

/**
 * Save component for the Scroll Accordion Item block.
 * Simple container that outputs inner blocks.
 *
 * @param {Object} props            - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @return {Element} Element to render.
 */
export default function Save({ attributes }) {
	const { overlayColor } = attributes;

	// Apply overlay styles when color is set
	const overlayStyles = overlayColor
		? {
				'--dsg-overlay-color': overlayColor,
				'--dsg-overlay-opacity': '0.8',
			}
		: {};

	const blockProps = useBlockProps.save({
		className: classnames('dsg-scroll-accordion-item', {
			'dsg-scroll-accordion-item--has-overlay': !!overlayColor,
		}),
		style: overlayColor ? overlayStyles : undefined,
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
