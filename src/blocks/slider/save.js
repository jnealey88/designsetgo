import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

const SINGLE_SLIDE_EFFECTS = ['fade', 'zoom'];

export default function SliderSave({ attributes }) {
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
		arrowVerticalPosition,
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
		activeSlide,
		styleVariation,
		ariaLabel,
	} = attributes;

	const requiresSingleSlideEffect = SINGLE_SLIDE_EFFECTS.includes(effect);
	const effectiveSlidesPerView = requiresSingleSlideEffect
		? 1
		: slidesPerView;
	const effectiveSlidesPerViewTablet = requiresSingleSlideEffect
		? 1
		: slidesPerViewTablet;
	const effectiveSlidesPerViewMobile = requiresSingleSlideEffect
		? 1
		: slidesPerViewMobile;

	// Same classes as edit.js - MUST MATCH EXACTLY
	const sliderClasses = classnames('dsg-slider', {
		[`dsg-slider--${styleVariation}`]: styleVariation,
		[`dsg-slider--effect-${effect}`]: effect,
		'dsg-slider--has-arrows': showArrows,
		'dsg-slider--has-dots': showDots,
		'dsg-slider--centered': centeredSlides,
		'dsg-slider--free-mode': freeMode,
	});

	// Apply settings as CSS custom properties - MUST MATCH edit.js
	const customStyles = {
		'--dsg-slider-height': height,
		'--dsg-slider-aspect-ratio': aspectRatio,
		'--dsg-slider-gap': gap,
		'--dsg-slider-transition': transitionDuration,
		'--dsg-slider-slides-per-view': String(effectiveSlidesPerView),
		'--dsg-slider-slides-per-view-tablet': String(
			effectiveSlidesPerViewTablet
		),
		'--dsg-slider-slides-per-view-mobile': String(
			effectiveSlidesPerViewMobile
		),
		...(arrowColor && { '--dsg-slider-arrow-color': arrowColor }),
		...(arrowBackgroundColor && {
			'--dsg-slider-arrow-bg-color': arrowBackgroundColor,
		}),
		...(arrowSize && { '--dsg-slider-arrow-size': arrowSize }),
		...(arrowPadding && { '--dsg-slider-arrow-padding': arrowPadding }),
		...(dotColor && { '--dsg-slider-dot-color': dotColor }),
	};

	// Use .save() variant for save function
	// Data attributes for JavaScript configuration
	const blockProps = useBlockProps.save({
		className: sliderClasses,
		style: customStyles,
		'data-slides-per-view': effectiveSlidesPerView,
		'data-slides-per-view-tablet': effectiveSlidesPerViewTablet,
		'data-slides-per-view-mobile': effectiveSlidesPerViewMobile,
		'data-use-aspect-ratio': useAspectRatio,
		'data-show-arrows': showArrows,
		'data-show-dots': showDots,
		'data-arrow-style': arrowStyle,
		'data-arrow-position': arrowPosition,
		'data-arrow-vertical-position': arrowVerticalPosition,
		'data-dot-style': dotStyle,
		'data-dot-position': dotPosition,
		'data-effect': effect,
		'data-transition-duration': transitionDuration,
		'data-transition-easing': transitionEasing,
		'data-autoplay': autoplay,
		'data-autoplay-interval': autoplayInterval,
		'data-pause-on-hover': pauseOnHover,
		'data-pause-on-interaction': pauseOnInteraction,
		'data-loop': loop,
		'data-draggable': draggable,
		'data-swipeable': swipeable,
		'data-free-mode': freeMode,
		'data-centered-slides': centeredSlides,
		'data-mobile-breakpoint': mobileBreakpoint,
		'data-tablet-breakpoint': tabletBreakpoint,
		'data-active-slide': activeSlide,
		role: 'region',
		'aria-label': ariaLabel || 'Image slider',
		'aria-roledescription': 'slider',
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-slider__track',
	});

	return (
		<div {...blockProps}>
			<div className="dsg-slider__viewport">
				<div {...innerBlocksProps} />
			</div>
		</div>
	);
}
