/**
 * Scroll Slides Templates
 *
 * Pre-configured templates for the template chooser
 * shown when the block is first inserted.
 */

import { __ } from '@wordpress/i18n';

const scrollSlidesTemplates = [
	{
		name: 'blank',
		title: __('Blank', 'designsetgo'),
		description: __('Start with empty slides', 'designsetgo'),
		icon: 'welcome-add-page',
		attributes: {},
		innerBlocks: [
			[
				'designsetgo/scroll-slide',
				{ navHeading: '' },
				[
					[
						'designsetgo/section',
						{},
						[
							['core/image'],
							[
								'core/heading',
								{
									level: 3,
									placeholder: __(
										'Slide title…',
										'designsetgo'
									),
								},
							],
							[
								'core/paragraph',
								{
									placeholder: __(
										'Slide description…',
										'designsetgo'
									),
								},
							],
						],
					],
				],
			],
			[
				'designsetgo/scroll-slide',
				{ navHeading: '' },
				[
					[
						'designsetgo/section',
						{},
						[
							['core/image'],
							[
								'core/heading',
								{
									level: 3,
									placeholder: __(
										'Slide title…',
										'designsetgo'
									),
								},
							],
							[
								'core/paragraph',
								{
									placeholder: __(
										'Slide description…',
										'designsetgo'
									),
								},
							],
						],
					],
				],
			],
			[
				'designsetgo/scroll-slide',
				{ navHeading: '' },
				[
					[
						'designsetgo/section',
						{},
						[
							['core/image'],
							[
								'core/heading',
								{
									level: 3,
									placeholder: __(
										'Slide title…',
										'designsetgo'
									),
								},
							],
							[
								'core/paragraph',
								{
									placeholder: __(
										'Slide description…',
										'designsetgo'
									),
								},
							],
						],
					],
				],
			],
		],
	},
	{
		name: 'showcase',
		title: __('Feature Showcase', 'designsetgo'),
		description: __(
			'Pre-filled slides highlighting product features',
			'designsetgo'
		),
		icon: 'slides',
		attributes: {
			align: 'full',
			overlayColor: '#000000',
			navColor: '#ffffffb3',
			navActiveColor: '#ffffff',
		},
		innerBlocks: [
			[
				'designsetgo/scroll-slide',
				{
					navHeading: __('Design', 'designsetgo'),
					style: {
						color: {
							background: '#0a0a1a',
							text: '#ffffff',
						},
						background: {
							backgroundImage: {
								url: 'https://images.pexels.com/photos/7135037/pexels-photo-7135037.jpeg?auto=compress&cs=tinysrgb&w=1920',
								source: 'url',
							},
							backgroundSize: 'cover',
							backgroundPosition: 'center center',
						},
					},
				},
				[
					[
						'designsetgo/section',
						{},
						[
							[
								'core/image',
								{
									url: 'https://images.pexels.com/photos/220417/pexels-photo-220417.jpeg?auto=compress&cs=tinysrgb&w=800',
									alt: __('Design preview', 'designsetgo'),
								},
							],
							[
								'core/heading',
								{
									level: 2,
									content: __(
										'Beautiful by default',
										'designsetgo'
									),
								},
							],
							[
								'core/paragraph',
								{
									content: __(
										'Create stunning layouts with pixel-perfect precision. Every detail is crafted to deliver an exceptional visual experience.',
										'designsetgo'
									),
								},
							],
						],
					],
				],
			],
			[
				'designsetgo/scroll-slide',
				{
					navHeading: __('Performance', 'designsetgo'),
					style: {
						color: {
							background: '#0d1b2a',
							text: '#ffffff',
						},
						background: {
							backgroundImage: {
								url: 'https://images.pexels.com/photos/7135033/pexels-photo-7135033.jpeg?auto=compress&cs=tinysrgb&w=1920',
								source: 'url',
							},
							backgroundSize: 'cover',
							backgroundPosition: 'center center',
						},
					},
				},
				[
					[
						'designsetgo/section',
						{},
						[
							[
								'core/image',
								{
									url: 'https://images.pexels.com/photos/9403/pexels-photo-9403.jpg?auto=compress&cs=tinysrgb&w=800',
									alt: __(
										'Performance preview',
										'designsetgo'
									),
								},
							],
							[
								'core/heading',
								{
									level: 2,
									content: __(
										'Lightning fast',
										'designsetgo'
									),
								},
							],
							[
								'core/paragraph',
								{
									content: __(
										'Optimized for speed at every level. Adaptive loading, responsive assets, and built-in enhancements keep your site performing at its best.',
										'designsetgo'
									),
								},
							],
						],
					],
				],
			],
			[
				'designsetgo/scroll-slide',
				{
					navHeading: __('Accessibility', 'designsetgo'),
					style: {
						color: {
							background: '#1a0a2e',
							text: '#ffffff',
						},
						background: {
							backgroundImage: {
								url: 'https://images.pexels.com/photos/2748716/pexels-photo-2748716.jpeg?auto=compress&cs=tinysrgb&w=1920',
								source: 'url',
							},
							backgroundSize: 'cover',
							backgroundPosition: 'center center',
						},
					},
				},
				[
					[
						'designsetgo/section',
						{},
						[
							[
								'core/image',
								{
									url: 'https://images.pexels.com/photos/6213/woman-hand-pen-girl.jpg?auto=compress&cs=tinysrgb&w=800',
									alt: __(
										'Accessibility preview',
										'designsetgo'
									),
								},
							],
							[
								'core/heading',
								{
									level: 2,
									content: __(
										'Inclusive by design',
										'designsetgo'
									),
								},
							],
							[
								'core/paragraph',
								{
									content: __(
										'Reach every user with inclusive design powered by accessibility tools that identify issues and guide improvements.',
										'designsetgo'
									),
								},
							],
						],
					],
				],
			],
		],
	},
];

export default scrollSlidesTemplates;
