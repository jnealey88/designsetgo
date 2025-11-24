/**
 * Modal Trigger Block - Deprecated Versions
 *
 * Handles backward compatibility for blocks saved with previous versions.
 *
 * @since 1.2.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';

/**
 * Version 1: Before lazy loading icon library
 *
 * Changes in current version:
 * - Icons now use data attributes for frontend lazy loading
 * - Frontend icons injected via PHP to avoid bundling 51KB library
 */
const v1 = {
	attributes: {
		targetModalId: {
			type: 'string',
			default: '',
		},
		text: {
			type: 'string',
			default: 'Open Modal',
		},
		buttonStyle: {
			type: 'string',
			default: 'fill',
		},
		width: {
			type: 'string',
			default: 'auto',
		},
		icon: {
			type: 'string',
			default: '',
		},
		iconPosition: {
			type: 'string',
			default: 'none',
		},
		iconSize: {
			type: 'number',
			default: 20,
		},
		iconGap: {
			type: 'string',
			default: '8px',
		},
	},
	save({ attributes }) {
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
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

export default [v1];
