/**
 * Icon Block - Edit Component
 *
 * Display icons from WordPress Dashicons library with customizable
 * size, rotation, background shape, and optional link.
 *
 * @since 1.0.0
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { IconSettingsPanel } from './components/inspector/IconSettingsPanel';
import { ShapeSettingsPanel } from './components/inspector/ShapeSettingsPanel';
import { LinkSettingsPanel } from './components/inspector/LinkSettingsPanel';
import {
	calculateIconWrapperStyle,
	calculateIconStyle,
	getIconWrapperClasses,
} from './utils/icon-styles';

/**
 * Edit component
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Edit component
 */
export default function IconEdit({ attributes, setAttributes }) {
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
	const blockPropsRaw = useBlockProps({
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

	// Calculate styles using utilities
	const iconWrapperStyle = calculateIconWrapperStyle({
		iconSize,
		shape,
		shapePadding,
		backgroundColor,
	});

	const iconStyle = calculateIconStyle({ rotation });

	const iconClasses = getIconWrapperClasses(shape);

	return (
		<>
			<InspectorControls>
				<IconSettingsPanel
					icon={icon}
					iconSize={iconSize}
					rotation={rotation}
					setAttributes={setAttributes}
				/>
				<ShapeSettingsPanel
					shape={shape}
					shapePadding={shapePadding}
					setAttributes={setAttributes}
				/>
				<LinkSettingsPanel
					linkUrl={linkUrl}
					linkTarget={linkTarget}
					linkRel={linkRel}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div className={iconClasses} style={iconWrapperStyle}>
					<span
						className={`dashicons dashicons-${icon}`}
						style={iconStyle}
					/>
				</div>
			</div>
		</>
	);
}
