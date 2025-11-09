/**
 * Icon Block - Save Component
 *
 * Renders inline SVG icon on the frontend
 */

import { useBlockProps } from '@wordpress/block-editor';
import { getIcon } from './utils/svg-icons';

export default function IconSave({ attributes }) {
	const {
		icon,
		iconStyle,
		strokeWidth,
		iconSize,
		rotation,
		linkUrl,
		linkTarget,
		linkRel,
		ariaLabel,
		isDecorative,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsg-icon',
		style: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	});

	// Icon wrapper styles
	const iconWrapperStyle = {
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
		// Background is inherited via CSS rules (see style.scss)
		// borderRadius inherits from parent for shape variants
		borderRadius: 'inherit',
	};

	// Determine ARIA attributes based on accessibility settings
	const getAriaAttributes = () => {
		// If decorative, hide from assistive technology
		if (isDecorative) {
			return {
				role: 'presentation',
				'aria-hidden': 'true',
			};
		}

		// If has custom label, use it
		if (ariaLabel) {
			return {
				role: 'img',
				'aria-label': ariaLabel,
			};
		}

		// Fallback to icon name (convert to readable format)
		const fallbackLabel = icon
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());

		return {
			role: 'img',
			'aria-label': fallbackLabel,
		};
	};

	const ariaAttributes = getAriaAttributes();

	const iconElement = (
		<div
			className="dsg-icon__wrapper"
			style={iconWrapperStyle}
			{...ariaAttributes}
		>
			{getIcon(icon, iconStyle, strokeWidth)}
		</div>
	);

	return (
		<div {...blockProps}>
			{linkUrl ? (
				<a
					href={linkUrl}
					target={linkTarget}
					rel={
						linkTarget === '_blank'
							? linkRel || 'noopener noreferrer'
							: linkRel || undefined
					}
				>
					{iconElement}
				</a>
			) : (
				iconElement
			)}
		</div>
	);
}
