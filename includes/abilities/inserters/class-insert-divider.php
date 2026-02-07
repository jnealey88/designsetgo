<?php
/**
 * Insert Divider Ability.
 *
 * Inserts a Divider block for visual separation between content
 * with customizable styles, widths, and decorative elements.
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
 * Insert Divider ability class.
 */
class Insert_Divider extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-divider';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Divider', 'designsetgo' ),
			'description'         => __( 'Inserts a Divider block for visual separation between content sections. Supports various styles including solid, dashed, dotted, and decorative options.', 'designsetgo' ),
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
						'description' => __( 'Divider attributes', 'designsetgo' ),
						'properties'  => array(
							'style'        => array(
								'type'        => 'string',
								'description' => __( 'Divider line style', 'designsetgo' ),
								'enum'        => array( 'solid', 'dashed', 'dotted', 'double', 'gradient' ),
								'default'     => 'solid',
							),
							'width'        => array(
								'type'        => 'string',
								'description' => __( 'Divider width (e.g., "100%", "50%", "200px")', 'designsetgo' ),
								'default'     => '100%',
							),
							'thickness'    => array(
								'type'        => 'string',
								'description' => __( 'Line thickness (e.g., "1px", "3px")', 'designsetgo' ),
								'default'     => '1px',
							),
							'color'        => array(
								'type'        => 'string',
								'description' => __( 'Divider color', 'designsetgo' ),
							),
							'alignment'    => array(
								'type'        => 'string',
								'description' => __( 'Horizontal alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right' ),
								'default'     => 'center',
							),
							'marginTop'    => array(
								'type'        => 'string',
								'description' => __( 'Top margin spacing', 'designsetgo' ),
							),
							'marginBottom' => array(
								'type'        => 'string',
								'description' => __( 'Bottom margin spacing', 'designsetgo' ),
							),
							'showIcon'     => array(
								'type'        => 'boolean',
								'description' => __( 'Show decorative icon in center', 'designsetgo' ),
								'default'     => false,
							),
							'iconName'     => array(
								'type'        => 'string',
								'description' => __( 'Icon name from Lucide icon set', 'designsetgo' ),
								'default'     => 'star',
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
			'designsetgo/divider',
			$attributes,
			array(),
			$position
		);
	}
}
