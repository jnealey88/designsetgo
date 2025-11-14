/**
 * Form Builder Block - Frontend JavaScript
 *
 * Handles AJAX form submission with validation
 *
 * @since 1.0.0
 */

/* global designsetgoForm */

document.addEventListener('DOMContentLoaded', function () {
	const forms = document.querySelectorAll('.dsgo-form-builder');

	forms.forEach((formContainer) => {
		const formElement = formContainer.querySelector('.dsgo-form');
		const submitButton = formElement?.querySelector('.dsgo-form__submit');
		const messageContainer = formElement?.querySelector(
			'.dsgo-form__message'
		);

		if (!formElement || !submitButton || !messageContainer) {
			return;
		}

		// Add timestamp field dynamically (not in save.js to avoid validation errors)
		const timestampField = document.createElement('input');
		timestampField.type = 'hidden';
		timestampField.name = 'dsg_timestamp';
		timestampField.value = Date.now();
		formElement.appendChild(timestampField);

		// Check if AJAX is enabled
		const ajaxEnabled =
			formContainer.getAttribute('data-ajax-submit') === 'true';

		// If AJAX is not enabled, use standard form submission
		if (!ajaxEnabled) {
			return;
		}

		// Get form settings from data attributes (only if AJAX enabled)
		const formId = formContainer.getAttribute('data-form-id');
		const successMessage = formContainer.getAttribute(
			'data-success-message'
		);
		const errorMessage = formContainer.getAttribute('data-error-message');

		// Get email settings from data attributes
		const enableEmail = formContainer.getAttribute('data-enable-email');
		const emailTo = formContainer.getAttribute('data-email-to');
		const emailSubject = formContainer.getAttribute('data-email-subject');
		const emailFromName = formContainer.getAttribute(
			'data-email-from-name'
		);
		const emailFromEmail = formContainer.getAttribute(
			'data-email-from-email'
		);
		const emailReplyTo = formContainer.getAttribute('data-email-reply-to');
		const emailBody = formContainer.getAttribute('data-email-body');

		// Handle form submission
		formElement.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Clear previous messages
			hideMessage(messageContainer);

			// Validate form using HTML5 validation
			if (!formElement.checkValidity()) {
				formElement.reportValidity();
				return;
			}

			// Disable submit button and show loading state
			submitButton.disabled = true;
			submitButton.classList.add('dsgo-form__submit--loading');
			const originalText = submitButton.textContent;
			submitButton.setAttribute('aria-busy', 'true');

			// Collect form data
			const formData = new FormData(formElement);
			const fields = [];

			for (const [name, value] of formData.entries()) {
				// Skip honeypot and system fields
				if (
					name === 'dsg_website' ||
					name === 'dsg_form_id' ||
					name === 'dsg_timestamp'
				) {
					continue;
				}

				const fieldElement = formElement.querySelector(
					`[name="${name}"]`
				);
				const fieldType =
					fieldElement?.getAttribute('data-field-type') ||
					fieldElement?.type ||
					'text';

				fields.push({
					name,
					value,
					type: fieldType,
				});
			}

			// Get honeypot and timestamp values
			const honeypot = formData.get('dsg_website');
			const timestamp = formData.get('dsg_timestamp');

			try {
				// Make AJAX request to WordPress REST API
				const response = await fetch(designsetgoForm.restUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': designsetgoForm.nonce,
					},
					body: JSON.stringify({
						formId,
						fields,
						honeypot: honeypot || '',
						timestamp: timestamp || Date.now(),
						enable_email: enableEmail,
						email_to: emailTo,
						email_subject: emailSubject,
						email_from_name: emailFromName,
						email_from_email: emailFromEmail,
						email_reply_to: emailReplyTo,
						email_body: emailBody,
					}),
				});

				const result = await response.json();

				if (result.success) {
					// Show success message
					showMessage(
						messageContainer,
						successMessage || result.message,
						'success'
					);

					// Reset form
					formElement.reset();

					// Fire custom event for tracking/analytics
					formContainer.dispatchEvent(
						new CustomEvent('dsgoFormSubmitted', {
							detail: {
								formId,
								submissionId: result.submissionId,
							},
							bubbles: true,
						})
					);

					// Scroll to message if not visible
					if (!isElementInViewport(messageContainer)) {
						messageContainer.scrollIntoView({
							behavior: 'smooth',
							block: 'nearest',
						});
					}
				} else {
					throw new Error(result.message || errorMessage);
				}
			} catch (error) {
				// eslint-disable-next-line no-console -- Error logging for debugging
				console.error('Form submission error:', error);

				// Show error message
				showMessage(
					messageContainer,
					error.message ||
						errorMessage ||
						'An error occurred. Please try again.',
					'error'
				);

				// Fire custom event for error tracking
				formContainer.dispatchEvent(
					new CustomEvent('dsgoFormError', {
						detail: {
							formId,
							error: error.message,
						},
						bubbles: true,
					})
				);
			} finally {
				// Re-enable submit button
				submitButton.disabled = false;
				submitButton.classList.remove('dsgo-form__submit--loading');
				submitButton.textContent = originalText;
				submitButton.removeAttribute('aria-busy');
			}
		});
	});

	/**
	 * Show message to user
	 *
	 * @param {HTMLElement} container Message container element
	 * @param {string}      message   Message text to display
	 * @param {string}      type      Message type: 'success' or 'error'
	 */
	function showMessage(container, message, type) {
		container.textContent = message;
		container.className = `dsgo-form__message dsgo-form__message--${type}`;
		container.style.display = 'block';
		container.setAttribute('role', type === 'error' ? 'alert' : 'status');

		// Announce to screen readers
		const announcement = document.createElement('span');
		announcement.className = 'screen-reader-text';
		announcement.textContent = message;
		announcement.setAttribute('aria-live', 'polite');
		container.appendChild(announcement);
	}

	/**
	 * Hide message container
	 *
	 * @param {HTMLElement} container Message container element
	 */
	function hideMessage(container) {
		container.style.display = 'none';
		container.textContent = '';
		container.className = 'dsgo-form__message';
	}

	/**
	 * Check if element is in viewport
	 *
	 * @param {HTMLElement} element Element to check
	 * @return {boolean} True if element is in viewport
	 */
	function isElementInViewport(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <=
				(window.innerWidth || document.documentElement.clientWidth)
		);
	}
});
