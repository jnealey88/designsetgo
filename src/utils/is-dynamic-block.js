/**
 * Dynamic Block Detection Utility
 *
 * @package DesignSetGo
 */

/**
 * Check if a block is server-side rendered (dynamic)
 *
 * Dynamic blocks use a render_callback on the server and have a null save function.
 * These blocks are more prone to REST API validation conflicts because they must
 * pass block attributes through the /wp-json/wp/v2/block-renderer endpoint, which
 * validates attributes against the server-registered schema.
 *
 * @param {string} blockName - Block name (e.g., 'gravityforms/form')
 * @return {boolean} Whether this block is dynamic/server-side rendered
 */
export function isDynamicBlock( blockName ) {
	const blockType = wp.blocks.getBlockType( blockName );

	// Dynamic blocks have no save function (it's null)
	// Static blocks have a save function that returns the markup
	return blockType?.save === null;
}
