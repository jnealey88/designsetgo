/**
 * ID generation utilities for Table of Contents block
 */

/**
 * Generate a URL-friendly ID from heading text.
 *
 * @param {string} text    - The heading text
 * @param {Set}    usedIds - Set of already used IDs to ensure uniqueness
 * @return {string} URL-safe unique ID
 */
export function generatePrettyId(text, usedIds) {
	// Convert heading text to URL-friendly slug
	let slug = text
		.toLowerCase()
		.trim()
		// Replace apostrophes and quotes
		.replace(/['"]/g, '')
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
