<?php
/**
 * Apply Text Reveal Ability.
 *
 * Applies scroll-triggered text reveal effect to paragraph and heading blocks.
 * Text color changes progressively from left-to-right, simulating natural reading.
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
 * Apply Text Reveal ability class.
 */
class Apply_Text_Reveal extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/apply-text-reveal';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Apply Text Reveal', 'designsetgo' ),
			'description'         => __( 'Applies scroll-triggered text color reveal effect to paragraphs and headings. Text progressively changes color as users scroll, simulating natural reading progression.', 'designsetgo' ),
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
						'description' => __( 'Block name to apply text reveal to (must be "core/paragraph" or "core/heading")', 'designsetgo' ),
						'enum'        => array( 'core/paragraph', 'core/heading' ),
					),
					'textReveal' => array(
						'type'        => 'object',
						'description' => __( 'Text reveal settings to apply', 'designsetgo' ),
						'properties'  => array(
							'enabled'            => array(
								'type'        => 'boolean',
								'description' => __( 'Enable text reveal effect', 'designsetgo' ),
								'default'     => true,
							),
							'revealColor'        => array(
								'type'        => 'string',
								'description' => __( 'Color text transitions to (hex, rgb, or theme preset)', 'designsetgo' ),
								'default'     => '#2563eb',
							),
							'splitMode'          => array(
								'type'        => 'string',
								'description' => __( 'How to split text for animation', 'designsetgo' ),
								'enum'        => array( 'word', 'character' ),
								'default'     => 'word',
							),
							'transitionDuration' => array(
								'type'        => 'integer',
								'description' => __( 'Transition duration per word/character in milliseconds', 'designsetgo' ),
								'minimum'     => 50,
								'maximum'     => 500,
								'default'     => 150,
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
		$text_reveal     = $input['textReveal'] ?? array();

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

		// Validate supported blocks.
		$supported = array( 'core/paragraph', 'core/heading' );
		if ( ! in_array( $block_name, $supported, true ) ) {
			return $this->error(
				'unsupported_block',
				__( 'Text reveal only supports paragraph and heading blocks.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Validate text reveal settings.
		if ( empty( $text_reveal ) ) {
			return $this->error(
				'missing_text_reveal',
				__( 'Text reveal settings are required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Map text reveal settings to block attributes.
		$attributes = array(
			'dsgoTextRevealEnabled'    => $text_reveal['enabled'] ?? true,
			'dsgoTextRevealColor'      => $text_reveal['revealColor'] ?? '#2563eb',
			'dsgoTextRevealSplitMode'  => $text_reveal['splitMode'] ?? 'word',
			'dsgoTextRevealTransition' => $text_reveal['transitionDuration'] ?? 150,
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
