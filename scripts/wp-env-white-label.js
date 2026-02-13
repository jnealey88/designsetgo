/**
 * Toggle wp-env to use the white-labeled dist/ build.
 *
 * Creates .wp-env.override.json that swaps the plugin source from . to ./dist.
 * Run `npm run wp-env:white-label:reset` to revert to normal development.
 *
 * Usage: node scripts/wp-env-white-label.js [--reset]
 *
 * @package
 */

'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('./white-label-replacements');

const ROOT = path.resolve(__dirname, '..');
const OVERRIDE_FILE = path.join(ROOT, '.wp-env.override.json');
const DIST = path.join(ROOT, 'dist');

const isReset = process.argv.includes('--reset');

if (isReset) {
	if (fs.existsSync(OVERRIDE_FILE)) {
		fs.unlinkSync(OVERRIDE_FILE);
		console.log('Removed .wp-env.override.json');
		console.log(
			'Run `npm run wp-env:start` to restart with normal (source) plugin.'
		);
	} else {
		console.log('No .wp-env.override.json found — already in normal mode.');
	}
	process.exit(0);
}

// Validate that white-label config exists.
const config = loadConfig();
if (!config) {
	console.error(
		'Error: No white-label.json found (or it matches defaults).\n' +
			'Copy white-label.json.example to white-label.json and customize it first.'
	);
	process.exit(1);
}

// Validate that dist/ exists (should be created by white-label:build).
if (!fs.existsSync(DIST)) {
	console.error(
		'Error: dist/ directory not found.\n' +
			'Run `npm run white-label:build` first to create the rebranded build.'
	);
	process.exit(1);
}

// Write the override file pointing wp-env to dist/.
const override = {
	plugins: ['./dist'],
};
fs.writeFileSync(
	OVERRIDE_FILE,
	JSON.stringify(override, null, '\t') + '\n',
	'utf8'
);

console.log(`\nWhite-label wp-env mode enabled for "${config.pluginName}".`);
console.log(`  Plugin source: dist/ (${config.pluginSlug})`);
console.log('');
console.log('Next steps:');
console.log(
	'  npm run wp-env:start    — Start/restart wp-env with the white-labeled plugin'
);
console.log('');
console.log('To revert to normal development:');
console.log('  npm run wp-env:white-label:reset');
