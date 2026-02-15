<?php
/**
 * Apply Scroll Parallax Ability.
 *
 * Applies Elementor-style vertical scroll parallax effects to blocks
 * with customizable direction, speed, viewport range, and device toggles.
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
 * Apply Scroll Parallax ability class.
 */
class Apply_Scroll_Parallax extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/apply-scroll-parallax';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Apply Scroll Parallax', 'designsetgo' ),
			'description'         => __( 'Applies Elementor-style vertical scroll parallax effects to container and visual blocks. Elements move at different speeds relative to page scroll, creating depth and visual interest.', 'designsetgo' ),
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
						'description' => __( 'Block name to apply parallax to (e.g., "core/group", "core/image", "designsetgo/section")', 'designsetgo' ),
					),
					'parallax'   => array(
						'type'        => 'object',
						'description' => __( 'Parallax settings to apply', 'designsetgo' ),
						'properties'  => array(
							'enabled'       => array(
								'type'        => 'boolean',
								'description' => __( 'Enable parallax effect', 'designsetgo' ),
								'default'     => true,
							),
							'direction'     => array(
								'type'        => 'string',
								'description' => __( 'Direction element moves while scrolling down', 'designsetgo' ),
								'enum'        => array( 'up', 'down', 'left', 'right' ),
								'default'     => 'up',
							),
							'speed'         => array(
								'type'        => 'number',
								'description' => __( 'Movement speed (0-10 scale, max 200px movement)', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 10,
								'default'     => 5,
							),
							'viewportStart' => array(
								'type'        => 'number',
								'description' => __( 'Viewport position where effect starts (0-100%)', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 100,
								'default'     => 0,
							),
							'viewportEnd'   => array(
								'type'        => 'number',
								'description' => __( 'Viewport position where effect ends (0-100%)', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 100,
								'default'     => 100,
							),
							'relativeTo'    => array(
								'type'        => 'string',
								'description' => __( 'Calculate scroll position relative to', 'designsetgo' ),
								'enum'        => array( 'viewport', 'page' ),
								'default'     => 'viewport',
							),
							'enableDesktop' => array(
								'type'        => 'boolean',
								'description' => __( 'Enable on desktop (>1024px)', 'designsetgo' ),
								'default'     => true,
							),
							'enableTablet'  => array(
								'type'        => 'boolean',
								'description' => __( 'Enable on tablet (768-1024px)', 'designsetgo' ),
								'default'     => true,
							),
							'enableMobile'      => array(
								'type'        => 'boolean',
								'description' => __( 'Enable on mobile (<768px)', 'designsetgo' ),
								'default'     => false,
							),
							'rotateEnabled'     => array(
								'type'        => 'boolean',
								'description' => __( 'Enable scroll-driven rotation', 'designsetgo' ),
								'default'     => false,
							),
							'rotateDirection'   => array(
								'type'        => 'string',
								'description' => __( 'Rotation direction while scrolling down', 'designsetgo' ),
								'enum'        => array( 'cw', 'ccw' ),
								'default'     => 'cw',
							),
							'rotateSpeed'       => array(
								'type'        => 'number',
								'description' => __( 'Rotation speed (0-10 scale, speed 10 = 360° full rotation)', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 10,
								'default'     => 3,
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
		$block_name      = $input['block_name'] ?? '';
		$block_client_id = $input['block_client_id'] ?? null;
		$update_all      = (bool) ( $input['update_all'] ?? false );
		$parallax        = $input['parallax'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Validate block name.
		if ( empty( $block_name ) ) {
			return $this->error(
				'missing_block_name',
				__( 'Block name is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Validate parallax settings.
		if ( empty( $parallax ) ) {
			return $this->error(
				'missing_parallax',
				__( 'Parallax settings are required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Map parallax settings to block attributes.
		$attributes = array(
			'dsgoParallaxEnabled'       => $parallax['enabled'] ?? true,
			'dsgoParallaxDirection'     => $parallax['direction'] ?? 'up',
			'dsgoParallaxSpeed'         => $parallax['speed'] ?? 5,
			'dsgoParallaxViewportStart' => $parallax['viewportStart'] ?? 0,
			'dsgoParallaxViewportEnd'   => $parallax['viewportEnd'] ?? 100,
			'dsgoParallaxRelativeTo'    => $parallax['relativeTo'] ?? 'viewport',
			'dsgoParallaxDesktop'       => $parallax['enableDesktop'] ?? true,
			'dsgoParallaxTablet'        => $parallax['enableTablet'] ?? true,
			'dsgoParallaxMobile'            => $parallax['enableMobile'] ?? false,
			'dsgoParallaxRotateEnabled'     => $parallax['rotateEnabled'] ?? false,
			'dsgoParallaxRotateDirection'   => $parallax['rotateDirection'] ?? 'cw',
			'dsgoParallaxRotateSpeed'       => $parallax['rotateSpeed'] ?? 3,
		);

		// Sanitize attributes.
		$attributes = Block_Configurator::sanitize_attributes( $attributes );

		// Update block attributes.
		return Block_Configurator::update_block_attributes(
			$post_id,
			$block_name,
			$attributes,
			$block_client_id,
			$update_all
		);
	}
}
