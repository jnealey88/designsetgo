<?php
/**
 * Insert Counter Group Ability.
 *
 * Inserts a Counter Group block container for displaying multiple
 * animated counters with shared settings.
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
 * Insert Counter Group ability class.
 */
class Insert_Counter_Group extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-counter-group';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Counter Group', 'designsetgo' ),
			'description'         => __( 'Inserts a Counter Group container for displaying animated statistics. Add Counter blocks as inner blocks to display multiple stats.', 'designsetgo' ),
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
						'description' => __( 'Counter group attributes', 'designsetgo' ),
						'properties'  => array(
							'columns'           => array(
								'type'        => 'number',
								'description' => __( 'Number of columns on desktop', 'designsetgo' ),
								'default'     => 3,
								'minimum'     => 1,
								'maximum'     => 6,
							),
							'columnsTablet'     => array(
								'type'        => 'number',
								'description' => __( 'Number of columns on tablet', 'designsetgo' ),
								'default'     => 2,
								'minimum'     => 1,
								'maximum'     => 4,
							),
							'columnsMobile'     => array(
								'type'        => 'number',
								'description' => __( 'Number of columns on mobile', 'designsetgo' ),
								'default'     => 1,
								'minimum'     => 1,
								'maximum'     => 2,
							),
							'gap'               => array(
								'type'        => 'string',
								'description' => __( 'Gap between counters (e.g., "32px")', 'designsetgo' ),
								'default'     => '32px',
							),
							'alignContent'      => array(
								'type'        => 'string',
								'description' => __( 'Content alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right' ),
								'default'     => 'center',
							),
							'animationDuration' => array(
								'type'        => 'number',
								'description' => __( 'Animation duration in seconds', 'designsetgo' ),
								'default'     => 2,
								'minimum'     => 0.5,
								'maximum'     => 10,
							),
							'animationDelay'    => array(
								'type'        => 'number',
								'description' => __( 'Animation delay in seconds', 'designsetgo' ),
								'default'     => 0,
								'minimum'     => 0,
								'maximum'     => 5,
							),
							'animationEasing'   => array(
								'type'        => 'string',
								'description' => __( 'Animation easing function', 'designsetgo' ),
								'enum'        => array( 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad' ),
								'default'     => 'easeOutQuad',
							),
							'useGrouping'       => array(
								'type'        => 'boolean',
								'description' => __( 'Use thousands separator', 'designsetgo' ),
								'default'     => true,
							),
							'separator'         => array(
								'type'        => 'string',
								'description' => __( 'Thousands separator character', 'designsetgo' ),
								'default'     => ',',
							),
							'decimal'           => array(
								'type'        => 'string',
								'description' => __( 'Decimal separator character', 'designsetgo' ),
								'default'     => '.',
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Counter blocks to insert (typically designsetgo/counter)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'       => array(
									'type'        => 'string',
									'description' => __( 'Block name (e.g., "designsetgo/counter")', 'designsetgo' ),
								),
								'attributes' => array(
									'type'        => 'object',
									'description' => __( 'Block attributes', 'designsetgo' ),
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
			'designsetgo/counter-group',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
