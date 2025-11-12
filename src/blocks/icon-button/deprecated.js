/**
 * Icon Button Block - Deprecated Versions
 *
 * Handles backward compatibility for blocks saved with previous versions.
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';

/**
 * Version 1: Before padding split logic
 *
 * Changes in current version:
 * - Added splitPaddingStyles utility to properly handle padding
 * - Padding is now applied to button wrapper instead of outer div
 */
const v1 = {
	attributes: {
		text: {
			type: 'string',
			default: '',
		},
		url: {
			type: 'string',
			default: '',
		},
		linkTarget: {
			type: 'string',
			default: '_self',
		},
		rel: {
			type: 'string',
			default: '',
		},
		icon: {
			type: 'string',
			default: 'lightbulb',
		},
		iconPosition: {
			type: 'string',
			default: 'start',
		},
		iconSize: {
			type: 'number',
			default: 20,
		},
		iconGap: {
			type: 'string',
			default: '8px',
		},
		width: {
			type: 'string',
			default: 'auto',
		},
		hoverAnimation: {
			type: 'string',
			default: 'none',
		},
		hoverBackgroundColor: {
			type: 'string',
			default: '',
		},
		hoverTextColor: {
			type: 'string',
			default: '',
		},
	},
	save({ attributes }) {
		const {
			text,
			url,
			linkTarget,
			rel,
			icon,
			iconPosition,
			iconSize,
			iconGap,
			width,
			hoverAnimation,
			hoverBackgroundColor,
			hoverTextColor,
			style,
			backgroundColor,
			textColor,
		} = attributes;

		// Extract WordPress color values (must match edit.js)
		const bgColor =
			style?.color?.background ||
			(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
		const txtColor =
			style?.color?.text ||
			(textColor && `var(--wp--preset--color--${textColor})`);

		// Calculate button styles - OLD VERSION (without splitPaddingStyles)
		const buttonStyles = {
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: iconPosition !== 'none' && icon ? iconGap : 0,
			width: width === 'auto' ? 'auto' : width,
			flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
			...(bgColor && { backgroundColor: bgColor }),
			...(txtColor && { color: txtColor }),
			...(hoverBackgroundColor && {
				'--dsg-button-hover-bg': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsg-button-hover-color': hoverTextColor,
			}),
		};

		// Calculate icon wrapper styles
		const iconWrapperStyles = {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: `${iconSize}px`,
			height: `${iconSize}px`,
			flexShrink: 0,
		};

		// Build animation class
		const animationClass =
			hoverAnimation && hoverAnimation !== 'none'
				? ` dsg-icon-button--${hoverAnimation}`
				: '';

		const blockProps = useBlockProps.save({
			className: `dsg-icon-button${animationClass}`,
			style: { display: width === '100%' ? 'block' : 'inline-block' },
		});

		// Wrap in link if URL is provided
		const ButtonWrapper = url ? 'a' : 'div';
		const wrapperProps = url
			? {
					className: 'dsg-icon-button__wrapper',
					style: buttonStyles,
					href: url,
					target: linkTarget,
					rel:
						linkTarget === '_blank'
							? rel || 'noopener noreferrer'
							: rel || undefined,
				}
			: {
					className: 'dsg-icon-button__wrapper',
					style: buttonStyles,
					role: 'button',
				};

		return (
			<div {...blockProps}>
				<ButtonWrapper {...wrapperProps}>
					{iconPosition !== 'none' &&
						iconPosition !== 'end' &&
						icon && (
							<span
								className="dsg-icon-button__icon"
								style={iconWrapperStyles}
							>
								{getIcon(icon)}
							</span>
						)}
					{text && (
						<RichText.Content
							tagName="span"
							value={text}
							className="dsg-icon-button__text"
						/>
					)}
					{iconPosition === 'end' && icon && (
						<span
							className="dsg-icon-button__icon"
							style={iconWrapperStyles}
						>
							{getIcon(icon)}
						</span>
					)}
				</ButtonWrapper>
			</div>
		);
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

export default [v1];
