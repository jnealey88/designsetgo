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
	}

	/**
	 * Register all blocks.
	 */
	public function register_blocks() {
		// Get all block directories.
		$blocks_dir = DESIGNSETGO_PATH . 'src/blocks/';

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
