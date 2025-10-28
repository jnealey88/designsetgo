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
const blockEntries = glob.sync('./src/blocks/*/index.js').reduce((entries, file) => {
	const blockName = file.match(/\/blocks\/([^/]+)\/index\.js$/)[1];
	entries[`blocks/${blockName}/index`] = path.resolve(process.cwd(), file);
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
		// Enable code splitting ONLY for the main 'index' entry point
		// Do NOT split individual blocks - WordPress needs them at specific paths
		splitChunks: {
			chunks: (chunk) => {
				// Only apply code splitting to the main 'index' chunk
				// Block entry points must remain intact (e.g., blocks/container/index.js)
				return chunk.name === 'index';
			},
			minSize: 20000, // Only split chunks larger than 20KB
			maxSize: 70000, // Try to keep chunks under 70KB
			minChunks: 1,
			maxAsyncRequests: 30, // Allow more async requests for better splitting
			maxInitialRequests: 30, // Allow more initial requests
			cacheGroups: {
				// Extract WordPress packages into separate chunk
				wpPackages: {
					test: /[\\/]node_modules[\\/]@wordpress[\\/]/,
					name: 'wp-packages',
					priority: 20,
					reuseExistingChunk: true,
				},
				// Extract other vendor (node_modules) code
				vendor: {
					test: /[\\/]node_modules[\\/](?!@wordpress[\\/])/,
					name: 'vendors',
					priority: 10,
					reuseExistingChunk: true,
				},
				// Extract icon libraries into separate chunk (lazy loaded)
				iconLibraries: {
					test: /[\\/]src[\\/]blocks[\\/].*[\\/]utils[\\/](svg-icons|icon-library|dashicons-library)\.js$/,
					name: 'icon-libraries',
					priority: 15,
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
