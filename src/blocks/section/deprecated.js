/**
 * Stack Block - Deprecated versions
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// Version 2: Before padding extraction - padding applied to outer div
// This caused alignfull/alignwide to not work correctly due to box-sizing: border-box
const v2 = {
	attributes: {
		align: {
			type: 'string',
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
		// OLD BEHAVIOR: Padding applied here via blockProps (from WordPress spacing support)
		const TagName = tagName || 'div';
		const blockProps = useBlockProps.save({
			className,
			style: {
				...(hoverBackgroundColor && {
					'--dsgo-hover-bg-color': hoverBackgroundColor,
				}),
				...(hoverTextColor && {
					'--dsgo-hover-text-color': hoverTextColor,
				}),
				...(hoverIconBackgroundColor && {
					'--dsgo-parent-hover-icon-bg': hoverIconBackgroundColor,
				}),
				...(hoverButtonBackgroundColor && {
					'--dsgo-parent-hover-button-bg': hoverButtonBackgroundColor,
				}),
				...(overlayColor && {
					'--dsgo-overlay-color': overlayColor,
					'--dsgo-overlay-opacity': '0.8',
				}),
			},
		});
		// No padding extraction here - padding stays on outer div (OLD BEHAVIOR)

		// Inner container props with width constraints only (NO PADDING)
		// Use custom contentWidth if set, otherwise fallback to theme's contentSize via CSS variable
		const innerStyle = {};
		if (constrainWidth) {
			innerStyle.maxWidth =
				contentWidth || 'var(--wp--style--global--content-size, 1140px)';
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
	migrate(oldAttributes) {
		// No attribute changes needed - just return as-is
		// The new save() will automatically extract padding and apply to inner div
		return oldAttributes;
	},
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
					'--dsgo-hover-bg-color': hoverBackgroundColor,
				}),
				...(hoverTextColor && {
					'--dsgo-hover-text-color': hoverTextColor,
				}),
				...(hoverIconBackgroundColor && {
					'--dsgo-parent-hover-icon-bg': hoverIconBackgroundColor,
				}),
				...(hoverButtonBackgroundColor && {
					'--dsgo-parent-hover-button-bg': hoverButtonBackgroundColor,
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

export default [v2, v1];
