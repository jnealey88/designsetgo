/**
 * Flip Card Front - Edit Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function FlipCardFrontEdit() {
	const blockProps = useBlockProps({
		className: 'dsg-flip-card__face dsg-flip-card__front',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [
			[
				'core/heading',
				{
					content: __('Front of Card', 'designsetgo'),
					level: 2,
					textAlign: 'center',
				},
			],
			[
				'core/paragraph',
				{
					content: __('Add any blocks you want here…', 'designsetgo'),
					align: 'center',
				},
			],
		],
		templateLock: false,
	});

	return <div {...innerBlocksProps} />;
}
