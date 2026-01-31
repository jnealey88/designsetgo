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

	// Visual styles applied to outer wrapper (must match edit.js)
	// Colors, padding, font size, and hover effects go on the outer wrapper
	// This ensures background and border apply to the same element
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

	// Layout styles for inner wrapper (must match edit.js)
	// Only structural/layout properties, no visual styles
	const layoutStyles = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: iconPosition !== 'none' && icon ? iconGap : 0,
		width: width === 'auto' ? 'auto' : width,
		flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
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
	// Visual styles (colors, padding, hover) applied to outer wrapper to align with WordPress border controls
	const blockProps = useBlockProps.save({
		className: `dsgo-icon-button wp-block-button wp-element-button${animationClass}${widthClass}`,
		style: visualStyles,
	});

	// Wrap in link if URL is provided
	// Inner wrapper only handles layout, no visual classes needed
	const ButtonWrapper = url ? 'a' : 'div';
	const wrapperProps = url
		? {
				className: 'dsgo-icon-button__wrapper',
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
				className: 'dsgo-icon-button__wrapper',
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
}
