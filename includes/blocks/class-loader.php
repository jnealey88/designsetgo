<?php
/**
 * Blocks Loader Class
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo\Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Blocks Loader Class - Registers all blocks
 */
class Loader {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'register_block_styles' ) );
	}

	/**
	 * Register all blocks.
	 */
	public function register_blocks() {
		// Get all block directories from build folder.
		$blocks_dir = DESIGNSETGO_PATH . 'build/blocks/';

		if ( ! file_exists( $blocks_dir ) ) {
			return;
		}

		// Register each block.
		$blocks = array_filter( glob( $blocks_dir . '*' ), 'is_dir' );

		foreach ( $blocks as $block_dir ) {
			$block_json = $block_dir . '/block.json';

			if ( file_exists( $block_json ) ) {
				register_block_type( $block_dir );
			}
		}
	}

	/**
	 * Register block style variations.
	 *
	 * These appear in the Site Editor under Styles → Blocks → [Block Name]
	 * Registers both JSON-based style variations and simple CSS class-based styles.
	 */
	public function register_block_styles() {
		// Register JSON-based block style variations from the /styles/ directory.
		$this->register_json_block_styles();

		// Container Block Style Variations (CSS class-based).
		register_block_style(
			'designsetgo/container',
			array(
				'name'  => 'card',
				'label' => __( 'Card', 'designsetgo' ),
			)
		);

		register_block_style(
			'designsetgo/container',
			array(
				'name'  => 'elevated',
				'label' => __( 'Elevated', 'designsetgo' ),
			)
		);

		register_block_style(
			'designsetgo/container',
			array(
				'name'  => 'bordered',
				'label' => __( 'Bordered', 'designsetgo' ),
			)
		);

		register_block_style(
			'designsetgo/container',
			array(
				'name'  => 'gradient',
				'label' => __( 'Gradient', 'designsetgo' ),
			)
		);

		register_block_style(
			'designsetgo/container',
			array(
				'name'  => 'glass',
				'label' => __( 'Glass (Glassmorphism)', 'designsetgo' ),
			)
		);
	}

	/**
	 * Register JSON-based block style variations.
	 *
	 * Discovers and registers block style variations from JSON files in the
	 * block's /styles/ subdirectory. These are theme.json-formatted style
	 * variations that provide comprehensive styling (colors, typography, etc.).
	 *
	 * @since 1.0.0
	 */
	private function register_json_block_styles() {
		$blocks_dir = DESIGNSETGO_PATH . 'build/blocks/';

		if ( ! file_exists( $blocks_dir ) ) {
			return;
		}

		// Find all block directories.
		$blocks = array_filter( glob( $blocks_dir . '*' ), 'is_dir' );

		foreach ( $blocks as $block_dir ) {
			$styles_dir = $block_dir . '/styles/';

			// Check if the block has a styles directory.
			if ( ! is_dir( $styles_dir ) ) {
				continue;
			}

			// Find all JSON files in the styles directory.
			$style_files = glob( $styles_dir . '*.json' );

			foreach ( $style_files as $style_file ) {
				// Read and decode the JSON file.
				$style_data = json_decode( file_get_contents( $style_file ), true );

				if ( ! $style_data || ! isset( $style_data['slug'] ) || ! isset( $style_data['title'] ) ) {
					continue;
				}

				// Get the block types this style applies to.
				$block_types = isset( $style_data['blockTypes'] ) ? $style_data['blockTypes'] : array();

				// Register the style for each block type.
				foreach ( $block_types as $block_type ) {
					// Register the block style variation.
					register_block_style(
						$block_type,
						array(
							'name'         => $style_data['slug'],
							'label'        => $style_data['title'],
							'style_handle' => null, // No separate stylesheet needed.
						)
					);

					// Register the style variation data with WordPress.
					// This allows the Site Editor to apply the comprehensive theme.json styles.
					add_filter(
						'wp_theme_json_data_default',
						function ( $theme_json ) use ( $style_data, $block_type ) {
							// Merge the style variation into the theme.json data.
							$theme_json_data = $theme_json->get_data();

							if ( ! isset( $theme_json_data['styles']['blocks'][ $block_type ] ) ) {
								$theme_json_data['styles']['blocks'][ $block_type ] = array();
							}

							// Add the style variation data.
							if ( isset( $style_data['styles'] ) ) {
								$theme_json_data['styles']['blocks'][ $block_type ]['variations'][ $style_data['slug'] ] = $style_data['styles'];
							}

							return new \WP_Theme_JSON_Data( $theme_json_data, 'default' );
						}
					);
				}
			}
		}
	}

	/**
	 * Get registered DesignSetGo blocks.
	 *
	 * @return array
	 */
	public static function get_registered_blocks() {
		$blocks = \WP_Block_Type_Registry::get_instance()->get_all_registered();
		$dsg_blocks = array();

		foreach ( $blocks as $name => $block ) {
			if ( strpos( $name, 'designsetgo/' ) === 0 ) {
				$dsg_blocks[] = $name;
			}
		}

		return $dsg_blocks;
	}
}
