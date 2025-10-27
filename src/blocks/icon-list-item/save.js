/**
 * Icon List Item Block - Save Component
 *
 * Renders the frontend output for a single icon list item.
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';

/**
 * Icon List Item Save Component
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Object} props.context    - Block context from parent
 * @return {JSX.Element} Icon List Item save component
 */
export default function IconListItemSave({ attributes, context = {} }) {
	const {
		icon,
		title,
		titleTag,
		description,
		descriptionTag,
		linkUrl,
		linkTarget,
		linkRel,
	} = attributes;

	// Get settings from parent via context with safe defaults
	const iconSize = context['designsetgo/iconList/iconSize'] || 32;
	const iconColor = context['designsetgo/iconList/iconColor'] || '';
	const iconPosition = context['designsetgo/iconList/iconPosition'] || 'left';

	// Calculate item layout styles (must match edit.js)
	const itemStyles = {
		display: 'flex',
		flexDirection: iconPosition === 'top' ? 'column' : 'row',
		alignItems: iconPosition === 'top' ? 'center' : 'flex-start',
		textAlign: iconPosition === 'top' ? 'center' : 'left',
		gap: iconPosition === 'top' ? '12px' : '16px',
	};

	// Calculate icon wrapper styles (must match edit.js)
	const iconWrapperStyles = {
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		minWidth: `${iconSize}px`,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		...(iconColor && {
			color: iconColor,
			'--dsg-icon-color': iconColor,
		}),
	};

	// Get block wrapper props
	const blockProps = useBlockProps.save({
		className: `dsg-icon-list-item dsg-icon-list-item--icon-${iconPosition}`,
		style: itemStyles,
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
			<div className="dsg-icon-list-item__icon" style={iconWrapperStyles}>
				{getIcon(icon)}
			</div>

			<div className="dsg-icon-list-item__content">
				{title && (
					<RichText.Content
						tagName={titleTag}
						className="dsg-icon-list-item__title"
						value={title}
					/>
				)}

				{description && (
					<RichText.Content
						tagName={descriptionTag}
						className="dsg-icon-list-item__description"
						value={description}
					/>
				)}
			</div>
		</ItemWrapper>
	);
}
