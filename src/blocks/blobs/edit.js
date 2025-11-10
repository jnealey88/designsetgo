/**
 * Blobs Block - Editor Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import classnames from 'classnames';

export default function BlobsEdit({ attributes, setAttributes, clientId }) {
	const wrapperRef = useRef(null);
	const {
		blobShape,
		blobAnimation,
		animationDuration,
		animationEasing,
		size,
		enableOverlay,
		overlayColor,
		overlayOpacity,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Calculate classes
	const blobClasses = classnames('dsg-blobs', {
		[`dsg-blobs--${blobShape}`]: blobShape,
		[`dsg-blobs--${blobAnimation}`]:
			blobAnimation && blobAnimation !== 'none',
	});

	// Apply animation settings as CSS custom properties
	const customStyles = {
		'--dsg-blob-size': size,
		'--dsg-blob-animation-duration': animationDuration,
		'--dsg-blob-animation-easing': animationEasing,
	};

	// Get block props with our wrapper class
	const blockProps = useBlockProps({
		className: 'dsg-blobs-wrapper',
		ref: wrapperRef,
	});

	// Transfer background styles from wrapper to blob in editor
	useEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		const wrapper = wrapperRef.current;
		const blob = wrapper.querySelector('.dsg-blobs');
		if (!blob) {
			return;
		}

		// WordPress sets inline styles on the wrapper
		// We need to read inline styles directly because our CSS has `background: none !important;`
		const inlineStyle = wrapper.style;

		// Transfer background image
		if (
			inlineStyle.backgroundImage &&
			inlineStyle.backgroundImage !== 'none'
		) {
			blob.style.setProperty(
				'background-image',
				inlineStyle.backgroundImage
			);
		} else {
			blob.style.removeProperty('background-image');
		}

		// Transfer background size
		if (
			inlineStyle.backgroundSize &&
			inlineStyle.backgroundSize !== 'auto'
		) {
			blob.style.setProperty(
				'background-size',
				inlineStyle.backgroundSize
			);
		}

		// Transfer background position
		if (inlineStyle.backgroundPosition) {
			blob.style.setProperty(
				'background-position',
				inlineStyle.backgroundPosition
			);
		}

		// Transfer background repeat
		if (
			inlineStyle.backgroundRepeat &&
			inlineStyle.backgroundRepeat !== 'repeat'
		) {
			blob.style.setProperty(
				'background-repeat',
				inlineStyle.backgroundRepeat
			);
		}

		// Transfer background attachment
		if (
			inlineStyle.backgroundAttachment &&
			inlineStyle.backgroundAttachment !== 'scroll'
		) {
			blob.style.setProperty(
				'background-attachment',
				inlineStyle.backgroundAttachment
			);
		}

		// Transfer background color
		if (inlineStyle.backgroundColor) {
			blob.style.setProperty(
				'background-color',
				inlineStyle.backgroundColor
			);
		} else {
			blob.style.removeProperty('background-color');
		}
	}); // Run on every render to catch style changes

	// Inner blocks for content inside blob
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-blobs__content',
		},
		{
			template: [
				[
					'core/heading',
					{
						level: 2,
						placeholder: __('Add title…', 'designsetgo'),
						textAlign: 'center',
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __('Add description…', 'designsetgo'),
						align: 'center',
					},
				],
			],
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Blob Settings', 'designsetgo')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Blob Shape', 'designsetgo')}
						value={blobShape}
						options={[
							{
								label: __('Classic Blob', 'designsetgo'),
								value: 'shape-1',
							},
							{
								label: __('Amoeba', 'designsetgo'),
								value: 'shape-2',
							},
							{
								label: __('Pebble', 'designsetgo'),
								value: 'shape-3',
							},
							{
								label: __('Splash', 'designsetgo'),
								value: 'shape-4',
							},
							{
								label: __('Drop', 'designsetgo'),
								value: 'shape-5',
							},
							{
								label: __('Cloud', 'designsetgo'),
								value: 'shape-6',
							},
						]}
						onChange={(value) =>
							setAttributes({ blobShape: value })
						}
						help={__(
							'Choose the organic shape style',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Blob Size', 'designsetgo')}
						value={size}
						onChange={(value) =>
							setAttributes({ size: value || '300px' })
						}
						units={[
							{ value: 'px', label: 'px', default: 300 },
							{ value: '%', label: '%', default: 100 },
							{ value: 'vw', label: 'vw', default: 30 },
							{ value: 'vh', label: 'vh', default: 30 },
						]}
						min={100}
						max={800}
						help={__(
							'Width and height of the blob shape',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Animation Type', 'designsetgo')}
						value={blobAnimation}
						options={[
							{ label: __('None', 'designsetgo'), value: 'none' },
							{
								label: __('Float', 'designsetgo'),
								value: 'float',
							},
							{
								label: __('Pulse', 'designsetgo'),
								value: 'pulse',
							},
							{ label: __('Spin', 'designsetgo'), value: 'spin' },
							{
								label: __('Morph Style 1', 'designsetgo'),
								value: 'morph-1',
							},
							{
								label: __('Morph Style 2', 'designsetgo'),
								value: 'morph-2',
							},
						]}
						onChange={(value) =>
							setAttributes({ blobAnimation: value })
						}
						help={__(
							'Float/Pulse/Spin keep your shape. Morph changes the shape itself.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Animation Duration', 'designsetgo')}
						value={animationDuration}
						onChange={(value) =>
							setAttributes({ animationDuration: value || '8s' })
						}
						units={[
							{ value: 's', label: 's', default: 8 },
							{ value: 'ms', label: 'ms', default: 8000 },
						]}
						min={1}
						max={30}
						help={__(
							'How long one animation cycle takes',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Animation Easing', 'designsetgo')}
						value={animationEasing}
						options={[
							{
								label: __('Linear', 'designsetgo'),
								value: 'linear',
							},
							{ label: __('Ease', 'designsetgo'), value: 'ease' },
							{
								label: __('Ease In', 'designsetgo'),
								value: 'ease-in',
							},
							{
								label: __('Ease Out', 'designsetgo'),
								value: 'ease-out',
							},
							{
								label: __('Ease In Out', 'designsetgo'),
								value: 'ease-in-out',
							},
						]}
						onChange={(value) =>
							setAttributes({ animationEasing: value })
						}
						help={__('Animation timing function', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Enable Background Overlay', 'designsetgo')}
						checked={enableOverlay}
						onChange={(value) =>
							setAttributes({ enableOverlay: value })
						}
						help={__(
							'Add a semi-transparent overlay over background images',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					{enableOverlay && (
						<>
							<RangeControl
								label={__('Overlay Opacity', 'designsetgo')}
								value={overlayOpacity}
								onChange={(value) =>
									setAttributes({ overlayOpacity: value })
								}
								min={0}
								max={100}
								help={__(
									'Overlay transparency (0 = transparent, 100 = opaque)',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			{enableOverlay && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Overlay Color', 'designsetgo')}
						settings={[
							{
								label: __('Overlay Color', 'designsetgo'),
								colorValue: overlayColor,
								onColorChange: (color) =>
									setAttributes({
										overlayColor: color || '#000000',
									}),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
			)}

			<div {...blockProps}>
				<div className={blobClasses} style={customStyles}>
					{enableOverlay && (
						<div
							className="dsg-blobs__overlay"
							style={{
								backgroundColor: overlayColor,
								opacity: overlayOpacity / 100,
							}}
						/>
					)}
					<div className="dsg-blobs__shape">
						<div {...innerBlocksProps} />
					</div>
				</div>
			</div>
		</>
	);
}
