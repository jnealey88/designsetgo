/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { minHeight } = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsgo-scroll-slides',
		'data-dsgo-min-height': minHeight || '100vh',
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-scroll-slides__panels',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
