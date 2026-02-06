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
		// defined until parse_request (which fires after this constructor), so
		// URL-based detection is the reliable early check for REST requests.
		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$rest_prefix = rest_get_url_prefix();
			$request_uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
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
		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			$cached = get_transient( self::CACHE_TRANSIENT );

			// Validate cached data structure and version match.
			if (
				is_array( $cached )
				&& isset( $cached['version'], $cached['map'] )
				&& DESIGNSETGO_VERSION === $cached['version']
				&& is_array( $cached['map'] )
			) {
				return $cached['map'];
			}
		}

		$patterns_dir = DESIGNSETGO_PATH . 'patterns/';
		$file_map     = array();

		if ( ! file_exists( $patterns_dir ) ) {
			return $file_map;
		}

		$dir_prefix_len = strlen( $patterns_dir );

		foreach ( self::ALLOWED_CATEGORIES as $category ) {
			$category_dir = $patterns_dir . $category . '/';

			if ( ! is_dir( $category_dir ) ) {
				continue;
			}

			$files = glob( $category_dir . '*.php' );

			// glob() returns false on error, empty array when no matches.
			if ( false === $files ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( sprintf( 'DesignSetGo: glob() failed for pattern directory: %s', $category_dir ) );
				}
				continue;
			}

			if ( $files ) {
				// Store paths relative to the patterns directory for portability.
				$file_map[ $category ] = array_map(
					static function ( $file ) use ( $dir_prefix_len ) {
						return substr( $file, $dir_prefix_len );
					},
					$files
				);
			}
		}

		/** This filter is documented in includes/patterns/class-loader.php */
		$cache_duration = (int) apply_filters( 'designsetgo_pattern_cache_duration', DAY_IN_SECONDS );

		set_transient(
			self::CACHE_TRANSIENT,
			array(
				'version' => DESIGNSETGO_VERSION,
				'map'     => $file_map,
			),
			$cache_duration
		);

		return $file_map;
	}

	/**
	 * Validate a relative pattern path before use.
	 *
	 * Ensures cached paths cannot be exploited for directory traversal
	 * or arbitrary file inclusion if the transient data is compromised.
	 *
	 * @param string $relative_path Relative path from the cache.
	 * @return bool True if the path is safe to use.
	 */
	private static function is_valid_relative_path( $relative_path ) {
		// Must be a non-empty string.
		if ( ! is_string( $relative_path ) || '' === $relative_path ) {
			return false;
		}

		// Must end with .php.
		if ( '.php' !== substr( $relative_path, -4 ) ) {
			return false;
		}

		// Must not contain directory traversal sequences.
		if ( false !== strpos( $relative_path, '..' ) ) {
			return false;
		}

		// Must not start with a path separator (absolute path).
		if ( '/' === $relative_path[0] || '\\' === $relative_path[0] ) {
			return false;
		}

		return true;
	}

	/**
	 * Register all patterns.
	 */
	public function register_patterns() {
		$patterns_dir = DESIGNSETGO_PATH . 'patterns/';
		$file_map     = $this->get_pattern_file_map();
		$real_dir     = realpath( $patterns_dir );

		if ( ! $real_dir ) {
			return;
		}

		// Enforce trailing slash for directory boundary check to prevent
		// matching sibling directories (e.g. "patterns2/").
		$real_dir = rtrim( $real_dir, '/' ) . '/';

		foreach ( $file_map as $category => $relative_paths ) {
			foreach ( $relative_paths as $relative_path ) {
				// Validate relative path structure before constructing full path.
				if ( ! self::is_valid_relative_path( $relative_path ) ) {
					if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
						error_log( sprintf( 'DesignSetGo: Skipped invalid relative pattern path: %s', $relative_path ) );
					}
					continue;
				}

				$file = $patterns_dir . $relative_path;

				// Security: Verify resolved file is within expected directory.
				$real_file = realpath( $file );

				if ( ! $real_file || 0 !== strpos( $real_file, $real_dir ) ) {
					if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
						error_log( sprintf( 'DesignSetGo: Skipped pattern file outside allowed directory: %s', $file ) );
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
