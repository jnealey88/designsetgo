/**
 * Group Block Variations
 *
 * Pre-configured Group block variations for common layouts.
 *
 * @package DesignSetGo
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Hero Section - Centered content with background
 */
registerBlockVariation('core/group', {
	name: 'designsetgo-hero',
	title: __('Hero Section', 'designsetgo'),
	description: __('Full-width hero with centered content', 'designsetgo'),
	category: 'designsetgo',
	icon: 'align-center',
	attributes: {
		align: 'full',
		dsgLayoutType: 'flex',
		dsgFlexDirection: 'column',
		dsgJustifyContent: 'center',
		dsgAlignItems: 'center',
		style: {
			spacing: {
				padding: {
					top: '80px',
					bottom: '80px',
				},
			},
		},
	},
	innerBlocks: [
		[
			'core/heading',
			{
				level: 1,
				textAlign: 'center',
				placeholder: __('Hero Heading', 'designsetgo'),
			},
		],
		[
			'core/paragraph',
			{
				align: 'center',
				placeholder: __('Hero description goes here...', 'designsetgo'),
			},
		],
		[
			'core/buttons',
			{
				layout: { type: 'flex', justifyContent: 'center' },
			},
		],
	],
	scope: ['inserter'],
});

/**
 * 3-Column Grid - Equal columns for features
 */
registerBlockVariation('core/group', {
	name: 'designsetgo-three-column-grid',
	title: __('3-Column Grid', 'designsetgo'),
	description: __('Three equal columns for features', 'designsetgo'),
	category: 'designsetgo',
	icon: 'grid-view',
	attributes: {
		dsgLayoutType: 'grid',
		dsgGridColumns: 3,
		style: {
			spacing: {
				blockGap: '2rem',
			},
		},
	},
	innerBlocks: [
		[
			'core/group',
			{},
			[
				['core/heading', { level: 3, placeholder: __('Feature 1', 'designsetgo') }],
				['core/paragraph', { placeholder: __('Description...', 'designsetgo') }],
			],
		],
		[
			'core/group',
			{},
			[
				['core/heading', { level: 3, placeholder: __('Feature 2', 'designsetgo') }],
				['core/paragraph', { placeholder: __('Description...', 'designsetgo') }],
			],
		],
		[
			'core/group',
			{},
			[
				['core/heading', { level: 3, placeholder: __('Feature 3', 'designsetgo') }],
				['core/paragraph', { placeholder: __('Description...', 'designsetgo') }],
			],
		],
	],
	scope: ['inserter'],
});

/**
 * Side-by-Side - Image and text layout
 */
registerBlockVariation('core/group', {
	name: 'designsetgo-side-by-side',
	title: __('Side by Side', 'designsetgo'),
	description: __('Image and content side by side', 'designsetgo'),
	category: 'designsetgo',
	icon: 'columns',
	attributes: {
		dsgLayoutType: 'flex',
		dsgFlexDirection: 'row',
		dsgAlignItems: 'center',
		style: {
			spacing: {
				blockGap: '3rem',
			},
		},
	},
	innerBlocks: [
		['core/image', { placeholder: __('Add image...', 'designsetgo') }],
		[
			'core/group',
			{},
			[
				['core/heading', { placeholder: __('Heading', 'designsetgo') }],
				['core/paragraph', { placeholder: __('Content...', 'designsetgo') }],
			],
		],
	],
	scope: ['inserter'],
});

/**
 * Centered Content - Simple centered container
 */
registerBlockVariation('core/group', {
	name: 'designsetgo-centered',
	title: __('Centered Container', 'designsetgo'),
	description: __('Center content horizontally and vertically', 'designsetgo'),
	category: 'designsetgo',
	icon: 'align-center',
	attributes: {
		dsgLayoutType: 'flex',
		dsgJustifyContent: 'center',
		dsgAlignItems: 'center',
		style: {
			spacing: {
				padding: {
					top: '4rem',
					bottom: '4rem',
				},
			},
		},
	},
	innerBlocks: [
		[
			'core/group',
			{},
			[
				['core/heading', { textAlign: 'center' }],
				['core/paragraph', { align: 'center' }],
			],
		],
	],
	scope: ['inserter'],
});

/**
 * Card Grid - Auto-responsive card layout
 */
registerBlockVariation('core/group', {
	name: 'designsetgo-card-grid',
	title: __('Card Grid', 'designsetgo'),
	description: __('Auto-responsive card layout', 'designsetgo'),
	category: 'designsetgo',
	icon: 'grid-view',
	attributes: {
		dsgLayoutType: 'auto-grid',
		style: {
			spacing: {
				blockGap: '2rem',
			},
		},
	},
	innerBlocks: [
		['core/group', { style: { spacing: { padding: '1.5rem' } } }],
		['core/group', { style: { spacing: { padding: '1.5rem' } } }],
		['core/group', { style: { spacing: { padding: '1.5rem' } } }],
	],
	scope: ['inserter'],
});
