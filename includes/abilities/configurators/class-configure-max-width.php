<?php
/**
 * Configure Max Width Ability.
 *
 * Sets maximum width constraints on blocks with responsive
 * values for different device sizes.
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
 * Configure Max Width ability class.
 */
class Configure_Max_Width extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-max-width';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Configure Max Width', 'designsetgo' ),
			'description'         => __( 'Sets maximum width constraints on blocks. Supports responsive values for desktop, tablet, and mobile breakpoints.', 'designsetgo' ),
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
					'maxWidth'   => array(
						'type'        => 'object',
						'description' => __( 'Max width settings', 'designsetgo' ),
						'properties'  => array(
							'enabled' => array(
								'type'        => 'boolean',
								'description' => __( 'Enable max width constraint', 'designsetgo' ),
								'default'     => true,
							),
							'desktop' => array(
								'type'        => 'string',
								'description' => __( 'Max width on desktop (e.g., "800px", "50%")', 'designsetgo' ),
							),
							'tablet'  => array(
								'type'        => 'string',
								'description' => __( 'Max width on tablet', 'designsetgo' ),
							),
							'mobile'  => array(
								'type'        => 'string',
								'description' => __( 'Max width on mobile', 'designsetgo' ),
							),
							'align'   => array(
								'type'        => 'string',
								'description' => __( 'Horizontal alignment when constrained', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right' ),
								'default'     => 'center',
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
		$max_width       = $input['maxWidth'] ?? array();

		// Validate required parameters.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		if ( empty( $max_width ) ) {
			return $this->error(
				'missing_max_width',
				__( 'Max width settings are required.', 'designsetgo' )
			);
		}

		// Map max width settings to block attributes.
		$new_attributes = array();

		if ( isset( $max_width['enabled'] ) ) {
			$new_attributes['dsgoMaxWidthEnabled'] = (bool) $max_width['enabled'];
		}
		if ( ! empty( $max_width['desktop'] ) ) {
			$new_attributes['dsgoMaxWidth'] = sanitize_text_field( $max_width['desktop'] );
		}
		if ( ! empty( $max_width['tablet'] ) ) {
			$new_attributes['dsgoMaxWidthTablet'] = sanitize_text_field( $max_width['tablet'] );
		}
		if ( ! empty( $max_width['mobile'] ) ) {
			$new_attributes['dsgoMaxWidthMobile'] = sanitize_text_field( $max_width['mobile'] );
		}
		if ( ! empty( $max_width['align'] ) ) {
			$new_attributes['dsgoMaxWidthAlign'] = sanitize_text_field( $max_width['align'] );
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
