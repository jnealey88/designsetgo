/**
 * Text Alignment Inheritance Extension
 *
 * Automatically sets text alignment for headings and paragraphs based on parent container's alignItems.
 *
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { select } from '@wordpress/data';

/**
 * Map container alignItems values to text-align values
 *
 * @param {string} alignItems Container's alignItems value
 * @return {string} Corresponding text-align value
 */
function mapAlignItemsToTextAlign(alignItems) {
	// Flex/Stack containers use flex-start, flex-end
	if (alignItems === 'flex-start' || alignItems === 'start') {
		return 'left';
	}
	if (alignItems === 'flex-end' || alignItems === 'end') {
		return 'right';
	}
	if (alignItems === 'center') {
		return 'center';
	}
	return null; // No default needed
}

/**
 * Add usesContext to core text blocks so they can receive parent alignment
 */
addFilter(
	'blocks.registerBlockType',
	'designsetgo/add-text-alignment-context',
	(settings, name) => {
		// Only apply to heading and paragraph blocks
		if (!['core/heading', 'core/paragraph'].includes(name)) {
			return settings;
		}

		return {
			...settings,
			usesContext: [
				...(settings.usesContext || []),
				'designsetgo/alignItems',
			],
		};
	}
);

/**
 * Set default textAlign attribute when block is inserted
 */
addFilter(
	'blocks.getBlockAttributes',
	'designsetgo/set-text-alignment-from-parent',
	(attributes, blockType, clientId) => {
		// Only apply to heading and paragraph blocks
		if (!['core/heading', 'core/paragraph'].includes(blockType.name)) {
			return attributes;
		}

		// Don't override if textAlign is already set
		if (attributes.textAlign) {
			return attributes;
		}

		// Get parent block's alignItems from context
		const blockEditor = select('core/block-editor');
		if (!blockEditor || !clientId) {
			return attributes;
		}

		const parents = blockEditor.getBlockParents(clientId);
		if (parents.length === 0) {
			return attributes;
		}

		// Check if parent is one of our container blocks
		const parentId = parents[parents.length - 1];
		const parentBlock = blockEditor.getBlock(parentId);

		if (!parentBlock) {
			return attributes;
		}

		const containerBlocks = [
			'designsetgo/stack',
			'designsetgo/flex',
			'designsetgo/grid',
		];

		if (!containerBlocks.includes(parentBlock.name)) {
			return attributes;
		}

		// Get parent's alignItems
		const parentAlignItems = parentBlock.attributes?.alignItems;
		if (!parentAlignItems) {
			return attributes;
		}

		// Map to text-align
		const textAlign = mapAlignItemsToTextAlign(parentAlignItems);
		if (!textAlign) {
			return attributes;
		}

		// Set default textAlign
		return {
			...attributes,
			textAlign,
		};
	}
);
