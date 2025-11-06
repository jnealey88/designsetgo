/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component for the Scroll Accordion Item block.
 * Simple container for inner blocks with sticky stacking effect on frontend.
 *
 * @return {Element} Element to render.
 */
export default function Edit() {
	const blockProps = useBlockProps({
		className: 'dsg-scroll-accordion-item',
		style: {
			alignSelf: 'stretch',
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [
			[
				'core/paragraph',
				{
					placeholder: __(
						'Add content for this scroll accordion item...',
						'designsetgo'
					),
				},
			],
		],
		templateLock: false,
	});

	return <div {...innerBlocksProps} />;
}
