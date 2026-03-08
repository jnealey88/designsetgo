/**
 * Scroll Slides Templates
 *
 * Pre-configured templates for the template chooser
 * shown when the block is first inserted.
 */

import { __ } from '@wordpress/i18n';

/**
 * Create a blank slide template with placeholder content
 *
 * @return {Array} Inner block template definition
 */
function blankSlide() {
	return [
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
							placeholder: __('Slide title…', 'designsetgo'),
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
	];
}

/**
 * Create a showcase slide with pre-filled content
 *
 * @param {Object} config            Slide configuration
 * @param {string} config.navHeading Navigation heading text
 * @param {string} config.bgColor    Background color hex
 * @param {string} config.heading    Slide heading text
 * @param {string} config.paragraph  Slide body text
 * @return {Array} Inner block template definition
 */
function showcaseSlide({ navHeading, bgColor, heading, paragraph }) {
	return [
		'designsetgo/scroll-slide',
		{
			navHeading,
			style: {
				color: { background: bgColor, text: '#ffffff' },
			},
		},
		[
			[
				'designsetgo/section',
				{},
				[
					['core/image'],
					['core/heading', { level: 2, content: heading }],
					['core/paragraph', { content: paragraph }],
				],
			],
		],
	];
}

const scrollSlidesTemplates = [
	{
		name: 'blank',
		title: __('Blank', 'designsetgo'),
		description: __('Start with empty slides', 'designsetgo'),
		icon: 'welcome-add-page',
		attributes: {},
		innerBlocks: [blankSlide(), blankSlide(), blankSlide()],
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
			showcaseSlide({
				navHeading: __('Design', 'designsetgo'),
				bgColor: '#0a0a1a',
				heading: __('Beautiful by default', 'designsetgo'),
				paragraph: __(
					'Create stunning layouts with pixel-perfect precision. Every detail is crafted to deliver an exceptional visual experience.',
					'designsetgo'
				),
			}),
			showcaseSlide({
				navHeading: __('Performance', 'designsetgo'),
				bgColor: '#0d1b2a',
				heading: __('Lightning fast', 'designsetgo'),
				paragraph: __(
					'Optimized for speed at every level. Adaptive loading, responsive assets, and built-in enhancements keep your site performing at its best.',
					'designsetgo'
				),
			}),
			showcaseSlide({
				navHeading: __('Accessibility', 'designsetgo'),
				bgColor: '#1a0a2e',
				heading: __('Inclusive by design', 'designsetgo'),
				paragraph: __(
					'Reach every user with inclusive design powered by accessibility tools that identify issues and guide improvements.',
					'designsetgo'
				),
			}),
		],
	},
];

export default scrollSlidesTemplates;
