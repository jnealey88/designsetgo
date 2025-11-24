/**
 * Tab Block - Deprecated Versions
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

/**
 * Version 1: Before adding "none" icon position option
 * - iconPosition attribute didn't exist (was always "left" implicitly)
 * - Blocks with icons always output data-icon-position="left"
 */
const v1 = {
	attributes: {
		uniqueId: {
			type: 'string',
			default: '',
		},
		title: {
			type: 'string',
			default: 'Tab',
		},
		icon: {
			type: 'string',
			default: '',
		},
		// iconPosition attribute didn't exist in v1
		anchor: {
			type: 'string',
			default: '',
		},
		style: {
			type: 'object',
			default: {
				spacing: {
					padding: {
						top: 'var:preset|spacing|40',
						right: 'var:preset|spacing|40',
						bottom: 'var:preset|spacing|40',
						left: 'var:preset|spacing|40',
					},
				},
			},
		},
	},

	save({ attributes }) {
		const { uniqueId, title, anchor, icon } = attributes;

		const blockProps = useBlockProps.save({
			className: 'dsgo-tab',
			role: 'tabpanel',
			'aria-labelledby': `tab-${uniqueId}`,
			'aria-label': title || `Tab ${uniqueId}`,
			id: `panel-${anchor || uniqueId}`,
			hidden: true,
			// v1 always output icon data with position="left" when icon exists
			...(icon && {
				'data-icon': sanitizeIconSlug(icon),
				'data-icon-position': 'left',
			}),
		});

		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsgo-tab__content',
		});

		return (
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		);
	},

	migrate(attributes) {
		// Migrate to new structure with iconPosition attribute
		return {
			...attributes,
			// If icon exists, set iconPosition to "left" (old default)
			// If no icon, set to "none" (new default)
			iconPosition: attributes.icon ? 'left' : 'none',
		};
	},
};

export default [v1];
