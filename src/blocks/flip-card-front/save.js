/**
 * Flip Card Front - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function FlipCardFrontSave() {
	const blockProps = useBlockProps.save({
		className: 'dsgo-flip-card__face dsgo-flip-card__front',
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
