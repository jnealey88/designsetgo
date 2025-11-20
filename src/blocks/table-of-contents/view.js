/**
 * Table of Contents Block - Frontend JavaScript
 *
 * Scans page for headings and populates TOC list with smooth scroll and scroll spy.
 */

/* global IntersectionObserver */

import { __ } from '@wordpress/i18n';

document.addEventListener('DOMContentLoaded', function () {
	initTableOfContents();
});

class DSGTableOfContents {
	constructor(element) {
		this.element = element;
		this.uniqueId = element.dataset.uniqueId || '';

		// Validate and parse heading levels
		this.headingLevels = this.parseHeadingLevels(
			element.dataset.headingLevels
		);

		// Validate display mode
		this.displayMode = this.parseDisplayMode(element.dataset.displayMode);

		// Validate scroll smooth boolean
		this.scrollSmooth = element.dataset.scrollSmooth === 'true';

		// Responsive scroll offset: 150px desktop, 60px mobile
		const baseOffset = this.parseScrollOffset(element.dataset.scrollOffset);
		this.scrollOffset = this.getResponsiveScrollOffset(baseOffset);

		this.listElement = element.querySelector(
			'.dsgo-table-of-contents__list'
		);
		this.observedHeadings = [];

		// Prevent duplicate initialization
		if (element.hasAttribute('data-dsgo-initialized')) {
			return;
		}
		element.setAttribute('data-dsgo-initialized', 'true');

		this.init();
	}

	/**
	 * Parse and validate heading levels from data attribute.
	 *
	 * @param {string} levelsString - Comma-separated heading levels (e.g., "h2,h3,h4")
	 * @return {string[]} Array of valid heading levels
	 */
	parseHeadingLevels(levelsString) {
		const VALID_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
		const DEFAULT_LEVELS = ['h2', 'h3'];

		if (!levelsString) {
			return DEFAULT_LEVELS;
		}

		const rawLevels = levelsString
			.split(',')
			.map((level) => level.trim().toLowerCase());
		const validLevels = rawLevels.filter((level) =>
			VALID_LEVELS.includes(level)
		);

		// If no valid levels found, return defaults
		return validLevels.length > 0 ? validLevels : DEFAULT_LEVELS;
	}

	/**
	 * Parse and validate display mode from data attribute.
	 *
	 * @param {string} mode - Display mode ("hierarchical" or "flat")
	 * @return {string} Valid display mode
	 */
	parseDisplayMode(mode) {
		const VALID_MODES = ['hierarchical', 'flat'];
		const DEFAULT_MODE = 'hierarchical';

		if (!mode || !VALID_MODES.includes(mode.toLowerCase())) {
			return DEFAULT_MODE;
		}

		return mode.toLowerCase();
	}

	/**
	 * Parse and validate scroll offset from data attribute.
	 *
	 * @param {string} offsetString - Scroll offset in pixels
	 * @return {number} Valid scroll offset (0-500px)
	 */
	parseScrollOffset(offsetString) {
		const DEFAULT_OFFSET = 150;
		const MIN_OFFSET = 0;
		const MAX_OFFSET = 500;

		const offset = parseInt(offsetString, 10);

		if (isNaN(offset)) {
			return DEFAULT_OFFSET;
		}

		// Clamp offset to valid range
		return Math.max(MIN_OFFSET, Math.min(MAX_OFFSET, offset));
	}

	/**
	 * Get responsive scroll offset based on viewport width.
	 * Uses mobile offset (60px) on screens < 782px, otherwise uses base offset.
	 *
	 * @param {number} baseOffset - The desktop scroll offset from block settings
	 * @return {number} Adjusted scroll offset for current viewport
	 */
	getResponsiveScrollOffset(baseOffset) {
		const MOBILE_BREAKPOINT = 782; // WordPress admin bar breakpoint
		const MOBILE_OFFSET = 60;

		// Use mobile offset on small screens, desktop offset otherwise
		if (window.innerWidth < MOBILE_BREAKPOINT) {
			return MOBILE_OFFSET;
		}

		return baseOffset;
	}

	init() {
		try {
			// Scan page for headings
			const headings = this.scanHeadings();

			if (headings.length === 0) {
				this.showEmptyMessage();
				return;
			}

			// Populate TOC list
			this.populateTOC(headings);

			// Setup link click handlers
			this.setupLinkHandlers();

			// Setup scroll spy
			if (this.scrollSmooth) {
				this.setupScrollSpy(headings);
			}
		} catch (error) {
			console.error(
				'[DSG TOC] Error initializing table of contents:',
				error
			);
			this.showEmptyMessage();
		}
	}

	scanHeadings() {
		const headings = [];
		const selector = this.headingLevels.join(',');
		const usedIds = new Set();

		// Define content area selectors (prioritized)
		const contentSelectors = [
			'.entry-content', // WordPress default post content
			'article .content', // Article content
			'main article', // Main article element
			'.post-content', // Alternative post content class
			'main', // Semantic main element
			'.site-content', // Site content area
		];

		// Find the main content container
		let contentArea = null;
		for (const contentSelector of contentSelectors) {
			contentArea = document.querySelector(contentSelector);
			if (contentArea) {
				break;
			}
		}

		// Fallback to document if no content area found
		const searchArea = contentArea || document;

		// Search for headings within the content area
		searchArea.querySelectorAll(selector).forEach((heading) => {
			// Skip if heading is inside a TOC block
			if (heading.closest('.dsgo-table-of-contents')) {
				return;
			}

			// Skip headings in excluded areas (comments, sidebars, footers, headers)
			const excludedAreas = [
				'.site-header',
				'header',
				'.site-footer',
				'footer',
				'aside',
				'.sidebar',
				'.widget',
				'.comments-area',
				'#comments',
				'.comment-respond',
				'.navigation',
				'.nav',
			];

			for (const excludedSelector of excludedAreas) {
				if (heading.closest(excludedSelector)) {
					return;
				}
			}

			const text = heading.textContent?.trim();
			if (!text) {
				return;
			}

			// Generate pretty ID from heading text if missing
			if (!heading.id) {
				heading.id = this.generatePrettyId(text, usedIds);
			} else {
				// Track existing IDs to avoid duplicates
				usedIds.add(heading.id);
			}

			headings.push({
				level: parseInt(heading.tagName.replace('H', '')),
				text,
				id: heading.id,
				element: heading,
			});
		});

		return headings;
	}

	generatePrettyId(text, usedIds) {
		// Convert heading text to URL-friendly slug
		let slug = text
			.toLowerCase()
			.trim()
			// Replace apostrophes and quotes
			.replace(/['']/g, '')
			// Replace any non-alphanumeric characters (except hyphens) with hyphens
			.replace(/[^a-z0-9-]+/g, '-')
			// Replace multiple hyphens with single hyphen
			.replace(/-+/g, '-')
			// Remove leading/trailing hyphens
			.replace(/^-+|-+$/g, '')
			// Limit length to 50 characters
			.substring(0, 50)
			// Remove trailing hyphen if substring cut in the middle
			.replace(/-+$/, '');

		// Ensure slug is not empty
		if (!slug) {
			slug = 'section';
		}

		// Make unique if already used
		let uniqueSlug = slug;
		let counter = 1;
		while (usedIds.has(uniqueSlug)) {
			uniqueSlug = `${slug}-${counter}`;
			counter++;
		}

		usedIds.add(uniqueSlug);
		return uniqueSlug;
	}

	showEmptyMessage() {
		if (this.listElement) {
			const li = document.createElement('li');
			li.className = 'dsgo-table-of-contents__empty';
			li.textContent = __('No headings found.', 'designsetgo');
			this.listElement.appendChild(li);
		}
	}

	populateTOC(headings) {
		if (!this.listElement) {
			return;
		}

		// Clear existing content
		this.listElement.innerHTML = '';

		if (this.displayMode === 'flat') {
			this.populateFlatTOC(headings);
		} else {
			this.populateHierarchicalTOC(headings);
		}
	}

	populateFlatTOC(headings) {
		headings.forEach((heading) => {
			const li = this.createListItem(heading);
			this.listElement.appendChild(li);
		});
	}

	populateHierarchicalTOC(headings) {
		if (headings.length === 0) {
			return;
		}

		const minLevel = Math.min(...headings.map((h) => h.level));
		const items = this.buildHierarchy(headings, minLevel);
		items.forEach((item) => this.listElement.appendChild(item));
	}

	buildHierarchy(headings, currentLevel) {
		const items = [];
		let i = 0;

		while (i < headings.length) {
			const heading = headings[i];

			if (heading.level === currentLevel) {
				const li = this.createListItem(heading);

				// Collect children
				const children = [];
				let j = i + 1;

				while (
					j < headings.length &&
					headings[j].level > currentLevel
				) {
					children.push(headings[j]);
					j++;
				}

				// Add nested list if there are children
				if (children.length > 0) {
					const isOrdered =
						this.listElement.tagName.toLowerCase() === 'ol';
					const subList = document.createElement(
						isOrdered ? 'ol' : 'ul'
					);
					subList.className = 'dsgo-table-of-contents__sublist';

					const childItems = this.buildHierarchy(
						children,
						currentLevel + 1
					);
					childItems.forEach((child) => subList.appendChild(child));

					li.appendChild(subList);
				}

				items.push(li);
				i = j;
			} else if (heading.level < currentLevel) {
				// This heading belongs to a parent level
				break;
			} else {
				// Skip headings at deeper levels (they'll be handled as children)
				i++;
			}
		}

		return items;
	}

	createListItem(heading) {
		const li = document.createElement('li');
		li.className = `dsgo-table-of-contents__item dsgo-table-of-contents__item--level-${heading.level}`;

		const a = document.createElement('a');
		a.href = `#${heading.id}`;
		a.className = 'dsgo-table-of-contents__link';
		a.textContent = heading.text;
		a.setAttribute('aria-label', `Jump to section: ${heading.text}`);

		li.appendChild(a);
		return li;
	}

	setupLinkHandlers() {
		try {
			const links = this.element.querySelectorAll(
				'.dsgo-table-of-contents__link'
			);

			links.forEach((link) => {
				link.addEventListener('click', (e) => {
					e.preventDefault();

					try {
						const targetId = link.getAttribute('href').substring(1);
						const target = document.getElementById(targetId);

						if (target) {
							this.scrollToTarget(target);
							this.updateActiveLink(link);

							// Update URL hash
							if (window.history.replaceState) {
								window.history.replaceState(
									null,
									null,
									`#${targetId}`
								);
							}

							// Focus target for accessibility
							target.setAttribute('tabindex', '-1');
							target.focus();
						}
					} catch (error) {
						console.error(
							'[DSG TOC] Error handling link click:',
							error
						);
					}
				});
			});
		} catch (error) {
			console.error('[DSG TOC] Error setting up link handlers:', error);
		}
	}

	scrollToTarget(target) {
		const rect = target.getBoundingClientRect();
		const scrollTop = window.scrollY + rect.top - this.scrollOffset;

		if (this.scrollSmooth) {
			window.scrollTo({
				top: scrollTop,
				behavior: 'smooth',
			});
		} else {
			window.scrollTo(0, scrollTop);
		}
	}

	setupScrollSpy(headings) {
		// Store heading elements for cleanup
		this.observedHeadings = headings.map((h) => h.element);

		// IntersectionObserver configuration for scroll spy
		// - Top offset: User's scroll offset + 100px buffer for early detection
		//   (ensures we detect heading before it reaches the exact scroll position)
		// - Bottom offset: 66% ensures we highlight the section when it's in the top 1/3 of viewport
		//   (100% - 66% = 34% visible area, centered on upper third for natural reading position)
		const EARLY_DETECTION_BUFFER = 100; // Pixels before scroll offset for smoother transitions
		const VIEWPORT_TRIGGER_THRESHOLD = 66; // Percentage from bottom (triggers in top 34% of viewport)

		const observerOptions = {
			rootMargin: `-${this.scrollOffset + EARLY_DETECTION_BUFFER}px 0px -${VIEWPORT_TRIGGER_THRESHOLD}% 0px`,
			threshold: 0,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target.id) {
					const link = this.element.querySelector(
						`.dsgo-table-of-contents__link[href="#${entry.target.id}"]`
					);
					if (link) {
						this.updateActiveLink(link);
					}
				}
			});
		}, observerOptions);

		// Observe all heading elements
		this.observedHeadings.forEach((heading) => {
			observer.observe(heading);
		});

		// Store observer for cleanup
		this.observer = observer;
	}

	updateActiveLink(activeLink) {
		// Remove active class from all links
		this.element
			.querySelectorAll('.dsgo-table-of-contents__link')
			.forEach((link) => {
				link.classList.remove('dsgo-table-of-contents__link--active');
				const li = link.closest('li');
				if (li) {
					li.classList.remove('dsgo-table-of-contents__item--active');
				}
			});

		// Add active class to current link
		if (activeLink) {
			activeLink.classList.add('dsgo-table-of-contents__link--active');
			const li = activeLink.closest('li');
			if (li) {
				li.classList.add('dsgo-table-of-contents__item--active');
			}
		}
	}

	destroy() {
		// Cleanup observer
		if (this.observer) {
			this.observedHeadings.forEach((heading) => {
				this.observer.unobserve(heading);
			});
			this.observer.disconnect();
		}
	}
}

function initTableOfContents() {
	const blocks = document.querySelectorAll('.dsgo-table-of-contents');
	blocks.forEach((block) => {
		new DSGTableOfContents(block);
	});
}

// Re-initialize on dynamic content changes (optional, for compatibility with dynamic loaders)
if (typeof window.addEventListener !== 'undefined') {
	window.addEventListener('dsgo-reinit-toc', initTableOfContents);
}
