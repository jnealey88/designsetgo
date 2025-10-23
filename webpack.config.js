/**
 * WordPress Scripts Webpack Config
 *
 * Custom configuration to build both blocks AND extensions.
 *
 * @package
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		// Main entry point for extensions and variations
		index: path.resolve(process.cwd(), 'src', 'index.js'),
		// Block-specific entries are auto-detected by @wordpress/scripts
		...defaultConfig.entry,
	},
};
