<?php
/**
 * Insert Counter Ability.
 *
 * Inserts a single Counter block for displaying animated
 * number statistics with optional prefix/suffix.
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
 * Insert Counter ability class.
 */
class Insert_Counter extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-counter';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Counter', 'designsetgo' ),
			'description'         => __( 'Inserts a single Counter block that animates from a start value to an end value. Perfect for statistics, achievements, and metrics displays.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating counter...', 'designsetgo' ),
			'success_message'     => __( 'Counter inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Counter attributes', 'designsetgo' ),
						'properties'  => array(
							'startValue'       => array(
								'type'        => 'number',
								'description' => __( 'Starting value for animation', 'designsetgo' ),
								'default'     => 0,
							),
							'endValue'         => array(
								'type'        => 'number',
								'description' => __( 'Ending value for animation', 'designsetgo' ),
								'default'     => 100,
							),
							'duration'         => array(
								'type'        => 'number',
								'description' => __( 'Animation duration in seconds', 'designsetgo' ),
								'default'     => 2,
								'minimum'     => 0.5,
								'maximum'     => 10,
							),
							'prefix'           => array(
								'type'        => 'string',
								'description' => __( 'Text/symbol before the number (e.g., "$")', 'designsetgo' ),
								'default'     => '',
							),
							'suffix'           => array(
								'type'        => 'string',
								'description' => __( 'Text/symbol after the number (e.g., "+", "%", "k")', 'designsetgo' ),
								'default'     => '',
							),
							'decimals'         => array(
								'type'        => 'number',
								'description' => __( 'Number of decimal places', 'designsetgo' ),
								'default'     => 0,
								'minimum'     => 0,
								'maximum'     => 4,
							),
							'separator'        => array(
								'type'        => 'string',
								'description' => __( 'Thousands separator (e.g., ",")', 'designsetgo' ),
								'default'     => ',',
							),
							'decimalSeparator' => array(
								'type'        => 'string',
								'description' => __( 'Decimal separator (e.g., ".")', 'designsetgo' ),
								'default'     => '.',
							),
							'label'            => array(
								'type'        => 'string',
								'description' => __( 'Label text below the counter', 'designsetgo' ),
								'default'     => '',
							),
							'labelPosition'    => array(
								'type'        => 'string',
								'description' => __( 'Position of the label', 'designsetgo' ),
								'enum'        => array( 'above', 'below' ),
								'default'     => 'below',
							),
							'alignment'        => array(
								'type'        => 'string',
								'description' => __( 'Text alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right' ),
								'default'     => 'center',
							),
							'numberColor'      => array(
								'type'        => 'string',
								'description' => __( 'Number text color', 'designsetgo' ),
							),
							'labelColor'       => array(
								'type'        => 'string',
								'description' => __( 'Label text color', 'designsetgo' ),
							),
							'prefixSuffixColor' => array(
								'type'        => 'string',
								'description' => __( 'Prefix/suffix text color', 'designsetgo' ),
							),
							'animateOnScroll'  => array(
								'type'        => 'boolean',
								'description' => __( 'Trigger animation when scrolled into view', 'designsetgo' ),
								'default'     => true,
							),
							'animateOnce'      => array(
								'type'        => 'boolean',
								'description' => __( 'Only animate once (vs every time in view)', 'designsetgo' ),
								'default'     => true,
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
	 * @return bool|WP_Error
	 */
	public function check_permission_callback() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to insert counters.', 'designsetgo' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
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
			return new WP_Error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/counter',
			$attributes,
			array(),
			$position
		);
	}
}
