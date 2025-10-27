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

module.exports = {
	...defaultConfig,
	entry: {
		// Main entry point for extensions and variations (editor)
		index: path.resolve(process.cwd(), 'src', 'index.js'),
		// Frontend CSS entry point
		'style-index': path.resolve(process.cwd(), 'src', 'style.scss'),
		// Frontend entry point for frontend-only scripts
		frontend: path.resolve(process.cwd(), 'src', 'frontend.js'),
		// Block-specific entries are auto-detected by @wordpress/scripts
		...defaultConfig.entry,
	},
	optimization: {
		...defaultConfig.optimization,
		// Enable code splitting for better caching
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				// Extract vendor (node_modules) code into separate chunk
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					priority: 10,
					reuseExistingChunk: true,
				},
				// Extract common code used across multiple blocks
				common: {
					minChunks: 2,
					priority: 5,
					reuseExistingChunk: true,
					enforce: true,
				},
			},
		},
		// Enable tree shaking in production
		usedExports: true,
		// Minimize bundle size in production
		minimize: defaultConfig.mode === 'production',
	},
	performance: {
		// Set performance budgets
		hints: defaultConfig.mode === 'production' ? 'warning' : false,
		maxEntrypointSize: 200000, // 200KB warning threshold
		maxAssetSize: 150000, // 150KB warning threshold for individual assets
	},
};
