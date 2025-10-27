/**
 * Block Animations - Attributes Extension
 *
 * Adds animation attributes to all WordPress blocks
 *
 * @package
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { DEFAULT_ANIMATION_SETTINGS } from './constants';

/**
 * Add animation attributes to all blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addAnimationAttributes(settings, name) {
	// Skip core embed blocks and other blocks that shouldn't have animations
	if (name.startsWith('core-embed/') || name === 'core/freeform') {
		return settings;
	}

	// Add animation attributes
	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgAnimationEnabled: {
				type: 'boolean',
				default: DEFAULT_ANIMATION_SETTINGS.enabled,
			},
			dsgEntranceAnimation: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.entranceAnimation,
			},
			dsgExitAnimation: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.exitAnimation,
			},
			dsgAnimationTrigger: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.trigger,
			},
			dsgAnimationDuration: {
				type: 'number',
				default: DEFAULT_ANIMATION_SETTINGS.duration,
			},
			dsgAnimationDelay: {
				type: 'number',
				default: DEFAULT_ANIMATION_SETTINGS.delay,
			},
			dsgAnimationEasing: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.easing,
			},
			dsgAnimationOffset: {
				type: 'number',
				default: DEFAULT_ANIMATION_SETTINGS.offset,
			},
			dsgAnimationOnce: {
				type: 'boolean',
				default: DEFAULT_ANIMATION_SETTINGS.once,
			},
		},
	};
}

// Register the filter
addFilter(
	'blocks.registerBlockType',
	'designsetgo/block-animations/add-attributes',
	addAnimationAttributes
);
