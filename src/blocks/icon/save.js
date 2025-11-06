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

	const iconElement = (
		<div className="dsg-icon__wrapper" style={iconWrapperStyle}>
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
