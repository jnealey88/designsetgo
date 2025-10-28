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
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_editor_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
		add_filter( 'render_block', array( $this, 'track_block_usage' ), 10, 2 );

		// Clear block detection cache when post is saved.
		add_action( 'save_post', array( $this, 'clear_block_cache' ) );
		add_action( 'deleted_post', array( $this, 'clear_block_cache' ) );
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
	 * Uses enqueue_block_assets hook to properly work with block editor iframe.
	 */
	public function enqueue_editor_assets() {
		// Only run in editor context.
		if ( ! is_admin() ) {
			return;
		}

		// Enqueue Dashicons for tab icons.
		// Note: WordPress automatically loads Dashicons in the admin, but we enqueue
		// explicitly to ensure it's available for our tab icon picker.
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
	 * Check if any DesignSetGo blocks are used (with caching).
	 *
	 * Uses transient caching to avoid repeated content parsing.
	 * Cache is automatically cleared on post save/delete.
	 *
	 * @return bool True if DesignSetGo blocks are present.
	 */
	private function has_designsetgo_blocks() {
		// Not on singular content - can't reliably detect.
		if ( ! is_singular() ) {
			return false;
		}

		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return false;
		}

		// Check transient cache first.
		$cache_key = 'dsg_has_blocks_' . $post_id;
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return (bool) $cached;
		}

		$has_blocks = false;

		// Method 1: Check has_blocks() first (fastest).
		if ( ! has_blocks() ) {
			set_transient( $cache_key, 0, HOUR_IN_SECONDS );
			return false;
		}

		// Method 2: Single content check for all our patterns.
		global $post;
		if ( ! $post || empty( $post->post_content ) ) {
			set_transient( $cache_key, 0, HOUR_IN_SECONDS );
			return false;
		}

		$content = $post->post_content;

		// Check for DesignSetGo blocks (single check for namespace).
		if ( strpos( $content, 'wp:designsetgo/' ) !== false ) {
			$has_blocks = true;
		}

		// Check for core blocks with our enhancements.
		if ( ! $has_blocks && strpos( $content, 'wp:core/group' ) !== false ) {
			// Only load if group has our enhancements (dsg- classes or animations).
			if ( strpos( $content, 'dsg-' ) !== false ||
				strpos( $content, 'data-dsg-animation' ) !== false ||
				strpos( $content, 'has-dsg-animation' ) !== false ) {
				$has_blocks = true;
			}
		}

		// Check for animations applied to any block.
		if ( ! $has_blocks && (
			strpos( $content, 'data-dsg-animation-enabled' ) !== false ||
			strpos( $content, 'has-dsg-animation' ) !== false
		) ) {
			$has_blocks = true;
		}

		// Cache result for 1 hour.
		set_transient( $cache_key, (int) $has_blocks, HOUR_IN_SECONDS );

		return $has_blocks;
	}

	/**
	 * Clear block detection cache for a post.
	 *
	 * Called automatically when a post is saved or deleted.
	 *
	 * @param int $post_id Post ID.
	 */
	public function clear_block_cache( $post_id ) {
		delete_transient( 'dsg_has_blocks_' . $post_id );
	}

	/**
	 * Enqueue frontend assets.
	 */
	public function enqueue_frontend_assets() {
		// Use optimized cached block detection.
		if ( ! $this->has_designsetgo_blocks() ) {
			return;
		}

		// Enqueue Dashicons for tab icons on frontend.
		// Note: Dashicons is typically only loaded in admin, so we enqueue it here
		// to ensure tab icons display correctly on the frontend.
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
