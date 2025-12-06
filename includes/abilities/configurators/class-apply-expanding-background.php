<?php
/**
 * Apply Expanding Background Ability.
 *
 * Applies scroll-driven expanding background effect to Group and Section blocks.
 * A small blurred circle expands to fill the entire section as users scroll.
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
 * Apply Expanding Background ability class.
 */
class Apply_Expanding_Background extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/apply-expanding-background';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Apply Expanding Background', 'designsetgo' ),
			'description'         => __( 'Applies scroll-driven expanding background effect to Group and Section blocks. A small blurred circle expands from the center to fill the entire section with color as users scroll.', 'designsetgo' ),
			'thinking_message'    => __( 'Applying expanding background...', 'designsetgo' ),
			'success_message'     => __( 'Expanding background applied successfully.', 'designsetgo' ),
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
					'block_name'          => array(
						'type'        => 'string',
						'description' => __( 'Block name to apply expanding background to (must be "core/group" or "designsetgo/section")', 'designsetgo' ),
						'enum'        => array( 'core/group', 'designsetgo/section' ),
						'required'    => true,
					),
					'expandingBackground' => array(
						'type'        => 'object',
						'description' => __( 'Expanding background settings to apply', 'designsetgo' ),
						'properties'  => array(
							'enabled'         => array(
								'type'        => 'boolean',
								'description' => __( 'Enable expanding background effect', 'designsetgo' ),
								'default'     => true,
							),
							'color'           => array(
								'type'        => 'string',
								'description' => __( 'Background color (hex, rgb, or theme preset)', 'designsetgo' ),
								'default'     => '#e8e8e8',
							),
							'initialSize'     => array(
								'type'        => 'integer',
								'description' => __( 'Initial circle radius in pixels (20-300)', 'designsetgo' ),
								'minimum'     => 20,
								'maximum'     => 300,
								'default'     => 50,
							),
							'blur'            => array(
								'type'        => 'integer',
								'description' => __( 'Initial blur amount in pixels (0-50)', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 50,
								'default'     => 30,
							),
							'speed'           => array(
								'type'        => 'number',
								'description' => __( 'Animation speed multiplier (0.5-2)', 'designsetgo' ),
								'minimum'     => 0.5,
								'maximum'     => 2,
								'default'     => 1,
							),
							'triggerOffset'   => array(
								'type'        => 'integer',
								'description' => __( 'Scroll offset percentage before effect starts (0-100)', 'designsetgo' ),
								'minimum'     => 0,
								'maximum'     => 100,
								'default'     => 0,
							),
							'completionPoint' => array(
								'type'        => 'integer',
								'description' => __( 'Scroll percentage where effect reaches 100% (50-100)', 'designsetgo' ),
								'minimum'     => 50,
								'maximum'     => 100,
								'default'     => 80,
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
		$post_id              = (int) ( $input['post_id'] ?? 0 );
		$block_name           = $input['block_name'] ?? '';
		$block_client_id      = $input['block_client_id'] ?? null;
		$update_all           = (bool) ( $input['update_all'] ?? false );
		$expanding_background = $input['expandingBackground'] ?? array();

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

		// Validate supported blocks.
		$supported = array( 'core/group', 'designsetgo/section' );
		if ( ! in_array( $block_name, $supported, true ) ) {
			return $this->error(
				'unsupported_block',
				__( 'Expanding background only supports Group and Section blocks.', 'designsetgo' )
			);
		}

		// Validate expanding background settings.
		if ( empty( $expanding_background ) ) {
			return $this->error(
				'missing_expanding_background',
				__( 'Expanding background settings are required.', 'designsetgo' )
			);
		}

		// Map expanding background settings to block attributes.
		$attributes = array(
			'dsgoExpandingBgEnabled'         => $expanding_background['enabled'] ?? true,
			'dsgoExpandingBgColor'           => $expanding_background['color'] ?? '#e8e8e8',
			'dsgoExpandingBgInitialSize'     => $expanding_background['initialSize'] ?? 50,
			'dsgoExpandingBgBlur'            => $expanding_background['blur'] ?? 30,
			'dsgoExpandingBgSpeed'           => $expanding_background['speed'] ?? 1,
			'dsgoExpandingBgTriggerOffset'   => $expanding_background['triggerOffset'] ?? 0,
			'dsgoExpandingBgCompletionPoint' => $expanding_background['completionPoint'] ?? 80,
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
