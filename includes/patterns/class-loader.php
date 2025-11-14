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
 */
class Loader {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_pattern_categories' ) );
		add_action( 'init', array( $this, 'register_patterns' ) );
	}

	/**
	 * Register pattern categories.
	 */
	public function register_pattern_categories() {
		$categories = array(
			'dsgo-hero'         => __( 'DesignSetGo: Hero', 'designsetgo' ),
			'dsgo-features'     => __( 'DesignSetGo: Features', 'designsetgo' ),
			'dsgo-pricing'      => __( 'DesignSetGo: Pricing', 'designsetgo' ),
			'dsgo-testimonials' => __( 'DesignSetGo: Testimonials', 'designsetgo' ),
			'dsgo-team'         => __( 'DesignSetGo: Team', 'designsetgo' ),
			'dsgo-cta'          => __( 'DesignSetGo: Call to Action', 'designsetgo' ),
			'dsgo-content'      => __( 'DesignSetGo: Content', 'designsetgo' ),
			'dsgo-faq'          => __( 'DesignSetGo: FAQ', 'designsetgo' ),
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
	 * Register all patterns.
	 */
	public function register_patterns() {
		$patterns_dir = DESIGNSETGO_PATH . 'patterns/';

		if ( ! file_exists( $patterns_dir ) ) {
			return;
		}

		// Only scan expected/allowed pattern categories.
		$allowed_categories = array( 'hero', 'features', 'pricing', 'testimonials', 'team', 'cta', 'content', 'faq' );

		foreach ( $allowed_categories as $category ) {
			$category_dir = $patterns_dir . $category . '/';

			// Skip if category directory doesn't exist.
			if ( ! is_dir( $category_dir ) ) {
				continue;
			}

			// Get pattern files from this specific category.
			$pattern_files = glob( $category_dir . '*.php' );

			if ( ! $pattern_files ) {
				continue;
			}

			foreach ( $pattern_files as $file ) {
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
}
