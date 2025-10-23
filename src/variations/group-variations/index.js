/**
 * Group Block Variations v2
 *
 * Uses WordPress's NATIVE layout system instead of custom attributes.
 * Works with the toolbar layout switcher.
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
		layout: {
			type: 'flex',
			orientation: 'vertical',
			justifyContent: 'center',
			verticalAlignment: 'center',
		},
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
 * Responsive Grid - Equal columns with responsive breakpoints
 */
registerBlockVariation('core/group', {
	name: 'designsetgo-responsive-grid',
	title: __('Responsive Grid', 'designsetgo'),
	description: __('Responsive grid with tablet and mobile breakpoints', 'designsetgo'),
	category: 'designsetgo',
	icon: 'grid-view',
	attributes: {
		// Use WordPress native grid layout
		layout: {
			type: 'grid',
			columnCount: 3,
			minimumColumnWidth: null,
		},
		// Add our custom responsive columns
		dsgGridColumns: 3,
		dsgGridColumnsTablet: 2,
		dsgGridColumnsMobile: 1,
		style: {
			spacing: {
				blockGap: '2rem',
				padding: {
					top: '2rem',
					bottom: '2rem',
				},
			},
		},
	},
	innerBlocks: [
		[
			'core/group',
			{
				style: {
					spacing: { padding: '1.5rem', blockGap: '1rem' },
				},
			},
			[
				[
					'core/heading',
					{
						level: 3,
						placeholder: __('Feature 1', 'designsetgo'),
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __('Description...', 'designsetgo'),
					},
				],
			],
		],
		[
			'core/group',
			{
				style: {
					spacing: { padding: '1.5rem', blockGap: '1rem' },
				},
			},
			[
				[
					'core/heading',
					{
						level: 3,
						placeholder: __('Feature 2', 'designsetgo'),
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __('Description...', 'designsetgo'),
					},
				],
			],
		],
		[
			'core/group',
			{
				style: {
					spacing: { padding: '1.5rem', blockGap: '1rem' },
				},
			},
			[
				[
					'core/heading',
					{
						level: 3,
						placeholder: __('Feature 3', 'designsetgo'),
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __('Description...', 'designsetgo'),
					},
				],
			],
		],
	],
	scope: ['inserter'],
});

