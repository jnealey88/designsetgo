<?php
/**
 * Apply Animation Ability.
 *
 * Applies entrance and exit animations to blocks with customizable
 * duration, delay, easing, and trigger settings.
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
 * Apply Animation ability class.
 */
class Apply_Animation extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/apply-animation';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Apply Block Animation', 'designsetgo' ),
			'description'         => __( 'Applies entrance and exit animations to any WordPress block with customizable settings for duration, delay, easing, and triggers.', 'designsetgo' ),
			'thinking_message'    => __( 'Applying animation...', 'designsetgo' ),
			'success_message'     => __( 'Animation applied successfully.', 'designsetgo' ),
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
						'description' => __( 'Block name to apply animation to (e.g., "core/paragraph", "core/heading")', 'designsetgo' ),
						'required'    => true,
					),
					'animation'  => array(
						'type'        => 'object',
						'description' => __( 'Animation settings to apply', 'designsetgo' ),
						'properties'  => array(
							'enabled'           => array(
								'type'        => 'boolean',
								'description' => __( 'Enable animation', 'designsetgo' ),
								'default'     => true,
							),
							'entranceAnimation' => array(
								'type'        => 'string',
								'description' => __( 'Entrance animation type', 'designsetgo' ),
								'enum'        => array(
									'fadeIn',
									'fadeInUp',
									'fadeInDown',
									'fadeInLeft',
									'fadeInRight',
									'slideInUp',
									'slideInDown',
									'slideInLeft',
									'slideInRight',
									'zoomIn',
									'bounceIn',
									'flipInX',
									'flipInY',
								),
							),
							'exitAnimation'     => array(
								'type'        => 'string',
								'description' => __( 'Exit animation type', 'designsetgo' ),
								'enum'        => array(
									'fadeOut',
									'fadeOutUp',
									'fadeOutDown',
									'fadeOutLeft',
									'fadeOutRight',
									'slideOutUp',
									'slideOutDown',
									'slideOutLeft',
									'slideOutRight',
									'zoomOut',
									'bounceOut',
								),
							),
							'trigger'           => array(
								'type'        => 'string',
								'description' => __( 'Animation trigger', 'designsetgo' ),
								'enum'        => array( 'scroll', 'load', 'hover', 'click' ),
								'default'     => 'scroll',
							),
							'duration'          => array(
								'type'        => 'integer',
								'description' => __( 'Animation duration in milliseconds', 'designsetgo' ),
								'enum'        => array( 300, 600, 1000, 2000 ),
								'default'     => 600,
							),
							'delay'             => array(
								'type'        => 'integer',
								'description' => __( 'Animation delay in milliseconds', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 5000,
								'default'     => 0,
							),
							'easing'            => array(
								'type'        => 'string',
								'description' => __( 'Animation easing function', 'designsetgo' ),
								'enum'        => array( 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' ),
								'default'     => 'ease-out',
							),
							'offset'            => array(
								'type'        => 'integer',
								'description' => __( 'Offset from viewport (pixels) before triggering scroll animation', 'designsetgo' ),
								'default'     => 100,
							),
							'once'              => array(
								'type'        => 'boolean',
								'description' => __( 'Animate only once (scroll animations)', 'designsetgo' ),
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
		$animation       = $input['animation'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Validate block name.
		if ( empty( $block_name ) ) {
			return $this->error(
				'missing_block_name',
				__( 'Block name is required.', 'designsetgo' )
			);
		}

		// Validate animation settings.
		if ( empty( $animation ) ) {
			return $this->error(
				'missing_animation',
				__( 'Animation settings are required.', 'designsetgo' )
			);
		}

		// Map animation settings to block attributes.
		$attributes = array(
			'dsgAnimationEnabled'  => $animation['enabled'] ?? true,
			'dsgEntranceAnimation' => $animation['entranceAnimation'] ?? '',
			'dsgExitAnimation'     => $animation['exitAnimation'] ?? '',
			'dsgAnimationTrigger'  => $animation['trigger'] ?? 'scroll',
			'dsgAnimationDuration' => $animation['duration'] ?? 600,
			'dsgAnimationDelay'    => $animation['delay'] ?? 0,
			'dsgAnimationEasing'   => $animation['easing'] ?? 'ease-out',
			'dsgAnimationOffset'   => $animation['offset'] ?? 100,
			'dsgAnimationOnce'     => $animation['once'] ?? true,
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
