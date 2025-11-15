/**
 * Counter Block - Number Formatter Utility
 *
 * Pure function for formatting counter numbers with grouping and decimals.
 * Separated for testability and reusability.
 *
 * @since 1.0.0
 */

/**
 * Escape special characters in replacement strings for use with String.replace()
 * Prevents injection via special sequences like $&, $`, $', $n
 *
 * @param {string} str - String to escape
 * @return {string} Escaped string safe for use as replacement
 */
const escapeReplacement = (str) => {
	// Escape $ characters by doubling them ($ becomes $$)
	// This prevents special replacement patterns like $&, $`, $', $1, etc.
	return String(str).replace(/\$/g, '$$$$');
};

/**
 * Format a number with thousands separator and decimal places.
 *
 * @param {number}  value               - The number to format
 * @param {Object}  options             - Formatting options
 * @param {number}  options.decimals    - Number of decimal places (0-3)
 * @param {boolean} options.useGrouping - Whether to use thousands separator
 * @param {string}  options.separator   - Thousands separator (e.g., ',')
 * @param {string}  options.decimal     - Decimal point character (e.g., '.')
 * @return {string} Formatted number string
 */
export const formatNumber = (value, options = {}) => {
	const {
		decimals = 0,
		useGrouping = true,
		separator = ',',
		decimal = '.',
	} = options;

	// Format with decimals
	const formatted = value.toFixed(decimals);
	const parts = formatted.split('.');

	// Add thousands separator if enabled
	if (useGrouping) {
		// SECURITY: Escape special characters in separator to prevent injection
		// via replacement string special sequences ($&, $`, $', $n, etc.)
		const safeSeparator = escapeReplacement(separator);
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, safeSeparator);
	}

	// Join with decimal point
	return parts.join(decimal);
};

/**
 * Format a counter value with prefix and suffix.
 *
 * @param {number}  value               - The number value
 * @param {Object}  options             - Formatting options
 * @param {string}  options.prefix      - Text before number (e.g., '$')
 * @param {string}  options.suffix      - Text after number (e.g., '+', '%')
 * @param {number}  options.decimals    - Number of decimal places
 * @param {boolean} options.useGrouping - Whether to use thousands separator
 * @param {string}  options.separator   - Thousands separator
 * @param {string}  options.decimal     - Decimal point character
 * @return {string} Fully formatted display value
 */
export const formatCounterValue = (value, options = {}) => {
	const { prefix = '', suffix = '', ...formatOptions } = options;

	const formattedNumber = formatNumber(value, formatOptions);

	return `${prefix}${formattedNumber}${suffix}`;
};
