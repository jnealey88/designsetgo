<?php
/**
 * Patterns Loader Class
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo\Patterns;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Patterns Loader Class - Registers block patterns
 *
 * Performance optimizations:
 * - Patterns only register on admin/REST/CLI requests (never on front-end page loads).
 * - Pattern file paths are cached in a transient to avoid repeated filesystem scans.
 */
class Loader {

	/**
	 * Transient name for caching pattern file paths.
	 *
	 * @var string
	 */
	const CACHE_TRANSIENT = 'dsgo_pattern_files';

	/**
	 * Allowed pattern category directory names.
	 *
	 * @var array
	 */
	const ALLOWED_CATEGORIES = array(
		'homepage',
		'hero',
		'features',
		'pricing',
		'testimonials',
		'team',
		'cta',
		'content',
		'faq',
		'modal',
		'gallery',
		'contact',
	);

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Patterns are only used in the block editor. Skip registration entirely
		// on front-end page loads to avoid unnecessary filesystem I/O and memory usage.
		if ( ! self::is_editor_request() ) {
			return;
		}

		add_action( 'init', array( $this, 'register_pattern_categories' ) );
		add_action( 'init', array( $this, 'register_patterns' ) );
	}

	/**
	 * Check if the current request may need block patterns.
	 *
	 * Returns true for admin pages (classic editor, Site Editor), REST API
	 * requests (block editor fetches patterns via REST), and WP-CLI.
	 *
	 * @return bool
	 */
	private static function is_editor_request() {
		// Admin requests (editor page loads, Site Editor).
		if ( is_admin() ) {
			return true;
		}

		// REST API — constant may already be set by another plugin or mu-plugin.
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return true;
		}

		// WP-CLI commands may need pattern data.
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			return true;
		}

		// Detect REST API requests by URL path. The REST_REQUEST constant is not
		// defined until parse_request, which fires after the constructor runs.
		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$rest_prefix = rest_get_url_prefix();
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- only used for string comparison, not output.
			$request_uri = wp_unslash( $_SERVER['REQUEST_URI'] );
			if ( false !== strpos( $request_uri, '/' . $rest_prefix . '/' ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Register pattern categories.
	 */
	public function register_pattern_categories() {
		$categories = array(
			'dsgo-homepage'     => __( 'DesignSetGo: Homepage', 'designsetgo' ),
			'dsgo-hero'         => __( 'DesignSetGo: Hero', 'designsetgo' ),
			'dsgo-features'     => __( 'DesignSetGo: Features', 'designsetgo' ),
			'dsgo-pricing'      => __( 'DesignSetGo: Pricing', 'designsetgo' ),
			'dsgo-testimonials' => __( 'DesignSetGo: Testimonials', 'designsetgo' ),
			'dsgo-team'         => __( 'DesignSetGo: Team', 'designsetgo' ),
			'dsgo-cta'          => __( 'DesignSetGo: Call to Action', 'designsetgo' ),
			'dsgo-content'      => __( 'DesignSetGo: Content', 'designsetgo' ),
			'dsgo-faq'          => __( 'DesignSetGo: FAQ', 'designsetgo' ),
			'dsgo-modal'        => __( 'DesignSetGo: Modals', 'designsetgo' ),
			'dsgo-gallery'      => __( 'DesignSetGo: Gallery', 'designsetgo' ),
			'dsgo-contact'      => __( 'DesignSetGo: Contact', 'designsetgo' ),
		);

		// Get pattern categories registry.
		$registry = \WP_Block_Pattern_Categories_Registry::get_instance();

		foreach ( $categories as $slug => $label ) {
			// Only register if not already registered.
			if ( ! $registry->is_registered( $slug ) ) {
				register_block_pattern_category(
					$slug,
					array( 'label' => $label )
				);
			}
		}
	}

	/**
	 * Get the cached map of category => relative file paths.
	 *
	 * Uses a version-keyed transient so the cache auto-invalidates on plugin
	 * updates. In WP_DEBUG mode the cache is bypassed for development convenience.
	 *
	 * @return array<string, string[]> Associative array of category => relative paths.
	 */
	private function get_pattern_file_map() {
		// Skip cache in debug mode so new/removed patterns are picked up immediately.
		if ( ! ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ) {
			$cached = get_transient( self::CACHE_TRANSIENT );

			// Validate that the cached data matches the current plugin version.
			if ( is_array( $cached ) && isset( $cached['version'] ) && DESIGNSETGO_VERSION === $cached['version'] ) {
				return $cached['map'];
			}
		}

		$patterns_dir = DESIGNSETGO_PATH . 'patterns/';
		$file_map     = array();

		if ( ! file_exists( $patterns_dir ) ) {
			return $file_map;
		}

		foreach ( self::ALLOWED_CATEGORIES as $category ) {
			$category_dir = $patterns_dir . $category . '/';

			if ( ! is_dir( $category_dir ) ) {
				continue;
			}

			$files = glob( $category_dir . '*.php' );

			if ( $files ) {
				// Store paths relative to the patterns directory for portability.
				$file_map[ $category ] = array_map(
					static function ( $file ) use ( $patterns_dir ) {
						return str_replace( $patterns_dir, '', $file );
					},
					$files
				);
			}
		}

		set_transient(
			self::CACHE_TRANSIENT,
			array(
				'version' => DESIGNSETGO_VERSION,
				'map'     => $file_map,
			),
			DAY_IN_SECONDS
		);

		return $file_map;
	}

	/**
	 * Register all patterns.
	 */
	public function register_patterns() {
		$patterns_dir = DESIGNSETGO_PATH . 'patterns/';
		$file_map     = $this->get_pattern_file_map();

		foreach ( $file_map as $category => $relative_paths ) {
			foreach ( $relative_paths as $relative_path ) {
				$file = $patterns_dir . $relative_path;

				// Security: Verify file is within expected directory (prevent directory traversal).
				$real_file = realpath( $file );
				$real_dir  = realpath( $patterns_dir );

				if ( ! $real_file || ! $real_dir || strpos( $real_file, $real_dir ) !== 0 ) {
					if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
						error_log( sprintf( 'DesignSetGo: Skipped invalid pattern file path: %s', $file ) );
					}
					continue;
				}

				// Load pattern file.
				$pattern = require $real_file;

				// Validate pattern structure.
				if ( is_array( $pattern ) && isset( $pattern['content'] ) ) {
					$slug = 'designsetgo/' . sanitize_key( $category ) . '/' . sanitize_key( basename( $file, '.php' ) );
					register_block_pattern( $slug, $pattern );
				}
			}
		}
	}

	/**
	 * Clear the pattern file cache.
	 *
	 * Should be called on plugin activation to ensure a fresh scan.
	 */
	public static function clear_cache() {
		delete_transient( self::CACHE_TRANSIENT );
	}
}
