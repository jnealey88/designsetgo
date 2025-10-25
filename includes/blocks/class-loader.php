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
	 */
	public function register_block_styles() {
		// Container Block Style Variations.
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
