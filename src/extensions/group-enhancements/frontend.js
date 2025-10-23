/**
 * Group Block Enhancements - Frontend
 *
 * Handles dynamic overlay rendering and clickable groups
 *
 * @package DesignSetGo
 */

document.addEventListener('DOMContentLoaded', function () {
	// Handle clickable groups
	const clickableGroups = document.querySelectorAll('.dsg-clickable');

	clickableGroups.forEach((group) => {
		const linkUrl = group.getAttribute('data-link-url');
		const linkTarget = group.getAttribute('data-link-target');
		const linkRel = group.getAttribute('data-link-rel');

		if (linkUrl) {
			// Make the entire group clickable
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
					// Build rel attribute
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
							newWindow.opener = null;
						}
					} else {
						window.location.href = linkUrl;
					}
				}
			});
		}
	});
});
