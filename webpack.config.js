/**
 * WordPress Scripts Webpack Config - Optimized for WordPress
 *
 * Optimized configuration that reduces bundle size while maintaining
 * full compatibility with WordPress's asset management system.
 *
 * Strategy:
 * - Treat WordPress packages as externals (already loaded by WordPress)
 * - No common chunks (WordPress doesn't handle these well)
 * - Individual block optimization via tree shaking
 * - Expected: 30-40% reduction in bundle size
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
		entries[`blocks/${blockName}/view`] = path.resolve(process.cwd(), file);
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
		// Admin dashboard entry point
		admin: path.resolve(process.cwd(), 'src', 'admin', 'index.js'),
		// Block category filter for dual categorization
		'block-category-filter': path.resolve(
			process.cwd(),
			'src',
			'block-category-filter.js'
		),
		// Block-specific entries (auto-detected from src/blocks/*/index.js)
		...blockEntries,
		// Block-specific view scripts (auto-detected from src/blocks/*/view.js)
		...viewEntries,
	},
	// Use default externals from @wordpress/scripts
	// WordPress packages are already externalized by default
	plugins: [
		...defaultConfig.plugins,
		// Copy block style variations and admin assets to build directory
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
					noErrorOnMissing: true, // Don't error if no files match
				},
				{
					from: 'src/admin/assets/*',
					to: 'admin/assets/[name][ext]',
					noErrorOnMissing: true,
				},
			],
		}),
	],
	optimization: {
		...defaultConfig.optimization,
		// Enable code splitting for shared icon library
		// WordPress externals system provides WordPress packages
		// This extracts OUR shared code (icon library) into separate chunks
		splitChunks: {
			cacheGroups: {
				// Extract icon library used by multiple blocks
				iconLibrary: {
					test: /svg-icons\.js$/,
					name: 'shared-icon-library',
					chunks: 'all',
					enforce: true,
					priority: 20,
				},
				// Extract IconPicker component
				iconPicker: {
					test: /IconPicker\.js$/,
					name: 'shared-icon-picker',
					chunks: 'all',
					enforce: true,
					priority: 15,
				},
				// Extract other shared utilities if needed
				sharedUtils: {
					test: /[\\/]src[\\/]blocks[\\/][^\/]+[\\/](utils|components)[\\/]/,
					name: 'shared-block-utils',
					chunks: 'all',
					minChunks: 3, // Only extract if used by 3+ blocks
					priority: 10,
				},
			},
		},
		// Enable aggressive tree shaking
		usedExports: true,
		sideEffects: false,
		// Minimize bundle size in production
		minimize: defaultConfig.mode === 'production',
	},
	performance: {
		// Set performance budgets with externals optimization
		// Bundle should be smaller now that WordPress packages are externalized
		hints: defaultConfig.mode === 'production' ? 'warning' : false,
		maxEntrypointSize: 300000, // 300KB threshold
		maxAssetSize: 120000, // 120KB threshold (reduced from 150KB)
		// Filter out asset.php files and source maps from performance hints
		assetFilter: (assetFilename) => {
			return (
				!assetFilename.endsWith('.asset.php') &&
				!assetFilename.endsWith('.map')
			);
		},
	},
};
