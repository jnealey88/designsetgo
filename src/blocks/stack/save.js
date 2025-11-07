/**
 * Stack Container Block - Save Component
 *
 * This is a DYNAMIC BLOCK with server-side rendering via render.php.
 * The save function only returns inner blocks content - the wrapper
 * is generated dynamically by render.php using get_block_wrapper_attributes().
 *
 * @since 2.0.0
 */

import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Stack Container Save Component
 *
 * For dynamic blocks, we only save the inner blocks content.
 * The wrapper div is generated server-side by render.php.
 *
 * @return {JSX.Element} Save component
 */
export default function StackSave() {
	return <InnerBlocks.Content />;
}
