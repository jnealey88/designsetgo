/**
 * White Label Zip Utility
 *
 * Zips the dist/ directory into an installable WordPress plugin zip.
 * The zip contains a top-level directory named after the plugin slug.
 *
 * Run: node scripts/white-label-zip.js
 *
 * @package
 */

'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadConfig } = require('./white-label-replacements');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.resolve(ROOT, 'dist');

const config = loadConfig();
if (!config) {
	console.error(
		'Error: No white-label.json found or config matches defaults.'
	);
	process.exit(1);
}

// Defense-in-depth: validate pluginSlug at point of use since this script
// can be run independently, bypassing the validation script.
if (!/^[a-z][a-z0-9-]*$/.test(config.pluginSlug)) {
	console.error(
		`Error: Invalid plugin slug "${config.pluginSlug}". Must be lowercase letters, numbers, and hyphens.`
	);
	process.exit(1);
}

if (!fs.existsSync(DIST)) {
	console.error(
		'Error: dist/ directory not found. Run "npm run white-label:build" first.'
	);
	process.exit(1);
}

const zipName = `${config.pluginSlug}.zip`;
const zipPath = path.resolve(ROOT, zipName);

// Remove existing zip if present.
if (fs.existsSync(zipPath)) {
	fs.unlinkSync(zipPath);
}

// WordPress expects the zip to contain a directory named after the plugin slug.
// Rename dist/ temporarily for zipping, then rename back.
const tempDir = path.resolve(ROOT, config.pluginSlug);

// Recover from a previous interrupted run — if the temp dir exists but
// dist/ also exists, remove the stale temp dir. If only temp dir exists,
// it IS the dist content from a prior crash, so restore it first.
if (fs.existsSync(tempDir)) {
	if (fs.existsSync(DIST)) {
		fs.rmSync(tempDir, { recursive: true, force: true });
	} else {
		console.warn(
			'Warning: Recovering from a previous interrupted zip — restoring dist/.'
		);
		fs.renameSync(tempDir, DIST);
	}
}

fs.renameSync(DIST, tempDir);

try {
	execFileSync('zip', ['-r', zipName, config.pluginSlug], {
		cwd: ROOT,
		stdio: 'pipe',
	});
	console.log(`\nCreated: ${zipName}`);
	console.log(
		'Install by uploading to WordPress > Plugins > Add New > Upload Plugin.'
	);
} catch (err) {
	console.error(`Error creating zip: ${err.message}`);
	process.exit(1);
} finally {
	// Restore dist/ directory.
	if (fs.existsSync(tempDir)) {
		fs.renameSync(tempDir, DIST);
	}
}
