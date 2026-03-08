/**
 * Scroll Slides - Tap Engine
 * Click-to-navigate mode for mobile
 */

import { __, sprintf } from '@wordpress/i18n';

/**
 * Set up tap-based slide switching for mobile
 *
 * @param {HTMLElement}     container  Container element
 * @param {NodeList}        slides     Slide elements
 * @param {AbortController} controller AbortController for cleanup
 */
export function setupTapEngine(container, slides, controller) {
	const { signal } = controller;
	const navItems = container.querySelectorAll(
		'.dsgo-scroll-slides__nav-item'
	);
	const bgLayers = container.querySelectorAll('.dsgo-scroll-slides__bg');
	const liveRegion = container.querySelector('[aria-live]');
	const slideCount = slides.length;
	let currentSlideIndex = 0;

	function activateSlide(newIndex) {
		if (newIndex === currentSlideIndex) {
			return;
		}

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

	navItems.forEach((button, index) => {
		button.addEventListener('click', () => activateSlide(index), {
			signal,
		});
	});
}
