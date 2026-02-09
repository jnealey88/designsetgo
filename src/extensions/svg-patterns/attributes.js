/**
 * SVG Patterns Extension - Attributes
 *
 * @package
 */

import { addFilter } from '@wordpress/hooks';
import { SUPPORTED_BLOCKS, DEFAULTS } from './constants';
import { shouldExtendBlock } from '../../utils/should-extend-block';

/**
 * Add SVG pattern attributes to supported blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addSvgPatternAttributes(settings, name) {
	if (!shouldExtendBlock(name)) {
		return settings;
	}

	if (!SUPPORTED_BLOCKS.includes(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoSvgPatternEnabled: {
				type: 'boolean',
				default: DEFAULTS.enabled,
			},
			dsgoSvgPatternType: {
				type: 'string',
				default: DEFAULTS.pattern,
			},
			dsgoSvgPatternColor: {
				type: 'string',
				default: DEFAULTS.color,
			},
			dsgoSvgPatternOpacity: {
				type: 'number',
				default: DEFAULTS.opacity,
			},
			dsgoSvgPatternScale: {
				type: 'number',
				default: DEFAULTS.scale,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/svg-pattern-attributes',
	addSvgPatternAttributes
);
