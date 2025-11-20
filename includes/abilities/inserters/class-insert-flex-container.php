<?php
/**
 * Insert Flex Container Ability.
 *
 * Inserts a Flex Container block with customizable layout settings
 * including direction, alignment, gap, and wrapping.
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
 * Insert Flex Container ability class.
 */
class Insert_Flex_Container extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-flex-container';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Flex Container', 'designsetgo' ),
			'description'         => __( 'Inserts a Flex Container block with customizable layout settings including direction, alignment, wrapping, and gap.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating flex container...', 'designsetgo' ),
			'success_message'     => __( 'Flex container inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Flex container attributes', 'designsetgo' ),
						'properties'  => array(
							'direction'      => array(
								'type'        => 'string',
								'description' => __( 'Flex direction', 'designsetgo' ),
								'enum'        => array( 'row', 'column' ),
								'default'     => 'row',
							),
							'wrap'           => array(
								'type'        => 'boolean',
								'description' => __( 'Allow wrapping to multiple lines', 'designsetgo' ),
								'default'     => true,
							),
							'justifyContent' => array(
								'type'        => 'string',
								'description' => __( 'Horizontal alignment', 'designsetgo' ),
								'enum'        => array( 'flex-start', 'center', 'flex-end', 'space-between', 'space-around' ),
								'default'     => 'flex-start',
							),
							'alignItems'     => array(
								'type'        => 'string',
								'description' => __( 'Vertical alignment', 'designsetgo' ),
								'enum'        => array( 'flex-start', 'center', 'flex-end', 'stretch' ),
								'default'     => 'center',
							),
							'mobileStack'    => array(
								'type'        => 'boolean',
								'description' => __( 'Stack items vertically on mobile', 'designsetgo' ),
								'default'     => false,
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
			'designsetgo/row',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
