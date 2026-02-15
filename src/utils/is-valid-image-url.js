/**
 * Validates image URL to prevent XSS attacks.
 *
 * Only allows http(s) URLs. Blocks javascript:, data:, and other protocols.
 *
 * @param {string} url URL to validate
 * @return {boolean} True if URL is safe
 */
export const isValidImageUrl = (url) => {
	if (!url || typeof url !== 'string') {
		return false;
	}
	return /^https?:\/\//.test(url);
};
