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
	 * This method is for global editor assets (extensions, variations, etc.).
	 */
	public function enqueue_editor_assets() {
		// Enqueue Dashicons for icon block and tab icons.
		wp_enqueue_style( 'dashicons' );

		// Load block extensions and variations.
		$asset_file_path = DESIGNSETGO_PATH . 'build/index.asset.php';

		if ( ! file_exists( $asset_file_path ) || ! is_readable( $asset_file_path ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'DesignSetGo: Editor asset file not found. Run `npm run build`.' );
			}
			return;
		}

		$asset_file = include $asset_file_path;

		if ( ! is_array( $asset_file ) || ! isset( $asset_file['dependencies'] ) || ! isset( $asset_file['version'] ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'DesignSetGo: Invalid editor asset file format.' );
			}
			return;
		}

		wp_enqueue_script(
			'designsetgo-extensions',
			DESIGNSETGO_URL . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_enqueue_style(
			'designsetgo-extensions',
			DESIGNSETGO_URL . 'build/index.css',
			array( 'wp-edit-blocks', 'dashicons' ),
			$asset_file['version']
		);
	}

	/**
	 * Enqueue frontend assets.
	 */
	public function enqueue_frontend_assets() {
		// Check if any DesignSetGo blocks or enhanced blocks are used.
		// Note: has_block() requires post content, so we check in the_content filter.
		// For now, check if we've tracked any blocks during rendering.
		// If no blocks are tracked yet, enqueue conditionally based on has_block().
		$should_enqueue = false;

		// Check for DesignSetGo blocks.
		if ( has_block( 'designsetgo/container' ) || has_block( 'designsetgo/tabs' ) || has_block( 'designsetgo/icon' ) ) {
			$should_enqueue = true;
		}

		// Check for core blocks that we enhance (Group block with extensions).
		if ( has_block( 'core/group' ) ) {
			$should_enqueue = true;
		}

		// If no blocks detected via has_block() but we're on singular content, enqueue anyway.
		// This handles edge cases where blocks are loaded dynamically.
		if ( ! $should_enqueue && is_singular() ) {
			// Check if post content contains our block namespaces.
			global $post;
			if ( $post && (
				strpos( $post->post_content, 'wp:designsetgo/' ) !== false ||
				strpos( $post->post_content, 'dsg-' ) !== false
			) ) {
				$should_enqueue = true;
			}
		}

		// If no blocks are used, skip loading assets.
		if ( ! $should_enqueue ) {
			return;
		}

		// Enqueue Dashicons for tab icons.
		wp_enqueue_style( 'dashicons' );

		// Block-specific frontend styles are handled by block.json.
		// Load global frontend styles for extensions.
		wp_enqueue_style(
			'designsetgo-frontend',
			DESIGNSETGO_URL . 'build/style-index.css',
			array( 'dashicons' ),
			DESIGNSETGO_VERSION
		);

		// Load frontend scripts from build directory.
		$frontend_asset_path = DESIGNSETGO_PATH . 'build/frontend.asset.php';

		if ( ! file_exists( $frontend_asset_path ) || ! is_readable( $frontend_asset_path ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'DesignSetGo: Frontend asset file not found. Run `npm run build`.' );
			}
			return;
		}

		$frontend_asset = include $frontend_asset_path;

		if ( ! is_array( $frontend_asset ) || ! isset( $frontend_asset['dependencies'] ) || ! isset( $frontend_asset['version'] ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'DesignSetGo: Invalid frontend asset file format.' );
			}
			return;
		}

		// Enqueue bundled frontend scripts (animations, group enhancements, etc.).
		wp_enqueue_script(
			'designsetgo-frontend',
			DESIGNSETGO_URL . 'build/frontend.js',
			$frontend_asset['dependencies'],
			$frontend_asset['version'],
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
