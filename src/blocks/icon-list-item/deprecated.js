/**
 * Icon List Item Block - Deprecated Versions
 *
 * Handles backward compatibility for blocks saved with previous versions.
 *
 * @since 1.2.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

/**
 * Version 1: Before lazy loading icon library
 *
 * Changes in current version:
 * - Icons now use data attributes for frontend lazy loading
 * - Frontend icons injected via PHP to avoid bundling 51KB library
 */
const v1 = {
	attributes: {
		icon: {
			type: 'string',
			default: 'star',
		},
		contentGap: {
			type: 'number',
			default: 8,
		},
		linkUrl: {
			type: 'string',
			default: '',
		},
		linkTarget: {
			type: 'string',
			default: '_self',
		},
		linkRel: {
			type: 'string',
			default: '',
		},
	},
	save({ attributes, context = {} }) {
		const { icon, linkUrl, linkTarget, linkRel, contentGap } = attributes;

		// Get settings from parent via context with safe defaults
		const iconSize = context['designsetgo/iconList/iconSize'] || 32;
		const iconColor = context['designsetgo/iconList/iconColor'] || '';
		const iconBackgroundColor =
			context['designsetgo/iconList/iconBackgroundColor'] || '';
		const iconPosition =
			context['designsetgo/iconList/iconPosition'] || 'left';

		// Calculate text alignment based on icon position
		const getTextAlign = () => {
			if (iconPosition === 'top') {
				return 'center';
			}
			if (iconPosition === 'right') {
				return 'right';
			}
			return 'left';
		};

		// Calculate item layout styles
		const itemStyles = {
			display: 'flex',
			flexDirection: iconPosition === 'top' ? 'column' : 'row',
			alignItems: iconPosition === 'top' ? 'center' : 'flex-start',
			gap: iconPosition === 'top' ? '12px' : '16px',
			...(iconPosition === 'right' && { flexDirection: 'row-reverse' }),
		};

		// Calculate icon wrapper styles
		const iconWrapperStyles = {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...(iconBackgroundColor
				? {
						width: `${iconSize + 16}px`,
						height: `${iconSize + 16}px`,
						minWidth: `${iconSize + 16}px`,
						backgroundColor:
							convertPresetToCSSVar(iconBackgroundColor),
						padding: '8px',
						borderRadius: '4px',
						boxSizing: 'border-box',
					}
				: {
						width: `${iconSize}px`,
						height: `${iconSize}px`,
						minWidth: `${iconSize}px`,
					}),
			...(iconColor && {
				color: convertPresetToCSSVar(iconColor),
				'--dsgo-icon-color': convertPresetToCSSVar(iconColor),
			}),
		};

		// Get block wrapper props
		const blockProps = useBlockProps.save({
			className: `dsgo-icon-list-item dsgo-icon-list-item--icon-${iconPosition}`,
			style: itemStyles,
		});

		// Configure inner blocks props
		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'dsgo-icon-list-item__content',
			style: {
				textAlign: getTextAlign(),
				display: 'flex',
				flexDirection: 'column',
				gap: `${contentGap}px`,
			},
		});

		// Wrap in link if URL is provided
		const ItemWrapper = linkUrl ? 'a' : 'div';
		const wrapperProps = linkUrl
			? {
					...blockProps,
					href: linkUrl,
					target: linkTarget,
					rel: linkRel || undefined,
				}
			: blockProps;

		return (
			<ItemWrapper {...wrapperProps}>
				<div
					className="dsgo-icon-list-item__icon"
					style={iconWrapperStyles}
				>
					{getIcon(icon)}
				</div>

				<div {...innerBlocksProps} />
			</ItemWrapper>
		);
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

export default [v1];
