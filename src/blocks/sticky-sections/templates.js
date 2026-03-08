/**
 * Sticky Sections Templates
 *
 * Pre-configured templates for the template chooser
 * shown when the block is first inserted.
 */

import { __ } from '@wordpress/i18n';

/**
 * Create a section template with a background color and inner content
 *
 * @param {Object} config           Section configuration
 * @param {string} config.bgColor   Background color hex
 * @param {string} config.textColor Text color hex
 * @param {string} config.heading   Heading text
 * @param {string} config.paragraph Body text
 * @param {string} config.minHeight Minimum height CSS value
 * @return {Array} Inner block template definition
 */
function sectionCard({
	bgColor,
	textColor = '#ffffff',
	heading = '',
	paragraph = '',
	minHeight = '',
}) {
	const sectionAttrs = {
		align: 'full',
		style: {
			color: { background: bgColor, text: textColor },
			...(minHeight && {
				dimensions: { minHeight },
			}),
			spacing: {
				padding: {
					top: 'var:preset|spacing|60',
					bottom: 'var:preset|spacing|60',
					left: 'var:preset|spacing|40',
					right: 'var:preset|spacing|40',
				},
			},
		},
	};

	const innerContent = [];

	if (heading) {
		innerContent.push(['core/heading', { level: 2, content: heading }]);
	} else {
		innerContent.push([
			'core/heading',
			{
				level: 2,
				placeholder: __('Section title…', 'designsetgo'),
			},
		]);
	}

	if (paragraph) {
		innerContent.push(['core/paragraph', { content: paragraph }]);
	} else {
		innerContent.push([
			'core/paragraph',
			{
				placeholder: __('Section content…', 'designsetgo'),
			},
		]);
	}

	return ['designsetgo/section', sectionAttrs, innerContent];
}

const stickySectionsTemplates = [
	{
		name: 'blank',
		title: __('Blank', 'designsetgo'),
		description: __('Start with empty sections', 'designsetgo'),
		icon: 'welcome-add-page',
		attributes: {},
		innerBlocks: [
			sectionCard({ bgColor: '#1a1a2e' }),
			sectionCard({ bgColor: '#16213e' }),
			sectionCard({ bgColor: '#0f3460' }),
		],
	},
	{
		name: 'feature-cards',
		title: __('Feature Cards', 'designsetgo'),
		description: __(
			'Pre-filled sections showcasing features',
			'designsetgo'
		),
		icon: 'screenoptions',
		attributes: {
			align: 'full',
		},
		innerBlocks: [
			sectionCard({
				bgColor: '#0a0a1a',
				heading: __('Design that stands out', 'designsetgo'),
				paragraph: __(
					'Create stunning layouts with pixel-perfect precision. Every detail is crafted to deliver an exceptional visual experience.',
					'designsetgo'
				),
			}),
			sectionCard({
				bgColor: '#1a0a2e',
				heading: __('Built for performance', 'designsetgo'),
				paragraph: __(
					'Optimized for speed at every level. Adaptive loading and responsive assets keep your site performing at its best.',
					'designsetgo'
				),
			}),
			sectionCard({
				bgColor: '#0d1b2a',
				heading: __('Scale with confidence', 'designsetgo'),
				paragraph: __(
					'From launch-ready basics to enterprise-grade experiences. Grow your site without limits.',
					'designsetgo'
				),
			}),
		],
	},
	{
		name: 'fullscreen',
		title: __('Full Screen', 'designsetgo'),
		description: __(
			'Full-viewport sections for dramatic stacking',
			'designsetgo'
		),
		icon: 'desktop',
		attributes: {
			align: 'full',
		},
		innerBlocks: [
			sectionCard({
				bgColor: '#0a0a1a',
				minHeight: '100vh',
			}),
			sectionCard({
				bgColor: '#1a0a2e',
				minHeight: '100vh',
			}),
			sectionCard({
				bgColor: '#0d1b2a',
				minHeight: '100vh',
			}),
		],
	},
];

export default stickySectionsTemplates;
