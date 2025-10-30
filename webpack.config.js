/**
 * WordPress Scripts Webpack Config
 *
 * Custom configuration to build both blocks AND extensions.
 * Optimized for performance with code splitting and tree shaking.
 *
 * @package
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');

// Auto-detect all blocks with index.js files
const blockEntries = glob
	.sync('./src/blocks/*/index.js')
	.reduce((entries, file) => {
		const blockName = file.match(/\/blocks\/([^/]+)\/index\.js$/)[1];
		entries[`blocks/${blockName}/index`] = path.resolve(
			process.cwd(),
			file
		);
		return entries;
	}, {});

// Auto-detect all blocks with view.js files (frontend scripts)
const viewEntries = glob
	.sync('./src/blocks/*/view.js')
	.reduce((entries, file) => {
		const blockName = file.match(/\/blocks\/([^/]+)\/view\.js$/)[1];
		entries[`blocks/${blockName}/view`] = path.resolve(
			process.cwd(),
			file
		);
		return entries;
	}, {});

module.exports = {
	...defaultConfig,
	entry: {
		// Main entry point for extensions and variations (editor)
		index: path.resolve(process.cwd(), 'src', 'index.js'),
		// Frontend CSS entry point
		'style-index': path.resolve(process.cwd(), 'src', 'style.scss'),
		// Frontend entry point for frontend-only scripts
		frontend: path.resolve(process.cwd(), 'src', 'frontend.js'),
		// Block-specific entries (auto-detected from src/blocks/*/index.js)
		...blockEntries,
		// Block-specific view scripts (auto-detected from src/blocks/*/view.js)
		...viewEntries,
	},
	plugins: [
		...defaultConfig.plugins,
		// Copy block style variations to build directory
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'src/blocks/*/styles/*.json',
					to: ({ absoluteFilename }) => {
						// Extract block name and filename from the absolute path
						const match = absoluteFilename.match(
							/blocks\/([^/]+)\/styles\/(.+)$/
						);
						if (match) {
							return `blocks/${match[1]}/styles/${match[2]}`;
						}
						return 'blocks/[name][ext]';
					},
				},
			],
		}),
	],
	optimization: {
		...defaultConfig.optimization,
		// Disable code splitting to ensure single index.js file for WordPress compatibility
		// WordPress expects build/index.js and build/index.asset.php at predictable paths
		splitChunks: false,
		// Enable tree shaking in production
		usedExports: true,
		// Minimize bundle size in production
		minimize: defaultConfig.mode === 'production',
	},
	performance: {
		// Set performance budgets for WordPress block plugin with 12+ blocks
		// Note: With code splitting, not all chunks load immediately
		hints: defaultConfig.mode === 'production' ? 'warning' : false,
		maxEntrypointSize: 300000, // 300KB threshold (combined size, but split into chunks)
		maxAssetSize: 150000, // 150KB threshold for individual assets
		// Filter out asset.php files and source maps from performance hints
		assetFilter: (assetFilename) => {
			return (
				!assetFilename.endsWith('.asset.php') &&
				!assetFilename.endsWith('.map')
			);
		},
	},
};
