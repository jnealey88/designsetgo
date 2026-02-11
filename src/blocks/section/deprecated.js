/**
 * Stack Block - Deprecated versions
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

// Version 2: Before shape dividers - current save without shape dividers
const v2 = {
	attributes: {
		align: {
			type: 'string',
			default: 'full',
		},
		tagName: {
			type: 'string',
			default: 'div',
		},
		constrainWidth: {
			type: 'boolean',
			default: true,
		},
		contentWidth: {
			type: 'string',
			default: '',
		},
		style: {
			type: 'object',
		},
		hoverBackgroundColor: {
			type: 'string',
			default: '',
		},
		hoverTextColor: {
			type: 'string',
			default: '',
		},
		hoverIconBackgroundColor: {
			type: 'string',
			default: '',
		},
		hoverButtonBackgroundColor: {
			type: 'string',
			default: '',
		},
		overlayColor: {
			type: 'string',
			default: '',
		},
	},
	/**
	 * Determine if this deprecation should be used
	 * Matches blocks created before shape dividers were added
	 *
	 * @param {Object} attributes Block attributes
	 * @return {boolean} True if block matches this deprecation
	 */
	isEligible(attributes) {
		// This deprecation is for blocks without shape divider attributes
		// If any shape divider attribute exists, this is not the right version
		// Use constrainWidth to distinguish v2 from v1 (v1 used layout.contentSize)
		return (
			!attributes.shapeDividerTop &&
			!attributes.shapeDividerBottom &&
			Object.prototype.hasOwnProperty.call(attributes, 'constrainWidth')
		);
	},
	save({ attributes }) {
		const {
			tagName = 'div',
			constrainWidth,
			contentWidth,
			hoverBackgroundColor,
			hoverTextColor,
			hoverIconBackgroundColor,
			hoverButtonBackgroundColor,
			overlayColor,
		} = attributes;

		// Build className with conditional no-width-constraint and overlay classes
		const className = [
			'dsgo-stack',
			!constrainWidth && 'dsgo-no-width-constraint',
			overlayColor && 'dsgo-stack--has-overlay',
		]
			.filter(Boolean)
			.join(' ');

		// Block wrapper props - outer div stays full width
		const TagName = tagName || 'div';
		const blockProps = useBlockProps.save({
			className,
			style: {
				...(hoverBackgroundColor && {
					'--dsgo-hover-bg-color':
						convertPresetToCSSVar(hoverBackgroundColor),
				}),
				...(hoverTextColor && {
					'--dsgo-hover-text-color':
						convertPresetToCSSVar(hoverTextColor),
				}),
				...(hoverIconBackgroundColor && {
					'--dsgo-parent-hover-icon-bg': convertPresetToCSSVar(
						hoverIconBackgroundColor
					),
				}),
				...(hoverButtonBackgroundColor && {
					'--dsgo-parent-hover-button-bg': convertPresetToCSSVar(
						hoverButtonBackgroundColor
					),
				}),
				...(overlayColor && {
					'--dsgo-overlay-color': convertPresetToCSSVar(overlayColor),
					'--dsgo-overlay-opacity': '0.8',
				}),
			},
		});

		// Inner container props with width constraints
		const innerStyle = {};
		if (constrainWidth) {
			innerStyle.maxWidth =
				contentWidth ||
				'var(--wp--style--global--content-size, 1140px)';
			innerStyle.marginLeft = 'auto';
			innerStyle.marginRight = 'auto';
		}

		// Merge inner blocks props without the outer block props
		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsgo-stack__inner',
			style: innerStyle,
		});

		return (
			<TagName {...blockProps}>
				<div {...innerBlocksProps} />
			</TagName>
		);
	},
	// No migration needed - shape divider attributes default to empty/false
};

// Version 1: Before align attribute - used className for alignment
const v1 = {
	attributes: {
		// Old blocks don't have align attribute, only className
		style: {
			type: 'object',
		},
		layout: {
			type: 'object',
		},
		contentWidth: {
			type: 'string',
		},
		hoverBackgroundColor: {
			type: 'string',
		},
		hoverTextColor: {
			type: 'string',
		},
		hoverIconBackgroundColor: {
			type: 'string',
		},
		hoverButtonBackgroundColor: {
			type: 'string',
		},
	},
	/**
	 * Determine if this deprecation should be used
	 * Matches blocks created before align attribute was added
	 *
	 * @param {Object} attributes Block attributes
	 * @return {boolean} True if block matches this deprecation
	 */
	isEligible(attributes) {
		// This deprecation is for the earliest blocks without align attribute
		// They used className for alignment instead
		return attributes.align === undefined;
	},
	save({ attributes }) {
		const {
			hoverBackgroundColor,
			hoverTextColor,
			hoverIconBackgroundColor,
			hoverButtonBackgroundColor,
			layout,
			contentWidth,
		} = attributes;

		let contentSize;
		if (layout && 'contentSize' in layout) {
			contentSize = layout.contentSize;
		} else {
			contentSize = contentWidth || '1200px';
		}

		const className = [
			'dsgo-stack',
			!contentSize && 'dsgo-no-width-constraint',
		]
			.filter(Boolean)
			.join(' ');

		const blockProps = useBlockProps.save({
			className,
			style: {
				...(hoverBackgroundColor && {
					'--dsgo-hover-bg-color':
						convertPresetToCSSVar(hoverBackgroundColor),
				}),
				...(hoverTextColor && {
					'--dsgo-hover-text-color':
						convertPresetToCSSVar(hoverTextColor),
				}),
				...(hoverIconBackgroundColor && {
					'--dsgo-parent-hover-icon-bg': convertPresetToCSSVar(
						hoverIconBackgroundColor
					),
				}),
				...(hoverButtonBackgroundColor && {
					'--dsgo-parent-hover-button-bg': convertPresetToCSSVar(
						hoverButtonBackgroundColor
					),
				}),
			},
		});

		const innerStyle = {};
		if (contentSize) {
			innerStyle.maxWidth = contentSize;
			innerStyle.marginLeft = 'auto';
			innerStyle.marginRight = 'auto';
		}

		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsgo-stack__inner',
			style: innerStyle,
		});

		return (
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	migrate(oldAttributes) {
		// Extract align from className if it exists
		const className = oldAttributes.className || '';
		let align;

		if (className.includes('alignfull')) {
			align = 'full';
		} else if (className.includes('alignwide')) {
			align = 'wide';
		}

		// Remove align classes from className since they'll be auto-added by WordPress
		const cleanClassName = className
			.split(' ')
			.filter((cls) => cls !== 'alignfull' && cls !== 'alignwide')
			.join(' ')
			.trim();

		// Return migrated attributes
		return {
			...oldAttributes,
			align,
			className: cleanClassName || undefined,
		};
	},
};

// Export deprecations in reverse chronological order (newest first)
export default [v2, v1];
