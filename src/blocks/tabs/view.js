/**
 * Tabs Block - Frontend JavaScript
 *
 * Handles tab switching, keyboard navigation, deep linking, and mobile responsive behavior
 */

(function () {
	'use strict';

	class DSGTabs {
		constructor(element) {
			this.element = element;
			this.nav = element.querySelector('.dsg-tabs__nav');
			this.panels = element.querySelectorAll('.dsg-tab');
			this.activeTab = parseInt(element.dataset.activeTab) || 0;
			this.mobileBreakpoint =
				parseInt(element.dataset.mobileBreakpoint) || 768;
			this.mobileMode = element.dataset.mobileMode || 'accordion';
			this.enableDeepLinking = element.dataset.deepLinking === 'true';

			this.init();
		}

		/**
		 * Create a Dashicon element securely (no innerHTML)
		 *
		 * @param {string} iconSlug - Sanitized dashicon slug
		 * @return {HTMLElement} Dashicon span element
		 */
		createDashicon(iconSlug) {
			const iconWrapper = document.createElement('span');
			iconWrapper.className = 'dsg-tabs__tab-icon';

			const dashicon = document.createElement('span');
			// Icon slug is already sanitized in save.js, but validate again
			// Only allow: lowercase letters, numbers, hyphens
			const safeIcon = iconSlug.replace(/[^a-z0-9\-]/g, '');
			dashicon.className = `dashicons dashicons-${safeIcon}`;

			iconWrapper.appendChild(dashicon);
			return iconWrapper;
		}

		init() {
			// Build tab navigation from panels
			this.buildNavigation();

			// Set initial active tab
			this.setActiveTab(this.activeTab, false);

			// Handle deep linking
			if (this.enableDeepLinking) {
				this.handleDeepLinking();
			}

			// Handle mobile responsiveness
			this.handleResize();
			window.addEventListener('resize', () => this.handleResize());
		}

		buildNavigation() {
			if (!this.nav || this.panels.length === 0) {
				return;
			}

			// Clear existing navigation (modern approach without innerHTML)
			this.nav.replaceChildren();

			// Build tab buttons from panels
			this.panels.forEach((panel, index) => {
				const tabId = panel.id.replace('panel-', 'tab-');
				const title =
					panel.getAttribute('aria-label') ||
					this.getTabTitle(panel) ||
					`Tab ${index + 1}`;
				const icon = panel.dataset.icon;
				const iconPosition = panel.dataset.iconPosition || 'left';

				const button = document.createElement('button');
				button.className = 'dsg-tabs__tab';
				button.id = tabId;
				button.setAttribute('type', 'button');
				button.setAttribute('role', 'tab');
				button.setAttribute(
					'aria-selected',
					index === this.activeTab ? 'true' : 'false'
				);
				button.setAttribute('aria-controls', panel.id);
				button.setAttribute(
					'tabindex',
					index === this.activeTab ? '0' : '-1'
				);
				button.dataset.tabIndex = index;

				// Add icon if present (✅ SECURITY: Using createElement, not innerHTML)
				if (icon) {
					button.classList.add('has-icon', `icon-${iconPosition}`);

					if (iconPosition === 'top') {
						const iconTopWrapper = document.createElement('span');
						iconTopWrapper.className = 'dsg-tabs__tab-icon-top';
						iconTopWrapper.appendChild(this.createDashicon(icon));
						button.appendChild(iconTopWrapper);
					} else if (iconPosition === 'left') {
						button.appendChild(this.createDashicon(icon));
					}
				}

				// Add title
				const titleSpan = document.createElement('span');
				titleSpan.className = 'dsg-tabs__tab-title';
				titleSpan.textContent = title;
				button.appendChild(titleSpan);

				// Add right icon if needed (✅ SECURITY: Using createElement, not innerHTML)
				if (icon && iconPosition === 'right') {
					button.appendChild(this.createDashicon(icon));
				}

				// Event listeners
				button.addEventListener('click', () =>
					this.setActiveTab(index)
				);
				button.addEventListener('keydown', (e) =>
					this.handleKeyboard(e, index)
				);

				this.nav.appendChild(button);
			});
		}

		getTabTitle(panel) {
			// Try to get title from data attribute or panel content
			const contentDiv = panel.querySelector('.dsg-tab__content');
			if (!contentDiv) {
				return null;
			}

			// Look for heading in first few elements
			const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
			return heading ? heading.textContent : null;
		}

		setActiveTab(index, updateURL = true) {
			if (index < 0 || index >= this.panels.length) {
				return;
			}

			this.activeTab = index;

			// Update tabs
			const tabs = this.nav.querySelectorAll('.dsg-tabs__tab');
			tabs.forEach((tab, i) => {
				const isActive = i === index;
				tab.classList.toggle('is-active', isActive);
				tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
				tab.setAttribute('tabindex', isActive ? '0' : '-1');
			});

			// Update panels
			this.panels.forEach((panel, i) => {
				const isActive = i === index;
				panel.classList.toggle('is-active', isActive);
				panel.hidden = !isActive;
			});

			// Update URL hash if deep linking enabled
			if (this.enableDeepLinking && updateURL) {
				const panel = this.panels[index];
				if (panel.id) {
					// eslint-disable-next-line no-undef
					history.replaceState(null, null, `#${panel.id}`);
				}
			}

			// Trigger custom event
			this.element.dispatchEvent(
				new CustomEvent('dsg-tab-change', {
					detail: { index, panel: this.panels[index] },
				})
			);
		}

		handleKeyboard(e, currentIndex) {
			let newIndex = currentIndex;
			const orientation = this.element.classList.contains(
				'dsg-tabs--vertical'
			)
				? 'vertical'
				: 'horizontal';

			if (orientation === 'horizontal') {
				if (e.key === 'ArrowLeft') {
					newIndex =
						currentIndex > 0
							? currentIndex - 1
							: this.panels.length - 1;
					e.preventDefault();
				} else if (e.key === 'ArrowRight') {
					newIndex =
						currentIndex < this.panels.length - 1
							? currentIndex + 1
							: 0;
					e.preventDefault();
				}
			} else if (e.key === 'ArrowUp') {
				newIndex =
					currentIndex > 0
						? currentIndex - 1
						: this.panels.length - 1;
				e.preventDefault();
			} else if (e.key === 'ArrowDown') {
				newIndex =
					currentIndex < this.panels.length - 1
						? currentIndex + 1
						: 0;
				e.preventDefault();
			}

			if (e.key === 'Home') {
				newIndex = 0;
				e.preventDefault();
			} else if (e.key === 'End') {
				newIndex = this.panels.length - 1;
				e.preventDefault();
			}

			if (newIndex !== currentIndex) {
				this.setActiveTab(newIndex);
				this.nav.querySelectorAll('.dsg-tabs__tab')[newIndex].focus();
			}
		}

		handleDeepLinking() {
			// Check URL hash on load
			const hash = window.location.hash.substring(1);
			if (hash) {
				const panel = this.element.querySelector(`#${hash}`);
				if (panel) {
					const index = Array.from(this.panels).indexOf(panel);
					if (index !== -1) {
						this.setActiveTab(index, false);
					}
				}
			}

			// Listen for hash changes
			window.addEventListener('hashchange', () => {
				const newHash = window.location.hash.substring(1);
				if (newHash) {
					const panel = this.element.querySelector(`#${newHash}`);
					if (panel) {
						const index = Array.from(this.panels).indexOf(panel);
						if (index !== -1) {
							this.setActiveTab(index, false);
						}
					}
				}
			});
		}

		handleResize() {
			const isMobile = window.innerWidth < this.mobileBreakpoint;

			if (isMobile) {
				this.element.classList.add('is-mobile');

				if (this.mobileMode === 'accordion') {
					this.convertToAccordion();
				} else if (this.mobileMode === 'dropdown') {
					this.convertToDropdown();
				}
			} else {
				this.element.classList.remove('is-mobile');
				this.restoreTabsMode();
			}
		}

		convertToAccordion() {
			this.element.classList.add('dsg-tabs--accordion');
			this.element.classList.remove('dsg-tabs--dropdown');

			// Hide tab navigation
			if (this.nav) {
				this.nav.style.display = 'none';
			}

			// Add accordion headers to each panel
			this.panels.forEach((panel, index) => {
				let header = panel.querySelector('.dsg-tab__accordion-header');

				if (!header) {
					header = document.createElement('button');
					header.className = 'dsg-tab__accordion-header';
					header.setAttribute('type', 'button');
					header.setAttribute(
						'aria-expanded',
						index === this.activeTab ? 'true' : 'false'
					);

					const title = this.getTabTitle(panel) || `Tab ${index + 1}`;
					header.textContent = title;

					header.addEventListener('click', () => {
						this.setActiveTab(index);
					});

					panel.insertBefore(header, panel.firstChild);
				}

				header.setAttribute(
					'aria-expanded',
					index === this.activeTab ? 'true' : 'false'
				);
			});
		}

		convertToDropdown() {
			this.element.classList.add('dsg-tabs--dropdown');
			this.element.classList.remove('dsg-tabs--accordion');

			// Convert nav to dropdown
			if (this.nav) {
				this.nav.style.display = 'block';
				// Implementation would convert buttons to <select> dropdown
			}
		}

		restoreTabsMode() {
			this.element.classList.remove(
				'dsg-tabs--accordion',
				'dsg-tabs--dropdown'
			);

			// Show tab navigation
			if (this.nav) {
				this.nav.style.display = '';
			}

			// Remove accordion headers
			this.panels.forEach((panel) => {
				const header = panel.querySelector(
					'.dsg-tab__accordion-header'
				);
				if (header) {
					header.remove();
				}
			});
		}
	}

	// Initialize all tabs on page load
	function initTabs() {
		const tabsElements = document.querySelectorAll('.dsg-tabs');
		tabsElements.forEach((element) => {
			new DSGTabs(element);
		});
	}

	// Run on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initTabs);
	} else {
		initTabs();
	}

	// Expose to window for external access
	window.DSGTabs = DSGTabs;
})();
