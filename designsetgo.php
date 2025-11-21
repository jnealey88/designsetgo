<?php
/**
 * Plugin Name:       DesignSetGo
 * Plugin URI:        https://designsetgoblocks.com
 * Description:       Professional Gutenberg block library with 43 blocks and 11 powerful extensions - complete Form Builder, container system, interactive elements, maps, and animations. Built with WordPress standards for guaranteed editor/frontend parity.
 * Version:           1.1.4
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            DesignSetGo
 * Author URI:        https://designsetgoblocks.com/nealey
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

define( 'DESIGNSETGO_VERSION', '1.1.4' );
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
 * Load breadcrumbs helper functions (used by breadcrumbs block).
 */
require_once DESIGNSETGO_PATH . 'includes/breadcrumbs-functions.php';

/**
 * Initialize the plugin.
 */
function designsetgo_init() {
	return \DesignSetGo\Plugin::instance();
}

// Kick off the plugin.
designsetgo_init();
