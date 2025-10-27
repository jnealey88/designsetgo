/**
 * Accordion Block - Frontend JavaScript
 * Enhanced UX with smooth animations and scroll-to-view
 * Following WordPress best practices - NO layout manipulation
 */

document.addEventListener('DOMContentLoaded', function () {
	initAccordions();
});

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches;

// Animation duration (matches CSS transition)
const ANIMATION_DURATION = prefersReducedMotion ? 0 : 350;

function initAccordions() {
	const accordions = document.querySelectorAll('.dsg-accordion');

	accordions.forEach((accordion) => {
		const allowMultiple =
			accordion.getAttribute('data-allow-multiple') === 'true';
		const items = accordion.querySelectorAll('.dsg-accordion-item');

		items.forEach((item) => {
			const trigger = item.querySelector('.dsg-accordion-item__trigger');
			const panel = item.querySelector('.dsg-accordion-item__panel');

			if (!trigger || !panel) {
				return;
			}

			// Set initial state based on data attribute
			const initiallyOpen =
				item.getAttribute('data-initially-open') === 'true';
			if (initiallyOpen) {
				openPanel(item, panel, false); // No animation on initial load
			} else {
				closePanel(item, panel, false); // No animation on initial load
			}

			// Click handler
			trigger.addEventListener('click', (e) => {
				e.preventDefault();
				const isOpen = item.classList.contains(
					'dsg-accordion-item--open'
				);

				if (isOpen) {
					// Close this panel
					closePanel(item, panel, true);
				} else {
					// If single mode, close all other panels first
					if (!allowMultiple) {
						closeAllPanels(accordion);
					}
					// Open this panel with smooth scroll
					openPanel(item, panel, true, true);
				}
			});

			// Keyboard accessibility - Arrow key navigation
			trigger.addEventListener('keydown', (e) => {
				// Enter or Space - toggle
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					trigger.click();
				}

				// Arrow Up - focus previous item
				if (e.key === 'ArrowUp') {
					e.preventDefault();
					const prevItem = getPreviousItem(item, items);
					if (prevItem) {
						prevItem
							.querySelector('.dsg-accordion-item__trigger')
							?.focus();
					}
				}

				// Arrow Down - focus next item
				if (e.key === 'ArrowDown') {
					e.preventDefault();
					const nextItem = getNextItem(item, items);
					if (nextItem) {
						nextItem
							.querySelector('.dsg-accordion-item__trigger')
							?.focus();
					}
				}

				// Home - focus first item
				if (e.key === 'Home') {
					e.preventDefault();
					items[0]
						?.querySelector('.dsg-accordion-item__trigger')
						?.focus();
				}

				// End - focus last item
				if (e.key === 'End') {
					e.preventDefault();
					items[items.length - 1]
						?.querySelector('.dsg-accordion-item__trigger')
						?.focus();
				}
			});
		});
	});
}

function openPanel(item, panel, animate = true, scrollIntoView = false) {
	// Update classes
	item.classList.remove('dsg-accordion-item--closed');
	item.classList.add('dsg-accordion-item--open');

	// Update ARIA
	const trigger = item.querySelector('.dsg-accordion-item__trigger');
	if (trigger) {
		trigger.setAttribute('aria-expanded', 'true');
	}

	// Show panel
	panel.hidden = false;

	// Get the natural height
	const content = panel.querySelector('.dsg-accordion-item__content');
	const contentHeight = content ? content.scrollHeight : panel.scrollHeight;

	if (!animate || prefersReducedMotion) {
		// No animation - set height immediately
		panel.style.height = '';
		return;
	}

	// Animate height
	panel.style.height = '0px';
	requestAnimationFrame(() => {
		panel.style.height = `${contentHeight}px`;

		// Smooth scroll into view after opening
		if (scrollIntoView) {
			setTimeout(() => {
				scrollItemIntoView(item);
			}, ANIMATION_DURATION / 2); // Scroll halfway through animation
		}

		// Remove inline height after animation completes
		setTimeout(() => {
			panel.style.height = '';
		}, ANIMATION_DURATION);
	});
}

function closePanel(item, panel, animate = true) {
	// Get current height for animation
	const currentHeight = panel.scrollHeight;

	// Update classes
	item.classList.remove('dsg-accordion-item--open');
	item.classList.add('dsg-accordion-item--closed');

	// Update ARIA
	const trigger = item.querySelector('.dsg-accordion-item__trigger');
	if (trigger) {
		trigger.setAttribute('aria-expanded', 'false');
	}

	if (!animate || prefersReducedMotion) {
		// No animation - hide immediately
		panel.hidden = true;
		panel.style.height = '';
		return;
	}

	// Set height explicitly for animation
	panel.style.height = `${currentHeight}px`;

	// Force reflow
	requestAnimationFrame(() => {
		panel.style.height = '0px';

		// Hide after animation completes
		setTimeout(() => {
			panel.hidden = true;
			panel.style.height = '';
		}, ANIMATION_DURATION);
	});
}

function closeAllPanels(accordion) {
	const items = accordion.querySelectorAll('.dsg-accordion-item');

	items.forEach((item) => {
		const panel = item.querySelector('.dsg-accordion-item__panel');
		if (panel && item.classList.contains('dsg-accordion-item--open')) {
			closePanel(item, panel, true);
		}
	});
}

// Smooth scroll to show opened accordion item
function scrollItemIntoView(item) {
	const itemRect = item.getBoundingClientRect();
	const viewportHeight = window.innerHeight;
	const headerOffset = 100; // Account for fixed headers

	// Check if item is not fully visible
	if (itemRect.top < headerOffset || itemRect.bottom > viewportHeight) {
		const scrollOptions = {
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			block: 'nearest',
			inline: 'nearest',
		};

		// Scroll with offset for better visibility
		item.scrollIntoView(scrollOptions);
	}
}

// Keyboard navigation helpers
function getPreviousItem(currentItem, allItems) {
	const itemsArray = Array.from(allItems);
	const currentIndex = itemsArray.indexOf(currentItem);
	return currentIndex > 0 ? itemsArray[currentIndex - 1] : null;
}

function getNextItem(currentItem, allItems) {
	const itemsArray = Array.from(allItems);
	const currentIndex = itemsArray.indexOf(currentItem);
	return currentIndex < itemsArray.length - 1
		? itemsArray[currentIndex + 1]
		: null;
}
