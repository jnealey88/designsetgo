<?php
/**
 * Insert Countdown Timer Ability.
 *
 * Inserts a Countdown Timer block for displaying time remaining
 * until a specific date/time with customizable styling.
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
 * Insert Countdown Timer ability class.
 */
class Insert_Countdown_Timer extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-countdown-timer';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Countdown Timer', 'designsetgo' ),
			'description'         => __( 'Inserts a Countdown Timer block that displays time remaining until a target date. Perfect for product launches, events, sales, and deadlines.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating countdown timer...', 'designsetgo' ),
			'success_message'     => __( 'Countdown timer inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Countdown timer attributes', 'designsetgo' ),
						'properties'  => array(
							'targetDateTime'    => array(
								'type'        => 'string',
								'description' => __( 'Target date/time in ISO 8601 format (e.g., "2025-12-31T23:59:59")', 'designsetgo' ),
							),
							'timezone'          => array(
								'type'        => 'string',
								'description' => __( 'Timezone for the countdown (empty for local time)', 'designsetgo' ),
								'default'     => '',
							),
							'showDays'          => array(
								'type'        => 'boolean',
								'description' => __( 'Show days unit', 'designsetgo' ),
								'default'     => true,
							),
							'showHours'         => array(
								'type'        => 'boolean',
								'description' => __( 'Show hours unit', 'designsetgo' ),
								'default'     => true,
							),
							'showMinutes'       => array(
								'type'        => 'boolean',
								'description' => __( 'Show minutes unit', 'designsetgo' ),
								'default'     => true,
							),
							'showSeconds'       => array(
								'type'        => 'boolean',
								'description' => __( 'Show seconds unit', 'designsetgo' ),
								'default'     => true,
							),
							'layout'            => array(
								'type'        => 'string',
								'description' => __( 'Layout style', 'designsetgo' ),
								'enum'        => array( 'inline', 'compact', 'boxed' ),
								'default'     => 'boxed',
							),
							'completionAction'  => array(
								'type'        => 'string',
								'description' => __( 'Action when countdown completes', 'designsetgo' ),
								'enum'        => array( 'message', 'hide' ),
								'default'     => 'message',
							),
							'completionMessage' => array(
								'type'        => 'string',
								'description' => __( 'Message to show when countdown completes', 'designsetgo' ),
								'default'     => 'The countdown has ended!',
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
				__( 'Sorry, you are not allowed to insert countdown timers.', 'designsetgo' ),
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

		// Set default target date if not provided (7 days from now).
		if ( empty( $attributes['targetDateTime'] ) ) {
			$attributes['targetDateTime'] = gmdate( 'c', strtotime( '+7 days' ) );
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/countdown-timer',
			$attributes,
			array(),
			$position
		);
	}
}
