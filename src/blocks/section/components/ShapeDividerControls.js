/**
 * Shape Divider Controls Component
 *
 * Inspector panel controls for configuring shape dividers.
 *
 * @since 1.4.2
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	Flex,
	FlexItem,
} from '@wordpress/components';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	getShapeDividerOptions,
	getShapeDivider,
} from '../utils/shape-dividers';

/**
 * Shape preview component showing a small preview of the selected shape
 *
 * @param {Object}  props          Component props
 * @param {string}  props.shape    Shape name
 * @param {string}  props.color    Fill color
 * @param {boolean} props.flipX    Flip horizontally
 * @param {boolean} props.flipY    Flip vertically
 * @param {boolean} props.isBottom Whether this is a bottom divider
 * @return {JSX.Element|null} Preview element
 */
function ShapePreview({ shape, color, flipX, flipY, isBottom }) {
	if (!shape) {
		return null;
	}

	const shapeElement = getShapeDivider(shape);
	if (!shapeElement) {
		return null;
	}

	// Calculate transform based on flip settings
	const transforms = [];
	if (flipX) {
		transforms.push('scaleX(-1)');
	}
	// Bottom dividers are rotated 180 degrees by default, flipY inverts this
	if (isBottom ? !flipY : flipY) {
		transforms.push('scaleY(-1)');
	}

	return (
		<div
			style={{
				width: '100%',
				height: '40px',
				overflow: 'hidden',
				borderRadius: '4px',
				backgroundColor: '#f0f0f0',
				marginBottom: '12px',
			}}
		>
			<svg
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				style={{
					width: '100%',
					height: '100%',
					fill: color || 'currentColor',
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

/**
 * Reusable Shape Divider Panel Component
 * Renders controls for a single shape divider (top or bottom)
 *
 * @param {Object}   props               Component props
 * @param {string}   props.title         Panel title
 * @param {string}   props.shape         Selected shape value
 * @param {string}   props.color         Shape color
 * @param {number}   props.height        Shape height
 * @param {number}   props.width         Shape width percentage
 * @param {boolean}  props.flipX         Flip horizontal
 * @param {boolean}  props.flipY         Flip vertical
 * @param {boolean}  props.front         Bring to front
 * @param {boolean}  props.isBottom      Whether this is a bottom divider
 * @param {Function} props.onChange      Callback for attribute changes
 * @param {string}   props.clientId      Block client ID
 * @param {Object}   props.colorSettings Color gradient settings
 * @return {JSX.Element} Shape divider panel
 */
function ShapeDividerPanel({
	title,
	shape,
	color,
	height,
	width,
	flipX,
	flipY,
	front,
	isBottom,
	onChange,
	clientId,
	colorSettings,
}) {
	return (
		<PanelBody title={title} initialOpen={false}>
			<SelectControl
				label={__('Shape', 'designsetgo')}
				value={shape}
				options={getShapeDividerOptions()}
				onChange={(value) => onChange({ shape: value })}
				__nextHasNoMarginBottom
			/>

			{shape && (
				<>
					<ShapePreview
						shape={shape}
						color={color}
						flipX={flipX}
						flipY={flipY}
						isBottom={isBottom}
					/>

					<ColorGradientSettingsDropdown
						panelId={clientId}
						settings={[
							{
								label: __('Color', 'designsetgo'),
								colorValue: color,
								onColorChange: (newColor) =>
									onChange({ color: newColor || '' }),
								clearable: true,
							},
						]}
						{...colorSettings}
					/>

					<RangeControl
						label={__('Height', 'designsetgo')}
						value={height}
						onChange={(value) => onChange({ height: value })}
						min={10}
						max={500}
						step={1}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Width', 'designsetgo')}
						value={width}
						onChange={(value) => onChange({ width: value })}
						min={100}
						max={300}
						step={1}
						help={__(
							'Stretch the shape wider for more dramatic effect.',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					<Flex>
						<FlexItem>
							<ToggleControl
								label={__('Flip Horizontal', 'designsetgo')}
								checked={flipX}
								onChange={(value) => onChange({ flipX: value })}
								__nextHasNoMarginBottom
							/>
						</FlexItem>
						<FlexItem>
							<ToggleControl
								label={__('Flip Vertical', 'designsetgo')}
								checked={flipY}
								onChange={(value) => onChange({ flipY: value })}
								__nextHasNoMarginBottom
							/>
						</FlexItem>
					</Flex>

					<ToggleControl
						label={__('Bring to Front', 'designsetgo')}
						checked={front}
						onChange={(value) => onChange({ front: value })}
						help={__(
							'Display the shape above the section content.',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>
				</>
			)}
		</PanelBody>
	);
}

/**
 * Shape Divider Controls
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Shape divider controls
 */
export default function ShapeDividerControls({
	attributes,
	setAttributes,
	clientId,
}) {
	const {
		shapeDividerTop,
		shapeDividerTopColor,
		shapeDividerTopHeight,
		shapeDividerTopWidth,
		shapeDividerTopFlipX,
		shapeDividerTopFlipY,
		shapeDividerTopFront,
		shapeDividerBottom,
		shapeDividerBottomColor,
		shapeDividerBottomHeight,
		shapeDividerBottomWidth,
		shapeDividerBottomFlipX,
		shapeDividerBottomFlipY,
		shapeDividerBottomFront,
	} = attributes;

	// Get theme color palette
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Handler for top shape divider changes
	const handleTopChange = (changes) => {
		const attrMap = {
			shape: 'shapeDividerTop',
			color: 'shapeDividerTopColor',
			height: 'shapeDividerTopHeight',
			width: 'shapeDividerTopWidth',
			flipX: 'shapeDividerTopFlipX',
			flipY: 'shapeDividerTopFlipY',
			front: 'shapeDividerTopFront',
		};
		const newAttrs = {};
		Object.entries(changes).forEach(([key, value]) => {
			if (attrMap[key]) {
				newAttrs[attrMap[key]] = value;
			}
		});
		setAttributes(newAttrs);
	};

	// Handler for bottom shape divider changes
	const handleBottomChange = (changes) => {
		const attrMap = {
			shape: 'shapeDividerBottom',
			color: 'shapeDividerBottomColor',
			height: 'shapeDividerBottomHeight',
			width: 'shapeDividerBottomWidth',
			flipX: 'shapeDividerBottomFlipX',
			flipY: 'shapeDividerBottomFlipY',
			front: 'shapeDividerBottomFront',
		};
		const newAttrs = {};
		Object.entries(changes).forEach(([key, value]) => {
			if (attrMap[key]) {
				newAttrs[attrMap[key]] = value;
			}
		});
		setAttributes(newAttrs);
	};

	return (
		<>
			<ShapeDividerPanel
				title={__('Top Shape Divider', 'designsetgo')}
				shape={shapeDividerTop}
				color={shapeDividerTopColor}
				height={shapeDividerTopHeight}
				width={shapeDividerTopWidth}
				flipX={shapeDividerTopFlipX}
				flipY={shapeDividerTopFlipY}
				front={shapeDividerTopFront}
				isBottom={false}
				onChange={handleTopChange}
				clientId={clientId}
				colorSettings={colorGradientSettings}
			/>
			<ShapeDividerPanel
				title={__('Bottom Shape Divider', 'designsetgo')}
				shape={shapeDividerBottom}
				color={shapeDividerBottomColor}
				height={shapeDividerBottomHeight}
				width={shapeDividerBottomWidth}
				flipX={shapeDividerBottomFlipX}
				flipY={shapeDividerBottomFlipY}
				front={shapeDividerBottomFront}
				isBottom={true}
				onChange={handleBottomChange}
				clientId={clientId}
				colorSettings={colorGradientSettings}
			/>
		</>
	);
}
