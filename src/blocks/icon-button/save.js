/**
 * Icon Button Block - Save Component
 *
 * Renders the frontend output for the icon button.
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { convertPaddingValue } from './utils/padding';

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
		fontSize,
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

	// Extract font size (must match edit.js)
	// Custom font sizes come from style.typography.fontSize (px/rem/em)
	// Preset font sizes come from fontSize (slug that needs conversion)
	const fontSizeValue =
		style?.typography?.fontSize ||
		(fontSize && `var(--wp--preset--font-size--${fontSize})`);

	// Extract padding (must match edit.js)
	const paddingValue = style?.spacing?.padding;

	// Combined styles for single element (must match edit.js)
	// Visual styles (colors, padding, font size, hover) + layout styles (flexbox)
	// Use flex for full-width, inline-flex for auto to work with CSS classes
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

	// Single element with all classes and styles combined
	// wp-block-button and wp-element-button enable theme.json button styles
	// wp-block-button__link ensures theme compatibility
	// Conditionally render as <a> (with URL) or <button> (without URL)
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
}
