/**
 * Modal Block - Frontend JavaScript
 *
 * Handles modal open/close, focus trapping, keyboard navigation,
 * and accessibility features.
 *
 * @package DesignSetGo
 */

(function () {
	'use strict';

	/**
	 * Modal Manager Class
	 *
	 * Handles a single modal instance with full accessibility support.
	 */
	class DSGModal {
		constructor(element) {
			this.modal = element;
			this.modalId = element.getAttribute('data-modal-id');
			this.backdrop = element.querySelector('.dsgo-modal__backdrop');
			this.dialog = element.querySelector('.dsgo-modal__dialog');
			this.content = element.querySelector('.dsgo-modal__content');
			this.closeButton = element.querySelector('.dsgo-modal__close');
			this.isOpen = false;
			this.previouslyFocusedElement = null;
			this.focusableElements = [];
			this.scrollPosition = 0;

			// Settings from data attributes
			this.settings = {
				animationType: element.getAttribute('data-animation-type') || 'fade',
				animationDuration: parseInt(element.getAttribute('data-animation-duration')) || 300,
				closeOnBackdrop: element.getAttribute('data-close-on-backdrop') === 'true',
				closeOnEsc: element.getAttribute('data-close-on-esc') === 'true',
				disableBodyScroll: element.getAttribute('data-disable-body-scroll') === 'true',
			};

			// Check for reduced motion preference
			this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			this.init();
		}

		/**
		 * Initialize the modal
		 */
		init() {
			// Prevent duplicate initialization
			if (this.modal.hasAttribute('data-dsgo-initialized')) {
				return;
			}
			this.modal.setAttribute('data-dsgo-initialized', 'true');

			// Add animation class
			if (this.settings.animationType !== 'none' && !this.prefersReducedMotion) {
				this.modal.classList.add(`dsgo-modal--animation-${this.settings.animationType}`);
			}

			// Set transition duration
			if (!this.prefersReducedMotion) {
				const duration = `${this.settings.animationDuration}ms`;
				if (this.backdrop) {
					this.backdrop.style.transition = `opacity ${duration} ease`;
				}
				if (this.dialog) {
					this.dialog.style.transition = `all ${duration} ease`;
				}
			}

			// Bind event handlers
			this.bindEvents();

			// Update focusable elements
			this.updateFocusableElements();
		}

		/**
		 * Bind event handlers
		 */
		bindEvents() {
			// Close button
			if (this.closeButton) {
				this.closeButton.addEventListener('click', (e) => {
					e.preventDefault();
					this.close();
				});
			}

			// Backdrop click
			if (this.settings.closeOnBackdrop && this.backdrop) {
				this.backdrop.addEventListener('click', (e) => {
					e.preventDefault();
					this.close();
				});
			}

			// ESC key
			if (this.settings.closeOnEsc) {
				this.handleEscKey = (e) => {
					if (e.key === 'Escape' && this.isOpen) {
						e.preventDefault();
						this.close();
					}
				};
				document.addEventListener('keydown', this.handleEscKey);
			}

			// Focus trap
			this.handleFocusTrap = (e) => {
				if (!this.isOpen || e.key !== 'Tab') {
					return;
				}

				if (this.focusableElements.length === 0) {
					e.preventDefault();
					return;
				}

				const firstElement = this.focusableElements[0];
				const lastElement = this.focusableElements[this.focusableElements.length - 1];

				if (e.shiftKey) {
					// Shift + Tab
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					// Tab
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			};
			document.addEventListener('keydown', this.handleFocusTrap);
		}

		/**
		 * Update list of focusable elements
		 */
		updateFocusableElements() {
			const focusableSelectors = [
				'a[href]',
				'button:not([disabled])',
				'textarea:not([disabled])',
				'input:not([disabled])',
				'select:not([disabled])',
				'[tabindex]:not([tabindex="-1"])',
			];

			this.focusableElements = Array.from(
				this.modal.querySelectorAll(focusableSelectors.join(','))
			).filter((el) => {
				return el.offsetParent !== null && !el.hasAttribute('aria-hidden');
			});
		}

		/**
		 * Open the modal
		 *
		 * @param {Element} trigger - The element that triggered the modal (optional)
		 */
		open(trigger = null) {
			if (this.isOpen) {
				return;
			}

			// Store the element that triggered the modal
			this.previouslyFocusedElement = trigger || document.activeElement;

			// Update focusable elements
			this.updateFocusableElements();

			// Disable body scroll
			if (this.settings.disableBodyScroll) {
				this.disableBodyScroll();
			}

			// Show modal
			this.modal.style.display = 'flex';
			this.modal.setAttribute('aria-hidden', 'false');

			// Trigger opening animation
			if (!this.prefersReducedMotion && this.settings.animationType !== 'none') {
				this.modal.classList.add('dsgo-modal--opening');

				// Force reflow to trigger animation
				void this.modal.offsetHeight;

				// Remove opening class and add open class
				requestAnimationFrame(() => {
					this.modal.classList.remove('dsgo-modal--opening');
					this.modal.classList.add('dsgo-modal--open');

					// Wait for animation to complete
					setTimeout(() => {
						this.onOpenComplete();
					}, this.settings.animationDuration);
				});
			} else {
				// No animation
				this.modal.classList.add('dsgo-modal--open');
				this.onOpenComplete();
			}

			this.isOpen = true;

			// Dispatch custom event
			this.modal.dispatchEvent(
				new CustomEvent('dsgo-modal-open', {
					bubbles: true,
					detail: { modalId: this.modalId },
				})
			);
		}

		/**
		 * Called when opening animation completes
		 */
		onOpenComplete() {
			// Focus the first focusable element or the content
			if (this.focusableElements.length > 0) {
				this.focusableElements[0].focus();
			} else if (this.content) {
				this.content.setAttribute('tabindex', '-1');
				this.content.focus();
			}
		}

		/**
		 * Close the modal
		 */
		close() {
			if (!this.isOpen) {
				return;
			}

			// Trigger closing animation
			if (!this.prefersReducedMotion && this.settings.animationType !== 'none') {
				this.modal.classList.remove('dsgo-modal--open');
				this.modal.classList.add('dsgo-modal--closing');

				// Wait for animation to complete
				setTimeout(() => {
					this.onCloseComplete();
				}, this.settings.animationDuration);
			} else {
				// No animation
				this.modal.classList.remove('dsgo-modal--open');
				this.onCloseComplete();
			}

			this.isOpen = false;

			// Dispatch custom event
			this.modal.dispatchEvent(
				new CustomEvent('dsgo-modal-close', {
					bubbles: true,
					detail: { modalId: this.modalId },
				})
			);
		}

		/**
		 * Called when closing animation completes
		 */
		onCloseComplete() {
			// Hide modal
			this.modal.style.display = 'none';
			this.modal.setAttribute('aria-hidden', 'true');
			this.modal.classList.remove('dsgo-modal--closing');

			// Enable body scroll
			if (this.settings.disableBodyScroll) {
				this.enableBodyScroll();
			}

			// Return focus to trigger element
			if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
				this.previouslyFocusedElement.focus();
			}

			this.previouslyFocusedElement = null;
		}

		/**
		 * Disable body scrolling
		 */
		disableBodyScroll() {
			// Store current scroll position
			this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

			// Add class to body
			document.body.classList.add('dsgo-modal-open');
			document.body.style.top = `-${this.scrollPosition}px`;
		}

		/**
		 * Enable body scrolling
		 */
		enableBodyScroll() {
			// Remove class from body
			document.body.classList.remove('dsgo-modal-open');
			document.body.style.top = '';

			// Restore scroll position
			window.scrollTo(0, this.scrollPosition);
		}

		/**
		 * Destroy the modal instance
		 */
		destroy() {
			// Remove event listeners
			if (this.handleEscKey) {
				document.removeEventListener('keydown', this.handleEscKey);
			}
			if (this.handleFocusTrap) {
				document.removeEventListener('keydown', this.handleFocusTrap);
			}

			// Close if open
			if (this.isOpen) {
				this.close();
			}

			// Remove initialization flag
			this.modal.removeAttribute('data-dsgo-initialized');
		}
	}

	/**
	 * Initialize all modals on the page
	 */
	function initModals() {
		const modals = document.querySelectorAll('[data-dsgo-modal]:not([data-dsgo-initialized])');

		modals.forEach((modal) => {
			const instance = new DSGModal(modal);

			// Store instance on element for external access
			modal.dsgoModalInstance = instance;
		});
	}

	/**
	 * Initialize modal triggers
	 */
	function initTriggers() {
		const triggers = document.querySelectorAll('[data-dsgo-modal-trigger]:not([data-dsgo-trigger-initialized])');

		triggers.forEach((trigger) => {
			const modalId = trigger.getAttribute('data-dsgo-modal-trigger');
			const modal = document.getElementById(modalId);

			if (!modal || !modal.dsgoModalInstance) {
				return;
			}

			// Prevent duplicate initialization
			trigger.setAttribute('data-dsgo-trigger-initialized', 'true');

			// Add click handler
			trigger.addEventListener('click', (e) => {
				e.preventDefault();
				modal.dsgoModalInstance.open(trigger);
			});
		});
	}

	/**
	 * Initialize on DOM ready
	 */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			initModals();
			initTriggers();
		});
	} else {
		initModals();
		initTriggers();
	}

	/**
	 * Re-initialize on dynamic content load (for AJAX/SPA support)
	 */
	document.addEventListener('dsgo-content-loaded', () => {
		initModals();
		initTriggers();
	});

	/**
	 * Expose to window for external access
	 */
	window.DSGModal = DSGModal;
	window.dsgoInitModals = initModals;
	window.dsgoInitModalTriggers = initTriggers;
})();
