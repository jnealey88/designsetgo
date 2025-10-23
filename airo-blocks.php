<?php
/**
 * Plugin Name:       Airo Blocks
 * Plugin URI:        https://airoblocks.com
 * Description:       Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Airo Blocks
 * License:           GPL-2.0-or-later
 * Text Domain:       airo-blocks
 * Domain Path:       /languages
 *
 * @package AiroBlocks
 */

namespace AiroBlocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AIRO_BLOCKS_VERSION', '1.0.0' );
define( 'AIRO_BLOCKS_FILE', __FILE__ );
define( 'AIRO_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'AIRO_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'AIRO_BLOCKS_BASENAME', plugin_basename( __FILE__ ) );

// Placeholder for now - will be developed in phases
add_action( 'init', function() {
	// Plugin will be developed here
} );
