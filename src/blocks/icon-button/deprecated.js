/**
 * Icon Button Block - Deprecated Versions
 *
 * Handles backward compatibility for blocks saved with previous versions.
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';
import { convertPaddingValue } from './utils/padding';

/**
 * Version 6: Before align-based full-width
 *
 * Changes in current version:
 * - Removed width attribute toggle (auto/100%)
 * - Full-width now uses WordPress alignment system (alignfull)
 * - Removed dsgo-icon-button--width-full and --width-auto classes
 * - Width attribute "100%" migrated to align: "full"
 */
const v6 = {
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
		modalCloseId: {
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
			fontSize,
			modalCloseId,
		} = attributes;

		// Extract WordPress color values
		const bgColor =
			style?.color?.background ||
			(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
		const txtColor =
			style?.color?.text ||
			(textColor && `var(--wp--preset--color--${textColor})`);

		// Extract font size
		const fontSizeValue =
			style?.typography?.fontSize ||
			(fontSize && `var(--wp--preset--font-size--${fontSize})`);

		// Extract padding
		const paddingValue = style?.spacing?.padding;

		// OLD: Combined styles - used width attribute for full-width
		const buttonStyles = {
			display: width === '100%' ? 'flex' : 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: iconPosition !== 'none' && icon ? iconGap : 0,
			width: width === '100%' ? '100%' : 'auto',
			flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
			...(bgColor && { backgroundColor: bgColor }),
			...(txtColor && { color: txtColor }),
			...(fontSizeValue && { fontSize: fontSizeValue }),
			...(paddingValue && {
				paddingTop: convertPaddingValue(paddingValue.top),
				paddingRight: convertPaddingValue(paddingValue.right),
				paddingBottom: convertPaddingValue(paddingValue.bottom),
				paddingLeft: convertPaddingValue(paddingValue.left),
			}),
			...(hoverBackgroundColor && {
				'--dsgo-button-hover-bg': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-button-hover-color': hoverTextColor,
			}),
		};

		// Icon wrapper styles
		const iconWrapperStyles = {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: `${iconSize}px`,
			height: `${iconSize}px`,
			flexShrink: 0,
		};

		// Animation class
		const animationClass =
			hoverAnimation && hoverAnimation !== 'none'
				? ` dsgo-icon-button--${hoverAnimation}`
				: '';

		// OLD: Width class based on width attribute
		const widthClass =
			width === '100%'
				? ' dsgo-icon-button--width-full'
				: ' dsgo-icon-button--width-auto';

		const ButtonElement = url ? 'a' : 'button';

		const blockProps = useBlockProps.save({
			className: `dsgo-icon-button wp-block-button wp-block-button__link wp-element-button${animationClass}${widthClass}`,
			style: buttonStyles,
			...(url && {
				href: url,
				target: linkTarget,
				rel:
					linkTarget === '_blank'
						? rel || 'noopener noreferrer'
						: rel || undefined,
			}),
			...(!url && {
				type: 'button',
			}),
			...(modalCloseId && {
				'data-dsgo-modal-close': modalCloseId,
			}),
		});

		return (
			<ButtonElement {...blockProps}>
				{iconPosition !== 'none' && icon && (
					<span
						className="dsgo-icon-button__icon dsgo-lazy-icon"
						style={iconWrapperStyles}
						data-icon-name={icon}
						data-icon-size={iconSize}
					/>
				)}
				<RichText.Content
					tagName="span"
					className="dsgo-icon-button__text"
					value={text}
				/>
			</ButtonElement>
		);
	},
	migrate(attributes) {
		// Migrate width="100%" to align="full"
		const { width, ...rest } = attributes;
		return {
			...rest,
			align: width === '100%' ? 'full' : attributes.align,
			width: 'auto', // Reset width to auto (no longer used)
		};
	},
};

/**
 * Version 5: Before simplified width options
 *
 * Changes in current version:
 * - Removed 50% and 25% width options (now only auto and 100%)
 * - Changed display to flex for 100% width (was inline-flex for all)
 * - Width values 50% and 25% migrated to auto
 */
const v5 = {
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
		modalCloseId: {
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
			fontSize,
			modalCloseId,
		} = attributes;

		// Extract WordPress color values
		const bgColor =
			style?.color?.background ||
			(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
		const txtColor =
			style?.color?.text ||
			(textColor && `var(--wp--preset--color--${textColor})`);

		// Extract font size
		const fontSizeValue =
			style?.typography?.fontSize ||
			(fontSize && `var(--wp--preset--font-size--${fontSize})`);

		// Extract padding
		const paddingValue = style?.spacing?.padding;

		// OLD: Combined styles - always used inline-flex and raw width value
		const buttonStyles = {
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: iconPosition !== 'none' && icon ? iconGap : 0,
			width: width === 'auto' ? 'auto' : width,
			flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
			...(bgColor && { backgroundColor: bgColor }),
			...(txtColor && { color: txtColor }),
			...(fontSizeValue && { fontSize: fontSizeValue }),
			...(paddingValue && {
				paddingTop: convertPaddingValue(paddingValue.top),
				paddingRight: convertPaddingValue(paddingValue.right),
				paddingBottom: convertPaddingValue(paddingValue.bottom),
				paddingLeft: convertPaddingValue(paddingValue.left),
			}),
			...(hoverBackgroundColor && {
				'--dsgo-button-hover-bg': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-button-hover-color': hoverTextColor,
			}),
		};

		// Icon wrapper styles
		const iconWrapperStyles = {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: `${iconSize}px`,
			height: `${iconSize}px`,
			flexShrink: 0,
		};

		// Animation class
		const animationClass =
			hoverAnimation && hoverAnimation !== 'none'
				? ` dsgo-icon-button--${hoverAnimation}`
				: '';

		// Width class
		const widthClass =
			width === '100%'
				? ' dsgo-icon-button--width-full'
				: ' dsgo-icon-button--width-auto';

		const ButtonElement = url ? 'a' : 'button';

		const blockProps = useBlockProps.save({
			className: `dsgo-icon-button wp-block-button wp-block-button__link wp-element-button${animationClass}${widthClass}`,
			style: buttonStyles,
			...(url && {
				href: url,
				target: linkTarget,
				rel:
					linkTarget === '_blank'
						? rel || 'noopener noreferrer'
						: rel || undefined,
			}),
			...(!url && {
				type: 'button',
			}),
			...(modalCloseId && {
				'data-dsgo-modal-close': modalCloseId,
			}),
		});

		return (
			<ButtonElement {...blockProps}>
				{iconPosition !== 'none' && icon && (
					<span
						className="dsgo-icon-button__icon dsgo-lazy-icon"
						style={iconWrapperStyles}
						data-icon-name={icon}
						data-icon-size={iconSize}
					/>
				)}
				<RichText.Content
					tagName="span"
					className="dsgo-icon-button__text"
					value={text}
				/>
			</ButtonElement>
		);
	},
	migrate(attributes) {
		// Convert old percentage widths to auto, and 100% to alignfull
		const { width, ...rest } = attributes;
		const isFullWidth = width === '100%';
		return {
			...rest,
			align: isFullWidth ? 'full' : attributes.align,
			width: 'auto', // Reset width to auto (no longer used for full-width)
		};
	},
};

/**
 * Version 4: Before collapsing to single element structure
 *
 * Changes in current version:
 * - Removed inner wrapper div/a element
 * - Merged all classes and styles onto single element
 * - Button is now single <a> tag instead of <div><a>...</a></div>
 * - Fixes wp-block-button__link class conflicts with theme.json
 * - Visual styles moved to outer wrapper (border-radius fix)
 */
const v4 = {
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
		modalCloseId: {
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
			fontSize,
			modalCloseId,
		} = attributes;

		// Extract WordPress color values
		const bgColor =
			style?.color?.background ||
			(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
		const txtColor =
			style?.color?.text ||
			(textColor && `var(--wp--preset--color--${textColor})`);

		// Extract font size
		const fontSizeValue =
			style?.typography?.fontSize ||
			(fontSize && `var(--wp--preset--font-size--${fontSize})`);

		// Extract padding
		const paddingValue = style?.spacing?.padding;

		// Visual styles applied to outer wrapper
		const visualStyles = {
			...(bgColor && { backgroundColor: bgColor }),
			...(txtColor && { color: txtColor }),
			...(fontSizeValue && { fontSize: fontSizeValue }),
			...(paddingValue && {
				paddingTop: convertPaddingValue(paddingValue.top),
				paddingRight: convertPaddingValue(paddingValue.right),
				paddingBottom: convertPaddingValue(paddingValue.bottom),
				paddingLeft: convertPaddingValue(paddingValue.left),
			}),
			...(hoverBackgroundColor && {
				'--dsgo-button-hover-bg': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-button-hover-color': hoverTextColor,
			}),
		};

		// Layout styles for inner wrapper
		const layoutStyles = {
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: iconPosition !== 'none' && icon ? iconGap : 0,
			width: width === 'auto' ? 'auto' : width,
			flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
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
				? ` dsgo-icon-button--${hoverAnimation}`
				: '';

		// Build width class
		const widthClass =
			width === '100%'
				? ' dsgo-icon-button--width-full'
				: ' dsgo-icon-button--width-auto';

		// OLD: Two-div structure with outer wrapper and inner wrapper
		const blockProps = useBlockProps.save({
			className: `dsgo-icon-button wp-block-button wp-element-button${animationClass}${widthClass}`,
			style: visualStyles,
		});

		// OLD: Inner wrapper with wp-block-button__link class
		const ButtonWrapper = url ? 'a' : 'div';
		const wrapperProps = url
			? {
					className:
						'dsgo-icon-button__wrapper wp-block-button__link',
					style: layoutStyles,
					href: url,
					target: linkTarget,
					rel:
						linkTarget === '_blank'
							? rel || 'noopener noreferrer'
							: rel || undefined,
					...(modalCloseId && {
						'data-dsgo-modal-close': modalCloseId || 'true',
					}),
				}
			: {
					className:
						'dsgo-icon-button__wrapper wp-block-button__link',
					style: layoutStyles,
					...(modalCloseId && {
						'data-dsgo-modal-close': modalCloseId || 'true',
					}),
				};

		return (
			<div {...blockProps}>
				<ButtonWrapper {...wrapperProps}>
					{iconPosition !== 'none' && icon && (
						<span
							className="dsgo-icon-button__icon dsgo-lazy-icon"
							style={iconWrapperStyles}
							data-icon-name={icon}
							data-icon-size={iconSize}
						/>
					)}
					<RichText.Content
						tagName="span"
						className="dsgo-icon-button__text"
						value={text}
					/>
				</ButtonWrapper>
			</div>
		);
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

/**
 * Version 3: Before CSS-based width handling
 *
 * Changes in current version:
 * - Removed inline display/width styles from block wrapper
 * - Added CSS classes for width control (--width-auto, --width-full)
 * - Block wrapper is now block-level by default to respect WordPress content width
 */
const v3 = {
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
		modalCloseId: {
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
			modalCloseId,
		} = attributes;

		// Extract WordPress color values
		const bgColor =
			style?.color?.background ||
			(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
		const txtColor =
			style?.color?.text ||
			(textColor && `var(--wp--preset--color--${textColor})`);

		// Calculate button styles
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
				'--dsgo-button-hover-bg': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-button-hover-color': hoverTextColor,
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
				? ` dsgo-icon-button--${hoverAnimation}`
				: '';

		// OLD: Inline display/width styles on block wrapper
		const blockProps = useBlockProps.save({
			className: `dsgo-icon-button${animationClass}`,
			style: {
				display: width === '100%' ? 'block' : 'inline-block',
				...(width === 'auto' && {
					width: 'fit-content',
					maxWidth: 'fit-content',
				}),
			},
		});

		// Wrap in link if URL is provided
		const ButtonWrapper = url ? 'a' : 'div';
		const wrapperProps = url
			? {
					className: 'dsgo-icon-button__wrapper',
					style: buttonStyles,
					href: url,
					target: linkTarget,
					rel:
						linkTarget === '_blank'
							? rel || 'noopener noreferrer'
							: rel || undefined,
					...(modalCloseId && {
						'data-dsgo-modal-close': modalCloseId || 'true',
					}),
				}
			: {
					className: 'dsgo-icon-button__wrapper',
					style: buttonStyles,
					...(modalCloseId && {
						'data-dsgo-modal-close': modalCloseId || 'true',
					}),
				};

		return (
			<div {...blockProps}>
				<ButtonWrapper {...wrapperProps}>
					{iconPosition !== 'none' && icon && (
						<span
							className="dsgo-icon-button__icon dsgo-lazy-icon"
							style={iconWrapperStyles}
							data-icon-name={icon}
							data-icon-size={iconSize}
						/>
					)}
					<RichText.Content
						tagName="span"
						className="dsgo-icon-button__text"
						value={text}
					/>
				</ButtonWrapper>
			</div>
		);
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

/**
 * Version 2: Before lazy loading icon library
 *
 * Changes in current version:
 * - Icons now use data attributes for frontend lazy loading
 * - Frontend icons injected via PHP to avoid bundling 51KB library
 * - Editor still uses getIcon() from shared library
 */
const v2 = {
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
		modalCloseId: {
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
			modalCloseId,
		} = attributes;

		// Extract WordPress color values
		const bgColor =
			style?.color?.background ||
			(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
		const txtColor =
			style?.color?.text ||
			(textColor && `var(--wp--preset--color--${textColor})`);

		// Calculate button styles
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
				'--dsgo-button-hover-bg': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-button-hover-color': hoverTextColor,
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
				? ` dsgo-icon-button--${hoverAnimation}`
				: '';

		const blockProps = useBlockProps.save({
			className: `dsgo-icon-button${animationClass}`,
			style: {
				display: width === '100%' ? 'block' : 'inline-block',
				...(width === 'auto' && {
					width: 'fit-content',
					maxWidth: 'fit-content',
				}),
			},
		});

		// Wrap in link if URL is provided
		const ButtonWrapper = url ? 'a' : 'div';
		const wrapperProps = url
			? {
					className: 'dsgo-icon-button__wrapper',
					style: buttonStyles,
					href: url,
					target: linkTarget,
					rel:
						linkTarget === '_blank'
							? rel || 'noopener noreferrer'
							: rel || undefined,
					...(modalCloseId && {
						'data-dsgo-modal-close': modalCloseId,
					}),
				}
			: {
					className: 'dsgo-icon-button__wrapper',
					style: buttonStyles,
					...(modalCloseId && {
						'data-dsgo-modal-close': modalCloseId,
					}),
				};

		return (
			<div {...blockProps}>
				<ButtonWrapper {...wrapperProps}>
					{iconPosition !== 'none' && icon && (
						<span
							className="dsgo-icon-button__icon"
							style={iconWrapperStyles}
						>
							{getIcon(icon)}
						</span>
					)}
					<RichText.Content
						tagName="span"
						className="dsgo-icon-button__text"
						value={text}
					/>
				</ButtonWrapper>
			</div>
		);
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

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
				'--dsgo-button-hover-bg': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsgo-button-hover-color': hoverTextColor,
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
				? ` dsgo-icon-button--${hoverAnimation}`
				: '';

		const blockProps = useBlockProps.save({
			className: `dsgo-icon-button${animationClass}`,
			style: { display: width === '100%' ? 'block' : 'inline-block' },
		});

		// Wrap in link if URL is provided
		const ButtonWrapper = url ? 'a' : 'div';
		const wrapperProps = url
			? {
					className: 'dsgo-icon-button__wrapper',
					style: buttonStyles,
					href: url,
					target: linkTarget,
					rel:
						linkTarget === '_blank'
							? rel || 'noopener noreferrer'
							: rel || undefined,
				}
			: {
					className: 'dsgo-icon-button__wrapper',
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
								className="dsgo-icon-button__icon"
								style={iconWrapperStyles}
							>
								{getIcon(icon)}
							</span>
						)}
					{text && (
						<RichText.Content
							tagName="span"
							value={text}
							className="dsgo-icon-button__text"
						/>
					)}
					{iconPosition === 'end' && icon && (
						<span
							className="dsgo-icon-button__icon"
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

export default [v6, v5, v4, v3, v2, v1];
