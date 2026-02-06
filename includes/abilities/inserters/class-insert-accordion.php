<?php
/**
 * Insert Accordion Ability.
 *
 * Inserts an Accordion block container for creating collapsible content sections
 * perfect for FAQs and content organization.
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
 * Insert Accordion ability class.
 */
class Insert_Accordion extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-accordion';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Accordion', 'designsetgo' ),
			'description'         => __( 'Inserts an Accordion container for creating accessible collapsible content sections. Perfect for FAQs and content organization.', 'designsetgo' ),
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
						'description' => __( 'Accordion attributes', 'designsetgo' ),
						'properties'  => array(
							'allowMultipleOpen' => array(
								'type'        => 'boolean',
								'description' => __( 'Allow multiple items to be open simultaneously', 'designsetgo' ),
								'default'     => false,
							),
							'initiallyOpen'     => array(
								'type'        => 'string',
								'description' => __( 'Which items are initially open', 'designsetgo' ),
								'enum'        => array( 'none', 'first', 'all' ),
								'default'     => 'first',
							),
							'iconStyle'         => array(
								'type'        => 'string',
								'description' => __( 'Icon style for expand/collapse indicator', 'designsetgo' ),
								'enum'        => array( 'chevron', 'plus-minus', 'caret', 'none' ),
								'default'     => 'chevron',
							),
							'iconPosition'      => array(
								'type'        => 'string',
								'description' => __( 'Position of expand/collapse icon', 'designsetgo' ),
								'enum'        => array( 'left', 'right' ),
								'default'     => 'right',
							),
							'borderBetween'     => array(
								'type'        => 'boolean',
								'description' => __( 'Show borders between items', 'designsetgo' ),
								'default'     => true,
							),
							'itemGap'           => array(
								'type'        => 'string',
								'description' => __( 'Gap between accordion items (e.g., "0.5rem")', 'designsetgo' ),
								'default'     => '0.5rem',
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Accordion item blocks (designsetgo/accordion-item)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (should be "designsetgo/accordion-item")', 'designsetgo' ),
									'default'     => 'designsetgo/accordion-item',
								),
								'attributes'  => array(
									'type'        => 'object',
									'description' => __( 'Accordion item attributes', 'designsetgo' ),
									'properties'  => array(
										'title'  => array(
											'type'        => 'string',
											'description' => __( 'Accordion item title/question', 'designsetgo' ),
										),
										'isOpen' => array(
											'type'        => 'boolean',
											'description' => __( 'Whether item is initially open', 'designsetgo' ),
											'default'     => false,
										),
									),
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
			'designsetgo/accordion',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
