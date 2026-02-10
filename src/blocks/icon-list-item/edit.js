/**
 * Icon List Item Block - Edit Component
 *
 * Child block that displays a single list item with icon and flexible content area.
 * Users can add any blocks in the content area. Default template includes a paragraph.
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
import { SpacingPanel } from './components/inspector/SpacingPanel';

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
	const { icon, linkUrl, contentGap } = attributes;

	// Get settings from parent via context
	const iconSize = context['designsetgo/iconList/iconSize'] || 32;
	const iconColor = context['designsetgo/iconList/iconColor'] || '';
	const iconBackgroundColor =
		context['designsetgo/iconList/iconBackgroundColor'] || '';
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
	const blockProps = useBlockProps({
		className: `dsgo-icon-list-item dsgo-icon-list-item--icon-${iconPosition}`,
		style: itemStyles,
	});

	// Configure inner blocks with paragraph as default template
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsgo-icon-list-item__content',
			style: {
				textAlign: getTextAlign(),
				display: 'flex',
				flexDirection: 'column',
				gap: `${contentGap}px`,
			},
		},
		{
			template: [
				[
					'core/paragraph',
					{
						placeholder: __('List item text…', 'designsetgo'),
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
				<SpacingPanel
					contentGap={contentGap}
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
					className="dsgo-icon-list-item__icon"
					style={iconWrapperStyles}
				>
					{getIcon(icon)}
				</div>

				<div {...innerBlocksProps} />

				{linkUrl && (
					<div className="dsgo-icon-list-item__link-indicator">
						🔗
					</div>
				)}
			</div>
		</>
	);
}
