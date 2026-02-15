/**
 * Vertical Scroll Parallax - Attributes Extension
 *
 * Adds parallax attributes to allowed WordPress blocks
 *
 * @package
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { DEFAULT_PARALLAX_SETTINGS, ALLOWED_BLOCKS } from './constants';
import { shouldExtendBlock } from '../../utils/should-extend-block';

/**
 * Add parallax attributes to allowed blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addParallaxAttributes(settings, name) {
	// Check user exclusion list first
	if (!shouldExtendBlock(name)) {
		return settings;
	}

	// Only add to allowed blocks
	if (!ALLOWED_BLOCKS.includes(name)) {
		return settings;
	}

	// Add parallax attributes
	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoParallaxEnabled: {
				type: 'boolean',
				default: DEFAULT_PARALLAX_SETTINGS.enabled,
			},
			dsgoParallaxDirection: {
				type: 'string',
				default: DEFAULT_PARALLAX_SETTINGS.direction,
			},
			dsgoParallaxSpeed: {
				type: 'number',
				default: DEFAULT_PARALLAX_SETTINGS.speed,
			},
			dsgoParallaxViewportStart: {
				type: 'number',
				default: DEFAULT_PARALLAX_SETTINGS.viewportStart,
			},
			dsgoParallaxViewportEnd: {
				type: 'number',
				default: DEFAULT_PARALLAX_SETTINGS.viewportEnd,
			},
			dsgoParallaxRelativeTo: {
				type: 'string',
				default: DEFAULT_PARALLAX_SETTINGS.relativeTo,
			},
			dsgoParallaxDesktop: {
				type: 'boolean',
				default: DEFAULT_PARALLAX_SETTINGS.enableDesktop,
			},
			dsgoParallaxTablet: {
				type: 'boolean',
				default: DEFAULT_PARALLAX_SETTINGS.enableTablet,
			},
			dsgoParallaxMobile: {
				type: 'boolean',
				default: DEFAULT_PARALLAX_SETTINGS.enableMobile,
			},
			dsgoParallaxRotateEnabled: {
				type: 'boolean',
				default: DEFAULT_PARALLAX_SETTINGS.rotateEnabled,
			},
			dsgoParallaxRotateDirection: {
				type: 'string',
				default: DEFAULT_PARALLAX_SETTINGS.rotateDirection,
			},
			dsgoParallaxRotateSpeed: {
				type: 'number',
				default: DEFAULT_PARALLAX_SETTINGS.rotateSpeed,
			},
		},
	};
}

// Register the filter
addFilter(
	'blocks.registerBlockType',
	'designsetgo/vertical-scroll-parallax/add-attributes',
	addParallaxAttributes
);
