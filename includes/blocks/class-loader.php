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
		add_action( 'init', array( $this, 'register_shared_chunks' ), 5 ); // Register shared chunks first.
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'register_block_styles' ) );
		add_action( 'init', array( $this, 'setup_script_translations' ), 15 ); // After blocks are registered.
		add_filter( 'block_type_metadata', array( $this, 'add_shared_dependencies' ) );
	}

	/**
	 * Register shared webpack chunks (code-split dependencies).
	 *
	 * These are extracted by webpack's splitChunks optimization and need to be
	 * manually registered so they can be used as dependencies by blocks.
	 *
	 * @since 1.0.0
	 */
	public function register_shared_chunks() {
		$shared_chunks = array(
			'shared-icon-library' => array(
				'path' => DESIGNSETGO_PATH . 'build/shared-icon-library.js',
			),
			'shared-icon-picker'  => array(
				'path' => DESIGNSETGO_PATH . 'build/shared-icon-picker.js',
			),
		);

		foreach ( $shared_chunks as $handle => $config ) {
			if ( ! file_exists( $config['path'] ) ) {
				continue;
			}

			// Get asset file with dependencies and version.
			$asset_file = str_replace( '.js', '.asset.php', $config['path'] );
			if ( ! file_exists( $asset_file ) ) {
				continue;
			}

			$asset_data = include $asset_file;

			// Register the script.
			wp_register_script(
				'designsetgo-' . $handle,
				DESIGNSETGO_URL . 'build/' . $handle . '.js',
				$asset_data['dependencies'],
				$asset_data['version'],
				true
			);
		}
	}

	/**
	 * Add shared chunk dependencies to blocks that use them.
	 *
	 * This filter runs during block registration and injects webpack-split
	 * shared chunks as dependencies for blocks that use them.
	 *
	 * @param array $metadata Block metadata from block.json.
	 * @return array Modified metadata.
	 */
	public function add_shared_dependencies( $metadata ) {
		if ( ! isset( $metadata['name'] ) ) {
			return $metadata;
		}

		// Blocks that use the icon library.
		$icon_blocks = array(
			'designsetgo/icon',
			'designsetgo/icon-button',
			'designsetgo/icon-list',
			'designsetgo/icon-list-item',
			'designsetgo/divider',
		);

		if ( in_array( $metadata['name'], $icon_blocks, true ) ) {
			// Add shared icon library dependencies.
			if ( ! isset( $metadata['editorScript'] ) ) {
				$metadata['editorScript'] = array();
			} elseif ( ! is_array( $metadata['editorScript'] ) ) {
				$metadata['editorScript'] = array( $metadata['editorScript'] );
			}

			// Add shared chunks as dependencies.
			$metadata['editorScript'][] = 'designsetgo-shared-icon-library';
			$metadata['editorScript'][] = 'designsetgo-shared-icon-picker';
		}

		return $metadata;
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
				// Get block name from block.json.
				$block_data = json_decode( file_get_contents( $block_json ), true );
				$block_name = isset( $block_data['name'] ) ? $block_data['name'] : '';

				// Check if block should be registered (allows filtering via Block_Manager).
				$should_register = apply_filters( 'designsetgo_register_block', true, $block_name );

				if ( $should_register ) {
					register_block_type( $block_dir );
				}
			}
		}
	}

	/**
	 * Setup script translations for blocks with viewScript.
	 *
	 * Enables i18n for frontend JavaScript files.
	 *
	 * @since 1.1.5
	 */
	public function setup_script_translations() {
		// Table of Contents block has translatable frontend strings.
		if ( wp_script_is( 'designsetgo-table-of-contents-view-script', 'registered' ) ) {
			wp_set_script_translations(
				'designsetgo-table-of-contents-view-script',
				'designsetgo',
				DESIGNSETGO_PATH . 'languages'
			);
		}
	}

	/**
	 * Register block style variations.
	 *
	 * These appear in the Site Editor under Styles → Blocks → [Block Name]
	 * All styles are now JSON-based (WordPress 6.7+ theme.json format) and
	 * auto-discovered from the block's /styles/ directory.
	 *
	 * Container block styles include:
	 * - section-1 through section-5: Color scheme variations
	 * - card, elevated, bordered, gradient, glass: Visual style variations
	 */
	public function register_block_styles() {
		// Register JSON-based block style variations from the /styles/ directory.
		// This will auto-discover all *.json files in build/blocks/*/styles/ directories.
		$this->register_json_block_styles();
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
		$blocks     = \WP_Block_Type_Registry::get_instance()->get_all_registered();
		$dsg_blocks = array();

		foreach ( $blocks as $name => $block ) {
			if ( strpos( $name, 'designsetgo/' ) === 0 ) {
				$dsg_blocks[] = $name;
			}
		}

		return $dsg_blocks;
	}
}
