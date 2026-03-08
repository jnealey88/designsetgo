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
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if (prefersReducedMotion) {
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

		// === Build DOM: spacer, nav, backgrounds ===
		setupDOM(container, slides, minHeight);

		// === Scroll engine ===
		setupScrollEngine(container, slides);
	});
}

/**
 * Build the pin spacer, navigation, and background layers
 *
 * @param {HTMLElement} container Container element
 * @param {NodeList}    slides    Slide elements
 * @param {string}      minHeight CSS height value for pinned section
 */
function setupDOM(container, slides, minHeight) {
	// 1. Create pin spacer and wrap container
	const spacer = document.createElement('div');
	spacer.className = 'dsgo-scroll-slides-spacer';
	container.parentNode.insertBefore(spacer, container);
	spacer.appendChild(container);

	// Set spacer height (slides x viewport height)
	spacer.style.height = `calc(${slides.length} * 100vh)`;

	// Pin the container
	container.classList.add('is-pinned');
	container.style.height = minHeight;

	// 2. Build navigation from data attributes
	const nav = document.createElement('nav');
	nav.className = 'dsgo-scroll-slides__nav';
	nav.setAttribute('aria-label', 'Slide navigation');

	slides.forEach((slide, index) => {
		const heading = slide.dataset.dsgoNavHeading || `Slide ${index + 1}`;
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

	// Insert nav before the panels container
	const panels = container.querySelector('.dsgo-scroll-slides__panels');
	container.insertBefore(nav, panels);

	// 3. Build background layers
	const bgContainer = document.createElement('div');
	bgContainer.className = 'dsgo-scroll-slides__backgrounds';

	slides.forEach((slide, index) => {
		const bgDiv = document.createElement('div');
		bgDiv.className = 'dsgo-scroll-slides__bg';

		// Extract background-image from slide's inline styles (set by WP block supports)
		const slideBg = slide.style.backgroundImage;
		if (slideBg && slideBg !== 'none') {
			bgDiv.style.backgroundImage = slideBg;
			// Remove from slide so it doesn't show behind content
			slide.style.backgroundImage = 'none';
		}

		if (index === 0) {
			bgDiv.classList.add('is-active');
		}

		bgContainer.appendChild(bgDiv);
	});

	container.insertBefore(bgContainer, nav);

	// 4. Set first slide as active
	slides[0].classList.add('is-active');
}

/**
 * Set up the scroll-driven animation engine
 *
 * @param {HTMLElement} container Container element
 * @param {NodeList}    slides    Slide elements
 */
function setupScrollEngine(container, slides) {
	const spacer = container.parentNode; // .dsgo-scroll-slides-spacer
	const navItems = container.querySelectorAll(
		'.dsgo-scroll-slides__nav-item'
	);
	const bgLayers = container.querySelectorAll('.dsgo-scroll-slides__bg');
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
			navItems[currentSlideIndex].classList.remove('is-active');
			navItems[currentSlideIndex].removeAttribute('aria-current');
			bgLayers[currentSlideIndex].classList.remove('is-active');

			// Activate new slide
			slides[newIndex].classList.add('is-active');
			navItems[newIndex].classList.add('is-active');
			navItems[newIndex].setAttribute('aria-current', 'step');
			bgLayers[newIndex].classList.add('is-active');

			currentSlideIndex = newIndex;
		}

		ticking = false;
	}

	function requestTick() {
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
		button.addEventListener('click', () => {
			const totalRange = spacer.offsetHeight - viewportHeight;
			const targetScroll =
				spacer.offsetTop + ((index + 0.5) / slideCount) * totalRange;
			window.scrollTo({ top: targetScroll, behavior: 'smooth' });
		});
	});

	// Bind events
	window.addEventListener('scroll', requestTick, { passive: true });
	window.addEventListener('resize', handleResize, { passive: true });

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
