/**
 * Modal Block - Editor Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

export default function ModalEdit({ attributes, setAttributes, clientId }) {
	const {
		modalId,
		width,
		maxWidth,
		height,
		maxHeight,
		animationType,
		animationDuration,
		overlayOpacity,
		overlayColor,
		overlayBlur,
		closeOnBackdrop,
		closeOnEsc,
		showCloseButton,
		closeButtonPosition,
		closeButtonSize,
		disableBodyScroll,
	} = attributes;

	// Generate unique modal ID on first load
	useEffect(() => {
		if (!modalId) {
			setAttributes({ modalId: `dsgo-modal-${clientId}` });
		}
	}, [modalId, clientId, setAttributes]);

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const blockProps = useBlockProps({
		className: 'dsgo-modal-editor-preview',
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsgo-modal__content',
			style: {
				width,
				maxWidth,
				height: height !== 'auto' ? height : undefined,
				maxHeight: height !== 'auto' ? maxHeight : undefined,
			},
		},
		{
			template: [
				[
					'core/heading',
					{
						level: 2,
						placeholder: __('Modal Title', 'designsetgo'),
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __(
							'Add your modal content here...',
							'designsetgo'
						),
					},
				],
			],
			templateLock: false,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Modal Settings', 'designsetgo')}
					initialOpen={true}
				>
					<TextControl
						label={__('Modal ID', 'designsetgo')}
						value={modalId}
						onChange={(value) =>
							setAttributes({ modalId: value })
						}
						help={__(
							'Unique identifier for this modal. Used by triggers.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Width', 'designsetgo')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						units={[
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'vw', label: 'vw' },
						]}
						__next40pxDefaultSize
					/>

					<UnitControl
						label={__('Max Width', 'designsetgo')}
						value={maxWidth}
						onChange={(value) =>
							setAttributes({ maxWidth: value })
						}
						units={[
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'vw', label: 'vw' },
						]}
						__next40pxDefaultSize
					/>

					<SelectControl
						label={__('Height', 'designsetgo')}
						value={height}
						onChange={(value) => setAttributes({ height: value })}
						options={[
							{
								label: __('Auto', 'designsetgo'),
								value: 'auto',
							},
							{
								label: __('Custom', 'designsetgo'),
								value: 'custom',
							},
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{height !== 'auto' && (
						<UnitControl
							label={__('Max Height', 'designsetgo')}
							value={maxHeight}
							onChange={(value) =>
								setAttributes({ maxHeight: value })
							}
							units={[
								{ value: 'px', label: 'px' },
								{ value: 'vh', label: 'vh' },
							]}
							__next40pxDefaultSize
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__('Animation', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Animation Type', 'designsetgo')}
						value={animationType}
						onChange={(value) =>
							setAttributes({ animationType: value })
						}
						options={[
							{
								label: __('Fade', 'designsetgo'),
								value: 'fade',
							},
							{
								label: __('Slide Up', 'designsetgo'),
								value: 'slide-up',
							},
							{
								label: __('Slide Down', 'designsetgo'),
								value: 'slide-down',
							},
							{
								label: __('Zoom In', 'designsetgo'),
								value: 'zoom',
							},
							{ label: __('None', 'designsetgo'), value: 'none' },
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Animation Duration (ms)', 'designsetgo')}
						value={animationDuration}
						onChange={(value) =>
							setAttributes({ animationDuration: value })
						}
						min={0}
						max={1000}
						step={50}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Overlay', 'designsetgo')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Overlay Opacity (%)', 'designsetgo')}
						value={overlayOpacity}
						onChange={(value) =>
							setAttributes({ overlayOpacity: value })
						}
						min={0}
						max={100}
						step={5}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Backdrop Blur (px)', 'designsetgo')}
						value={overlayBlur}
						onChange={(value) =>
							setAttributes({ overlayBlur: value })
						}
						min={0}
						max={20}
						step={1}
						help={__(
							'Blurs the background content when modal is open.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Close Button', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show Close Button', 'designsetgo')}
						checked={showCloseButton}
						onChange={(value) =>
							setAttributes({ showCloseButton: value })
						}
						__nextHasNoMarginBottom
					/>

					{showCloseButton && (
						<>
							<SelectControl
								label={__('Position', 'designsetgo')}
								value={closeButtonPosition}
								onChange={(value) =>
									setAttributes({
										closeButtonPosition: value,
									})
								}
								options={[
									{
										label: __('Top Right', 'designsetgo'),
										value: 'top-right',
									},
									{
										label: __('Top Left', 'designsetgo'),
										value: 'top-left',
									},
									{
										label: __(
											'Inside Top Right',
											'designsetgo'
										),
										value: 'inside-top-right',
									},
									{
										label: __(
											'Inside Top Left',
											'designsetgo'
										),
										value: 'inside-top-left',
									},
								]}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<RangeControl
								label={__('Button Size (px)', 'designsetgo')}
								value={closeButtonSize}
								onChange={(value) =>
									setAttributes({ closeButtonSize: value })
								}
								min={16}
								max={48}
								step={2}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>

				<PanelBody
					title={__('Behavior', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Close on Backdrop Click', 'designsetgo')}
						checked={closeOnBackdrop}
						onChange={(value) =>
							setAttributes({ closeOnBackdrop: value })
						}
						help={__(
							'Allow closing the modal by clicking outside of it.',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Close on ESC Key', 'designsetgo')}
						checked={closeOnEsc}
						onChange={(value) =>
							setAttributes({ closeOnEsc: value })
						}
						help={__(
							'Allow closing the modal with the Escape key.',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Disable Body Scroll', 'designsetgo')}
						checked={disableBodyScroll}
						onChange={(value) =>
							setAttributes({ disableBodyScroll: value })
						}
						help={__(
							'Prevent scrolling the page when modal is open.',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

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
							clearable: false,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div className="dsgo-modal-editor-preview__label">
					<span>
						{__('Modal:', 'designsetgo')} <code>{modalId}</code>
					</span>
					<span className="dsgo-modal-editor-preview__note">
						{__(
							'Hidden by default. Use a Modal Trigger to open it.',
							'designsetgo'
						)}
					</span>
				</div>

				<div
					className="dsgo-modal-editor-preview__backdrop"
					style={{
						backgroundColor: overlayColor,
						opacity: overlayOpacity / 100,
					}}
				/>

				<div className="dsgo-modal-editor-preview__dialog">
					{showCloseButton &&
						!closeButtonPosition.startsWith('inside-') && (
							<button
								className={`dsgo-modal__close dsgo-modal__close--${closeButtonPosition}`}
								style={{
									width: `${closeButtonSize}px`,
									height: `${closeButtonSize}px`,
								}}
								aria-label={__('Close modal', 'designsetgo')}
								disabled
							>
								<svg
									width="100%"
									height="100%"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 6L6 18M6 6L18 18"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						)}

					<div
						{...innerBlocksProps}
						className={`${innerBlocksProps.className}${
							showCloseButton &&
							closeButtonPosition.startsWith('inside-')
								? ' has-inside-close-button'
								: ''
						}`}
					>
						{innerBlocksProps.children}
						{showCloseButton &&
							closeButtonPosition.startsWith('inside-') && (
								<button
									className={`dsgo-modal__close dsgo-modal__close--${closeButtonPosition}`}
									style={{
										width: `${closeButtonSize}px`,
										height: `${closeButtonSize}px`,
									}}
									aria-label={__(
										'Close modal',
										'designsetgo'
									)}
									disabled
								>
									<svg
										width="100%"
										height="100%"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M18 6L6 18M6 6L18 18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							)}
					</div>
				</div>
			</div>
		</>
	);
}
