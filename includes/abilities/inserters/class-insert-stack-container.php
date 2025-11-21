<?php
/**
 * Insert Stack Container Ability.
 *
 * Inserts a Stack Container block for vertical stacking layouts
 * with consistent gaps between elements.
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
 * Insert Stack Container ability class.
 */
class Insert_Stack_Container extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-stack-container';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Stack Container', 'designsetgo' ),
			'description'         => __( 'Inserts a Stack Container block for simple vertical stacking with consistent gaps. Perfect for sections and content areas.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating stack container...', 'designsetgo' ),
			'success_message'     => __( 'Stack container inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Stack container attributes', 'designsetgo' ),
						'properties'  => array(
							'alignItems'     => array(
								'type'        => 'string',
								'description' => __( 'Horizontal alignment of items', 'designsetgo' ),
								'enum'        => array( 'flex-start', 'center', 'flex-end', 'stretch' ),
								'default'     => 'flex-start',
							),
							'textAlign'      => array(
								'type'        => 'string',
								'description' => __( 'Text alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right' ),
							),
							'constrainWidth' => array(
								'type'        => 'boolean',
								'description' => __( 'Constrain to content width', 'designsetgo' ),
								'default'     => true,
							),
							'contentWidth'   => array(
								'type'        => 'string',
								'description' => __( 'Maximum content width (e.g., "1200px")', 'designsetgo' ),
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Inner blocks to insert', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (e.g., "core/paragraph")', 'designsetgo' ),
								),
								'attributes'  => array(
									'type'        => 'object',
									'description' => __( 'Block attributes', 'designsetgo' ),
								),
								'innerBlocks' => array(
									'type'        => 'array',
									'description' => __( 'Nested inner blocks', 'designsetgo' ),
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
			'designsetgo/section',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
