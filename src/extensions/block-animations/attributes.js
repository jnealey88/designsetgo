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
			dsgoAnimationEnabled: {
				type: 'boolean',
				default: DEFAULT_ANIMATION_SETTINGS.enabled,
			},
			dsgoEntranceAnimation: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.entranceAnimation,
			},
			dsgoExitAnimation: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.exitAnimation,
			},
			dsgoAnimationTrigger: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.trigger,
			},
			dsgoAnimationDuration: {
				type: 'number',
				default: DEFAULT_ANIMATION_SETTINGS.duration,
			},
			dsgoAnimationDelay: {
				type: 'number',
				default: DEFAULT_ANIMATION_SETTINGS.delay,
			},
			dsgoAnimationEasing: {
				type: 'string',
				default: DEFAULT_ANIMATION_SETTINGS.easing,
			},
			dsgoAnimationOffset: {
				type: 'number',
				default: DEFAULT_ANIMATION_SETTINGS.offset,
			},
			dsgoAnimationOnce: {
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
