/**
 * Flex Container Block - Deprecated Versions
 *
 * Handles migration from layout.contentSize to maxWidth attribute.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const deprecated = [
	{
		// Version 2: Two-div structure without display: flex on inner div
		// Changed to apply display: flex directly to inner div for proper flex layout
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			mobileStack: {
				type: 'boolean',
				default: false,
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
			constrainWidth: {
				type: 'boolean',
				default: true,
			},
			contentWidth: {
				type: 'string',
				default: '',
			},
		},
		save({ attributes }) {
			const {
				constrainWidth,
				contentWidth,
				hoverBackgroundColor,
				hoverTextColor,
				hoverIconBackgroundColor,
				hoverButtonBackgroundColor,
				mobileStack,
			} = attributes;

			// Block wrapper props - outer div stays full width
			const blockProps = useBlockProps.save({
				className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
				style: {
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

			// OLD: Inner container props with width constraints but NO display: flex
			const innerStyle = {};
			if (constrainWidth) {
				innerStyle.maxWidth = contentWidth || '1200px';
				innerStyle.marginLeft = 'auto';
				innerStyle.marginRight = 'auto';
			}

			// Merge inner blocks props without the outer block props
			const innerBlocksProps = useInnerBlocksProps.save({
				className: 'dsg-flex__inner',
				style: innerStyle,
			});

			return (
				<div {...blockProps}>
					<div {...innerBlocksProps} />
				</div>
			);
		},
	},
	{
		// Version 1: Used layout.contentSize for width constraint
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			mobileStack: {
				type: 'boolean',
				default: false,
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
			// Migrate contentSize from layout to maxWidth attribute
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
				hoverBackgroundColor,
				hoverTextColor,
				hoverIconBackgroundColor,
				hoverButtonBackgroundColor,
				mobileStack,
			} = attributes;

			const blockProps = useBlockProps.save({
				className: `dsg-flex ${
					mobileStack ? 'dsg-flex--mobile-stack' : ''
				}`,
				style: {
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
];

export default deprecated;
