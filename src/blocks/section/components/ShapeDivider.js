/**
 * Shape Divider Component
 *
 * Renders an SVG shape divider for section blocks.
 * Used in both edit.js and save.js for consistent rendering.
 *
 * @since 1.4.2
 */

import { getShapeDivider } from '../utils/shape-dividers';

/**
 * Shape Divider Component
 *
 * @param {Object}  props          Component props
 * @param {string}  props.shape    Shape name from SHAPE_DIVIDERS
 * @param {string}  props.color    Fill color for the shape
 * @param {number}  props.height   Height in pixels
 * @param {number}  props.width    Width percentage (100-300)
 * @param {boolean} props.flipX    Flip horizontally
 * @param {boolean} props.flipY    Flip vertically
 * @param {boolean} props.front    Bring to front (above content)
 * @param {string}  props.position 'top' or 'bottom'
 * @return {JSX.Element|null} Shape divider element or null
 */
export default function ShapeDivider({
	shape,
	color,
	height = 100,
	width = 100,
	flipX = false,
	flipY = false,
	front = false,
	position = 'top',
}) {
	// Don't render if no shape selected
	if (!shape) {
		return null;
	}

	// Get the shape SVG element
	const shapeElement = getShapeDivider(shape);
	if (!shapeElement) {
		return null;
	}

	// Build transform for flipping
	// Bottom shapes are rotated 180deg by default (to point into section)
	const transforms = [];

	if (flipX) {
		transforms.push('scaleX(-1)');
	}

	// For bottom position, default is rotated (pointing into section)
	// flipY inverts this behavior
	if (position === 'bottom' && !flipY) {
		transforms.push('rotateX(180deg)');
	} else if (position !== 'bottom' && flipY) {
		// For top position, flipY rotates it
		transforms.push('rotateX(180deg)');
	}

	// Calculate width offset for stretched shapes (centering)
	const widthOffset = width > 100 ? (width - 100) / 2 : 0;

	// Build className
	const className = [
		'dsgo-shape-divider',
		`dsgo-shape-divider--${position}`,
		front && 'dsgo-shape-divider--front',
	]
		.filter(Boolean)
		.join(' ');

	// Build inline styles
	const style = {
		'--dsgo-shape-height': `${height}px`,
		'--dsgo-shape-width': `${width}%`,
		'--dsgo-shape-offset': `-${widthOffset}%`,
		'--dsgo-shape-color': color || 'currentColor',
	};

	return (
		<div className={className} style={style} aria-hidden="true">
			<svg
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				style={{
					transform:
						transforms.length > 0
							? transforms.join(' ')
							: undefined,
				}}
			>
				{shapeElement}
			</svg>
		</div>
	);
}
