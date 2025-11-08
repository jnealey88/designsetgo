/**
 * Icon Button Block - Save Component
 *
 * Renders the frontend output for the icon button.
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';

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
			'--dsg-button-hover-bg': hoverBackgroundColor,
		}),
		...(hoverTextColor && {
			'--dsg-button-hover-color': hoverTextColor,
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
			};

	return (
		<div {...blockProps}>
			<ButtonWrapper {...wrapperProps}>
				{iconPosition !== 'none' && icon && (
					<span
						className="dsg-icon-button__icon"
						style={iconWrapperStyles}
					>
						{getIcon(icon)}
					</span>
				)}
				<RichText.Content
					tagName="span"
					className="dsg-icon-button__text"
					value={text}
				/>
			</ButtonWrapper>
		</div>
	);
}
