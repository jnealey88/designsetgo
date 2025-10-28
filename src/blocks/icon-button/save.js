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
	} = attributes;

	// Calculate button styles (must match edit.js)
	const buttonStyles = {
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

	const blockProps = useBlockProps.save({
		className: 'dsg-icon-button',
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
