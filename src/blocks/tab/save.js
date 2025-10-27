/**
 * Tab Block - Save Component
 *
 * Renders the tab panel on frontend
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Sanitize icon slug to prevent XSS.
 * Allow only: lowercase letters, numbers, hyphens
 *
 * @param {string} icon - Icon slug to sanitize
 * @return {string} Sanitized icon slug
 */
function sanitizeIconSlug(icon) {
	if (!icon || typeof icon !== 'string') {
		return '';
	}
	// Only allow safe characters for dashicon class names
	return icon.toLowerCase().replace(/[^a-z0-9\-]/g, '');
}

export default function Save({ attributes }) {
	const { uniqueId, title, anchor, icon, iconPosition } = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsg-tab',
		role: 'tabpanel',
		'aria-labelledby': `tab-${uniqueId}`,
		'aria-label': title || `Tab ${uniqueId}`,
		id: `panel-${anchor || uniqueId}`,
		hidden: true, // All tabs hidden by default, JS will show active
		// ✅ SECURITY: Sanitized icon data for frontend JS
		...(icon && {
			'data-icon': sanitizeIconSlug(icon),
			'data-icon-position': ['left', 'right', 'top'].includes(iconPosition) ? iconPosition : 'left',
		}),
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
