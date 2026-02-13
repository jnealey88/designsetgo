/**
 * White Label PHP/Pattern Transformer
 *
 * Post-build step that copies and transforms PHP files, patterns,
 * and metadata into the dist/ directory with rebranded identifiers.
 *
 * Run after webpack build: node scripts/white-label-php.js
 *
 * @package
 */

'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const {
	loadConfig,
	buildPhpReplacements,
	buildCssReplacements,
	buildBlockJsonReplacements,
	buildJsScssReplacements,
	buildPluginHeaderReplacements,
	applyReplacements,
	DEFAULTS,
} = require('./white-label-replacements');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.resolve(ROOT, 'dist');

const config = loadConfig();
if (!config) {
	console.log(
		'No white-label.json found or config matches defaults. Skipping PHP transform.'
	);
	process.exit(0);
}

const phpRules = buildPhpReplacements(config);
const cssRules = buildCssReplacements(config);
const blockJsonRules = buildBlockJsonReplacements(config);
const jsRules = buildJsScssReplacements(config);
const headerRules = buildPluginHeaderReplacements(config);

/**
 * Build filename renaming rules (branded prefixes in file/directory names).
 *
 * @return {Array} Array of { search, replace } pairs for filenames.
 */
function buildFilenameRules() {
	const rules = [];
	function add(from, to) {
		if (from !== to) {
			rules.push({ search: from, replace: to });
		}
	}
	// Order: longest first to prevent partial matches.
	add('designsetgo', config.textDomain);
	add('dsgo-', `${config.cssPrefix}-`);
	add('dsgo_', `${config.cssPrefix}_`);
	return rules;
}
const filenameRules = buildFilenameRules();

/**
 * Rename a file or directory name by applying branded prefix replacements.
 *
 * @param {string} name Original filename.
 * @return {string} Renamed filename (unchanged if no branded prefixes found).
 */
function renameEntry(name) {
	let result = name;
	for (const rule of filenameRules) {
		result = result.split(rule.search).join(rule.replace);
	}
	return result;
}

/**
 * Recursively copy a directory, applying transform function to matching files.
 *
 * @param {string}   src       Source directory.
 * @param {string}   dest      Destination directory.
 * @param {Function} transform Function(content, filePath) => transformed content.
 * @param {RegExp}   pattern   File pattern to transform (others are copied as-is).
 */
function copyDirWithTransform(src, dest, transform, pattern) {
	if (!fs.existsSync(src)) {
		return;
	}

	fs.mkdirSync(dest, { recursive: true });

	const entries = fs.readdirSync(src, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const renamedName = renameEntry(entry.name);
		const destPath = path.join(dest, renamedName);

		if (entry.isDirectory()) {
			copyDirWithTransform(srcPath, destPath, transform, pattern);
		} else if (pattern && pattern.test(entry.name)) {
			const content = fs.readFileSync(srcPath, 'utf8');
			const transformed = transform(content, srcPath);
			fs.writeFileSync(destPath, transformed, 'utf8');
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

/**
 * Copy a directory as-is (no transformation).
 *
 * @param {string} src  Source directory.
 * @param {string} dest Destination directory.
 */
function copyDir(src, dest) {
	if (!fs.existsSync(src)) {
		return;
	}

	fs.mkdirSync(dest, { recursive: true });

	const entries = fs.readdirSync(src, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const renamedName = renameEntry(entry.name);
		const destPath = path.join(dest, renamedName);

		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

/**
 * Apply PHP replacements to file content.
 *
 * @param {string} content File content.
 * @return {string} Transformed content.
 */
function transformPhp(content) {
	return applyReplacements(content, phpRules);
}

// ---- Main ----

console.log(
	`\nWhite-label: Building rebranded plugin "${config.pluginName}"...`
);

// Clean dist/ directory.
if (fs.existsSync(DIST)) {
	fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// 1. Transform and copy main plugin file (rename if slug changed).
const mainPhpSrc = path.join(ROOT, 'designsetgo.php');
const mainPhpDest = path.join(DIST, `${config.pluginSlug}.php`);
let mainPhpContent = fs.readFileSync(mainPhpSrc, 'utf8');
mainPhpContent = applyReplacements(mainPhpContent, headerRules);
mainPhpContent = transformPhp(mainPhpContent);
fs.writeFileSync(mainPhpDest, mainPhpContent, 'utf8');
console.log(`  Main plugin file: ${config.pluginSlug}.php`);

// 2. Transform and copy uninstall.php.
const uninstallSrc = path.join(ROOT, 'uninstall.php');
if (fs.existsSync(uninstallSrc)) {
	const uninstallContent = transformPhp(
		fs.readFileSync(uninstallSrc, 'utf8')
	);
	fs.writeFileSync(
		path.join(DIST, 'uninstall.php'),
		uninstallContent,
		'utf8'
	);
	console.log('  uninstall.php');
}

// 3. Transform and copy includes/ directory (PHP, CSS, JS, JSON).
function transformIncludesFile(content, filePath) {
	if (filePath.endsWith('.php')) {
		return transformPhp(content);
	}
	if (filePath.endsWith('.css')) {
		return applyReplacements(content, cssRules);
	}
	if (filePath.endsWith('.js')) {
		return applyReplacements(content, jsRules);
	}
	if (filePath.endsWith('.json')) {
		return applyReplacements(content, blockJsonRules);
	}
	return content;
}
copyDirWithTransform(
	path.join(ROOT, 'includes'),
	path.join(DIST, 'includes'),
	transformIncludesFile,
	/\.(php|css|js|json)$/
);
console.log('  includes/');

// 4. Transform and copy patterns/ directory (PHP files with block content).
copyDirWithTransform(
	path.join(ROOT, 'patterns'),
	path.join(DIST, 'patterns'),
	transformPhp,
	/\.php$/
);
console.log('  patterns/');

// 5. Copy build/ directory with post-build transformations.
// CSS: sass-loader bypasses webpack loaders for partials, so transform compiled CSS here.
// PHP: render.php files copied by @wordpress/scripts.
// JSON: block.json files copied as-is by @wordpress/scripts (webpack loader only intercepts imports).
// JS: Second pass to catch any remaining references the webpack loader missed.
function transformBuildFile(content, filePath) {
	if (filePath.endsWith('.css')) {
		return applyReplacements(content, cssRules);
	}
	if (filePath.endsWith('.php')) {
		return transformPhp(content);
	}
	if (filePath.endsWith('block.json')) {
		return applyReplacements(content, blockJsonRules);
	}
	if (filePath.endsWith('.js')) {
		return applyReplacements(content, jsRules);
	}
	return content;
}
copyDirWithTransform(
	path.join(ROOT, 'build'),
	path.join(DIST, 'build'),
	transformBuildFile,
	/\.(css|php|json|js)$/
);
console.log('  build/ (CSS + PHP + JSON + JS transformed)');

// 6. Copy languages/ directory as-is.
copyDir(path.join(ROOT, 'languages'), path.join(DIST, 'languages'));
console.log('  languages/');

// 7. Copy vendor/ directory as-is (if exists).
const vendorSrc = path.join(ROOT, 'vendor');
if (fs.existsSync(vendorSrc)) {
	copyDir(vendorSrc, path.join(DIST, 'vendor'));
	console.log('  vendor/');
}

// 8. Transform and copy readme.txt.
const readmeSrc = path.join(ROOT, 'readme.txt');
if (fs.existsSync(readmeSrc)) {
	let readmeContent = fs.readFileSync(readmeSrc, 'utf8');
	// Replace plugin name in readme header (first line is "=== PluginName ===").
	readmeContent = readmeContent.replace(
		`=== ${DEFAULTS.pluginName} ===`,
		`=== ${config.pluginName} ===`
	);
	readmeContent = applyReplacements(readmeContent, phpRules);
	fs.writeFileSync(path.join(DIST, 'readme.txt'), readmeContent, 'utf8');
	console.log('  readme.txt');
}

// 9. Copy license file.
const licenseSrc = path.join(ROOT, 'LICENSE.txt');
if (fs.existsSync(licenseSrc)) {
	fs.copyFileSync(licenseSrc, path.join(DIST, 'LICENSE.txt'));
	console.log('  LICENSE.txt');
}

// 10. Handle custom logo if specified.
if (config.logoPath && config.logoPath !== DEFAULTS.logoPath) {
	const logoSrc = path.join(ROOT, config.logoPath);
	if (fs.existsSync(logoSrc)) {
		const logoDest = path.join(DIST, 'build', 'admin', 'assets');
		fs.mkdirSync(logoDest, { recursive: true });
		fs.copyFileSync(logoSrc, path.join(logoDest, path.basename(logoSrc)));
		console.log(`  Custom logo: ${config.logoPath}`);
	} else {
		console.warn(`  Warning: Logo file not found: ${config.logoPath}`);
	}
}

console.log(`\nWhite-label build complete: dist/`);
console.log(`Plugin: ${config.pluginName} (${config.pluginSlug})`);
