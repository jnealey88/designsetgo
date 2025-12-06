/**
 * Icon Button Block - Save Component
 *
 * Renders the frontend output for the icon button.
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Icon Button Save Component
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {JSX.Element} Icon Button save component
 */
export default function IconButtonSave({ attributes }) {
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

	// Extract WordPress color values (must match edit.js)
	// Custom colors come from style.color.background (hex/rgb)
	// Preset colors come from backgroundColor/textColor (slugs that need conversion)
	const bgColor =
		style?.color?.background ||
		(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
	const txtColor =
		style?.color?.text ||
		(textColor && `var(--wp--preset--color--${textColor})`);

	// Calculate button styles (must match edit.js)
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

	// Calculate icon wrapper styles (must match edit.js)
	const iconWrapperStyles = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		flexShrink: 0,
	};

	// Build animation class (must match edit.js)
	const animationClass =
		hoverAnimation && hoverAnimation !== 'none'
			? ` dsgo-icon-button--${hoverAnimation}`
			: '';

	// Build width class for CSS-based width handling (must match edit.js)
	// Default to auto width for any non-100% value
	const widthClass =
		width === '100%'
			? ' dsgo-icon-button--width-full'
			: ' dsgo-icon-button--width-auto';

	// wp-block-button class enables theme.json button styles to cascade to wp-block-button__link
	const blockProps = useBlockProps.save({
		className: `dsgo-icon-button wp-block-button${animationClass}${widthClass}`,
		// Let block wrapper be block-level to respect WordPress content width constraints
		// Width styling is now handled via CSS classes on both wrapper and inner element
	});

	// Wrap in link if URL is provided
	// wp-element-button + wp-block-button__link classes inherit theme.json button styles
	const ButtonWrapper = url ? 'a' : 'div';
	const wrapperProps = url
		? {
				className:
					'dsgo-icon-button__wrapper wp-element-button wp-block-button__link',
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
				className:
					'dsgo-icon-button__wrapper wp-element-button wp-block-button__link',
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
}
