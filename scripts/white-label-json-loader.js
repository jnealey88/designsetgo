/**
 * White Label block.json Webpack Loader
 *
 * Custom webpack loader that transforms block.json files at compile time.
 * Only active when white-label.json exists with non-default values.
 *
 * @package
 */

'use strict';

const {
	loadConfig,
	buildBlockJsonReplacements,
	applyReplacements,
} = require('./white-label-replacements');

// Cache config and rules across invocations (webpack calls this per-file).
let cachedRules = null;
let configChecked = false;

module.exports = function whiteLabelJsonLoader(source) {
	// Only transform block.json files.
	if (!this.resourcePath.endsWith('block.json')) {
		return source;
	}

	// Load config once.
	if (!configChecked) {
		const config = loadConfig();
		if (config) {
			cachedRules = buildBlockJsonReplacements(config);
		}
		configChecked = true;
	}

	// No transformation needed.
	if (!cachedRules) {
		return source;
	}

	return applyReplacements(source, cachedRules);
};
