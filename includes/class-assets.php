<?php
/**
 * Assets Management Class
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Assets Class - Handles CSS/JS loading and optimization
 */
class Assets {
	/**
	 * Track which blocks are used on the current page.
	 *
	 * @var array
	 */
	private $used_blocks = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
		add_filter( 'render_block', array( $this, 'track_block_usage' ), 10, 2 );
	}

	/**
	 * Track which blocks are used on the page for conditional loading.
	 *
	 * @param string $block_content Block content.
	 * @param array  $block         Block data.
	 * @return string Block content.
	 */
	public function track_block_usage( $block_content, $block ) {
		if ( isset( $block['blockName'] ) && strpos( $block['blockName'], 'designsetgo/' ) === 0 ) {
			$block_name = str_replace( 'designsetgo/', '', $block['blockName'] );
			$this->used_blocks[] = $block_name;
		}
		return $block_content;
	}

	/**
	 * Enqueue editor assets.
	 *
	 * Note: Individual block assets are loaded automatically via block.json.
	 * This method is for global editor assets only.
	 */
	public function enqueue_editor_assets() {
		// Block-specific assets are handled by block.json registration.
		// Add any global editor assets here if needed in the future.
	}

	/**
	 * Enqueue frontend assets.
	 */
	public function enqueue_frontend_assets() {
		// Block-specific frontend styles are handled by block.json.
		// Only load global assets here.

		// Check if any DesignSetGo blocks are on the page.
		if ( ! has_block( 'designsetgo/container' ) ) {
			return;
		}

		// Enqueue animation script for frontend animations.
		wp_enqueue_script(
			'designsetgo-animations',
			DESIGNSETGO_URL . 'src/extensions/animation/index.js',
			array(),
			DESIGNSETGO_VERSION,
			true
		);
	}

	/**
	 * Get asset URL.
	 *
	 * @param string $path Path relative to plugin root.
	 * @return string Full URL.
	 */
	public static function get_url( $path ) {
		return DESIGNSETGO_URL . ltrim( $path, '/' );
	}
}
