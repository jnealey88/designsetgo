/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Save component for the Scroll Accordion block.
 * Simple container that outputs inner blocks.
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {Element} Element to render.
 */
export default function Save({ attributes }) {
	const { alignItems } = attributes;

	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: alignItems || 'flex-start',
	};

	const blockProps = useBlockProps.save({
		className: 'dsg-scroll-accordion',
		style: {
			width: '100%',
			alignSelf: 'stretch',
		},
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-scroll-accordion__items',
		style: innerStyles,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
