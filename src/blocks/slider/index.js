/**
 * Slider Block Registration
 */

import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import deprecated from './deprecated';
import { ICON_COLOR } from '../shared/constants';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
	...metadata,
	deprecated,
	icon: {
		src: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-8l-4 5h12l-3-4-2.03 2.71L12 11z" />
				<circle cx="8.5" cy="8.5" r="1.5" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit: Edit,
	save: Save,
});

// Block Variations
registerBlockVariation(metadata.name, {
	name: 'hero-slider',
	title: __('Hero Slider', 'designsetgo'),
	description: __(
		'Full-height slider for hero sections with centered content',
		'designsetgo'
	),
	icon: 'cover-image',
	attributes: {
		height: '100vh',
		styleVariation: 'fullbleed',
		effect: 'fade',
		transitionDuration: '1s',
		autoplay: true,
		autoplayInterval: 5000,
		showDots: true,
		showArrows: true,
	},
	innerBlocks: [
		[
			'designsetgo/slide',
			{},
			[
				[
					'core/heading',
					{
						level: 1,
						content: __('Welcome to Your Site', 'designsetgo'),
						textAlign: 'center',
						style: { typography: { fontSize: '3.5rem' } },
					},
				],
				[
					'core/paragraph',
					{
						content: __(
							'Create something amazing with beautiful, full-screen hero sliders',
							'designsetgo'
						),
						align: 'center',
						style: { typography: { fontSize: '1.25rem' } },
					},
				],
				[
					'core/buttons',
					{ layout: { type: 'flex', justifyContent: 'center' } },
					[
						[
							'core/button',
							{
								text: __('Get Started', 'designsetgo'),
								style: { color: { background: '#2563eb' } },
							},
						],
					],
				],
			],
		],
		[
			'designsetgo/slide',
			{},
			[
				[
					'core/heading',
					{
						level: 1,
						content: __('Powerful Features', 'designsetgo'),
						textAlign: 'center',
						style: { typography: { fontSize: '3.5rem' } },
					},
				],
				[
					'core/paragraph',
					{
						content: __(
							'Everything you need to build stunning websites',
							'designsetgo'
						),
						align: 'center',
						style: { typography: { fontSize: '1.25rem' } },
					},
				],
				[
					'core/buttons',
					{ layout: { type: 'flex', justifyContent: 'center' } },
					[
						[
							'core/button',
							{
								text: __('Learn More', 'designsetgo'),
								style: { color: { background: '#ea580c' } },
							},
						],
					],
				],
			],
		],
	],
	scope: ['inserter'],
	isActive: (blockAttributes) =>
		blockAttributes.styleVariation === 'fullbleed',
});

registerBlockVariation(metadata.name, {
	name: 'gallery-carousel',
	title: __('Gallery Carousel', 'designsetgo'),
	description: __('Show multiple images in a carousel view', 'designsetgo'),
	icon: 'images-alt2',
	attributes: {
		slidesPerView: 3,
		slidesPerViewTablet: 2,
		slidesPerViewMobile: 1,
		gap: '16px',
		height: '400px',
		styleVariation: 'card',
		effect: 'slide',
		autoplay: false,
		loop: true,
		showDots: false,
		showArrows: true,
	},
	innerBlocks: [
		[
			'designsetgo/slide',
			{},
			[
				[
					'core/heading',
					{
						level: 3,
						content: __('Image 1', 'designsetgo'),
						textAlign: 'center',
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{},
			[
				[
					'core/heading',
					{
						level: 3,
						content: __('Image 2', 'designsetgo'),
						textAlign: 'center',
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{},
			[
				[
					'core/heading',
					{
						level: 3,
						content: __('Image 3', 'designsetgo'),
						textAlign: 'center',
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{},
			[
				[
					'core/heading',
					{
						level: 3,
						content: __('Image 4', 'designsetgo'),
						textAlign: 'center',
					},
				],
			],
		],
	],
	scope: ['inserter'],
});

registerBlockVariation(metadata.name, {
	name: 'testimonial-slider',
	title: __('Testimonial Slider', 'designsetgo'),
	description: __(
		'Slider optimized for testimonials with fade transitions',
		'designsetgo'
	),
	icon: 'format-quote',
	attributes: {
		height: '350px',
		styleVariation: 'classic',
		effect: 'fade',
		transitionDuration: '0.8s',
		autoplay: true,
		autoplayInterval: 6000,
		centeredSlides: true,
		showDots: true,
		showArrows: false,
	},
	innerBlocks: [
		[
			'designsetgo/slide',
			{ contentVerticalAlign: 'center' },
			[
				[
					'core/paragraph',
					{
						content: __('★★★★★', 'designsetgo'),
						align: 'center',
						style: {
							typography: { fontSize: '1.5rem' },
							color: { text: '#fbbf24' },
						},
					},
				],
				[
					'core/paragraph',
					{
						content: __(
							'"This product exceeded all my expectations. Highly recommended!"',
							'designsetgo'
						),
						align: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontStyle: 'italic',
							},
						},
					},
				],
				[
					'core/paragraph',
					{
						content: __('— Sarah Johnson', 'designsetgo'),
						align: 'center',
						style: {
							typography: { fontSize: '1rem', fontWeight: '600' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ contentVerticalAlign: 'center' },
			[
				[
					'core/paragraph',
					{
						content: __('★★★★★', 'designsetgo'),
						align: 'center',
						style: {
							typography: { fontSize: '1.5rem' },
							color: { text: '#fbbf24' },
						},
					},
				],
				[
					'core/paragraph',
					{
						content: __(
							'"Outstanding quality and amazing customer service. Will buy again!"',
							'designsetgo'
						),
						align: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontStyle: 'italic',
							},
						},
					},
				],
				[
					'core/paragraph',
					{
						content: __('— Michael Chen', 'designsetgo'),
						align: 'center',
						style: {
							typography: { fontSize: '1rem', fontWeight: '600' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ contentVerticalAlign: 'center' },
			[
				[
					'core/paragraph',
					{
						content: __('★★★★★', 'designsetgo'),
						align: 'center',
						style: {
							typography: { fontSize: '1.5rem' },
							color: { text: '#fbbf24' },
						},
					},
				],
				[
					'core/paragraph',
					{
						content: __(
							'"Best purchase I\'ve made this year. Absolutely love it!"',
							'designsetgo'
						),
						align: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontStyle: 'italic',
							},
						},
					},
				],
				[
					'core/paragraph',
					{
						content: __('— Emily Rodriguez', 'designsetgo'),
						align: 'center',
						style: {
							typography: { fontSize: '1rem', fontWeight: '600' },
						},
					},
				],
			],
		],
	],
	scope: ['inserter'],
});

registerBlockVariation(metadata.name, {
	name: 'logo-slider',
	title: __('Logo Slider', 'designsetgo'),
	description: __('Continuous scrolling logo slider', 'designsetgo'),
	icon: 'grid-view',
	attributes: {
		slidesPerView: 4,
		slidesPerViewTablet: 3,
		slidesPerViewMobile: 2,
		gap: '32px',
		height: '120px',
		styleVariation: 'minimal',
		effect: 'slide',
		transitionDuration: '0.4s',
		autoplay: true,
		autoplayInterval: 2000,
		loop: true,
		showDots: false,
		showArrows: false,
	},
	innerBlocks: [
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 1', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 2', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 3', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 4', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 5', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 6', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 7', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
		[
			'designsetgo/slide',
			{ enableOverlay: false, contentVerticalAlign: 'center' },
			[
				[
					'core/heading',
					{
						level: 4,
						content: __('Brand 8', 'designsetgo'),
						textAlign: 'center',
						style: {
							typography: {
								fontSize: '1.25rem',
								fontWeight: '700',
							},
							color: { text: '#1f2937' },
						},
					},
				],
			],
		],
	],
	scope: ['inserter'],
});
