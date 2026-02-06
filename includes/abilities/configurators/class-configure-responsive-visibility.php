<?php
/**
 * Configure Responsive Visibility Ability.
 *
 * Controls block visibility across different device breakpoints
 * (desktop, tablet, mobile).
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
 * Configure Responsive Visibility ability class.
 */
class Configure_Responsive_Visibility extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-responsive-visibility';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Configure Responsive Visibility', 'designsetgo' ),
			'description'         => __( 'Controls block visibility across different device sizes. Hide or show blocks on desktop, tablet, and mobile breakpoints.', 'designsetgo' ),
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
					'block_name' => array(
						'type'        => 'string',
						'description' => __( 'Block type to configure (any block type supported)', 'designsetgo' ),
					),
					'visibility' => array(
						'type'        => 'object',
						'description' => __( 'Visibility settings per device', 'designsetgo' ),
						'properties'  => array(
							'hideOnDesktop' => array(
								'type'        => 'boolean',
								'description' => __( 'Hide block on desktop devices', 'designsetgo' ),
								'default'     => false,
							),
							'hideOnTablet'  => array(
								'type'        => 'boolean',
								'description' => __( 'Hide block on tablet devices', 'designsetgo' ),
								'default'     => false,
							),
							'hideOnMobile'  => array(
								'type'        => 'boolean',
								'description' => __( 'Hide block on mobile devices', 'designsetgo' ),
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
		$post_id         = (int) ( $input['post_id'] ?? 0 );
		$block_client_id = $input['block_client_id'] ?? null;
		$update_all      = (bool) ( $input['update_all'] ?? false );
		$block_name      = $input['block_name'] ?? '';
		$visibility      = $input['visibility'] ?? array();

		// Validate required parameters.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		if ( empty( $visibility ) ) {
			return $this->error(
				'missing_visibility',
				__( 'Visibility settings are required.', 'designsetgo' )
			);
		}

		// Map visibility settings to block attributes.
		$new_attributes = array();

		if ( isset( $visibility['hideOnDesktop'] ) ) {
			$new_attributes['dsgoHideOnDesktop'] = (bool) $visibility['hideOnDesktop'];
		}
		if ( isset( $visibility['hideOnTablet'] ) ) {
			$new_attributes['dsgoHideOnTablet'] = (bool) $visibility['hideOnTablet'];
		}
		if ( isset( $visibility['hideOnMobile'] ) ) {
			$new_attributes['dsgoHideOnMobile'] = (bool) $visibility['hideOnMobile'];
		}

		// Apply the configuration.
		return Block_Configurator::configure_block(
			$post_id,
			$block_name,
			$new_attributes,
			$block_client_id,
			$update_all
		);
	}
}
