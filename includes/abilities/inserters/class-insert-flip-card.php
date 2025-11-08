<?php
/**
 * Insert Flip Card Ability.
 *
 * Inserts a Flip Card with interactive front and back sides.
 * Perfect for team profiles, product showcases, and feature highlights.
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
 * Insert Flip Card ability class.
 */
class Insert_Flip_Card extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-flip-card';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Flip Card', 'designsetgo' ),
			'description'         => __( 'Inserts an interactive Flip Card that reveals content on the back. Perfect for team profiles, product showcases, and feature highlights.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating flip card...', 'designsetgo' ),
			'success_message'     => __( 'Flip card inserted successfully.', 'designsetgo' ),
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
					'attributes'  => array(
						'type'        => 'object',
						'description' => __( 'Flip Card attributes', 'designsetgo' ),
						'properties'  => array(
							'flipTrigger'   => array(
								'type'        => 'string',
								'description' => __( 'How to trigger the flip', 'designsetgo' ),
								'enum'        => array( 'hover', 'click' ),
								'default'     => 'hover',
							),
							'flipEffect'    => array(
								'type'        => 'string',
								'description' => __( 'Flip animation effect', 'designsetgo' ),
								'enum'        => array( 'flip', 'fade', 'slide', 'zoom' ),
								'default'     => 'flip',
							),
							'flipDirection' => array(
								'type'        => 'string',
								'description' => __( 'Flip direction (only applies to "flip" effect)', 'designsetgo' ),
								'enum'        => array( 'horizontal', 'vertical' ),
								'default'     => 'horizontal',
							),
							'flipDuration'  => array(
								'type'        => 'string',
								'description' => __( 'Animation duration (e.g., "0.6s")', 'designsetgo' ),
								'default'     => '0.6s',
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Front and back card blocks (designsetgo/flip-card-front and designsetgo/flip-card-back)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (should be "designsetgo/flip-card-front" or "designsetgo/flip-card-back")', 'designsetgo' ),
									'enum'        => array( 'designsetgo/flip-card-front', 'designsetgo/flip-card-back' ),
								),
								'attributes'  => array(
									'type'        => 'object',
									'description' => __( 'Card side attributes (supports all WordPress block supports like spacing, colors, etc.)', 'designsetgo' ),
								),
								'innerBlocks' => array(
									'type'        => 'array',
									'description' => __( 'Content blocks for this card side', 'designsetgo' ),
								),
							),
							'required'   => array( 'name' ),
						),
						'minItems'    => 2,
						'maxItems'    => 2,
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

		// Validate that we have exactly 2 inner blocks (front and back).
		if ( count( $inner_blocks ) !== 2 ) {
			return $this->error(
				'invalid_inner_blocks',
				__( 'Flip Card requires exactly 2 inner blocks: flip-card-front and flip-card-back.', 'designsetgo' )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Validate inner blocks.
		$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
		if ( is_wp_error( $validation ) ) {
			return $validation;
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/flip-card',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
