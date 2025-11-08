<?php
/**
 * Insert Icon Ability.
 *
 * Inserts an Icon block with customizable icon selection, size, style, and optional link.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Inserters;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Insert Icon ability class.
 */
class Insert_Icon extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-icon';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Icon', 'designsetgo' ),
			'description'         => __( 'Inserts an Icon block with customizable styling including icon selection, size, style (filled/outlined), rotation, and optional link.', 'designsetgo' ),
			'thinking_message'    => __( 'Inserting icon...', 'designsetgo' ),
			'success_message'     => __( 'Icon inserted successfully.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Inserter::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common = Block_Inserter::get_common_input_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'attributes' => array(
						'type'        => 'object',
						'description' => __( 'Icon attributes', 'designsetgo' ),
						'properties'  => array(
							'icon'        => array(
								'type'        => 'string',
								'description' => __( 'Icon name (e.g., "star", "heart", "check")', 'designsetgo' ),
								'default'     => 'star',
							),
							'iconStyle'   => array(
								'type'        => 'string',
								'description' => __( 'Icon style', 'designsetgo' ),
								'enum'        => array( 'filled', 'outlined' ),
								'default'     => 'filled',
							),
							'strokeWidth' => array(
								'type'        => 'number',
								'description' => __( 'Stroke width for outlined icons', 'designsetgo' ),
								'default'     => 1.5,
								'minimum'     => 0.5,
								'maximum'     => 5,
							),
							'iconSize'    => array(
								'type'        => 'number',
								'description' => __( 'Icon size in pixels', 'designsetgo' ),
								'default'     => 48,
								'minimum'     => 8,
								'maximum'     => 512,
							),
							'rotation'    => array(
								'type'        => 'number',
								'description' => __( 'Icon rotation in degrees (0-360)', 'designsetgo' ),
								'default'     => 0,
								'minimum'     => 0,
								'maximum'     => 360,
							),
							'linkUrl'     => array(
								'type'        => 'string',
								'description' => __( 'Optional URL to link the icon', 'designsetgo' ),
							),
							'linkTarget'  => array(
								'type'        => 'string',
								'description' => __( 'Link target', 'designsetgo' ),
								'enum'        => array( '_self', '_blank' ),
								'default'     => '_self',
							),
							'linkRel'     => array(
								'type'        => 'string',
								'description' => __( 'Link rel attribute', 'designsetgo' ),
							),
						),
					),
				)
			),
			'additionalProperties' => false,
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool
	 */
	public function check_permission_callback(): bool {
		return $this->check_permission( 'edit_posts' );
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error
	 */
	public function execute( array $input ) {
		$post_id    = (int) ( $input['post_id'] ?? 0 );
		$position   = (int) ( $input['position'] ?? -1 );
		$attributes = $input['attributes'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/icon',
			$attributes,
			array(), // Icons don't have inner blocks
			$position
		);
	}
}
