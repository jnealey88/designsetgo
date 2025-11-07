<?php
/**
 * Plugin Name:       DesignSetGo
 * Plugin URI:        https://designsetgoblocks.com
 * Description:       Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            DesignSetGo
 * Author URI:        https://designsetgoblocks.com
 * License:           GPL-2.0-or-later
 * Text Domain:       designsetgo
 * Domain Path:       /languages
 *
 * @package DesignSetGo
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DESIGNSETGO_VERSION', '1.0.0' );
define( 'DESIGNSETGO_FILE', __FILE__ );
define( 'DESIGNSETGO_PATH', plugin_dir_path( __FILE__ ) );
define( 'DESIGNSETGO_URL', plugin_dir_url( __FILE__ ) );
define( 'DESIGNSETGO_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Load the plugin.
 */
require_once DESIGNSETGO_PATH . 'includes/class-plugin.php';

/**
 * Load animation attributes helper (used by dynamic blocks).
 */
require_once DESIGNSETGO_PATH . 'includes/block-animation-attributes.php';

/**
 * Load SVG icon library (used by dynamic blocks).
 */
require_once DESIGNSETGO_PATH . 'includes/icon-svg-library.php';

/**
 * Initialize the plugin.
 */
function designsetgo_init() {
	return \DesignSetGo\Plugin::instance();
}

// Kick off the plugin.
designsetgo_init();
