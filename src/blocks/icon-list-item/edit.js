/**
 * Icon List Item Block - Edit Component
 *
 * Child block that displays a single list item with icon and flexible content area.
 * Users can add any blocks in the content area. Default template includes an h4 heading.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';
import { IconPickerPanel } from './components/inspector/IconPickerPanel';
import { LinkSettingsPanel } from './components/inspector/LinkSettingsPanel';

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
	const { icon, linkUrl } = attributes;

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

	// Configure inner blocks with h4 heading as default template
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-icon-list-item__content',
			style: {
				textAlign: getTextAlign(),
			},
		},
		{
			template: [
				[
					'core/heading',
					{
						level: 4,
						placeholder: __('List item title…', 'designsetgo'),
					},
				],
			],
			templateLock: false, // Allow adding/removing blocks
		}
	);

	return (
		<>
			<InspectorControls>
				<IconPickerPanel icon={icon} setAttributes={setAttributes} />
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

				<div {...innerBlocksProps} />

				{linkUrl && (
					<div className="dsg-icon-list-item__link-indicator">🔗</div>
				)}
			</div>
		</>
	);
}
