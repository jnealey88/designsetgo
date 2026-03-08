/**
 * Scroll Slides - DOM Setup
 * Builds the pin spacer, navigation, and background layers
 */

import { __, sprintf } from '@wordpress/i18n';

/**
 * Build the pin spacer, navigation, and background layers
 *
 * @param {HTMLElement} container Container element
 * @param {NodeList}    slides    Slide elements
 * @param {string}      minHeight CSS height value for pinned section
 * @param {string}      maxHeight CSS max-height cap (empty string if unset)
 * @param {boolean}     isMobile  Whether to use tap mode (no spacer/sticky)
 */
export function setupDOM(container, slides, minHeight, maxHeight, isMobile) {
	if (isMobile) {
		// Tap mode — no spacer, no sticky, content determines height
		container.classList.add('is-tap-mode');
	} else {
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
	}

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
