<?php
/**
 * Insert Icon List Ability.
 *
 * Inserts an Icon List container for creating lists with icons, titles, and descriptions.
 * Perfect for features, benefits, services lists.
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
 * Insert Icon List ability class.
 */
class Insert_Icon_List extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-icon-list';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Icon List', 'designsetgo' ),
			'description'         => __( 'Inserts an Icon List container for creating lists with icons, titles, and descriptions. Perfect for features, benefits, and services.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating icon list...', 'designsetgo' ),
			'success_message'     => __( 'Icon list inserted successfully.', 'designsetgo' ),
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
					'attributes'  => array(
						'type'        => 'object',
						'description' => __( 'Icon List attributes', 'designsetgo' ),
						'properties'  => array(
							'layout'       => array(
								'type'        => 'string',
								'description' => __( 'List layout', 'designsetgo' ),
								'enum'        => array( 'vertical', 'horizontal', 'grid' ),
								'default'     => 'vertical',
							),
							'iconSize'     => array(
								'type'        => 'number',
								'description' => __( 'Icon size in pixels', 'designsetgo' ),
								'default'     => 32,
								'minimum'     => 16,
								'maximum'     => 128,
							),
							'iconColor'    => array(
								'type'        => 'string',
								'description' => __( 'Icon color (hex code)', 'designsetgo' ),
								'default'     => '',
							),
							'gap'          => array(
								'type'        => 'string',
								'description' => __( 'Gap between list items (e.g., "24px")', 'designsetgo' ),
								'default'     => '24px',
							),
							'iconPosition' => array(
								'type'        => 'string',
								'description' => __( 'Icon position relative to content', 'designsetgo' ),
								'enum'        => array( 'left', 'top' ),
								'default'     => 'left',
							),
							'columns'      => array(
								'type'        => 'number',
								'description' => __( 'Number of columns (for grid layout)', 'designsetgo' ),
								'default'     => 1,
								'minimum'     => 1,
								'maximum'     => 6,
							),
							'alignment'    => array(
								'type'        => 'string',
								'description' => __( 'List alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right' ),
								'default'     => 'left',
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Icon list item blocks (designsetgo/icon-list-item)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (should be "designsetgo/icon-list-item")', 'designsetgo' ),
									'default'     => 'designsetgo/icon-list-item',
								),
								'attributes'  => array(
									'type'        => 'object',
									'description' => __( 'Icon list item attributes', 'designsetgo' ),
									'properties'  => array(
										'icon'       => array(
											'type'        => 'string',
											'description' => __( 'Icon name (e.g., "star", "check", "rocket")', 'designsetgo' ),
											'default'     => 'star',
										),
										'linkUrl'    => array(
											'type'        => 'string',
											'description' => __( 'Optional URL to link the item', 'designsetgo' ),
										),
										'linkTarget' => array(
											'type'        => 'string',
											'description' => __( 'Link target', 'designsetgo' ),
											'enum'        => array( '_self', '_blank' ),
											'default'     => '_self',
										),
										'linkRel'    => array(
											'type'        => 'string',
											'description' => __( 'Link rel attribute', 'designsetgo' ),
										),
									),
								),
								'innerBlocks' => array(
									'type'        => 'array',
									'description' => __( 'Content blocks for this icon list item (typically heading and paragraph)', 'designsetgo' ),
								),
							),
							'required'   => array( 'name' ),
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
		$post_id      = (int) ( $input['post_id'] ?? 0 );
		$position     = (int) ( $input['position'] ?? -1 );
		$attributes   = $input['attributes'] ?? array();
		$inner_blocks = $input['innerBlocks'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Validate inner blocks if provided.
		if ( ! empty( $inner_blocks ) ) {
			$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
			if ( is_wp_error( $validation ) ) {
				return $validation;
			}
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/icon-list',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
