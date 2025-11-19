/**
 * Modal Trigger Block - Save Component
 *
 * @package DesignSetGo
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';

export default function save({ attributes }) {
	const {
		targetModalId,
		text,
		buttonStyle,
		width,
		icon,
		iconPosition,
		iconSize,
		iconGap,
	} = attributes;

	const buttonStyles = {
		gap: iconPosition !== 'none' && icon ? iconGap : undefined,
		flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
	};

	const iconWrapperStyles = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		flexShrink: 0,
	};

	const blockProps = useBlockProps.save({
		className: `dsgo-modal-trigger dsgo-modal-trigger--${buttonStyle} dsgo-modal-trigger--width-${width}`,
		style: { display: width === 'full' ? 'block' : 'inline-block' },
	});

	return (
		<div {...blockProps}>
			<button
				className="dsgo-modal-trigger__button"
				data-dsgo-modal-trigger={targetModalId}
				style={buttonStyles}
				type="button"
			>
				{icon && iconPosition === 'start' && iconPosition !== 'none' && (
					<span
						className="dsgo-modal-trigger__icon"
						style={iconWrapperStyles}
					>
						{getIcon(icon)}
					</span>
				)}
				<RichText.Content
					tagName="span"
					value={text}
					className="dsgo-modal-trigger__text"
				/>
				{icon && iconPosition === 'end' && iconPosition !== 'none' && (
					<span
						className="dsgo-modal-trigger__icon"
						style={iconWrapperStyles}
					>
						{getIcon(icon)}
					</span>
				)}
			</button>
		</div>
	);
}
