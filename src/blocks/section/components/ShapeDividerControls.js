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
	SHAPE_DIVIDER_OPTIONS,
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

	return (
		<>
			<PanelBody
				title={__('Top Shape Divider', 'designsetgo')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Shape', 'designsetgo')}
					value={shapeDividerTop}
					options={SHAPE_DIVIDER_OPTIONS}
					onChange={(value) =>
						setAttributes({ shapeDividerTop: value })
					}
					__nextHasNoMarginBottom
				/>

				{shapeDividerTop && (
					<>
						<ShapePreview
							shape={shapeDividerTop}
							color={shapeDividerTopColor}
							flipX={shapeDividerTopFlipX}
							flipY={shapeDividerTopFlipY}
							isBottom={false}
						/>

						<ColorGradientSettingsDropdown
							panelId={clientId}
							settings={[
								{
									label: __('Color', 'designsetgo'),
									colorValue: shapeDividerTopColor,
									onColorChange: (color) =>
										setAttributes({
											shapeDividerTopColor: color || '',
										}),
									clearable: true,
								},
							]}
							{...colorGradientSettings}
						/>

						<RangeControl
							label={__('Height', 'designsetgo')}
							value={shapeDividerTopHeight}
							onChange={(value) =>
								setAttributes({ shapeDividerTopHeight: value })
							}
							min={10}
							max={500}
							step={1}
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={__('Width', 'designsetgo')}
							value={shapeDividerTopWidth}
							onChange={(value) =>
								setAttributes({ shapeDividerTopWidth: value })
							}
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
									checked={shapeDividerTopFlipX}
									onChange={(value) =>
										setAttributes({
											shapeDividerTopFlipX: value,
										})
									}
									__nextHasNoMarginBottom
								/>
							</FlexItem>
							<FlexItem>
								<ToggleControl
									label={__('Flip Vertical', 'designsetgo')}
									checked={shapeDividerTopFlipY}
									onChange={(value) =>
										setAttributes({
											shapeDividerTopFlipY: value,
										})
									}
									__nextHasNoMarginBottom
								/>
							</FlexItem>
						</Flex>

						<ToggleControl
							label={__('Bring to Front', 'designsetgo')}
							checked={shapeDividerTopFront}
							onChange={(value) =>
								setAttributes({ shapeDividerTopFront: value })
							}
							help={__(
								'Display the shape above the section content.',
								'designsetgo'
							)}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody
				title={__('Bottom Shape Divider', 'designsetgo')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Shape', 'designsetgo')}
					value={shapeDividerBottom}
					options={SHAPE_DIVIDER_OPTIONS}
					onChange={(value) =>
						setAttributes({ shapeDividerBottom: value })
					}
					__nextHasNoMarginBottom
				/>

				{shapeDividerBottom && (
					<>
						<ShapePreview
							shape={shapeDividerBottom}
							color={shapeDividerBottomColor}
							flipX={shapeDividerBottomFlipX}
							flipY={shapeDividerBottomFlipY}
							isBottom={true}
						/>

						<ColorGradientSettingsDropdown
							panelId={clientId}
							settings={[
								{
									label: __('Color', 'designsetgo'),
									colorValue: shapeDividerBottomColor,
									onColorChange: (color) =>
										setAttributes({
											shapeDividerBottomColor:
												color || '',
										}),
									clearable: true,
								},
							]}
							{...colorGradientSettings}
						/>

						<RangeControl
							label={__('Height', 'designsetgo')}
							value={shapeDividerBottomHeight}
							onChange={(value) =>
								setAttributes({
									shapeDividerBottomHeight: value,
								})
							}
							min={10}
							max={500}
							step={1}
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={__('Width', 'designsetgo')}
							value={shapeDividerBottomWidth}
							onChange={(value) =>
								setAttributes({
									shapeDividerBottomWidth: value,
								})
							}
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
									checked={shapeDividerBottomFlipX}
									onChange={(value) =>
										setAttributes({
											shapeDividerBottomFlipX: value,
										})
									}
									__nextHasNoMarginBottom
								/>
							</FlexItem>
							<FlexItem>
								<ToggleControl
									label={__('Flip Vertical', 'designsetgo')}
									checked={shapeDividerBottomFlipY}
									onChange={(value) =>
										setAttributes({
											shapeDividerBottomFlipY: value,
										})
									}
									__nextHasNoMarginBottom
								/>
							</FlexItem>
						</Flex>

						<ToggleControl
							label={__('Bring to Front', 'designsetgo')}
							checked={shapeDividerBottomFront}
							onChange={(value) =>
								setAttributes({
									shapeDividerBottomFront: value,
								})
							}
							help={__(
								'Display the shape above the section content.',
								'designsetgo'
							)}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>
		</>
	);
}
