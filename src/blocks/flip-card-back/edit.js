/**
 * Flip Card Back - Edit Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function FlipCardBackEdit() {
	const blockProps = useBlockProps({
		className: 'dsg-flip-card__face dsg-flip-card__back',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [
			['core/heading', { content: __('Back of Card', 'designsetgo'), level: 2, textAlign: 'center' }],
			['core/paragraph', { content: __('Add any blocks you want here...', 'designsetgo'), align: 'center' }],
		],
		templateLock: false,
	});

	return <div {...innerBlocksProps} />;
}
