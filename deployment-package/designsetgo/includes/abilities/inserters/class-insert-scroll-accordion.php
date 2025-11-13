<?php
/**
 * Insert Scroll Accordion Ability.
 *
 * Inserts a Scroll Accordion that reveals items progressively as you scroll down.
 * Items stack on top of each other with a sticky stacking effect.
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
 * Insert Scroll Accordion ability class.
 */
class Insert_Scroll_Accordion extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-scroll-accordion';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Scroll Accordion', 'designsetgo' ),
			'description'         => __( 'Inserts a Scroll Accordion that reveals items progressively as you scroll. Items stack on top of each other with a sticky stacking effect.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating scroll accordion...', 'designsetgo' ),
			'success_message'     => __( 'Scroll accordion inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Scroll Accordion attributes', 'designsetgo' ),
						'properties'  => array(
							'alignItems' => array(
								'type'        => 'string',
								'description' => __( 'Vertical alignment of items', 'designsetgo' ),
								'enum'        => array( 'flex-start', 'center', 'flex-end', 'stretch' ),
								'default'     => 'flex-start',
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Scroll accordion item blocks (designsetgo/scroll-accordion-item)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (should be "designsetgo/scroll-accordion-item")', 'designsetgo' ),
									'default'     => 'designsetgo/scroll-accordion-item',
								),
								'attributes'  => array(
									'type'        => 'object',
									'description' => __( 'Scroll accordion item attributes (supports all WordPress block supports like spacing, colors, etc.)', 'designsetgo' ),
								),
								'innerBlocks' => array(
									'type'        => 'array',
									'description' => __( 'Content blocks for this accordion item', 'designsetgo' ),
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
			'designsetgo/scroll-accordion',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
