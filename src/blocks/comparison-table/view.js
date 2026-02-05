/**
 * Comparison Table Block - Frontend Interactivity
 *
 * Handles:
 * - Sticky header behavior on scroll
 * - Tooltip display on hover/focus
 * - Accessibility: keyboard navigation and ARIA
 */

document.addEventListener('DOMContentLoaded', () => {
	const tables = document.querySelectorAll('.dsgo-comparison-table');

	tables.forEach((table) => {
		if (table.dataset.dsgoInitialized) return;
		table.dataset.dsgoInitialized = 'true';

		initStickyHeader(table);
		initTooltips(table);
	});
});

/**
 * Initializes sticky header behavior for a comparison table
 *
 * @param {HTMLElement} table - The comparison table wrapper element
 */
function initStickyHeader(table) {
	if (table.dataset.stickyHeader !== 'true') return;

	const thead = table.querySelector('.dsgo-comparison-table__header');
	if (!thead) return;

	// Use IntersectionObserver for performant sticky detection
	const sentinel = document.createElement('div');
	sentinel.className = 'dsgo-comparison-table__sticky-sentinel';
	sentinel.setAttribute('aria-hidden', 'true');
	sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;';
	table.style.position = 'relative';
	table.prepend(sentinel);

	const observer = new IntersectionObserver(
		([entry]) => {
			thead.classList.toggle(
				'dsgo-comparison-table__header--stuck',
				!entry.isIntersecting
			);
		},
		{
			threshold: 0,
			rootMargin: '0px 0px 0px 0px',
		}
	);

	observer.observe(sentinel);
}

/**
 * Initializes tooltip behavior for feature row info icons
 *
 * @param {HTMLElement} table - The comparison table wrapper element
 */
function initTooltips(table) {
	const triggers = table.querySelectorAll(
		'.dsgo-comparison-table__tooltip-trigger[data-tooltip]'
	);

	if (!triggers.length) return;

	triggers.forEach((trigger) => {
		const tooltipText = trigger.dataset.tooltip;
		if (!tooltipText) return;

		// Set ARIA attributes
		const tooltipId = `dsgo-tooltip-${Math.random().toString(36).substring(2, 9)}`;
		trigger.setAttribute('aria-describedby', tooltipId);
		trigger.setAttribute('tabindex', '0');
		trigger.setAttribute('role', 'button');

		// Create tooltip element
		const tooltip = document.createElement('div');
		tooltip.className = 'dsgo-comparison-table__tooltip';
		tooltip.id = tooltipId;
		tooltip.setAttribute('role', 'tooltip');
		tooltip.textContent = tooltipText;
		trigger.parentNode.style.position = 'relative';
		trigger.parentNode.appendChild(tooltip);

		/**
		 * Shows the tooltip
		 */
		const show = () => {
			tooltip.classList.add('is-visible');
		};

		/**
		 * Hides the tooltip
		 */
		const hide = () => {
			tooltip.classList.remove('is-visible');
		};

		// Mouse events
		trigger.addEventListener('mouseenter', show);
		trigger.addEventListener('mouseleave', hide);

		// Keyboard events
		trigger.addEventListener('focus', show);
		trigger.addEventListener('blur', hide);

		// Dismiss on Escape
		trigger.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				hide();
				trigger.blur();
			}
		});
	});
}
