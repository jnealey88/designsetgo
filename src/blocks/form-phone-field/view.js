/**
 * Form Phone Field Block - Frontend Auto-Formatting
 *
 * @since 1.0.0
 */

document.addEventListener('DOMContentLoaded', function () {
	// Find all phone field wrappers with auto-format enabled
	const phoneWrappers = document.querySelectorAll(
		'.dsgo-form-field__phone-wrapper[data-auto-format="true"]'
	);

	phoneWrappers.forEach((wrapper) => {
		const input = wrapper.querySelector('input[type="tel"]');
		if (!input) {
			return;
		}

		const phoneFormat = input.dataset.phoneFormat || 'any';

		// Format phone number based on format type
		function formatPhoneNumber(value, format) {
			// Remove all non-numeric characters
			const cleaned = value.replace(/\D/g, '');

			if (format === 'us') {
				// US format: (555) 123-4567
				if (cleaned.length <= 3) {
					return cleaned;
				} else if (cleaned.length <= 6) {
					return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
				}
				return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
			} else if (format === 'international') {
				// International format: +1 555 123 4567
				if (cleaned.length <= 3) {
					return cleaned;
				} else if (cleaned.length <= 6) {
					return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
				} else if (cleaned.length <= 9) {
					return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
				}
				return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
			}
			// Any format: just add spaces for readability
			if (cleaned.length <= 3) {
				return cleaned;
			} else if (cleaned.length <= 6) {
				return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
			}
			return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
		}

		// Handle input event for auto-formatting
		input.addEventListener('input', function (e) {
			const cursorPosition = e.target.selectionStart;
			const oldValue = e.target.value;
			const oldLength = oldValue.length;

			// Format the value
			const formattedValue = formatPhoneNumber(oldValue, phoneFormat);
			const newLength = formattedValue.length;

			// Update the input value
			e.target.value = formattedValue;

			// Adjust cursor position
			const diff = newLength - oldLength;
			const newCursorPosition = cursorPosition + diff;
			e.target.setSelectionRange(newCursorPosition, newCursorPosition);
		});

		// Handle paste event
		input.addEventListener('paste', function (e) {
			e.preventDefault();
			const pastedText = (
				e.clipboardData || window.clipboardData
			).getData('text');
			const formattedValue = formatPhoneNumber(pastedText, phoneFormat);
			e.target.value = formattedValue;
		});
	});
});
