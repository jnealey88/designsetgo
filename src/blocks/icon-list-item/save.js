/**
 * Icon List Item Block - Save Component
 *
 * Renders the frontend output for a single icon list item with flexible content area.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Icon List Item Save Component
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Object} props.context    - Block context from parent
 * @return {JSX.Element} Icon List Item save component
 */
export default function IconListItemSave({ attributes, context = {} }) {
	const { icon, linkUrl, linkTarget, linkRel, contentGap } = attributes;

	// Get settings from parent via context with safe defaults
	const iconSize = context['designsetgo/iconList/iconSize'] || 32;
	const iconColor = context['designsetgo/iconList/iconColor'] || '';
	const iconBackgroundColor =
		context['designsetgo/iconList/iconBackgroundColor'] || '';
	const iconPosition = context['designsetgo/iconList/iconPosition'] || 'left';

	// Calculate text alignment based on icon position (must match edit.js)
	const getTextAlign = () => {
		if (iconPosition === 'top') {
			return 'center';
		}
		if (iconPosition === 'right') {
			return 'right';
		}
		return 'left';
	};

	// Calculate item layout styles (must match edit.js)
	const itemStyles = {
		display: 'flex',
		flexDirection: iconPosition === 'top' ? 'column' : 'row',
		alignItems: iconPosition === 'top' ? 'center' : 'flex-start',
		gap: iconPosition === 'top' ? '12px' : '16px',
		...(iconPosition === 'right' && { flexDirection: 'row-reverse' }),
	};

	// Calculate icon wrapper styles (must match edit.js)
	const iconWrapperStyles = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		...(iconBackgroundColor
			? {
					width: `${iconSize + 16}px`,
					height: `${iconSize + 16}px`,
					minWidth: `${iconSize + 16}px`,
					backgroundColor: iconBackgroundColor,
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
			color: iconColor,
			'--dsgo-icon-color': iconColor,
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
				className="dsgo-icon-list-item__icon dsgo-lazy-icon"
				style={iconWrapperStyles}
				data-icon-name={icon}
			/>

			<div {...innerBlocksProps} />
		</ItemWrapper>
	);
}
