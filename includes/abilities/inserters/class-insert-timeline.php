<?php
/**
 * Insert Timeline Ability.
 *
 * Inserts a Timeline block container for displaying chronological events,
 * company history, or process steps in a visual timeline format.
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
 * Insert Timeline ability class.
 */
class Insert_Timeline extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-timeline';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Timeline', 'designsetgo' ),
			'description'         => __( 'Inserts a Timeline block for displaying chronological events, company history, product roadmaps, or process steps with customizable layouts and scroll animations.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating timeline...', 'designsetgo' ),
			'success_message'     => __( 'Timeline inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Timeline attributes', 'designsetgo' ),
						'properties'  => array(
							'orientation'       => array(
								'type'        => 'string',
								'description' => __( 'Timeline orientation', 'designsetgo' ),
								'enum'        => array( 'vertical', 'horizontal' ),
								'default'     => 'vertical',
							),
							'layout'            => array(
								'type'        => 'string',
								'description' => __( 'Content layout for vertical timeline', 'designsetgo' ),
								'enum'        => array( 'alternating', 'left', 'right' ),
								'default'     => 'alternating',
							),
							'lineColor'         => array(
								'type'        => 'string',
								'description' => __( 'Timeline line color (CSS color value)', 'designsetgo' ),
							),
							'lineThickness'     => array(
								'type'        => 'integer',
								'description' => __( 'Timeline line thickness in pixels', 'designsetgo' ),
								'default'     => 2,
								'minimum'     => 1,
								'maximum'     => 8,
							),
							'connectorStyle'    => array(
								'type'        => 'string',
								'description' => __( 'Line connector style', 'designsetgo' ),
								'enum'        => array( 'solid', 'dashed', 'dotted' ),
								'default'     => 'solid',
							),
							'markerStyle'       => array(
								'type'        => 'string',
								'description' => __( 'Marker shape for timeline items', 'designsetgo' ),
								'enum'        => array( 'circle', 'square', 'diamond' ),
								'default'     => 'circle',
							),
							'markerSize'        => array(
								'type'        => 'integer',
								'description' => __( 'Marker size in pixels', 'designsetgo' ),
								'default'     => 16,
								'minimum'     => 8,
								'maximum'     => 48,
							),
							'markerColor'       => array(
								'type'        => 'string',
								'description' => __( 'Marker fill color (CSS color value)', 'designsetgo' ),
							),
							'markerBorderColor' => array(
								'type'        => 'string',
								'description' => __( 'Marker border color (CSS color value)', 'designsetgo' ),
							),
							'itemSpacing'       => array(
								'type'        => 'string',
								'description' => __( 'Spacing between timeline items (e.g., "2rem")', 'designsetgo' ),
								'default'     => '2rem',
							),
							'animateOnScroll'   => array(
								'type'        => 'boolean',
								'description' => __( 'Enable scroll-triggered animations', 'designsetgo' ),
								'default'     => true,
							),
							'animationDuration' => array(
								'type'        => 'integer',
								'description' => __( 'Animation duration in milliseconds', 'designsetgo' ),
								'default'     => 600,
							),
							'staggerDelay'      => array(
								'type'        => 'integer',
								'description' => __( 'Delay between each item animation in milliseconds', 'designsetgo' ),
								'default'     => 100,
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Timeline item blocks (designsetgo/timeline-item)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (should be "designsetgo/timeline-item")', 'designsetgo' ),
									'default'     => 'designsetgo/timeline-item',
								),
								'attributes'  => array(
									'type'        => 'object',
									'description' => __( 'Timeline item attributes', 'designsetgo' ),
									'properties'  => array(
										'date'     => array(
											'type'        => 'string',
											'description' => __( 'Date or label for the timeline item', 'designsetgo' ),
										),
										'title'    => array(
											'type'        => 'string',
											'description' => __( 'Timeline item title/heading', 'designsetgo' ),
										),
										'isActive' => array(
											'type'        => 'boolean',
											'description' => __( 'Whether this item is highlighted as active/current', 'designsetgo' ),
											'default'     => false,
										),
										'linkUrl'  => array(
											'type'        => 'string',
											'description' => __( 'Optional link URL for this item', 'designsetgo' ),
										),
									),
								),
								'innerBlocks' => array(
									'type'        => 'array',
									'description' => __( 'Content blocks for this timeline item', 'designsetgo' ),
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
			'designsetgo/timeline',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
