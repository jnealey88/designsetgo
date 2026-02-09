/**
 * Draft Mode Preview Banner Script
 *
 * Toggles the details panel in the preview banner.
 *
 * @package
 * @since 2.0.0
 */

(function () {
	'use strict';

	const toggleBtn = document.querySelector(
		'.dsgo-preview-banner__details-toggle'
	);
	const detailsPanel = document.getElementById('dsgo-preview-draft-list');

	if (toggleBtn && detailsPanel) {
		toggleBtn.addEventListener('click', function () {
			const isExpanded =
				toggleBtn.getAttribute('aria-expanded') === 'true';
			toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
			detailsPanel.hidden = isExpanded;
		});
	}
})();
