/**
 * Clickable Group - Frontend JavaScript
 *
 * Handles clickable group functionality on the frontend.
 * Makes entire group blocks clickable while preserving
 * functionality of interactive elements inside.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

document.addEventListener('DOMContentLoaded', function () {
	// Find all clickable groups
	const clickableGroups = document.querySelectorAll('.dsg-clickable');

	clickableGroups.forEach((group) => {
		const linkUrl = group.getAttribute('data-link-url');

		if (!linkUrl) {
			return;
		}

		const linkTarget = group.getAttribute('data-link-target');
		const linkRel = group.getAttribute('data-link-rel');

		// Make the cursor show it's clickable
		group.style.cursor = 'pointer';

		// Handle click event
		group.addEventListener('click', function (e) {
			// Don't navigate if clicking on an interactive element
			const target = e.target;
			const isInteractive =
				target.tagName === 'A' ||
				target.tagName === 'BUTTON' ||
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.tagName === 'SELECT' ||
				target.closest('a') ||
				target.closest('button');

			if (!isInteractive) {
				// Build rel attribute for security
				let relValue = linkRel || '';
				if (linkTarget === '_blank') {
					// Add noopener noreferrer for security when opening in new tab
					relValue = relValue
						? `${relValue} noopener noreferrer`
						: 'noopener noreferrer';
				}

				// Navigate to URL
				if (linkTarget === '_blank') {
					const newWindow = window.open(linkUrl, '_blank');
					if (newWindow && relValue) {
						newWindow.opener = null; // Security: prevent window.opener access
					}
				} else {
					window.location.href = linkUrl;
				}
			}
		});
	});
});
