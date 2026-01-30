/**
 * Block Extension Utilities
 *
 * @package DesignSetGo
 */

/**
 * Check if a block should receive DSG extensions
 *
 * This function checks if a block is in the user-configured exclusion list.
 * Exclusions can be exact matches (e.g., 'gravityforms/form') or namespace
 * wildcards (e.g., 'gravityforms/*' to exclude all Gravity Forms blocks).
 *
 * @param {string} blockName - Block name (e.g., 'gravityforms/form')
 * @return {boolean} Whether to extend this block with DSG attributes
 */
export function shouldExtendBlock( blockName ) {
	// Get excluded blocks from settings (passed from PHP via wp_localize_script)
	const excludedBlocks = window.dsgoSettings?.excludedBlocks || [];

	// Check exact match
	if ( excludedBlocks.includes( blockName ) ) {
		return false;
	}

	// Check namespace match (e.g., 'gravityforms/*')
	const namespace = blockName.split( '/' )[ 0 ];
	if ( excludedBlocks.includes( `${ namespace }/*` ) ) {
		return false;
	}

	return true;
}
