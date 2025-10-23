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
			'dsg-hero'         => __( 'DesignSetGo: Hero', 'designsetgo' ),
			'dsg-features'     => __( 'DesignSetGo: Features', 'designsetgo' ),
			'dsg-pricing'      => __( 'DesignSetGo: Pricing', 'designsetgo' ),
			'dsg-testimonials' => __( 'DesignSetGo: Testimonials', 'designsetgo' ),
			'dsg-team'         => __( 'DesignSetGo: Team', 'designsetgo' ),
			'dsg-cta'          => __( 'DesignSetGo: Call to Action', 'designsetgo' ),
			'dsg-content'      => __( 'DesignSetGo: Content', 'designsetgo' ),
		);

		foreach ( $categories as $slug => $label ) {
			register_block_pattern_category(
				$slug,
				array( 'label' => $label )
			);
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

		// Get all pattern files from subdirectories.
		$pattern_files = glob( $patterns_dir . '*/*.php' );

		foreach ( $pattern_files as $file ) {
			$pattern = require $file;

			if ( is_array( $pattern ) && isset( $pattern['content'] ) ) {
				$slug = 'designsetgo/' . basename( dirname( $file ) ) . '/' . basename( $file, '.php' );

				register_block_pattern( $slug, $pattern );
			}
		}
	}
}
