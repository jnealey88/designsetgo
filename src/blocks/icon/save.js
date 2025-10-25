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

	// Get block props with WordPress styles
	const blockPropsRaw = useBlockProps.save({
		className: 'dsg-icon',
	});

	// Extract background color from WordPress
	const backgroundColor = blockPropsRaw.style?.backgroundColor;

	// Remove background from outer wrapper (we'll apply it to inner wrapper)
	const blockProps = {
		...blockPropsRaw,
		style: {
			...blockPropsRaw.style,
			background: 'transparent',
			backgroundColor: undefined,
		},
	};

	// Icon wrapper classes
	const iconClasses = `dsg-icon__wrapper shape-${shape}`;

	// Icon wrapper styles - apply background color to wrapper instead of outer div
	const iconWrapperStyle = {
		fontSize: `${iconSize}px`,
		padding: shape !== 'none' ? `${shapePadding}px` : undefined,
		backgroundColor: shape !== 'none' ? backgroundColor : undefined,
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
