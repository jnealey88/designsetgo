/**
 * Row Block - Deprecated versions
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

// Version 3: Before align-items (vertical alignment) was added to inner div
// This version has width constraints but no alignItems CSS property
const v3 = {
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
		},
		contentWidth: {
			type: 'string',
		},
		mobileStack: {
			type: 'boolean',
		},
		style: {
			type: 'object',
		},
		layout: {
			type: 'object',
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
		overlayColor: {
			type: 'string',
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
			mobileStack,
			overlayColor,
			layout,
		} = attributes;

		const className = [
			'dsgo-flex',
			mobileStack && 'dsgo-flex--mobile-stack',
			!constrainWidth && 'dsgo-no-width-constraint',
			overlayColor && 'dsgo-flex--has-overlay',
		]
			.filter(Boolean)
			.join(' ');

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

		// Extract gap
		const rawGapValue = attributes.style?.spacing?.blockGap;
		const gapValue = convertPresetToCSSVar(rawGapValue);

		// Remove gap from outer div's inline styles
		if (blockProps.style?.gap) {
			delete blockProps.style.gap;
		}

		// Inner container WITHOUT alignItems (this is the key difference from current save)
		const innerStyle = {
			display: 'flex',
			justifyContent: layout?.justifyContent || 'left',
			flexWrap: layout?.flexWrap || 'wrap',
			...(gapValue && { gap: gapValue }),
		};

		// Apply width constraints if enabled
		if (constrainWidth) {
			innerStyle.maxWidth =
				contentWidth ||
				'var(--wp--style--global--content-size, 1140px)';
			innerStyle.marginLeft = 'auto';
			innerStyle.marginRight = 'auto';
		}

		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsgo-flex__inner',
			style: innerStyle,
		});

		return (
			<TagName {...blockProps}>
				<div {...innerBlocksProps} />
			</TagName>
		);
	},
	migrate(oldAttributes) {
		// Preserve all attributes - the new version automatically applies alignItems
		return {
			...oldAttributes,
		};
	},
};

// Version 2: Before width constraint styles were added to inner div
// This version had dsgo-has-max-width class from max-width extension
// but didn't output width constraints on inner div when constrainWidth was true
const v2 = {
	attributes: {
		align: {
			type: 'string',
		},
		constrainWidth: {
			type: 'boolean',
		},
		contentWidth: {
			type: 'string',
		},
		mobileStack: {
			type: 'boolean',
		},
		style: {
			type: 'object',
		},
		layout: {
			type: 'object',
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
		overlayColor: {
			type: 'string',
		},
	},
	save({ attributes }) {
		const {
			hoverBackgroundColor,
			hoverTextColor,
			hoverIconBackgroundColor,
			hoverButtonBackgroundColor,
			mobileStack,
			overlayColor,
			layout,
		} = attributes;

		const className = [
			'dsgo-flex',
			mobileStack && 'dsgo-flex--mobile-stack',
			overlayColor && 'dsgo-flex--has-overlay',
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
				...(overlayColor && {
					'--dsgo-overlay-color': convertPresetToCSSVar(overlayColor),
					'--dsgo-overlay-opacity': '0.8',
				}),
			},
		});

		// Extract gap
		const rawGapValue = attributes.style?.spacing?.blockGap;
		const gapValue = convertPresetToCSSVar(rawGapValue);

		// Remove gap from outer div's inline styles
		if (blockProps.style?.gap) {
			delete blockProps.style.gap;
		}

		// Inner container WITHOUT width constraints
		// This is the key difference - old version didn't apply width constraints here
		const innerStyle = {
			display: 'flex',
			justifyContent: layout?.justifyContent || 'left',
			flexWrap: layout?.flexWrap || 'wrap',
			...(gapValue && { gap: gapValue }),
		};

		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsgo-flex__inner',
			style: innerStyle,
		});

		return (
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	migrate(oldAttributes) {
		// Clean up dsgo-has-max-width class that was added by old max-width extension
		const className = oldAttributes.className || '';
		const cleanClassName = className
			.split(' ')
			.filter((cls) => cls !== 'dsgo-has-max-width')
			.join(' ')
			.trim();

		return {
			...oldAttributes,
			className: cleanClassName || undefined,
		};
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
			'dsgo-flex',
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
			className: 'dsgo-flex__inner',
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

		// Remove align classes and dsgo-has-max-width from className
		const cleanClassName = className
			.split(' ')
			.filter(
				(cls) =>
					cls !== 'alignfull' &&
					cls !== 'alignwide' &&
					cls !== 'dsgo-has-max-width'
			)
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

export default [v3, v2, v1];
