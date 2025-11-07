import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import classnames from 'classnames';

export default function SlideEdit({ attributes, setAttributes, context }) {
	const {
		backgroundImage,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		enableOverlay,
		overlayColor,
		overlayOpacity,
		contentVerticalAlign,
		contentHorizontalAlign,
		minHeight,
	} = attributes;

	// Get context from parent slider
	const sliderEffect = context['designsetgo/slider/effect'];
	const styleVariation = context['designsetgo/slider/styleVariation'];

	// Declaratively calculate classes
	const slideClasses = classnames('dsg-slide', {
		'dsg-slide--has-background': backgroundImage?.url,
		'dsg-slide--has-overlay': enableOverlay,
		[`dsg-slide--${styleVariation}`]: styleVariation,
	});

	// Background image styles
	const backgroundStyles = backgroundImage?.url
		? {
				backgroundImage: `url(${backgroundImage.url})`,
				backgroundSize,
				backgroundPosition,
				backgroundRepeat,
			}
		: {};

	// Overlay styles
	const overlayStyles = enableOverlay
		? {
				'--dsg-slide-overlay-color': overlayColor,
				'--dsg-slide-overlay-opacity': String(overlayOpacity / 100),
			}
		: {};

	// Content alignment styles
	const alignmentStyles = {
		'--dsg-slide-content-vertical-align': contentVerticalAlign,
		'--dsg-slide-content-horizontal-align': contentHorizontalAlign,
	};

	// Min height override
	const heightStyles = minHeight ? { minHeight } : {};

	// Block wrapper props
	const blockProps = useBlockProps({
		className: slideClasses,
		style: {
			...backgroundStyles,
			...overlayStyles,
			...alignmentStyles,
			...heightStyles,
		},
		role: 'group',
		'aria-roledescription': 'slide',
	});

	// Inner blocks configuration - Allow any blocks
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-slide__content',
		},
		{
			template: [
				[
					'core/heading',
					{
						level: 2,
						placeholder: __('Add slide title…', 'designsetgo'),
						textAlign: 'center',
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __('Add slide content…', 'designsetgo'),
						align: 'center',
					},
				],
			],
			templateLock: false,
		}
	);

	// Background image handler
	const onSelectImage = (media) => {
		setAttributes({
			backgroundImage: {
				id: media.id,
				url: media.url,
				alt: media.alt || '',
			},
		});
	};

	const onRemoveImage = () => {
		setAttributes({
			backgroundImage: {
				id: 0,
				url: '',
				alt: '',
			},
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Background Image', 'designsetgo')}
					initialOpen={true}
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={['image']}
							value={backgroundImage?.id}
							render={({ open }) => (
								<>
									{!backgroundImage?.url ? (
										<Button
											onClick={open}
											variant="secondary"
											style={{
												width: '100%',
												marginBottom: '12px',
											}}
										>
											{__(
												'Select Background Image',
												'designsetgo'
											)}
										</Button>
									) : (
										<div style={{ marginBottom: '12px' }}>
											<img
												src={backgroundImage.url}
												alt={backgroundImage.alt}
												style={{
													width: '100%',
													height: 'auto',
													borderRadius: '4px',
													marginBottom: '8px',
												}}
											/>
											<div
												style={{
													display: 'flex',
													gap: '8px',
												}}
											>
												<Button
													onClick={open}
													variant="secondary"
													style={{ flex: 1 }}
												>
													{__(
														'Replace Image',
														'designsetgo'
													)}
												</Button>
												<Button
													onClick={onRemoveImage}
													variant="secondary"
													isDestructive
													style={{ flex: 1 }}
												>
													{__(
														'Remove Image',
														'designsetgo'
													)}
												</Button>
											</div>
										</div>
									)}
								</>
							)}
						/>
					</MediaUploadCheck>

					{backgroundImage?.url && (
						<>
							<SelectControl
								label={__('Background Size', 'designsetgo')}
								value={backgroundSize}
								options={[
									{
										label: __('Cover', 'designsetgo'),
										value: 'cover',
									},
									{
										label: __('Contain', 'designsetgo'),
										value: 'contain',
									},
									{
										label: __('Auto', 'designsetgo'),
										value: 'auto',
									},
								]}
								onChange={(value) =>
									setAttributes({ backgroundSize: value })
								}
								help={__(
									'How the background image fills the slide',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label={__('Background Position', 'designsetgo')}
								value={backgroundPosition}
								options={[
									{
										label: __(
											'Center Center',
											'designsetgo'
										),
										value: 'center center',
									},
									{
										label: __('Top Center', 'designsetgo'),
										value: 'top center',
									},
									{
										label: __(
											'Bottom Center',
											'designsetgo'
										),
										value: 'bottom center',
									},
									{
										label: __('Left Center', 'designsetgo'),
										value: 'left center',
									},
									{
										label: __(
											'Right Center',
											'designsetgo'
										),
										value: 'right center',
									},
									{
										label: __('Top Left', 'designsetgo'),
										value: 'top left',
									},
									{
										label: __('Top Right', 'designsetgo'),
										value: 'top right',
									},
									{
										label: __('Bottom Left', 'designsetgo'),
										value: 'bottom left',
									},
									{
										label: __(
											'Bottom Right',
											'designsetgo'
										),
										value: 'bottom right',
									},
								]}
								onChange={(value) =>
									setAttributes({ backgroundPosition: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<hr
								style={{
									margin: '16px 0',
									borderColor: '#ddd',
								}}
							/>

							<ToggleControl
								label={__('Enable Overlay', 'designsetgo')}
								checked={enableOverlay}
								onChange={(value) =>
									setAttributes({ enableOverlay: value })
								}
								help={
									enableOverlay
										? __(
												'Overlay applied to background',
												'designsetgo'
											)
										: __('No overlay', 'designsetgo')
								}
								__nextHasNoMarginBottom
							/>

							{enableOverlay && (
								<>
									<PanelColorGradientSettings
										title={__(
											'Overlay Color',
											'designsetgo'
										)}
										settings={[
											{
												colorValue: overlayColor,
												onColorChange: (value) =>
													setAttributes({
														overlayColor:
															value || '#000000',
													}),
												label: __(
													'Color',
													'designsetgo'
												),
											},
										]}
										__experimentalIsRenderedInSidebar
									/>

									<RangeControl
										label={__(
											'Overlay Opacity',
											'designsetgo'
										)}
										value={overlayOpacity}
										onChange={(value) =>
											setAttributes({
												overlayOpacity: value,
											})
										}
										min={0}
										max={100}
										help={__(
											'Opacity of the overlay',
											'designsetgo'
										)}
										__next40pxDefaultSize
										__nextHasNoMarginBottom
									/>
								</>
							)}
						</>
					)}
				</PanelBody>

				<PanelBody
					title={__('Content Alignment', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Vertical Alignment', 'designsetgo')}
						value={contentVerticalAlign}
						options={[
							{
								label: __('Top', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Bottom', 'designsetgo'),
								value: 'flex-end',
							},
						]}
						onChange={(value) =>
							setAttributes({ contentVerticalAlign: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Horizontal Alignment', 'designsetgo')}
						value={contentHorizontalAlign}
						options={[
							{
								label: __('Left', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Right', 'designsetgo'),
								value: 'flex-end',
							},
						]}
						onChange={(value) =>
							setAttributes({ contentHorizontalAlign: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Min Height Override', 'designsetgo')}
						value={minHeight}
						onChange={(value) =>
							setAttributes({ minHeight: value })
						}
						units={[
							{ value: 'px', label: 'px', default: 0 },
							{ value: 'vh', label: 'vh', default: 0 },
						]}
						help={__(
							'Override slider height for this slide only (leave empty to use slider settings)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{enableOverlay && (
					<div
						className="dsg-slide__overlay"
						style={{
							backgroundColor: overlayColor,
							opacity: overlayOpacity / 100,
						}}
					/>
				)}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
