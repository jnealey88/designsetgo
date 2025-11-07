<?php
/**
 * Insert Reveal Ability.
 *
 * Inserts a Reveal container that reveals hidden content on hover.
 * Perfect for interactive content reveals and hover effects.
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
 * Insert Reveal ability class.
 */
class Insert_Reveal extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-reveal';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'             => __( 'Insert Reveal', 'designsetgo' ),
			'description'       => __( 'Inserts a Reveal container that reveals hidden content on hover. Perfect for interactive content reveals and hover effects.', 'designsetgo' ),
			'thinking_message'  => __( 'Creating reveal container...', 'designsetgo' ),
			'success_message'   => __( 'Reveal container inserted successfully.', 'designsetgo' ),
			'category'          => 'blocks',
			'input_schema'      => $this->get_input_schema(),
			'output_schema'     => Block_Inserter::get_default_output_schema(),
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
			'type'       => 'object',
			'properties' => array_merge(
				$common,
				array(
					'attributes'  => array(
						'type'       => 'object',
						'description' => __( 'Reveal container attributes', 'designsetgo' ),
						'properties' => array(
							'revealAnimation' => array(
								'type'        => 'string',
								'description' => __( 'Reveal animation effect', 'designsetgo' ),
								'enum'        => array( 'fade', 'slide-up', 'slide-down', 'zoom' ),
								'default'     => 'fade',
							),
							'revealDuration'  => array(
								'type'        => 'number',
								'description' => __( 'Animation duration in milliseconds', 'designsetgo' ),
								'default'     => 300,
								'minimum'     => 0,
								'maximum'     => 2000,
							),
							'isRevealContainer' => array(
								'type'        => 'boolean',
								'description' => __( 'Whether this is a reveal container', 'designsetgo' ),
								'default'     => true,
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Content blocks to be revealed on hover', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'       => array(
									'type'        => 'string',
									'description' => __( 'Block name (any WordPress core block or DesignSetGo block)', 'designsetgo' ),
								),
								'attributes' => array(
									'type'        => 'object',
									'description' => __( 'Block attributes', 'designsetgo' ),
								),
								'innerBlocks' => array(
									'type'        => 'array',
									'description' => __( 'Nested blocks', 'designsetgo' ),
								),
							),
							'required'   => array( 'name' ),
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
		$post_id      = (int) ( $input['post_id'] ?? 0 );
		$position     = (int) ( $input['position'] ?? -1 );
		$attributes   = $input['attributes'] ?? array();
		$inner_blocks = $input['innerBlocks'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Validate inner blocks if provided.
		if ( ! empty( $inner_blocks ) ) {
			$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
			if ( is_wp_error( $validation ) ) {
				return $validation;
			}
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/reveal',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
