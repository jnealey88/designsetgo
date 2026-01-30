/**
 * Grid Block - Deprecated versions
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// Version 3: Before custom alignment system - used WordPress align attribute
// This matches blocks created before the dsgoAlign refactoring
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
			default: false,
		},
		contentWidth: {
			type: 'string',
			default: '',
		},
		desktopColumns: {
			type: 'number',
			default: 3,
		},
		tabletColumns: {
			type: 'number',
			default: 2,
		},
		mobileColumns: {
			type: 'number',
			default: 1,
		},
		rowGap: {
			type: 'string',
			default: '',
		},
		columnGap: {
			type: 'string',
			default: '',
		},
		alignItems: {
			type: 'string',
			default: 'stretch',
		},
		textAlign: {
			type: 'string',
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
		style: {
			type: 'object',
		},
	},
	save({ attributes }) {
		const {
			tagName = 'div',
			constrainWidth,
			contentWidth,
			desktopColumns,
			tabletColumns,
			mobileColumns,
			rowGap,
			columnGap,
			alignItems,
			hoverBackgroundColor,
			hoverTextColor,
			hoverIconBackgroundColor,
			hoverButtonBackgroundColor,
			style,
		} = attributes;

		// Build className WITHOUT dsgoAlign (old behavior)
		const className = [
			'dsgo-grid',
			`dsgo-grid-cols-${desktopColumns}`,
			`dsgo-grid-cols-tablet-${tabletColumns}`,
			`dsgo-grid-cols-mobile-${mobileColumns}`,
			!constrainWidth && 'dsgo-no-width-constraint',
		]
			.filter(Boolean)
			.join(' ');

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
			},
		});

		const paddingTop = blockProps.style?.paddingTop;
		const paddingRight = blockProps.style?.paddingRight;
		const paddingBottom = blockProps.style?.paddingBottom;
		const paddingLeft = blockProps.style?.paddingLeft;
		const padding = blockProps.style?.padding;

		if (blockProps.style?.padding) {
			delete blockProps.style.padding;
		}
		if (blockProps.style?.paddingTop) {
			delete blockProps.style.paddingTop;
		}
		if (blockProps.style?.paddingRight) {
			delete blockProps.style.paddingRight;
		}
		if (blockProps.style?.paddingBottom) {
			delete blockProps.style.paddingBottom;
		}
		if (blockProps.style?.paddingLeft) {
			delete blockProps.style.paddingLeft;
		}

		const blockGap = style?.spacing?.blockGap;
		const defaultGap = 'var(--wp--preset--spacing--50)';

		const innerStyles = {
			display: 'grid',
			gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
			alignItems: alignItems || 'start',
			rowGap: blockGap || rowGap || defaultGap,
			columnGap: blockGap || columnGap || defaultGap,
			...(padding && { padding }),
			...(paddingTop && { paddingTop }),
			...(paddingRight && { paddingRight }),
			...(paddingBottom && { paddingBottom }),
			...(paddingLeft && { paddingLeft }),
		};

		if (constrainWidth) {
			innerStyles.maxWidth =
				contentWidth || 'var(--wp--style--global--content-size, 1140px)';
			innerStyles.marginLeft = 'auto';
			innerStyles.marginRight = 'auto';
		}

		const innerBlocksProps = useInnerBlocksProps.save(
			{
				className: 'dsgo-grid__inner',
				style: innerStyles,
			},
			{
				__unstableDisableLayoutClassNames: true,
			}
		);

		return (
			<TagName {...blockProps}>
				<div {...innerBlocksProps} />
			</TagName>
		);
	},
	migrate(oldAttributes) {
		const { align, ...rest } = oldAttributes;

		return {
			...rest,
			dsgoAlign: align || 'full', // Migrate align → dsgoAlign
			align: undefined, // Clear old attribute
		};
	},
};

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
		desktopColumns: {
			type: 'number',
			default: 3,
		},
		tabletColumns: {
			type: 'number',
			default: 2,
		},
		mobileColumns: {
			type: 'number',
			default: 1,
		},
		rowGap: {
			type: 'string',
		},
		columnGap: {
			type: 'string',
		},
		alignItems: {
			type: 'string',
			default: 'start',
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
	},
	save({ attributes }) {
		const {
			tagName = 'div',
			constrainWidth,
			contentWidth,
			desktopColumns,
			tabletColumns,
			mobileColumns,
			rowGap,
			columnGap,
			alignItems,
			hoverBackgroundColor,
			hoverTextColor,
			hoverIconBackgroundColor,
			hoverButtonBackgroundColor,
			style,
		} = attributes;

		// Build className with conditional classes
		const className = [
			'dsgo-grid',
			`dsgo-grid-cols-${desktopColumns}`,
			`dsgo-grid-cols-tablet-${tabletColumns}`,
			`dsgo-grid-cols-mobile-${mobileColumns}`,
			!constrainWidth && 'dsgo-no-width-constraint',
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
			},
		});
		// No padding extraction here - padding stays on outer div (OLD BEHAVIOR)

		// Calculate inner styles declaratively (NO PADDING)
		const blockGap = style?.spacing?.blockGap;
		const defaultGap = 'var(--wp--preset--spacing--50)';

		const innerStyles = {
			display: 'grid',
			gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
			alignItems: alignItems || 'start',
			rowGap: blockGap || rowGap || defaultGap,
			columnGap: blockGap || columnGap || defaultGap,
		};

		// Apply width constraints to inner container
		if (constrainWidth) {
			innerStyles.maxWidth =
				contentWidth || 'var(--wp--style--global--content-size, 1140px)';
			innerStyles.marginLeft = 'auto';
			innerStyles.marginRight = 'auto';
		}

		// Merge inner blocks props
		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsgo-grid__inner',
			style: innerStyles,
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

export default [v3, v2, v1];
