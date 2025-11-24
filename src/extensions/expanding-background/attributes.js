/**
 * Expanding Background Extension - Attributes
 *
 * @package DesignSetGo
 */

import { addFilter } from '@wordpress/hooks';
import { SUPPORTED_BLOCKS, DEFAULTS } from './constants';

/**
 * Add expanding background attributes to supported blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addExpandingBackgroundAttributes(settings, name) {
	// Only add attributes to supported blocks
	if (!SUPPORTED_BLOCKS.includes(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoExpandingBgEnabled: {
				type: 'boolean',
				default: DEFAULTS.enabled,
			},
			dsgoExpandingBgColor: {
				type: 'string',
				default: DEFAULTS.color,
			},
			dsgoExpandingBgInitialSize: {
				type: 'number',
				default: DEFAULTS.initialSize,
			},
			dsgoExpandingBgBlur: {
				type: 'number',
				default: DEFAULTS.blur,
			},
			dsgoExpandingBgSpeed: {
				type: 'number',
				default: DEFAULTS.speed,
			},
			dsgoExpandingBgTriggerOffset: {
				type: 'number',
				default: DEFAULTS.triggerOffset,
			},
			dsgoExpandingBgCompletionPoint: {
				type: 'number',
				default: DEFAULTS.completionPoint,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/expanding-background-attributes',
	addExpandingBackgroundAttributes
);
