/**
 * Modal Trigger Block - Save Component
 *
 * @package
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

	// Get icon element with fallback
	const iconElement = icon ? getIcon(icon) : null;

	return (
		<div {...blockProps}>
			<button
				className="dsgo-modal-trigger__button"
				data-dsgo-modal-trigger={targetModalId}
				style={buttonStyles}
				type="button"
			>
				{iconElement && iconPosition === 'start' && (
					<span
						className="dsgo-modal-trigger__icon"
						style={iconWrapperStyles}
					>
						{iconElement}
					</span>
				)}
				<RichText.Content
					tagName="span"
					value={text}
					className="dsgo-modal-trigger__text"
				/>
				{iconElement && iconPosition === 'end' && (
					<span
						className="dsgo-modal-trigger__icon"
						style={iconWrapperStyles}
					>
						{iconElement}
					</span>
				)}
			</button>
		</div>
	);
}
