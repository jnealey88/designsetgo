<?php
/**
 * Insert Progress Bar Ability.
 *
 * Inserts a Progress Bar block for displaying progress or statistics
 * with customizable styling and animation.
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
 * Insert Progress Bar ability class.
 */
class Insert_Progress_Bar extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-progress-bar';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Progress Bar', 'designsetgo' ),
			'description'         => __( 'Inserts a Progress Bar block for displaying progress, statistics, or skills with customizable colors, labels, and animations.', 'designsetgo' ),
			'thinking_message'    => __( 'Inserting progress bar...', 'designsetgo' ),
			'success_message'     => __( 'Progress bar inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Progress bar attributes', 'designsetgo' ),
						'properties'  => array(
							'percentage'         => array(
								'type'        => 'number',
								'description' => __( 'Progress percentage (0-100)', 'designsetgo' ),
								'default'     => 75,
								'minimum'     => 0,
								'maximum'     => 100,
							),
							'labelText'          => array(
								'type'        => 'string',
								'description' => __( 'Label text (e.g., "Project Completion")', 'designsetgo' ),
							),
							'showLabel'          => array(
								'type'        => 'boolean',
								'description' => __( 'Show label text', 'designsetgo' ),
								'default'     => true,
							),
							'showPercentage'     => array(
								'type'        => 'boolean',
								'description' => __( 'Show percentage value', 'designsetgo' ),
								'default'     => true,
							),
							'labelPosition'      => array(
								'type'        => 'string',
								'description' => __( 'Label position', 'designsetgo' ),
								'enum'        => array( 'top', 'bottom', 'left', 'right' ),
								'default'     => 'top',
							),
							'height'             => array(
								'type'        => 'string',
								'description' => __( 'Bar height (e.g., "20px")', 'designsetgo' ),
								'default'     => '20px',
							),
							'borderRadius'       => array(
								'type'        => 'string',
								'description' => __( 'Border radius (e.g., "4px")', 'designsetgo' ),
								'default'     => '4px',
							),
							'barColor'           => array(
								'type'        => 'string',
								'description' => __( 'Progress bar color', 'designsetgo' ),
							),
							'barBackgroundColor' => array(
								'type'        => 'string',
								'description' => __( 'Bar background color', 'designsetgo' ),
							),
							'barStyle'           => array(
								'type'        => 'string',
								'description' => __( 'Bar style', 'designsetgo' ),
								'enum'        => array( 'solid', 'gradient', 'striped' ),
								'default'     => 'solid',
							),
							'animateOnScroll'    => array(
								'type'        => 'boolean',
								'description' => __( 'Animate when scrolled into view', 'designsetgo' ),
								'default'     => true,
							),
							'animationDuration'  => array(
								'type'        => 'number',
								'description' => __( 'Animation duration in seconds', 'designsetgo' ),
								'default'     => 1.5,
								'minimum'     => 0.1,
								'maximum'     => 5,
							),
							'stripedAnimation'   => array(
								'type'        => 'boolean',
								'description' => __( 'Animate striped pattern', 'designsetgo' ),
								'default'     => false,
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
			'designsetgo/progress-bar',
			$attributes,
			array(),
			$position
		);
	}
}
