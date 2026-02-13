/**
 * White Label Config Validator
 *
 * Validates white-label.json before building.
 * Run: node scripts/white-label-validate.js
 *
 * @package DesignSetGo
 */

'use strict';

const fs = require( 'fs' );
const path = require( 'path' );

const configPath = path.resolve( __dirname, '..', 'white-label.json' );

if ( ! fs.existsSync( configPath ) ) {
	console.error(
		'Error: white-label.json not found.\n' +
			'Copy white-label.json.example to white-label.json and customize it.'
	);
	process.exit( 1 );
}

let config;
try {
	config = JSON.parse( fs.readFileSync( configPath, 'utf8' ) );
} catch ( err ) {
	console.error( `Error: Invalid JSON in white-label.json:\n${ err.message }` );
	process.exit( 1 );
}

const errors = [];

function required( field, label ) {
	if ( ! config[ field ] || typeof config[ field ] !== 'string' || config[ field ].trim() === '' ) {
		errors.push( `${ label } (${ field }) is required and must be a non-empty string.` );
		return false;
	}
	return true;
}

function matchesPattern( field, label, pattern, hint ) {
	if ( ! required( field, label ) ) {
		return;
	}
	if ( ! pattern.test( config[ field ] ) ) {
		errors.push( `${ label } (${ field }): "${ config[ field ] }" is invalid. ${ hint }` );
	}
}

function maxLength( field, label, max ) {
	if ( config[ field ] && config[ field ].length > max ) {
		errors.push(
			`${ label } (${ field }): "${ config[ field ] }" exceeds max length of ${ max } characters (currently ${ config[ field ].length }).`
		);
	}
}

// Plugin slug: lowercase, hyphens, no leading hyphen.
matchesPattern(
	'pluginSlug',
	'Plugin slug',
	/^[a-z][a-z0-9-]*$/,
	'Must be lowercase letters, numbers, and hyphens. Must start with a letter.'
);

// Text domain must match plugin slug.
if ( config.textDomain && config.pluginSlug && config.textDomain !== config.pluginSlug ) {
	errors.push(
		`Text domain ("${ config.textDomain }") should match plugin slug ("${ config.pluginSlug }"). WordPress convention requires these to be identical.`
	);
}

// Block namespace.
matchesPattern(
	'blockNamespace',
	'Block namespace',
	/^[a-z][a-z0-9-]*$/,
	'Must be lowercase letters, numbers, and hyphens.'
);

// CSS prefix.
matchesPattern(
	'cssPrefix',
	'CSS prefix',
	/^[a-z][a-z0-9]*$/,
	'Must be lowercase letters and numbers only (no hyphens).'
);
if ( config.cssPrefix && ( config.cssPrefix.length < 2 || config.cssPrefix.length > 6 ) ) {
	errors.push(
		`CSS prefix (${ config.cssPrefix }): Recommended 2-6 characters (currently ${ config.cssPrefix.length }).`
	);
}

// Short prefix.
matchesPattern(
	'shortPrefix',
	'Short prefix',
	/^[a-z][a-z0-9]*$/,
	'Must be lowercase letters and numbers only.'
);

// PHP namespace.
matchesPattern(
	'phpNamespace',
	'PHP namespace',
	/^[A-Z][A-Za-z0-9]*$/,
	'Must be PascalCase (start with uppercase, letters and numbers only).'
);

// PHP function prefix.
matchesPattern(
	'phpFunctionPrefix',
	'PHP function prefix',
	/^[a-z][a-z0-9_]*$/,
	'Must be lowercase with underscores.'
);

// PHP constant prefix.
matchesPattern(
	'phpConstantPrefix',
	'PHP constant prefix',
	/^[A-Z][A-Z0-9_]*$/,
	'Must be UPPERCASE with underscores.'
);

// REST namespace.
matchesPattern(
	'restNamespace',
	'REST namespace',
	/^[a-z][a-z0-9-]*\/v[0-9]+$/,
	'Must be in format "slug/v1".'
);

// Post type slug: max 20 characters.
matchesPattern(
	'postTypeSlug',
	'Post type slug',
	/^[a-z][a-z0-9_]*$/,
	'Must be lowercase with underscores.'
);
maxLength( 'postTypeSlug', 'Post type slug', 20 );

// Meta key prefix.
if ( required( 'metaKeyPrefix', 'Meta key prefix' ) ) {
	if ( ! /^_?[a-z][a-z0-9]*$/.test( config.metaKeyPrefix ) ) {
		errors.push(
			`Meta key prefix ("${ config.metaKeyPrefix }") is invalid. Must be lowercase, optionally starting with underscore.`
		);
	}
}

// Pattern category prefix.
matchesPattern(
	'patternCategoryPrefix',
	'Pattern category prefix',
	/^[a-z][a-z0-9]*$/,
	'Must be lowercase letters and numbers only.'
);

// Transient prefix.
matchesPattern(
	'transientPrefix',
	'Transient prefix',
	/^[a-z][a-z0-9]*$/,
	'Must be lowercase letters and numbers only.'
);

// Option prefix.
matchesPattern(
	'optionPrefix',
	'Option prefix',
	/^[a-z][a-z0-9_]*$/,
	'Must be lowercase with underscores.'
);

// Plugin name (display).
required( 'pluginName', 'Plugin name' );

// Check for prefix collision: shortPrefix must not be a prefix of cssPrefix + hyphen pattern.
// e.g., if cssPrefix is "mb" and shortPrefix is "mb", that's fine because
// shortPrefix matches /mb[A-Z]/ and cssPrefix matches /mb-/.
// But if shortPrefix is "dsgo" it would match "dsgoA" which could collide.

if ( errors.length > 0 ) {
	console.error( 'White-label configuration errors:\n' );
	errors.forEach( ( err ) => console.error( `  - ${ err }` ) );
	console.error( `\n${ errors.length } error(s) found. Fix white-label.json and try again.` );
	process.exit( 1 );
}

console.log( 'White-label configuration is valid.' );
console.log( `  Plugin: ${ config.pluginName } (${ config.pluginSlug })` );
console.log( `  Block namespace: ${ config.blockNamespace }` );
console.log( `  CSS prefix: ${ config.cssPrefix }-` );
console.log( `  Short prefix: ${ config.shortPrefix }` );
console.log( `  PHP namespace: ${ config.phpNamespace }` );
console.log( `  REST namespace: ${ config.restNamespace }` );
console.log( `  Post type: ${ config.postTypeSlug }` );
