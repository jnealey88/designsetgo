/**
 * Grid Container Block - Deprecated versions
 *
 * Handles block markup changes to prevent validation errors.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const deprecated = [
	{
		// Version 3: Single-div structure before two-div structure migration
		// Changed to two-div structure (outer + inner) for proper width constraints
		attributes: {
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
				default: 'start',
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
		},
		save({ attributes }) {
			const {
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
			} = attributes;

			// OLD: Single-div structure with merged styles
			const innerStyles = {
				display: 'grid',
				gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
				alignItems: alignItems || 'start',
				rowGap: rowGap || 'var(--wp--preset--spacing--50)',
				columnGap: columnGap || 'var(--wp--preset--spacing--50)',
			};

			const blockProps = useBlockProps.save({
				className: `dsg-grid dsg-grid-cols-${desktopColumns} dsg-grid-cols-tablet-${tabletColumns} dsg-grid-cols-mobile-${mobileColumns}`,
				style: {
					...innerStyles,
					...(hoverBackgroundColor && {
						'--dsg-hover-bg-color': hoverBackgroundColor,
					}),
					...(hoverTextColor && {
						'--dsg-hover-text-color': hoverTextColor,
					}),
					...(hoverIconBackgroundColor && {
						'--dsg-parent-hover-icon-bg': hoverIconBackgroundColor,
					}),
					...(hoverButtonBackgroundColor && {
						'--dsg-parent-hover-button-bg':
							hoverButtonBackgroundColor,
					}),
				},
			});

			const innerBlocksProps = useInnerBlocksProps.save(blockProps);

			return <div {...innerBlocksProps} />;
		},
	},
	{
		// Version 2: Used layout.contentSize for width constraint
		// Migrated to use maxWidth attribute directly
		attributes: {
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
				default: 'start',
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
		},
		migrate(attributes) {
			// Convert layout.contentSize to maxWidth attribute
			const maxWidth = attributes.layout?.contentSize || '';
			const { contentSize: _, ...restLayout } = attributes.layout || {};

			return {
				...attributes,
				maxWidth,
				layout:
					Object.keys(restLayout).length > 0 ? restLayout : undefined,
			};
		},
		save({ attributes }) {
			const {
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
			} = attributes;

			// Calculate inner styles declaratively (must match previous version)
			const innerStyles = {
				display: 'grid',
				gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
				alignItems: alignItems || 'start',
				rowGap: rowGap || 'var(--wp--preset--spacing--50)',
				columnGap: columnGap || 'var(--wp--preset--spacing--50)',
			};

			const blockProps = useBlockProps.save({
				className: `dsg-grid dsg-grid-cols-${desktopColumns} dsg-grid-cols-tablet-${tabletColumns} dsg-grid-cols-mobile-${mobileColumns}`,
				style: {
					...innerStyles,
					...(hoverBackgroundColor && {
						'--dsg-hover-bg-color': hoverBackgroundColor,
					}),
					...(hoverTextColor && {
						'--dsg-hover-text-color': hoverTextColor,
					}),
					...(hoverIconBackgroundColor && {
						'--dsg-parent-hover-icon-bg': hoverIconBackgroundColor,
					}),
					...(hoverButtonBackgroundColor && {
						'--dsg-parent-hover-button-bg':
							hoverButtonBackgroundColor,
					}),
				},
			});

			const innerBlocksProps = useInnerBlocksProps.save(blockProps);

			return <div {...innerBlocksProps} />;
		},
	},
	{
		// Version 1: Custom constrainWidth logic (before WordPress layout integration)
		attributes: {
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
				default: 'start',
			},
			textAlign: {
				type: 'string',
			},
			constrainWidth: {
				type: 'boolean',
				default: true,
			},
			contentWidth: {
				type: 'string',
				default: '',
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
				desktopColumns,
				tabletColumns,
				mobileColumns,
				rowGap,
				columnGap,
				alignItems,
				constrainWidth,
				contentWidth,
				hoverBackgroundColor,
				hoverTextColor,
			} = attributes;

			const effectiveContentWidth = contentWidth || '1200px';

			const innerStyles = {
				display: 'grid',
				gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
				alignItems: alignItems || 'stretch',
				rowGap: rowGap || 'var(--wp--preset--spacing--50)',
				columnGap: columnGap || 'var(--wp--preset--spacing--50)',
				...(constrainWidth && {
					maxWidth: effectiveContentWidth,
					marginLeft: 'auto',
					marginRight: 'auto',
				}),
			};

			const blockProps = useBlockProps.save({
				className: `dsg-grid dsg-grid-cols-${desktopColumns} dsg-grid-cols-tablet-${tabletColumns} dsg-grid-cols-mobile-${mobileColumns}`,
				style: {
					alignSelf: 'stretch',
					...innerStyles,
					...(hoverBackgroundColor && {
						'--dsg-hover-bg-color': hoverBackgroundColor,
					}),
					...(hoverTextColor && {
						'--dsg-hover-text-color': hoverTextColor,
					}),
					...(attributes.hoverIconBackgroundColor && {
						'--dsg-parent-hover-icon-bg':
							attributes.hoverIconBackgroundColor,
					}),
					...(attributes.hoverButtonBackgroundColor && {
						'--dsg-parent-hover-button-bg':
							attributes.hoverButtonBackgroundColor,
					}),
				},
			});

			const innerBlocksProps = useInnerBlocksProps.save(blockProps);

			return <div {...innerBlocksProps} />;
		},
		migrate(attributes) {
			const { constrainWidth, contentWidth, ...restAttributes } =
				attributes;

			// Convert old constrainWidth to new layout attribute
			return {
				...restAttributes,
				layout: {
					type: 'constrained',
					...(contentWidth && { contentSize: contentWidth }),
				},
			};
		},
	},
];

export default deprecated;
