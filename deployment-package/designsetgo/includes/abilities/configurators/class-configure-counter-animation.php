<?php
/**
 * Configure Counter Animation Ability.
 *
 * Updates animation settings for Counter blocks including duration,
 * delay, easing, and display options.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Configurators;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Configurator;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Configure Counter Animation ability class.
 */
class Configure_Counter_Animation extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-counter-animation';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Configure Counter Animation', 'designsetgo' ),
			'description'         => __( 'Updates animation settings for Counter blocks including start/end values, duration, delay, decimals, and prefix/suffix.', 'designsetgo' ),
			'thinking_message'    => __( 'Updating counter animation...', 'designsetgo' ),
			'success_message'     => __( 'Counter animation updated successfully.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Configurator::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common = Block_Configurator::get_common_input_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'settings' => array(
						'type'        => 'object',
						'description' => __( 'Counter animation settings to update', 'designsetgo' ),
						'properties'  => array(
							'startValue'        => array(
								'type'        => 'number',
								'description' => __( 'Starting value of the counter', 'designsetgo' ),
							),
							'endValue'          => array(
								'type'        => 'number',
								'description' => __( 'Ending value of the counter', 'designsetgo' ),
							),
							'decimals'          => array(
								'type'        => 'integer',
								'description' => __( 'Number of decimal places', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 10,
							),
							'prefix'            => array(
								'type'        => 'string',
								'description' => __( 'Prefix text (e.g., "$")', 'designsetgo' ),
							),
							'suffix'            => array(
								'type'        => 'string',
								'description' => __( 'Suffix text (e.g., "+", "%")', 'designsetgo' ),
							),
							'label'             => array(
								'type'        => 'string',
								'description' => __( 'Counter label text', 'designsetgo' ),
							),
							'overrideAnimation' => array(
								'type'        => 'boolean',
								'description' => __( 'Override group animation settings', 'designsetgo' ),
							),
							'customDuration'    => array(
								'type'        => 'number',
								'description' => __( 'Animation duration in seconds', 'designsetgo' ),
								'minimum'     => 0.1,
								'maximum'     => 10,
							),
							'customDelay'       => array(
								'type'        => 'number',
								'description' => __( 'Animation delay in seconds', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 10,
							),
							'customEasing'      => array(
								'type'        => 'string',
								'description' => __( 'Animation easing function', 'designsetgo' ),
								'enum'        => array( 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic' ),
							),
							'showIcon'          => array(
								'type'        => 'boolean',
								'description' => __( 'Show icon with counter', 'designsetgo' ),
							),
							'icon'              => array(
								'type'        => 'string',
								'description' => __( 'Icon name', 'designsetgo' ),
							),
							'iconPosition'      => array(
								'type'        => 'string',
								'description' => __( 'Icon position', 'designsetgo' ),
								'enum'        => array( 'top', 'left', 'right' ),
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
		$post_id         = (int) ( $input['post_id'] ?? 0 );
		$block_client_id = $input['block_client_id'] ?? null;
		$update_all      = (bool) ( $input['update_all'] ?? false );
		$settings        = $input['settings'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Validate settings.
		if ( empty( $settings ) ) {
			return $this->error(
				'missing_settings',
				__( 'Settings are required.', 'designsetgo' )
			);
		}

		// Sanitize settings.
		$settings = Block_Configurator::sanitize_attributes( $settings );

		// Update block attributes.
		return Block_Configurator::update_block_attributes(
			$post_id,
			'designsetgo/counter',
			$settings,
			$block_client_id,
			$update_all
		);
	}
}
