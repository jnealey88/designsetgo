/**
 * Stack Container Block - Deprecated versions
 *
 * Handles block markup changes to prevent validation errors.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const deprecated = [
	{
		// Version with manual flex styles (before WordPress layout integration)
		attributes: {
			align: {
				type: 'string',
			},
			textAlign: {
				type: 'string',
			},
			style: {
				type: 'object',
			},
			alignItems: {
				type: 'string',
				default: 'flex-start',
			},
			layout: {
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
				alignItems,
				hoverBackgroundColor,
				hoverTextColor,
				hoverIconBackgroundColor,
				hoverButtonBackgroundColor,
			} = attributes;

			const innerStyles = {
				display: 'flex',
				flexDirection: 'column',
				alignItems: alignItems || 'flex-start',
			};

			const blockProps = useBlockProps.save({
				className: 'dsg-stack',
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
		migrate(attributes) {
			const { alignItems, textAlign, ...restAttributes } = attributes;

			// Convert old alignItems to WordPress layout.justifyContent
			let justifyContent = 'left';
			if (alignItems === 'center') {
				justifyContent = 'center';
			} else if (alignItems === 'flex-end') {
				justifyContent = 'right';
			}

			return {
				...restAttributes,
				layout: {
					type: 'flex',
					orientation: 'vertical',
					justifyContent,
				},
			};
		},
	},
	{
		// Version with custom constrainWidth and NESTED wrapper div (oldest version)
		attributes: {
			align: {
				type: 'string',
			},
			textAlign: {
				type: 'string',
			},
			alignItems: {
				type: 'string',
				default: 'flex-start',
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
				alignItems,
				constrainWidth,
				contentWidth,
				hoverBackgroundColor,
				hoverTextColor,
			} = attributes;

			const effectiveContentWidth = contentWidth || '1200px';

			// Outer wrapper - just alignSelf
			const blockProps = useBlockProps.save({
				className: 'dsg-stack',
				style: {
					alignSelf: 'stretch',
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

			// Inner wrapper with layout styles and width constraint
			const innerStyles = {
				display: 'flex',
				flexDirection: 'column',
				alignItems: alignItems || 'flex-start',
				...(constrainWidth && {
					maxWidth: effectiveContentWidth,
					marginLeft: 'auto',
					marginRight: 'auto',
				}),
			};

			// Get InnerBlocks content
			const { children } = useInnerBlocksProps.save();

			return (
				<div {...blockProps}>
					<div className="dsg-stack__inner" style={innerStyles}>
						{children}
					</div>
				</div>
			);
		},
		migrate(attributes) {
			const {
				constrainWidth,
				contentWidth,
				alignItems,
				textAlign,
				...restAttributes
			} = attributes;

			// Convert old alignItems to WordPress layout.justifyContent
			let justifyContent = 'left';
			if (alignItems === 'center') {
				justifyContent = 'center';
			} else if (alignItems === 'flex-end') {
				justifyContent = 'right';
			}

			return {
				...restAttributes,
				layout: {
					type: 'flex',
					orientation: 'vertical',
					justifyContent,
					...(contentWidth && { contentSize: contentWidth }),
				},
			};
		},
	},
	{
		// Version with custom constrainWidth logic (before WordPress layout integration)
		attributes: {
			align: {
				type: 'string',
			},
			textAlign: {
				type: 'string',
			},
			alignItems: {
				type: 'string',
				default: 'flex-start',
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
				alignItems,
				constrainWidth,
				contentWidth,
				hoverBackgroundColor,
				hoverTextColor,
			} = attributes;

			const effectiveContentWidth = contentWidth || '1200px';

			const innerStyles = {
				display: 'flex',
				flexDirection: 'column',
				alignItems: alignItems || 'flex-start',
				...(constrainWidth && {
					maxWidth: effectiveContentWidth,
					marginLeft: 'auto',
					marginRight: 'auto',
				}),
			};

			const blockProps = useBlockProps.save({
				className: 'dsg-stack',
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
			const {
				constrainWidth,
				contentWidth,
				alignItems,
				textAlign,
				...restAttributes
			} = attributes;

			// Convert old alignItems to WordPress layout.justifyContent
			let justifyContent = 'left';
			if (alignItems === 'center') {
				justifyContent = 'center';
			} else if (alignItems === 'flex-end') {
				justifyContent = 'right';
			}

			return {
				...restAttributes,
				layout: {
					type: 'flex',
					orientation: 'vertical',
					justifyContent,
					...(contentWidth && { contentSize: contentWidth }),
				},
			};
		},
	},
];

export default deprecated;
