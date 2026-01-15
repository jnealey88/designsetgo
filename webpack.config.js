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
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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

// Auto-detect all blocks with style.scss files (frontend CSS)
const styleEntries = glob
	.sync('./src/blocks/*/style.scss')
	.reduce((entries, file) => {
		const blockName = file.match(/\/blocks\/([^/]+)\/style\.scss$/)[1];
		entries[`blocks/${blockName}/style-index`] = path.resolve(
			process.cwd(),
			file
		);
		return entries;
	}, {});

module.exports = {
	...defaultConfig,
	// Enable persistent filesystem caching for faster rebuilds
	cache: {
		type: 'filesystem',
		cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
		buildDependencies: {
			config: [__filename],
		},
	},
	entry: {
		// Main entry point for extensions and variations (editor)
		index: path.resolve(process.cwd(), 'src', 'index.js'),
		// Frontend CSS entry point
		'style-index': path.resolve(process.cwd(), 'src', 'style.scss'),
		// Frontend entry point for frontend-only scripts
		frontend: path.resolve(process.cwd(), 'src', 'frontend.js'),
		// Admin dashboard entry point
		admin: path.resolve(process.cwd(), 'src', 'admin', 'index.js'),
		// Visual revision comparison entry point
		revisions: path.resolve(process.cwd(), 'src', 'admin', 'revisions', 'index.js'),
		// Block category filter for dual categorization
		'block-category-filter': path.resolve(
			process.cwd(),
			'src',
			'block-category-filter.js'
		),
		// Sticky header utility script
		'utils/sticky-header': path.resolve(
			process.cwd(),
			'src',
			'utils',
			'sticky-header.js'
		),
		// Icon injector frontend script
		'frontend/lazy-icon-injector': path.resolve(
			process.cwd(),
			'src',
			'frontend',
			'lazy-icon-injector.js'
		),
		// Block-specific entries (auto-detected from src/blocks/*/index.js)
		...blockEntries,
		// Block-specific view scripts (auto-detected from src/blocks/*/view.js)
		...viewEntries,
		// Block-specific frontend styles (auto-detected from src/blocks/*/style.scss)
		...styleEntries,
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
		// Bundle analyzer - run with: ANALYZE=true npm run build
		// Opens interactive visualization of bundle sizes
		...(process.env.ANALYZE
			? [
					new BundleAnalyzerPlugin({
						analyzerMode: 'static',
						reportFilename: 'bundle-report.html',
						openAnalyzer: true,
						generateStatsFile: true,
						statsFilename: 'bundle-stats.json',
					}),
				]
			: []),
	],
	optimization: {
		...defaultConfig.optimization,
		// TEMPORARY: Code splitting for icon library during migration
		// TODO: Remove this entire splitChunks configuration once all blocks
		// are converted to lazy loading (currently 6/6 converted in PR #111)
		// PERFORMANCE: Only enable code splitting in production mode
		splitChunks:
			defaultConfig.mode === 'production'
				? {
						cacheGroups: {
							// Extract icon library for editor use only
							// Frontend uses PHP wp_localize_script for lazy loading
							iconLibrary: {
								test: /svg-icons\.js$/,
								name: 'shared-icon-library-static',
								chunks: 'initial', // Only extract from initial chunks (not lazy loaded)
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
					}
				: false,
		// Enable aggressive tree shaking
		usedExports: true,
		sideEffects: false,
		// Minimize bundle size in production
		minimize: defaultConfig.mode === 'production',
	},
	performance: {
		// ===================================================================
		// PERFORMANCE BUDGETS (Updated 2025-11-11)
		// ===================================================================
		// After optimizations (Grid CSS -84%, Bundle splitting):
		// - Individual blocks: Target <15KB JS, <10KB CSS (raw)
		// - Shared chunks: Max 50KB (icon library at 50KB is acceptable)
		// - Entry points: Max 250KB (editor entry with all extensions)
		//
		// These budgets prevent future bloat and maintain optimization gains.
		// Run `ANALYZE=true npm run build` to visualize bundle sizes.
		// ===================================================================
		hints: defaultConfig.mode === 'production' ? 'warning' : false,
		maxEntrypointSize: 250000, // 250KB - main editor entry (tightened from 300KB)
		maxAssetSize: 50000, // 50KB - individual blocks/chunks (tightened from 120KB)
		// Filter out asset.php files, source maps, and CSS from performance hints
		// CSS is less critical as it's loaded async and highly cacheable
		assetFilter: (assetFilename) => {
			return (
				!assetFilename.endsWith('.asset.php') &&
				!assetFilename.endsWith('.map') &&
				!assetFilename.endsWith('.css')
			);
		},
	},
};
