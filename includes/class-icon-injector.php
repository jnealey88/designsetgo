<?php
/**
 * Icon Injector
 *
 * Handles frontend icon injection for blocks that use icons.
 * Provides icon library via wp_localize_script to avoid bundling
 * the 51KB icon library into every block's JS bundle.
 *
 * @package DesignSetGo
 * @since 1.2.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Icon Injector Class
 */
class Icon_Injector {

	/**
	 * Blocks that use icons and need the injector script.
	 *
	 * @var array
	 */
	private $icon_blocks = array(
		'designsetgo/icon',
		'designsetgo/icon-button',
		'designsetgo/icon-list-item',
		'designsetgo/divider',
		'designsetgo/tabs',
		'designsetgo/modal-trigger',
	);

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_icon_injector' ) );
	}

	/**
	 * Enqueue icon injector script with icon library data.
	 *
	 * Only loads if icon-using blocks are present on the page.
	 */
	public function enqueue_icon_injector() {
		// Check if any icon-using blocks are present.
		if ( ! $this->has_icon_blocks() ) {
			return;
		}

		// Enqueue the icon injector script.
		$asset_file = DESIGNSETGO_PATH . 'build/frontend/lazy-icon-injector.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;

		wp_enqueue_script(
			'designsetgo-icon-injector',
			DESIGNSETGO_URL . 'build/frontend/lazy-icon-injector.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Localize with icon library (from PHP).
		// This avoids bundling 51KB of icons into every block's JS.
		wp_localize_script(
			'designsetgo-icon-injector',
			'dsgoIcons',
			dsgo_get_all_icons()
		);
	}

	/**
	 * Check if any icon-using blocks are present on the current page.
	 *
	 * @return bool True if icon blocks are present.
	 */
	private function has_icon_blocks() {
		// Only check on singular pages (posts, pages, CPTs).
		if ( ! is_singular() ) {
			return false;
		}

		$post = get_post();

		if ( ! $post || ! has_blocks( $post->post_content ) ) {
			return false;
		}

		// Check if any icon-using blocks are present.
		foreach ( $this->icon_blocks as $block_name ) {
			if ( has_block( $block_name, $post ) ) {
				return true;
			}
		}

		return false;
	}
}
