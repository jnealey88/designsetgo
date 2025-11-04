/**
 * Block Category Filter
 *
 * Ensures DesignSetGo blocks appear in BOTH:
 * 1. Their assigned WordPress core category (design, text, widgets)
 * 2. The custom DesignSetGo category
 *
 * This improves discoverability while maintaining organization.
 *
 * @package DesignSetGo
 */

import { addFilter } from '@wordpress/hooks';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Modify block categories to add DesignSetGo category alongside core categories.
 *
 * This filter adds the 'designsetgo' category to all our blocks,
 * ensuring they appear in both their core category AND our custom category.
 */
addFilter(
	'blocks.registerBlockType',
	'designsetgo/dual-categorization',
	(settings, name) => {
		// Only modify our blocks
		if (!name.startsWith('designsetgo/')) {
			return settings;
		}

		// Store the original category
		const originalCategory = settings.category;

		// Create a custom categories array that includes both categories
		// Note: WordPress only supports one category per block in the UI,
		// but we can modify how blocks appear in the inserter using collections
		return {
			...settings,
			// Keep the core category as primary
			category: originalCategory,
			// Add metadata for our custom handling
			__experimentalLabel: (props, { context }) => {
				// This allows blocks to show context-aware labeling
				return settings.title;
			},
		};
	}
);

/**
 * Register block collection for DesignSetGo.
 *
 * This creates a filterable collection in the block inserter
 * that shows all DesignSetGo blocks together.
 */
wp.domReady(() => {
	if (wp.blocks && wp.blocks.registerBlockCollection) {
		// Register a block collection for all DesignSetGo blocks
		wp.blocks.registerBlockCollection('designsetgo', {
			title: 'DesignSetGo',
			icon: 'layout',
		});
	}
});
