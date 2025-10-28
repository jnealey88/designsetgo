/**
 * Icon List Item Block - Edit Component
 *
 * Child block that displays a single list item with icon, title, and description.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';
import { IconPickerPanel } from './components/inspector/IconPickerPanel';
import { LinkSettingsPanel } from './components/inspector/LinkSettingsPanel';
import { TextSettingsPanel } from './components/inspector/TextSettingsPanel';

/**
 * Icon List Item Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {Object}   props.context       - Block context from parent
 * @return {JSX.Element} Icon List Item edit component
 */
export default function IconListItemEdit({
	attributes,
	setAttributes,
	context,
}) {
	const { icon, title, titleTag, description, descriptionTag, linkUrl } =
		attributes;

	// Get settings from parent via context
	const iconSize = context['designsetgo/iconList/iconSize'] || 32;
	const iconColor = context['designsetgo/iconList/iconColor'] || '';
	const iconPosition = context['designsetgo/iconList/iconPosition'] || 'left';

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
		textAlign: getTextAlign(),
		gap: iconPosition === 'top' ? '12px' : '16px',
		...(iconPosition === 'right' && { flexDirection: 'row-reverse' }),
	};

	// Calculate icon wrapper styles
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
	const blockProps = useBlockProps({
		className: `dsg-icon-list-item dsg-icon-list-item--icon-${iconPosition}`,
		style: itemStyles,
	});

	return (
		<>
			<InspectorControls>
				<IconPickerPanel icon={icon} setAttributes={setAttributes} />
				<TextSettingsPanel
					titleTag={titleTag}
					descriptionTag={descriptionTag}
					setAttributes={setAttributes}
				/>
				<LinkSettingsPanel
					linkUrl={linkUrl}
					linkTarget={attributes.linkTarget}
					linkRel={attributes.linkRel}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div
					className="dsg-icon-list-item__icon"
					style={iconWrapperStyles}
				>
					{getIcon(icon)}
				</div>

				<div className="dsg-icon-list-item__content">
					<RichText
						tagName={titleTag}
						className="dsg-icon-list-item__title"
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						placeholder={__('List item title…', 'designsetgo')}
						allowedFormats={['core/bold', 'core/italic']}
					/>

					<RichText
						tagName={descriptionTag}
						className="dsg-icon-list-item__description"
						value={description}
						onChange={(value) =>
							setAttributes({ description: value })
						}
						placeholder={__(
							'Add description (optional)…',
							'designsetgo'
						)}
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/link',
						]}
					/>
				</div>

				{linkUrl && (
					<div className="dsg-icon-list-item__link-indicator">🔗</div>
				)}
			</div>
		</>
	);
}
