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
 * - iconPosition default was "left"
 * - iconPosition enum: ["left", "right", "top"]
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
		iconPosition: {
			type: 'string',
			default: 'left',
			enum: ['left', 'right', 'top'],
		},
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
		const { uniqueId, title, anchor, icon, iconPosition } = attributes;

		const blockProps = useBlockProps.save({
			className: 'dsgo-tab',
			role: 'tabpanel',
			'aria-labelledby': `tab-${uniqueId}`,
			'aria-label': title || `Tab ${uniqueId}`,
			id: `panel-${anchor || uniqueId}`,
			hidden: true,
			...(icon && {
				'data-icon': sanitizeIconSlug(icon),
				'data-icon-position': ['left', 'right', 'top'].includes(
					iconPosition
				)
					? iconPosition
					: 'left',
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
		// If no icon is set, migrate to iconPosition: "none"
		// Otherwise keep the existing iconPosition
		return {
			...attributes,
			iconPosition:
				!attributes.icon || attributes.icon === ''
					? 'none'
					: attributes.iconPosition || 'left',
		};
	},
};

export default [v1];
