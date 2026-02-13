/**
 * White Label Replacement Rules
 *
 * Centralized replacement definitions shared by webpack loaders
 * and the post-build PHP/pattern transformer.
 *
 * @package
 */

'use strict';

const path = require('path');
const fs = require('fs');

/**
 * Default values matching the current DesignSetGo branding.
 * When config matches these, no transformation occurs.
 */
const DEFAULTS = {
	pluginName: 'DesignSetGo',
	pluginSlug: 'designsetgo',
	pluginUri: 'https://designsetgoblocks.com',
	pluginDescription:
		'Professional Gutenberg block library with 52 blocks and 16 powerful extensions - complete Form Builder, container system, interactive elements, maps, modals, breadcrumbs, timelines, scroll effects, and animations. Built with WordPress standards for guaranteed editor/frontend parity.',
	pluginAuthor: 'DesignSetGo',
	pluginAuthorUri: 'https://designsetgoblocks.com/nealey',
	textDomain: 'designsetgo',
	blockNamespace: 'designsetgo',
	cssPrefix: 'dsgo',
	shortPrefix: 'dsg',
	phpNamespace: 'DesignSetGo',
	phpFunctionPrefix: 'designsetgo',
	phpConstantPrefix: 'DESIGNSETGO',
	restNamespace: 'designsetgo/v1',
	patternCategoryPrefix: 'dsgo',
	postTypeSlug: 'dsgo_form_submission',
	metaKeyPrefix: '_dsg',
	transientPrefix: 'dsgo',
	optionPrefix: 'designsetgo',
	logoPath: 'src/admin/assets/logo.png',
};

/**
 * Convert a hyphenated slug to camelCase.
 * E.g., "my-blocks" → "myBlocks", "myblocks" → "myblocks"
 *
 * @param {string} slug Hyphenated slug.
 * @return {string} camelCase version.
 */
function toCamelCase(slug) {
	return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Load white-label config, returning null if not found or matching defaults.
 *
 * @return {Object|null} Config object or null if no transformation needed.
 */
function loadConfig() {
	const configPath = path.resolve(__dirname, '..', 'white-label.json');
	if (!fs.existsSync(configPath)) {
		return null;
	}

	const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

	// Strip JSON Schema reference and comment fields.
	const cleaned = { ...config };
	delete cleaned.$schema;
	Object.keys(cleaned).forEach((key) => {
		if (key.startsWith('_comment')) {
			delete cleaned[key];
		}
	});

	// Check if all values match defaults (no transformation needed).
	const isDefault = Object.keys(DEFAULTS).every(
		(key) => cleaned[key] === DEFAULTS[key]
	);
	if (isDefault) {
		return null;
	}

	return { ...DEFAULTS, ...cleaned };
}

/**
 * Build replacement pairs for JS and SCSS files (webpack string-replace-loader).
 *
 * Returns an array of { search: RegExp, replace: string } objects,
 * ordered longest-match-first.
 *
 * @param {Object} config White-label config.
 * @return {Array} Replacement rules for string-replace-loader.
 */
function buildJsScssReplacements(config) {
	const rules = [];

	// Helper: add a literal string replacement.
	function literal(from, to) {
		if (from !== to) {
			rules.push({
				search: from,
				replace: to,
				from, // Keep original for sorting.
			});
		}
	}

	// --- Longest patterns first ---

	// WP auto-generated block CSS classes.
	literal('wp-block-designsetgo-', `wp-block-${config.blockNamespace}-`);

	// Block comment markers in pattern content.
	literal('wp:designsetgo/', `wp:${config.blockNamespace}/`);

	// Block namespace in strings (block names, context keys).
	literal('designsetgo/', `${config.blockNamespace}/`);

	// Data attributes.
	literal('data-dsgo-', `data-${config.cssPrefix}-`);

	// CSS custom properties.
	literal('--dsgo-', `--${config.cssPrefix}-`);

	// CSS classes (dot-prefixed).
	literal('.dsgo-', `.${config.cssPrefix}-`);

	// CSS classes (without dot, for classnames() calls and string concatenation).
	literal('dsgo-', `${config.cssPrefix}-`);

	// JS global names passed via wp_localize_script.
	literal(
		'designSetGoRevisions',
		`${toCamelCase(config.pluginSlug)}Revisions`
	);
	literal('designSetGoAdmin', `${toCamelCase(config.pluginSlug)}Admin`);
	literal('designsetgoForm', `${config.textDomain}Form`);

	// WP script handles (hyphenated) in JS references.
	literal('designsetgo-', `${config.pluginSlug}-`);

	// Display name in JS strings.
	literal('DesignSetGo', config.pluginName);

	// Text domain in i18n calls.
	literal('designsetgo', config.textDomain);

	// Short prefix for camelCase identifiers (animation keyframes, attribute names, globals).
	// Match dsg followed by uppercase letter — e.g., dsgFadeIn, dsgLinkUrl, dsgStickyHeaderSettings.
	// This must NOT match dsgo- (safe: dsgo is never followed by uppercase).
	if (config.shortPrefix !== DEFAULTS.shortPrefix) {
		rules.push({
			search: new RegExp(`\\b${DEFAULTS.shortPrefix}([A-Z])`, 'g'),
			replace: `${config.shortPrefix}$1`,
			from: `${DEFAULTS.shortPrefix}[A-Z]`,
		});
	}

	// Sort literal rules: longest 'from' first to prevent partial matches.
	// Regex rules go last since they handle what literals miss.
	return rules.sort((a, b) => {
		const aIsRegex = a.search instanceof RegExp;
		const bIsRegex = b.search instanceof RegExp;
		if (aIsRegex && !bIsRegex) {
			return 1;
		}
		if (!aIsRegex && bIsRegex) {
			return -1;
		}
		return (b.from || '').length - (a.from || '').length;
	});
}

/**
 * Build replacement pairs for PHP files.
 *
 * Returns an array of { search: string|RegExp, replace: string } objects.
 *
 * @param {Object} config White-label config.
 * @return {Array} Replacement rules.
 */
function buildPhpReplacements(config) {
	const rules = [];

	function literal(from, to) {
		if (from !== to) {
			rules.push({ search: from, replace: to, from });
		}
	}

	// --- PHP-specific replacements (longest first) ---

	// PHP namespace (backslash-prefixed references).
	literal('\\DesignSetGo\\', `\\${config.phpNamespace}\\`);

	// PHP namespace declarations.
	literal('namespace DesignSetGo', `namespace ${config.phpNamespace}`);

	// @package docblock tag.
	literal('@package DesignSetGo', `@package ${config.phpNamespace}`);

	// PHP constants (order: longest constant names first).
	literal('DESIGNSETGO_BASENAME', `${config.phpConstantPrefix}_BASENAME`);
	literal('DESIGNSETGO_VERSION', `${config.phpConstantPrefix}_VERSION`);
	literal('DESIGNSETGO_FILE', `${config.phpConstantPrefix}_FILE`);
	literal('DESIGNSETGO_PATH', `${config.phpConstantPrefix}_PATH`);
	literal('DESIGNSETGO_URL', `${config.phpConstantPrefix}_URL`);

	// REST namespace.
	literal('designsetgo/v1', config.restNamespace);

	// Post type slug.
	literal('dsgo_form_submission', config.postTypeSlug);

	// Option names.
	literal(
		'designsetgo_global_styles',
		`${config.optionPrefix}_global_styles`
	);
	literal('designsetgo_settings', `${config.optionPrefix}_settings`);

	// Transient prefixes.
	literal('dsgo_has_blocks_', `${config.transientPrefix}_has_blocks_`);
	literal(
		'dsgo_form_submissions_count',
		`${config.transientPrefix}_form_submissions_count`
	);

	// JS global names passed via wp_localize_script (must match JS side).
	// These use camelCase variants of the plugin name.
	literal(
		'designSetGoRevisions',
		`${toCamelCase(config.pluginSlug)}Revisions`
	);
	literal('designSetGoAdmin', `${toCamelCase(config.pluginSlug)}Admin`);
	literal('designsetgoForm', `${config.textDomain}Form`);

	// Cache group.
	literal("'designsetgo'", `'${config.textDomain}'`);

	// WP auto-generated block CSS classes.
	literal('wp-block-designsetgo-', `wp-block-${config.blockNamespace}-`);

	// Block comment markers in pattern content.
	literal('wp:designsetgo/', `wp:${config.blockNamespace}/`);

	// Block namespace in strings.
	literal('designsetgo/', `${config.blockNamespace}/`);

	// Function prefix (hook names, function names).
	literal('designsetgo_', `${config.phpFunctionPrefix}_`);

	// WP script/style handles and admin page slugs (hyphenated).
	literal('designsetgo-', `${config.pluginSlug}-`);

	// Data attributes in PHP HTML output.
	literal('data-dsgo-', `data-${config.cssPrefix}-`);

	// CSS custom properties in PHP inline styles.
	literal('--dsgo-', `--${config.cssPrefix}-`);

	// CSS class prefix in PHP HTML output (with dot for selectors).
	literal('.dsgo-', `.${config.cssPrefix}-`);

	// CSS class prefix in PHP HTML output (without dot for class attributes).
	literal('dsgo-', `${config.cssPrefix}-`);

	// Pattern category prefix.
	literal('dsgo-hero', `${config.patternCategoryPrefix}-hero`);
	literal('dsgo-contact', `${config.patternCategoryPrefix}-contact`);
	literal('dsgo-features', `${config.patternCategoryPrefix}-features`);
	literal('dsgo-cta', `${config.patternCategoryPrefix}-cta`);
	literal('dsgo-faq', `${config.patternCategoryPrefix}-faq`);
	literal('dsgo-gallery', `${config.patternCategoryPrefix}-gallery`);
	literal('dsgo-homepage', `${config.patternCategoryPrefix}-homepage`);
	literal('dsgo-modal', `${config.patternCategoryPrefix}-modal`);
	literal('dsgo-pricing', `${config.patternCategoryPrefix}-pricing`);
	literal('dsgo-team', `${config.patternCategoryPrefix}-team`);
	literal(
		'dsgo-testimonials',
		`${config.patternCategoryPrefix}-testimonials`
	);
	literal('dsgo-content', `${config.patternCategoryPrefix}-content`);

	// Meta key prefix.
	literal('_dsg_', `${config.metaKeyPrefix}_`);

	// Short prefix for camelCase identifiers.
	if (config.shortPrefix !== DEFAULTS.shortPrefix) {
		rules.push({
			search: new RegExp(`\\b${DEFAULTS.shortPrefix}([A-Z])`, 'g'),
			replace: `${config.shortPrefix}$1`,
			from: `${DEFAULTS.shortPrefix}[A-Z]`,
		});
	}

	// Display name.
	literal('DesignSetGo', config.pluginName);

	// Catch-all: bare "designsetgo" (admin menu slug, page params, remaining occurrences).
	// Must come last since it's the shortest and most general match.
	literal('designsetgo', config.textDomain);

	// Sort: longest literal first, regexes last.
	return rules.sort((a, b) => {
		const aIsRegex = a.search instanceof RegExp;
		const bIsRegex = b.search instanceof RegExp;
		if (aIsRegex && !bIsRegex) {
			return 1;
		}
		if (!aIsRegex && bIsRegex) {
			return -1;
		}
		return (b.from || '').length - (a.from || '').length;
	});
}

/**
 * Build replacement pairs for block.json files.
 *
 * @param {Object} config White-label config.
 * @return {Array} Replacement rules.
 */
function buildBlockJsonReplacements(config) {
	const rules = [];

	function literal(from, to) {
		if (from !== to) {
			rules.push({ search: from, replace: to, from });
		}
	}

	// Block name namespace.
	literal('"designsetgo/', `"${config.blockNamespace}/`);

	// Context provider keys.
	literal('designsetgo/', `${config.blockNamespace}/`);

	// Text domain.
	literal('"designsetgo"', `"${config.textDomain}"`);

	// CSS class references in block.json metadata.
	literal('dsgo-', `${config.cssPrefix}-`);

	// CSS custom property references.
	literal('--dsgo-', `--${config.cssPrefix}-`);

	// WP auto-generated class prefix.
	literal('wp-block-designsetgo-', `wp-block-${config.blockNamespace}-`);

	return rules.sort((a, b) => (b.from || '').length - (a.from || '').length);
}

/**
 * Build replacement pairs for compiled CSS files (post-build).
 *
 * Applied to the CSS output after sass compilation, so SCSS variables
 * are already resolved and only CSS class names, custom properties,
 * data attributes, and keyframe names remain.
 *
 * @param {Object} config White-label config.
 * @return {Array} Replacement rules.
 */
function buildCssReplacements(config) {
	const rules = [];

	function literal(from, to) {
		if (from !== to) {
			rules.push({ search: from, replace: to, from });
		}
	}

	// WP auto-generated block CSS classes.
	literal('wp-block-designsetgo-', `wp-block-${config.blockNamespace}-`);

	// Data attributes.
	literal('data-dsgo-', `data-${config.cssPrefix}-`);

	// CSS custom properties.
	literal('--dsgo-', `--${config.cssPrefix}-`);

	// CSS classes (dot-prefixed selectors).
	literal('.dsgo-', `.${config.cssPrefix}-`);

	// CSS classes (without dot, e.g., in attribute selectors or animations).
	literal('dsgo-', `${config.cssPrefix}-`);

	// Admin dashboard CSS classes and WP theme.json custom properties using full name.
	// E.g., .designsetgo-info-box, --wp--custom--designsetgo--border-radius
	literal('designsetgo-', `${config.pluginSlug}-`);
	literal('designsetgo', config.textDomain);

	// Display name in CSS comments (e.g., @package DesignSetGo).
	literal('DesignSetGo', config.pluginName);

	// Short prefix for CSS @keyframes names (dsgFadeIn, dsgSlideInUp, etc.).
	if (config.shortPrefix !== DEFAULTS.shortPrefix) {
		rules.push({
			search: new RegExp(`${DEFAULTS.shortPrefix}([A-Z])`, 'g'),
			replace: `${config.shortPrefix}$1`,
			from: `${DEFAULTS.shortPrefix}[A-Z]`,
		});
	}

	// Sort: longest literal first, regexes last.
	return rules.sort((a, b) => {
		const aIsRegex = a.search instanceof RegExp;
		const bIsRegex = b.search instanceof RegExp;
		if (aIsRegex && !bIsRegex) {
			return 1;
		}
		if (!aIsRegex && bIsRegex) {
			return -1;
		}
		return (b.from || '').length - (a.from || '').length;
	});
}

/**
 * Build plugin file header replacements.
 *
 * @param {Object} config White-label config.
 * @return {Array} Replacement rules for the main plugin PHP file header.
 */
function buildPluginHeaderReplacements(config) {
	const rules = [];

	function headerField(field, defaultVal, newVal) {
		if (newVal !== defaultVal) {
			rules.push({
				search: `${field}${defaultVal}`,
				replace: `${field}${newVal}`,
				from: `${field}${defaultVal}`,
			});
		}
	}

	headerField(
		' * Plugin Name:       ',
		DEFAULTS.pluginName,
		config.pluginName
	);
	headerField(' * Plugin URI:        ', DEFAULTS.pluginUri, config.pluginUri);
	headerField(
		' * Description:       ',
		DEFAULTS.pluginDescription,
		config.pluginDescription
	);
	headerField(
		' * Author:            ',
		DEFAULTS.pluginAuthor,
		config.pluginAuthor
	);
	headerField(
		' * Author URI:        ',
		DEFAULTS.pluginAuthorUri,
		config.pluginAuthorUri
	);
	headerField(
		' * Text Domain:       ',
		DEFAULTS.textDomain,
		config.textDomain
	);

	return rules;
}

/**
 * Apply replacement rules to a string.
 *
 * @param {string} content Source content.
 * @param {Array}  rules   Replacement rules from any build*Replacements function.
 * @return {string} Transformed content.
 */
function applyReplacements(content, rules) {
	let result = content;
	for (const rule of rules) {
		if (rule.search instanceof RegExp) {
			result = result.replace(rule.search, rule.replace);
		} else {
			result = result.split(rule.search).join(rule.replace);
		}
	}
	return result;
}

module.exports = {
	DEFAULTS,
	loadConfig,
	buildJsScssReplacements,
	buildPhpReplacements,
	buildBlockJsonReplacements,
	buildCssReplacements,
	buildPluginHeaderReplacements,
	applyReplacements,
};
