/**
 * Scroll Slides - Frontend JavaScript
 * Handles scroll-pinned slideshow with crossfading transitions
 *
 * How it works:
 * 1. Wraps the container in a "pin spacer" div (height = slides x viewportHeight)
 * 2. Container becomes sticky (pinned at top of viewport)
 * 3. As user scrolls through the spacer, JS calculates a 0-1 progress value
 * 4. Progress determines which slide is active and drives opacity/transform transitions
 * 5. A nav is built dynamically from each slide's data-dsgo-nav-heading attribute
 * 6. Background layers crossfade per slide based on each slide's background-image
 */

/* global requestAnimationFrame */

import { __, sprintf } from '@wordpress/i18n';

/**
 * Track initialized containers to prevent double-init
 */
const initialized = new WeakSet();

/**
 * Clamp a value between min and max
 *
 * @param {number} min   Minimum value
 * @param {number} value Value to clamp
 * @param {number} max   Maximum value
 * @return {number} Clamped value
 */
function clamp(min, value, max) {
	return Math.min(Math.max(value, min), max);
}

/**
 * Initialize all scroll slides instances on the page
 */
function initScrollSlides() {
	const containers = document.querySelectorAll('.dsgo-scroll-slides');

	if (!containers.length) {
		return;
	}

	// Check reduced motion preference — show all slides stacked (like mobile)
	const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	if (motionQuery.matches) {
		return;
	}

	containers.forEach((container) => {
		if (initialized.has(container)) {
			return;
		}
		initialized.add(container);

		const slides = container.querySelectorAll('.dsgo-scroll-slide');

		if (slides.length < 2) {
			// Need at least 2 slides for the effect
			if (slides.length === 1) {
				slides[0].classList.add('is-active');
			}
			return;
		}

		const minHeight = container.dataset.dsgoMinHeight || '100vh';
		const maxHeight = container.dataset.dsgoMaxHeight || '';

		const controller = new AbortController();

		// === Build DOM: spacer, nav, backgrounds ===
		setupDOM(container, slides, minHeight, maxHeight);

		// === Scroll engine ===
		setupScrollEngine(container, slides, controller);

		// Abort scroll engine if user enables reduced motion mid-session
		motionQuery.addEventListener(
			'change',
			(e) => {
				if (e.matches) {
					controller.abort();
				}
			},
			{ signal: controller.signal }
		);
	});
}

/**
 * Build the pin spacer, navigation, and background layers
 *
 * @param {HTMLElement} container Container element
 * @param {NodeList}    slides    Slide elements
 * @param {string}      minHeight CSS height value for pinned section
 * @param {string}      maxHeight CSS max-height cap (empty string if unset)
 */
function setupDOM(container, slides, minHeight, maxHeight) {
	// 1. Create pin spacer and wrap container
	// Spacer must inherit alignment classes so the theme treats it like the block
	const spacer = document.createElement('div');
	spacer.className = 'dsgo-scroll-slides-spacer';
	if (container.classList.contains('alignfull')) {
		spacer.classList.add('alignfull');
	} else if (container.classList.contains('alignwide')) {
		spacer.classList.add('alignwide');
	}
	container.parentNode.insertBefore(spacer, container);
	spacer.appendChild(container);

	// Set spacer height (slides x viewport height)
	spacer.style.height = `calc(${slides.length} * 100vh)`;

	// Pin the container — cap height on tall monitors if maxHeight is set
	container.classList.add('is-pinned');
	container.style.height = maxHeight
		? `min(${minHeight}, ${maxHeight})`
		: minHeight;

	// 2. Build navigation from data attributes
	const nav = document.createElement('nav');
	nav.className = 'dsgo-scroll-slides__nav';
	nav.setAttribute('aria-label', __('Slide navigation', 'designsetgo'));

	slides.forEach((slide, index) => {
		const heading =
			slide.dataset.dsgoNavHeading ||
			sprintf(
				/* translators: %d: slide number */
				__('Slide %d', 'designsetgo'),
				index + 1
			);
		const button = document.createElement('button');
		button.className = 'dsgo-scroll-slides__nav-item';
		button.textContent = heading;
		button.type = 'button';

		if (index === 0) {
			button.classList.add('is-active');
			button.setAttribute('aria-current', 'step');
		}

		nav.appendChild(button);
	});

	// Insert nav into the inner container (before panels)
	const inner = container.querySelector('.dsgo-scroll-slides__inner');
	const panels = inner.querySelector('.dsgo-scroll-slides__panels');
	inner.insertBefore(nav, panels);

	// 3. Build background layers (full-width, in outer container)
	const bgContainer = document.createElement('div');
	bgContainer.className = 'dsgo-scroll-slides__backgrounds';

	slides.forEach((slide, index) => {
		const bgDiv = document.createElement('div');
		bgDiv.className = 'dsgo-scroll-slides__bg';

		// Extract backgrounds from slide's inline styles (set by WP block supports)
		// Move them to the crossfading layer and clear from the slide wrapper
		const slideBgImage = slide.style.backgroundImage;
		if (slideBgImage && slideBgImage !== 'none') {
			bgDiv.style.backgroundImage = slideBgImage;
			slide.style.backgroundImage = 'none';
		}

		const slideBgColor = slide.style.backgroundColor;
		if (slideBgColor) {
			bgDiv.style.backgroundColor = slideBgColor;
			slide.style.backgroundColor = 'transparent';
		}

		// Transfer background-position/size/repeat if user customized them
		const slideBgPosition = slide.style.backgroundPosition;
		if (slideBgPosition) {
			bgDiv.style.backgroundPosition = slideBgPosition;
			slide.style.backgroundPosition = '';
		}

		const slideBgSize = slide.style.backgroundSize;
		if (slideBgSize) {
			bgDiv.style.backgroundSize = slideBgSize;
			slide.style.backgroundSize = '';
		}

		const slideBgRepeat = slide.style.backgroundRepeat;
		if (slideBgRepeat) {
			bgDiv.style.backgroundRepeat = slideBgRepeat;
			slide.style.backgroundRepeat = '';
		}

		if (index === 0) {
			bgDiv.classList.add('is-active');
		}

		bgContainer.appendChild(bgDiv);
	});

	// Backgrounds go in outer container (before inner) for full-width coverage
	container.insertBefore(bgContainer, inner);

	// 4. Aria-live region for screen reader slide change announcements
	const liveRegion = document.createElement('div');
	liveRegion.className = 'screen-reader-text';
	liveRegion.setAttribute('aria-live', 'polite');
	liveRegion.setAttribute('aria-atomic', 'true');
	container.appendChild(liveRegion);

	// 5. Set first slide as active, mark others as inert
	slides[0].classList.add('is-active');
	slides.forEach((slide, index) => {
		if (index !== 0) {
			slide.setAttribute('inert', '');
			slide.setAttribute('aria-hidden', 'true');
		}
	});
}

/**
 * Set up the scroll-driven animation engine
 *
 * @param {HTMLElement}     container  Container element
 * @param {NodeList}        slides     Slide elements
 * @param {AbortController} controller AbortController for cleanup on removal or reduced-motion
 */
function setupScrollEngine(container, slides, controller) {
	const { signal } = controller;
	const spacer = container.parentNode; // .dsgo-scroll-slides-spacer
	const navItems = container.querySelectorAll(
		'.dsgo-scroll-slides__nav-item'
	);
	const bgLayers = container.querySelectorAll('.dsgo-scroll-slides__bg');
	const liveRegion = container.querySelector('[aria-live]');
	const slideCount = slides.length;

	// Cache viewport dimensions
	let viewportHeight = window.innerHeight;

	function updateViewportDimensions() {
		viewportHeight = window.innerHeight;
	}

	let ticking = false;
	let currentSlideIndex = 0;

	/**
	 * Main update loop — calculate progress and update active states
	 */
	function update() {
		const totalRange = spacer.offsetHeight - viewportHeight;

		if (totalRange <= 0) {
			ticking = false;
			return;
		}

		const spacerRect = spacer.getBoundingClientRect();

		// Progress: 0 (top of spacer at viewport top) to 1 (bottom of spacer at viewport bottom)
		const progress = clamp(0, -spacerRect.top / totalRange, 1);

		// Which slide should be active?
		// Last slide stays active for the final segment
		const newIndex = Math.min(
			Math.floor(progress * slideCount),
			slideCount - 1
		);

		if (newIndex !== currentSlideIndex) {
			// Deactivate old slide
			slides[currentSlideIndex].classList.remove('is-active');
			slides[currentSlideIndex].setAttribute('inert', '');
			slides[currentSlideIndex].setAttribute('aria-hidden', 'true');
			navItems[currentSlideIndex].classList.remove('is-active');
			navItems[currentSlideIndex].removeAttribute('aria-current');
			bgLayers[currentSlideIndex].classList.remove('is-active');

			// Activate new slide
			slides[newIndex].classList.add('is-active');
			slides[newIndex].removeAttribute('inert');
			slides[newIndex].removeAttribute('aria-hidden');
			navItems[newIndex].classList.add('is-active');
			navItems[newIndex].setAttribute('aria-current', 'step');
			bgLayers[newIndex].classList.add('is-active');

			// Announce slide change to screen readers
			if (liveRegion) {
				liveRegion.textContent = sprintf(
					/* translators: 1: current slide number, 2: total slides, 3: slide heading */
					__('Slide %1$d of %2$d: %3$s', 'designsetgo'),
					newIndex + 1,
					slideCount,
					navItems[newIndex]?.textContent?.trim() || ''
				);
			}

			currentSlideIndex = newIndex;
		}

		ticking = false;
	}

	function requestTick() {
		// Clean up if container was removed from DOM (e.g. client-side navigation)
		if (signal.aborted || !spacer.isConnected) {
			controller.abort();
			return;
		}
		if (!ticking) {
			requestAnimationFrame(update);
			ticking = true;
		}
	}

	// Resize handler with debounce
	let resizeTimer;
	function handleResize() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			updateViewportDimensions();
			requestTick();
		}, 150);
	}

	// Nav click handler — scroll to center of target slide's range
	// Using (index + 0.5) avoids landing on exact boundaries where
	// floating point precision could keep us on the wrong slide
	navItems.forEach((button, index) => {
		button.addEventListener(
			'click',
			() => {
				const totalRange = spacer.offsetHeight - viewportHeight;
				const targetScroll =
					spacer.getBoundingClientRect().top +
					window.scrollY +
					((index + 0.5) / slideCount) * totalRange;
				window.scrollTo({ top: targetScroll, behavior: 'smooth' });
			},
			{ signal }
		);
	});

	// Bind events — signal auto-removes listeners when controller is aborted
	window.addEventListener('scroll', requestTick, { passive: true, signal });
	window.addEventListener('resize', handleResize, { passive: true, signal });

	// Initial update
	update();
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initScrollSlides);
} else {
	initScrollSlides();
}

/**
 * Reinitialize on dynamic content changes (e.g., AJAX)
 */
document.addEventListener('scroll-slides:reinit', initScrollSlides);
