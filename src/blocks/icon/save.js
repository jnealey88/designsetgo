/**
 * Icon Block - Save Component
 *
 * Renders the icon on the frontend
 */

import { useBlockProps } from '@wordpress/block-editor';

export default function IconSave({ attributes }) {
	const {
		icon,
		iconSize,
		rotation,
		shape,
		shapePadding,
		linkUrl,
		linkTarget,
		linkRel,
	} = attributes;

	// Block wrapper props
	const blockProps = useBlockProps.save({
		className: 'dsg-icon',
	});

	// Icon wrapper classes
	const iconClasses = `dsg-icon__wrapper shape-${shape}`;

	// Icon wrapper styles
	const iconWrapperStyle = {
		fontSize: `${iconSize}px`,
		padding: shape !== 'none' ? `${shapePadding}px` : undefined,
	};

	// Icon styles
	const iconStyle = {
		transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
	};

	const iconElement = (
		<div className={iconClasses} style={iconWrapperStyle}>
			<span
				className={`dashicons dashicons-${icon}`}
				style={iconStyle}
			/>
		</div>
	);

	return (
		<div {...blockProps}>
			{linkUrl ? (
				<a
					href={linkUrl}
					target={linkTarget}
					rel={linkTarget === '_blank' ? linkRel || 'noopener noreferrer' : undefined}
					className="dsg-icon__link"
				>
					{iconElement}
				</a>
			) : (
				iconElement
			)}
		</div>
	);
}
