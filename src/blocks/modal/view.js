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
			this.focusableElementsCached = false;
			this.scrollPosition = 0;

			// Settings from data attributes
			this.settings = {
				animationType: element.getAttribute('data-animation-type') || 'fade',
				animationDuration: parseInt(element.getAttribute('data-animation-duration')) || 300,
				closeOnBackdrop: element.getAttribute('data-close-on-backdrop') === 'true',
				closeOnEsc: element.getAttribute('data-close-on-esc') === 'true',
				disableBodyScroll: element.getAttribute('data-disable-body-scroll') === 'true',
				allowHashTrigger: element.getAttribute('data-allow-hash-trigger') !== 'false',
				updateUrlOnOpen: element.getAttribute('data-update-url-on-open') === 'true',
				autoTriggerType: element.getAttribute('data-auto-trigger-type') || 'none',
				autoTriggerDelay: parseInt(element.getAttribute('data-auto-trigger-delay')) || 0,
				autoTriggerFrequency: element.getAttribute('data-auto-trigger-frequency') || 'always',
				cookieDuration: parseInt(element.getAttribute('data-cookie-duration')) || 7,
				exitIntentSensitivity: element.getAttribute('data-exit-intent-sensitivity') || 'medium',
				exitIntentMinTime: parseInt(element.getAttribute('data-exit-intent-min-time')) || 5,
				exitIntentExcludeMobile: element.getAttribute('data-exit-intent-exclude-mobile') !== 'false',
				scrollDepth: parseInt(element.getAttribute('data-scroll-depth')) || 50,
				scrollDirection: element.getAttribute('data-scroll-direction') || 'down',
				timeOnPage: parseInt(element.getAttribute('data-time-on-page')) || 30,
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

			// Set up MutationObserver to invalidate focusable elements cache when content changes
			this.setupContentObserver();

			// Update focusable elements initially
			this.updateFocusableElements();

			// Set up hash triggering if enabled
			if (this.settings.allowHashTrigger && this.modalId) {
				this.setupHashTrigger();
			}

			// Set up auto-trigger if enabled
			if (this.settings.autoTriggerType !== 'none') {
				this.setupAutoTrigger();
			}
		}

		/**
		 * Bind event handlers
		 */
		bindEvents() {
			// Store bound handlers for cleanup
			this.handleCloseClick = (e) => {
				e.preventDefault();
				this.close();
			};

			this.handleBackdropClick = (e) => {
				e.preventDefault();
				this.close();
			};

			// Close button
			if (this.closeButton) {
				this.closeButton.addEventListener('click', this.handleCloseClick);
			}

			// Backdrop click
			if (this.settings.closeOnBackdrop && this.backdrop) {
				this.backdrop.addEventListener('click', this.handleBackdropClick);
			}

			// Define ESC key handler (will be attached/detached on modal open/close)
			if (this.settings.closeOnEsc) {
				this.handleEscKey = (e) => {
					if (e.key === 'Escape' && this.isOpen) {
						e.preventDefault();
						this.close();
					}
				};
			}

			// Define focus trap handler (will be attached/detached on modal open/close)
			this.handleFocusTrap = (e) => {
				if (!this.isOpen || e.key !== 'Tab') {
					return;
				}

				// If no focusable elements, allow Tab to close modal for accessibility
				if (this.focusableElements.length === 0) {
					e.preventDefault();
					this.close();
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
		}

		/**
		 * Attach global keyboard listeners
		 */
		attachKeyboardListeners() {
			if (this.handleEscKey) {
				document.addEventListener('keydown', this.handleEscKey);
			}
			if (this.handleFocusTrap) {
				document.addEventListener('keydown', this.handleFocusTrap);
			}
		}

		/**
		 * Detach global keyboard listeners
		 */
		detachKeyboardListeners() {
			if (this.handleEscKey) {
				document.removeEventListener('keydown', this.handleEscKey);
			}
			if (this.handleFocusTrap) {
				document.removeEventListener('keydown', this.handleFocusTrap);
			}
		}

		/**
		 * Set up MutationObserver to watch for content changes
		 */
		setupContentObserver() {
			if (!this.content) return;

			// Invalidate cache when modal content changes
			this.contentObserver = new MutationObserver(() => {
				this.focusableElementsCached = false;
			});

			this.contentObserver.observe(this.content, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['disabled', 'tabindex', 'aria-hidden'],
			});
		}

		/**
		 * Update list of focusable elements (with caching)
		 */
		updateFocusableElements() {
			// Use cached elements if available and modal content hasn't changed
			if (this.focusableElementsCached && this.focusableElements.length > 0) {
				return;
			}

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

			this.focusableElementsCached = true;
		}

		/**
		 * Set up hash triggering
		 */
		setupHashTrigger() {
			// Define hash change handler
			this.handleHashChange = () => {
				// Ignore if we're the one updating the hash
				if (this.isUpdatingHash) {
					return;
				}

				const hash = window.location.hash.replace('#', '');

				// Check if hash matches this modal's ID
				if (hash === this.modalId) {
					if (!this.isOpen) {
						this.open();
					}
				} else if (this.isOpen && this.settings.updateUrlOnOpen) {
					// Close if we were opened by hash and hash changed
					this.close();
				}
			};

			// Listen for hash changes
			window.addEventListener('hashchange', this.handleHashChange);

			// Check initial hash on page load
			const currentHash = window.location.hash.replace('#', '');
			if (currentHash === this.modalId) {
				// Small delay to ensure all modals are initialized
				setTimeout(() => {
					if (!this.isOpen) {
						this.open();
					}
				}, 100);
			}
		}

		/**
		 * Set up auto-trigger
		 */
		setupAutoTrigger() {
			// Check if we should trigger based on frequency
			if (!this.checkTriggerFrequency()) {
				return;
			}

			switch (this.settings.autoTriggerType) {
				case 'pageLoad':
					this.setupPageLoadTrigger();
					break;
				case 'exitIntent':
					this.setupExitIntentTrigger();
					break;
				case 'scroll':
					this.setupScrollTrigger();
					break;
				case 'time':
					this.setupTimeOnPageTrigger();
					break;
			}
		}

		/**
		 * Check if modal should trigger based on frequency settings
		 */
		checkTriggerFrequency() {
			const frequency = this.settings.autoTriggerFrequency;

			// Always show
			if (frequency === 'always') {
				return true;
			}

			const storageKey = `dsgo_modal_${this.modalId}_shown`;

			// Check session storage for session frequency
			if (frequency === 'session') {
				if (sessionStorage.getItem(storageKey)) {
					return false;
				}
			}

			// Check localStorage/cookie for once frequency
			if (frequency === 'once') {
				// Try localStorage first
				if (localStorage.getItem(storageKey)) {
					return false;
				}

				// Fallback to cookie
				if (this.getCookie(storageKey)) {
					return false;
				}
			}

			return true;
		}

		/**
		 * Mark modal as shown for frequency tracking
		 */
		markAsShown() {
			const frequency = this.settings.autoTriggerFrequency;

			if (frequency === 'always') {
				return;
			}

			const storageKey = `dsgo_modal_${this.modalId}_shown`;

			if (frequency === 'session') {
				sessionStorage.setItem(storageKey, 'true');
			}

			if (frequency === 'once') {
				// Save to localStorage
				localStorage.setItem(storageKey, 'true');

				// Also save to cookie as fallback
				this.setCookie(storageKey, 'true', this.settings.cookieDuration);
			}
		}

		/**
		 * Get cookie value
		 */
		getCookie(name) {
			const matches = document.cookie.match(
				new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
			);
			return matches ? decodeURIComponent(matches[1]) : undefined;
		}

		/**
		 * Set cookie
		 */
		setCookie(name, value, days) {
			const expires = new Date();
			expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
			document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
		}

		/**
		 * Set up page load trigger
		 */
		setupPageLoadTrigger() {
			const delay = this.settings.autoTriggerDelay;

			this.pageLoadTimeout = setTimeout(() => {
				if (!this.isOpen) {
					this.open();
					this.markAsShown();
				}
			}, delay);
		}

		/**
		 * Set up exit intent trigger
		 */
		setupExitIntentTrigger() {
			// Don't trigger on mobile if excluded
			if (this.settings.exitIntentExcludeMobile && this.isMobileDevice()) {
				return;
			}

			const minTime = this.settings.exitIntentMinTime * 1000;
			const pageLoadTime = Date.now();
			let hasTriggered = false;

			// Sensitivity settings (distance from top in pixels)
			const sensitivityMap = {
				low: 100,
				medium: 50,
				high: 20,
			};
			const threshold = sensitivityMap[this.settings.exitIntentSensitivity] || 50;

			this.handleExitIntent = (e) => {
				// Check if enough time has passed
				if (Date.now() - pageLoadTime < minTime) {
					return;
				}

				// Check if mouse is leaving from top
				if (e.clientY <= threshold && !hasTriggered && !this.isOpen) {
					hasTriggered = true;
					this.open();
					this.markAsShown();
				}
			};

			document.addEventListener('mouseout', this.handleExitIntent);
		}

		/**
		 * Set up scroll depth trigger
		 */
		setupScrollTrigger() {
			let hasTriggered = false;
			const targetDepth = this.settings.scrollDepth;
			let lastScrollTop = 0;

			this.handleScroll = () => {
				if (hasTriggered || this.isOpen) {
					return;
				}

				const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
				const scrollPercent = (scrollTop / scrollHeight) * 100;

				// Check direction if needed
				if (this.settings.scrollDirection === 'down') {
					if (scrollTop < lastScrollTop) {
						lastScrollTop = scrollTop;
						return; // Scrolling up, ignore
					}
				}

				lastScrollTop = scrollTop;

				// Check if we've reached the target depth
				if (scrollPercent >= targetDepth) {
					hasTriggered = true;
					this.open();
					this.markAsShown();
					window.removeEventListener('scroll', this.handleScroll);
				}
			};

			window.addEventListener('scroll', this.handleScroll, { passive: true });
		}

		/**
		 * Set up time on page trigger
		 */
		setupTimeOnPageTrigger() {
			const delay = this.settings.timeOnPage * 1000;

			this.timeOnPageTimeout = setTimeout(() => {
				if (!this.isOpen) {
					this.open();
					this.markAsShown();
				}
			}, delay);
		}

		/**
		 * Check if device is mobile
		 */
		isMobileDevice() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			);
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

			// Move modal to body to avoid z-index stacking context issues
			// Store original parent for potential cleanup
			if (!this.originalParent && this.modal.parentElement !== document.body) {
				this.originalParent = this.modal.parentElement;
				this.originalNextSibling = this.modal.nextSibling;
				document.body.appendChild(this.modal);
			}

			// Update focusable elements
			this.updateFocusableElements();

			// Attach keyboard listeners (ESC and Tab)
			this.attachKeyboardListeners();

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

					// Clear any pending animation timeout to prevent race conditions
					if (this.animationTimeout) {
						clearTimeout(this.animationTimeout);
					}

					// Wait for animation to complete
					this.animationTimeout = setTimeout(() => {
						this.animationTimeout = null;
						this.onOpenComplete();
					}, this.settings.animationDuration);
				});
			} else {
				// No animation
				this.modal.classList.add('dsgo-modal--open');
				this.onOpenComplete();
			}

			this.isOpen = true;

			// Update URL hash if enabled
			if (this.settings.updateUrlOnOpen && this.modalId) {
				// Store that we're programmatically changing the hash to avoid triggering hash change listener
				this.isUpdatingHash = true;
				window.location.hash = this.modalId;
				// Reset flag after a short delay
				setTimeout(() => {
					this.isUpdatingHash = false;
				}, 100);
			}

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

				// Clear any pending animation timeout to prevent race conditions
				if (this.animationTimeout) {
					clearTimeout(this.animationTimeout);
				}

				// Wait for animation to complete
				this.animationTimeout = setTimeout(() => {
					this.animationTimeout = null;
					this.onCloseComplete();
				}, this.settings.animationDuration);
			} else {
				// No animation
				this.modal.classList.remove('dsgo-modal--open');
				this.onCloseComplete();
			}

			this.isOpen = false;

			// Clear URL hash if we set it on open
			if (this.settings.updateUrlOnOpen && window.location.hash === `#${this.modalId}`) {
				this.isUpdatingHash = true;
				history.replaceState(null, null, ' ');
				// Reset flag after a short delay
				setTimeout(() => {
					this.isUpdatingHash = false;
				}, 100);
			}

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

			// Detach keyboard listeners (ESC and Tab)
			this.detachKeyboardListeners();

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

			// Calculate scrollbar width to prevent layout shift
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

			// Add class to body
			document.body.classList.add('dsgo-modal-open');
			document.body.style.top = `-${this.scrollPosition}px`;

			// Compensate for scrollbar disappearance to prevent content shift
			if (scrollbarWidth > 0) {
				document.body.style.paddingRight = `${scrollbarWidth}px`;
			}
		}

		/**
		 * Enable body scrolling
		 */
		enableBodyScroll() {
			// Remove class from body
			document.body.classList.remove('dsgo-modal-open');
			document.body.style.top = '';
			document.body.style.paddingRight = ''; // Remove scrollbar compensation

			// Restore scroll position
			window.scrollTo(0, this.scrollPosition);
		}

		/**
		 * Destroy the modal instance
		 */
		destroy() {
			// Remove event listeners
			if (this.closeButton && this.handleCloseClick) {
				this.closeButton.removeEventListener('click', this.handleCloseClick);
			}
			if (this.backdrop && this.handleBackdropClick) {
				this.backdrop.removeEventListener('click', this.handleBackdropClick);
			}
			if (this.handleHashChange) {
				window.removeEventListener('hashchange', this.handleHashChange);
			}
			if (this.handleExitIntent) {
				document.removeEventListener('mouseout', this.handleExitIntent);
			}
			if (this.handleScroll) {
				window.removeEventListener('scroll', this.handleScroll);
			}

			// Clear auto-trigger timeouts
			if (this.pageLoadTimeout) {
				clearTimeout(this.pageLoadTimeout);
			}
			if (this.timeOnPageTimeout) {
				clearTimeout(this.timeOnPageTimeout);
			}

			// Ensure keyboard listeners are removed
			this.detachKeyboardListeners();

			// Disconnect MutationObserver to prevent memory leaks
			if (this.contentObserver) {
				this.contentObserver.disconnect();
				this.contentObserver = null;
			}

			// Clear animation timeout to prevent memory leaks
			if (this.animationTimeout) {
				clearTimeout(this.animationTimeout);
				this.animationTimeout = null;
			}

			// Restore modal to original parent if it was moved
			if (this.originalParent && this.modal.parentElement === document.body) {
				if (this.originalNextSibling) {
					this.originalParent.insertBefore(this.modal, this.originalNextSibling);
				} else {
					this.originalParent.appendChild(this.modal);
				}
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
