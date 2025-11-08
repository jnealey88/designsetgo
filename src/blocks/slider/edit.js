import { __ } from '@wordpress/i18n';
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
	ToggleControl,
	SelectControl,
	RangeControl,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import classnames from 'classnames';

export default function SliderEdit({ attributes, setAttributes, clientId }) {
	const {
		slidesPerView,
		slidesPerViewTablet,
		slidesPerViewMobile,
		height,
		aspectRatio,
		useAspectRatio,
		gap,
		showArrows,
		showDots,
		arrowStyle,
		arrowPosition,
		arrowColor,
		arrowBackgroundColor,
		arrowSize,
		arrowPadding,
		dotStyle,
		dotPosition,
		dotColor,
		effect,
		transitionDuration,
		transitionEasing,
		autoplay,
		autoplayInterval,
		pauseOnHover,
		pauseOnInteraction,
		loop,
		draggable,
		swipeable,
		freeMode,
		centeredSlides,
		mobileBreakpoint,
		tabletBreakpoint,
		styleVariation,
		ariaLabel,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Editor navigation: scroll the track without state management
	const scrollToSlide = (direction) => {
		const track = document.querySelector(
			`[data-block="${clientId}"] .dsg-slider__track`
		);
		if (!track) {
			return;
		}

		const slide = track.querySelector('.dsg-slide');
		if (!slide) {
			return;
		}

		const slideWidth = slide.offsetWidth;
		const gapValue = parseFloat(window.getComputedStyle(track).gap) || 0;
		const scrollAmount = slideWidth + gapValue;

		track.scrollBy({
			left: direction === 'next' ? scrollAmount : -scrollAmount,
			behavior: 'smooth',
		});
	};

	const scrollToSlideIndex = (index) => {
		const track = document.querySelector(
			`[data-block="${clientId}"] .dsg-slider__track`
		);
		if (!track) {
			return;
		}

		const slide = track.querySelector('.dsg-slide');
		if (!slide) {
			return;
		}

		const slideWidth = slide.offsetWidth;
		const gapValue = parseFloat(window.getComputedStyle(track).gap) || 0;
		const scrollPosition = index * (slideWidth + gapValue);

		track.scrollTo({
			left: scrollPosition,
			behavior: 'smooth',
		});
	};

	// Declaratively calculate classes based on attributes
	const sliderClasses = classnames('dsg-slider', {
		[`dsg-slider--${styleVariation}`]: styleVariation,
		[`dsg-slider--effect-${effect}`]: effect,
		'dsg-slider--has-arrows': showArrows,
		'dsg-slider--has-dots': showDots,
		'dsg-slider--centered': centeredSlides,
		'dsg-slider--free-mode': freeMode,
	});

	// Apply settings as CSS custom properties
	const customStyles = {
		'--dsg-slider-height': height,
		'--dsg-slider-aspect-ratio': aspectRatio,
		'--dsg-slider-gap': gap,
		'--dsg-slider-transition': transitionDuration,
		'--dsg-slider-slides-per-view': String(slidesPerView),
		'--dsg-slider-slides-per-view-tablet': String(slidesPerViewTablet),
		'--dsg-slider-slides-per-view-mobile': String(slidesPerViewMobile),
		...(arrowColor && { '--dsg-slider-arrow-color': arrowColor }),
		...(arrowBackgroundColor && {
			'--dsg-slider-arrow-bg-color': arrowBackgroundColor,
		}),
		...(arrowSize && { '--dsg-slider-arrow-size': arrowSize }),
		...(arrowPadding && { '--dsg-slider-arrow-padding': arrowPadding }),
		...(dotColor && { '--dsg-slider-dot-color': dotColor }),
	};

	// Block wrapper props
	// Data attributes for JavaScript configuration and CSS selectors (match save.js)
	const blockProps = useBlockProps({
		className: sliderClasses,
		style: customStyles,
		'data-slides-per-view': slidesPerView,
		'data-slides-per-view-tablet': slidesPerViewTablet,
		'data-slides-per-view-mobile': slidesPerViewMobile,
		'data-use-aspect-ratio': useAspectRatio,
		'data-show-arrows': showArrows,
		'data-show-dots': showDots,
		'data-arrow-style': arrowStyle,
		'data-arrow-position': arrowPosition,
		'data-dot-style': dotStyle,
		'data-dot-position': dotPosition,
		'data-effect': effect,
	});

	// Inner blocks configuration - ONLY allow slide children
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-slider__track',
		},
		{
			allowedBlocks: ['designsetgo/slide'],
			template: [
				[
					'designsetgo/slide',
					{},
					[
						[
							'core/heading',
							{
								level: 2,
								content: __(
									'Slide 1: Beautiful Slider',
									'designsetgo'
								),
								textAlign: 'center',
							},
						],
						[
							'core/paragraph',
							{
								content: __(
									'Add any WordPress blocks inside slides. Click to edit or add background images.',
									'designsetgo'
								),
								align: 'center',
							},
						],
					],
				],
				[
					'designsetgo/slide',
					{},
					[
						[
							'core/heading',
							{
								level: 2,
								content: __(
									'Slide 2: Fully Customizable',
									'designsetgo'
								),
								textAlign: 'center',
							},
						],
						[
							'core/paragraph',
							{
								content: __(
									'Configure transitions, navigation, auto-play, and more in the settings panel.',
									'designsetgo'
								),
								align: 'center',
							},
						],
					],
				],
				[
					'designsetgo/slide',
					{},
					[
						[
							'core/heading',
							{
								level: 2,
								content: __(
									'Slide 3: Get Started',
									'designsetgo'
								),
								textAlign: 'center',
							},
						],
						[
							'core/paragraph',
							{
								content: __(
									'Replace these slides with your own content and images. Swipe, click arrows, or use keyboard to navigate.',
									'designsetgo'
								),
								align: 'center',
							},
						],
					],
				],
			],
			orientation: 'horizontal',
			renderAppender: false, // Hide default appender, we'll add custom UI
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Layout Settings', 'designsetgo')}
					initialOpen={true}
				>
					<RangeControl
						label={__('Slides Per View (Desktop)', 'designsetgo')}
						value={slidesPerView}
						onChange={(value) =>
							setAttributes({ slidesPerView: value })
						}
						min={1}
						max={6}
						help={__(
							'Number of slides visible at once',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Slides Per View (Tablet)', 'designsetgo')}
						value={slidesPerViewTablet}
						onChange={(value) =>
							setAttributes({ slidesPerViewTablet: value })
						}
						min={1}
						max={4}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Slides Per View (Mobile)', 'designsetgo')}
						value={slidesPerViewMobile}
						onChange={(value) =>
							setAttributes({ slidesPerViewMobile: value })
						}
						min={1}
						max={2}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Use Aspect Ratio', 'designsetgo')}
						checked={useAspectRatio}
						onChange={(value) =>
							setAttributes({ useAspectRatio: value })
						}
						help={
							useAspectRatio
								? __('Slider uses aspect ratio', 'designsetgo')
								: __('Slider uses fixed height', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>

					{useAspectRatio ? (
						<SelectControl
							label={__('Aspect Ratio', 'designsetgo')}
							value={aspectRatio}
							options={[
								{ label: '16:9', value: '16/9' },
								{ label: '4:3', value: '4/3' },
								{ label: '21:9', value: '21/9' },
								{ label: '1:1', value: '1/1' },
								{ label: '3:2', value: '3/2' },
							]}
							onChange={(value) =>
								setAttributes({ aspectRatio: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) : (
						<UnitControl
							label={__('Height', 'designsetgo')}
							value={height}
							onChange={(value) =>
								setAttributes({ height: value || '500px' })
							}
							units={[
								{ value: 'px', label: 'px', default: 500 },
								{ value: 'vh', label: 'vh', default: 50 },
								{ value: 'rem', label: 'rem', default: 30 },
							]}
							min={200}
							max={1000}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<UnitControl
						label={__('Gap Between Slides', 'designsetgo')}
						value={gap}
						onChange={(value) =>
							setAttributes({ gap: value || '20px' })
						}
						units={[
							{ value: 'px', label: 'px', default: 20 },
							{ value: 'rem', label: 'rem', default: 1.25 },
						]}
						min={0}
						max={64}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Navigation Settings', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show Arrows', 'designsetgo')}
						checked={showArrows}
						onChange={(value) =>
							setAttributes({ showArrows: value })
						}
						__nextHasNoMarginBottom
					/>

					{showArrows && (
						<>
							<SelectControl
								label={__('Arrow Style', 'designsetgo')}
								value={arrowStyle}
								options={[
									{
										label: __('Default', 'designsetgo'),
										value: 'default',
									},
									{
										label: __('Circle', 'designsetgo'),
										value: 'circle',
									},
									{
										label: __('Square', 'designsetgo'),
										value: 'square',
									},
									{
										label: __('Minimal', 'designsetgo'),
										value: 'minimal',
									},
								]}
								onChange={(value) =>
									setAttributes({ arrowStyle: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label={__('Arrow Position', 'designsetgo')}
								value={arrowPosition}
								options={[
									{
										label: __('Sides', 'designsetgo'),
										value: 'sides',
									},
									{
										label: __('Inside', 'designsetgo'),
										value: 'inside',
									},
									{
										label: __('Outside', 'designsetgo'),
										value: 'outside',
									},
								]}
								onChange={(value) =>
									setAttributes({ arrowPosition: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}

					{showArrows && (
						<>
							<UnitControl
								label={__('Arrow Size', 'designsetgo')}
								value={arrowSize}
								onChange={(value) =>
									setAttributes({ arrowSize: value })
								}
								units={[
									{ value: 'px', label: 'px' },
									{ value: 'rem', label: 'rem' },
									{ value: 'em', label: 'em' },
								]}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<UnitControl
								label={__('Arrow Padding', 'designsetgo')}
								value={arrowPadding}
								onChange={(value) =>
									setAttributes({ arrowPadding: value })
								}
								units={[
									{ value: 'px', label: 'px' },
									{ value: 'rem', label: 'rem' },
									{ value: 'em', label: 'em' },
								]}
								help={__(
									'Inner spacing of the arrow button',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}

					<ToggleControl
						label={__('Show Dots', 'designsetgo')}
						checked={showDots}
						onChange={(value) => setAttributes({ showDots: value })}
						__nextHasNoMarginBottom
					/>

					{showDots && (
						<>
							<SelectControl
								label={__('Dot Style', 'designsetgo')}
								value={dotStyle}
								options={[
									{
										label: __('Default', 'designsetgo'),
										value: 'default',
									},
									{
										label: __('Lines', 'designsetgo'),
										value: 'lines',
									},
									{
										label: __('Squares', 'designsetgo'),
										value: 'squares',
									},
								]}
								onChange={(value) =>
									setAttributes({ dotStyle: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label={__('Dot Position', 'designsetgo')}
								value={dotPosition}
								options={[
									{
										label: __('Bottom', 'designsetgo'),
										value: 'bottom',
									},
									{
										label: __('Top', 'designsetgo'),
										value: 'top',
									},
								]}
								onChange={(value) =>
									setAttributes({ dotPosition: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}

				</PanelBody>

				<PanelBody
					title={__('Transition Settings', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Transition Effect', 'designsetgo')}
						value={effect}
						options={[
							{
								label: __('Slide', 'designsetgo'),
								value: 'slide',
							},
							{ label: __('Fade', 'designsetgo'), value: 'fade' },
							{ label: __('Zoom', 'designsetgo'), value: 'zoom' },
						]}
						onChange={(value) => setAttributes({ effect: value })}
						help={__(
							'Animation style between slides',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Transition Duration', 'designsetgo')}
						value={transitionDuration}
						onChange={(value) =>
							setAttributes({
								transitionDuration: value || '0.5s',
							})
						}
						units={[
							{ value: 's', label: 's', default: 0.5 },
							{ value: 'ms', label: 'ms', default: 500 },
						]}
						min={0.1}
						max={2}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Transition Easing', 'designsetgo')}
						value={transitionEasing}
						options={[
							{ label: __('Ease', 'designsetgo'), value: 'ease' },
							{
								label: __('Ease In Out', 'designsetgo'),
								value: 'ease-in-out',
							},
							{
								label: __('Ease In', 'designsetgo'),
								value: 'ease-in',
							},
							{
								label: __('Ease Out', 'designsetgo'),
								value: 'ease-out',
							},
							{
								label: __('Linear', 'designsetgo'),
								value: 'linear',
							},
						]}
						onChange={(value) =>
							setAttributes({ transitionEasing: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Auto-play Settings', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Auto-play', 'designsetgo')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
						help={
							autoplay
								? __(
										'Slides advance automatically',
										'designsetgo'
									)
								: __('Manual navigation only', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>

					{autoplay && (
						<>
							<RangeControl
								label={__(
									'Auto-play Interval (ms)',
									'designsetgo'
								)}
								value={autoplayInterval}
								onChange={(value) =>
									setAttributes({ autoplayInterval: value })
								}
								min={1000}
								max={10000}
								step={500}
								help={__('Time between slides', 'designsetgo')}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__('Pause on Hover', 'designsetgo')}
								checked={pauseOnHover}
								onChange={(value) =>
									setAttributes({ pauseOnHover: value })
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__(
									'Pause on Interaction',
									'designsetgo'
								)}
								checked={pauseOnInteraction}
								onChange={(value) =>
									setAttributes({ pauseOnInteraction: value })
								}
								help={__(
									'Pause after user clicks, swipes, or drags',
									'designsetgo'
								)}
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>

				<PanelBody
					title={__('Behavior Settings', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Loop', 'designsetgo')}
						checked={loop}
						onChange={(value) => setAttributes({ loop: value })}
						help={
							loop
								? __('Infinite loop navigation', 'designsetgo')
								: __('Stop at first/last slide', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Swipeable (Touch)', 'designsetgo')}
						checked={swipeable}
						onChange={(value) =>
							setAttributes({ swipeable: value })
						}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Draggable (Mouse)', 'designsetgo')}
						checked={draggable}
						onChange={(value) =>
							setAttributes({ draggable: value })
						}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Free Mode', 'designsetgo')}
						checked={freeMode}
						onChange={(value) => setAttributes({ freeMode: value })}
						help={__(
							'Smooth scrolling without snap points',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Centered Slides', 'designsetgo')}
						checked={centeredSlides}
						onChange={(value) =>
							setAttributes({ centeredSlides: value })
						}
						help={__(
							'Active slide centered in view',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Advanced Settings', 'designsetgo')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Mobile Breakpoint (px)', 'designsetgo')}
						value={mobileBreakpoint}
						onChange={(value) =>
							setAttributes({ mobileBreakpoint: value })
						}
						min={320}
						max={900}
						help={__(
							'Below this width, uses mobile slides per view',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Tablet Breakpoint (px)', 'designsetgo')}
						value={tabletBreakpoint}
						onChange={(value) =>
							setAttributes({ tabletBreakpoint: value })
						}
						min={768}
						max={1280}
						help={__(
							'Below this width, uses tablet slides per view',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('ARIA Label', 'designsetgo')}
						value={ariaLabel}
						onChange={(value) =>
							setAttributes({ ariaLabel: value })
						}
						help={__(
							'Accessible label for screen readers',
							'designsetgo'
						)}
						placeholder={__('Image slider', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			{showArrows && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Arrow Colors', 'designsetgo')}
						settings={[
							{
								label: __('Arrow Icon Color', 'designsetgo'),
								colorValue: arrowColor,
								onColorChange: (color) =>
									setAttributes({
										arrowColor: color || '',
									}),
								clearable: true,
							},
							{
								label: __('Arrow Background', 'designsetgo'),
								colorValue: arrowBackgroundColor,
								onColorChange: (color) =>
									setAttributes({
										arrowBackgroundColor: color || '',
									}),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
			)}

			{showDots && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Dot Color', 'designsetgo')}
						settings={[
							{
								label: __('Dot Color', 'designsetgo'),
								colorValue: dotColor,
								onColorChange: (color) =>
									setAttributes({ dotColor: color || '' }),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
			)}

			<div {...blockProps}>
				<div className="dsg-slider__viewport">
					<div {...innerBlocksProps} />
				</div>

				{/* Editor-only navigation - functional scroll controls */}
				{showArrows && (
					<div className="dsg-slider__arrows dsg-slider__arrows--editor-only">
						<button
							type="button"
							className="dsg-slider__arrow dsg-slider__arrow--prev"
							aria-label={__('Previous slide', 'designsetgo')}
							onClick={() => scrollToSlide('prev')}
						>
							<span>‹</span>
						</button>
						<button
							type="button"
							className="dsg-slider__arrow dsg-slider__arrow--next"
							aria-label={__('Next slide', 'designsetgo')}
							onClick={() => scrollToSlide('next')}
						>
							<span>›</span>
						</button>
					</div>
				)}

				{showDots && (
					<div className="dsg-slider__dots dsg-slider__dots--editor-only">
						<button
							type="button"
							className="dsg-slider__dot"
							onClick={() => scrollToSlideIndex(0)}
						>
							<span className="screen-reader-text">
								{__('Slide 1', 'designsetgo')}
							</span>
						</button>
						<button
							type="button"
							className="dsg-slider__dot"
							onClick={() => scrollToSlideIndex(1)}
						>
							<span className="screen-reader-text">
								{__('Slide 2', 'designsetgo')}
							</span>
						</button>
						<button
							type="button"
							className="dsg-slider__dot"
							onClick={() => scrollToSlideIndex(2)}
						>
							<span className="screen-reader-text">
								{__('Slide 3', 'designsetgo')}
							</span>
						</button>
					</div>
				)}
			</div>
		</>
	);
}
