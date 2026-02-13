/**
 * White Label Zip Utility
 *
 * Zips the dist/ directory into an installable WordPress plugin zip.
 * The zip contains a top-level directory named after the plugin slug.
 *
 * Run: node scripts/white-label-zip.js
 *
 * @package DesignSetGo
 */

'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const { execFileSync } = require( 'child_process' );
const { loadConfig } = require( './white-label-replacements' );

const ROOT = path.resolve( __dirname, '..' );
const DIST = path.resolve( ROOT, 'dist' );

const config = loadConfig();
if ( ! config ) {
	console.error(
		'Error: No white-label.json found or config matches defaults.'
	);
	process.exit( 1 );
}

if ( ! fs.existsSync( DIST ) ) {
	console.error(
		'Error: dist/ directory not found. Run "npm run white-label:build" first.'
	);
	process.exit( 1 );
}

const zipName = `${ config.pluginSlug }.zip`;
const zipPath = path.resolve( ROOT, zipName );

// Remove existing zip if present.
if ( fs.existsSync( zipPath ) ) {
	fs.unlinkSync( zipPath );
}

// WordPress expects the zip to contain a directory named after the plugin slug.
// Rename dist/ temporarily for zipping, then rename back.
const tempDir = path.resolve( ROOT, config.pluginSlug );

// If temp dir already exists (shouldn't happen), clean it.
if ( fs.existsSync( tempDir ) ) {
	fs.rmSync( tempDir, { recursive: true, force: true } );
}

fs.renameSync( DIST, tempDir );

try {
	execFileSync( 'zip', [ '-r', zipName, config.pluginSlug ], {
		cwd: ROOT,
		stdio: 'pipe',
	} );
	console.log( `\nCreated: ${ zipName }` );
	console.log(
		'Install by uploading to WordPress > Plugins > Add New > Upload Plugin.'
	);
} catch ( err ) {
	console.error( `Error creating zip: ${ err.message }` );
	process.exit( 1 );
} finally {
	// Restore dist/ directory.
	fs.renameSync( tempDir, DIST );
}
