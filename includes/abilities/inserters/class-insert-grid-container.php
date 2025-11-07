<?php
/**
 * Insert Grid Container Ability.
 *
 * Inserts a Grid Container block with responsive column configuration
 * for desktop, tablet, and mobile devices.
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
 * Insert Grid Container ability class.
 */
class Insert_Grid_Container extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-grid-container';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'             => __( 'Insert Grid Container', 'designsetgo' ),
			'description'       => __( 'Inserts a responsive Grid Container block with customizable column counts for desktop, tablet, and mobile.', 'designsetgo' ),
			'thinking_message'  => __( 'Creating grid container...', 'designsetgo' ),
			'success_message'   => __( 'Grid container inserted successfully.', 'designsetgo' ),
			'category'          => 'blocks',
			'input_schema'      => $this->get_input_schema(),
			'output_schema'     => Block_Inserter::get_default_output_schema(),
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
			'type'       => 'object',
			'properties' => array_merge(
				$common,
				array(
					'attributes'  => array(
						'type'       => 'object',
						'description' => __( 'Grid container attributes', 'designsetgo' ),
						'properties' => array(
							'desktopColumns' => array(
								'type'        => 'integer',
								'description' => __( 'Number of columns on desktop', 'designsetgo' ),
								'default'     => 3,
								'minimum'     => 1,
								'maximum'     => 12,
							),
							'tabletColumns'  => array(
								'type'        => 'integer',
								'description' => __( 'Number of columns on tablet', 'designsetgo' ),
								'default'     => 2,
								'minimum'     => 1,
								'maximum'     => 12,
							),
							'mobileColumns'  => array(
								'type'        => 'integer',
								'description' => __( 'Number of columns on mobile', 'designsetgo' ),
								'default'     => 1,
								'minimum'     => 1,
								'maximum'     => 12,
							),
							'rowGap'         => array(
								'type'        => 'string',
								'description' => __( 'Gap between rows (e.g., "20px", "2rem")', 'designsetgo' ),
							),
							'columnGap'      => array(
								'type'        => 'string',
								'description' => __( 'Gap between columns (e.g., "20px", "2rem")', 'designsetgo' ),
							),
							'alignItems'     => array(
								'type'        => 'string',
								'description' => __( 'Vertical alignment of grid items', 'designsetgo' ),
								'enum'        => array( 'start', 'center', 'end', 'stretch' ),
								'default'     => 'start',
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
						'description' => __( 'Inner blocks to insert (grid items)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (e.g., "core/group")', 'designsetgo' ),
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
			'designsetgo/grid',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
