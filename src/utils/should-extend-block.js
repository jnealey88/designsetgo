/**
 * Block Extension Utilities
 *
 * @package
 */

/**
 * Cache for exclusion check results
 *
 * This cache improves performance by memoizing results. With 50 blocks and 13 extensions,
 * we could have 2,600+ function calls per page load (4 calls per block per extension).
 *
 * @type {Map<string, boolean>}
 */
const exclusionCache = new Map();

/**
 * Check if a block should receive DSG extensions
 *
 * This function checks if a block is in the user-configured exclusion list.
 * Exclusions can be exact matches (e.g., 'gravityforms/form') or namespace
 * wildcards (e.g., 'gravityforms/*' to exclude all Gravity Forms blocks).
 *
 * Results are cached for performance optimization.
 *
 * @param {string} blockName - Block name (e.g., 'gravityforms/form')
 * @return {boolean} Whether to extend this block with DSG attributes
 */
export function shouldExtendBlock(blockName) {
	// Check cache first
	if (exclusionCache.has(blockName)) {
		return exclusionCache.get(blockName);
	}

	// Get excluded blocks from settings (passed from PHP via wp_localize_script)
	const excludedBlocks = window.dsgoSettings?.excludedBlocks || [];

	let result = true;

	// Check exact match
	if (excludedBlocks.includes(blockName)) {
		result = false;
	} else {
		// Check namespace match (e.g., 'gravityforms/*')
		const namespace = blockName.split('/')[0];
		if (excludedBlocks.includes(`${namespace}/*`)) {
			result = false;
		}
	}

	// Cache the result
	exclusionCache.set(blockName, result);

	return result;
}

/**
 * Clear the exclusion cache
 *
 * Useful for testing or when settings change dynamically.
 *
 * @return {void}
 */
export function clearExclusionCache() {
	exclusionCache.clear();
}
