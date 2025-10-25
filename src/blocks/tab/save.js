/**
 * Tab Block - Save Component
 *
 * Renders the tab panel on frontend
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { uniqueId, title, anchor } = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsg-tab',
		role: 'tabpanel',
		'aria-labelledby': `tab-${uniqueId}`,
		id: `panel-${anchor || uniqueId}`,
		hidden: true, // All tabs hidden by default, JS will show active
	});

	// Use useInnerBlocksProps.save() for consistency
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-tab__content',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
