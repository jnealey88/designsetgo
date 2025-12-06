<?php
/**
 * Insert Section Ability.
 *
 * Inserts a Section block for creating full-width page sections
 * with optional width constraints and background styling.
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
 * Insert Section ability class.
 */
class Insert_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Section', 'designsetgo' ),
			'description'         => __( 'Inserts a Section block for creating full-width page sections with optional content width constraints. Perfect for hero sections, feature areas, and page layouts.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating section...', 'designsetgo' ),
			'success_message'     => __( 'Section inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Section attributes', 'designsetgo' ),
						'properties'  => array(
							'constrainWidth'   => array(
								'type'        => 'boolean',
								'description' => __( 'Constrain inner content width', 'designsetgo' ),
								'default'     => true,
							),
							'contentWidth'     => array(
								'type'        => 'string',
								'description' => __( 'Content max width (e.g., "1200px")', 'designsetgo' ),
							),
							'minHeight'        => array(
								'type'        => 'string',
								'description' => __( 'Minimum section height (e.g., "500px", "100vh")', 'designsetgo' ),
							),
							'verticalAlign'    => array(
								'type'        => 'string',
								'description' => __( 'Vertical content alignment', 'designsetgo' ),
								'enum'        => array( 'top', 'center', 'bottom', 'space-between' ),
								'default'     => 'top',
							),
							'tagName'          => array(
								'type'        => 'string',
								'description' => __( 'HTML tag for the section', 'designsetgo' ),
								'enum'        => array( 'section', 'div', 'article', 'header', 'footer', 'main', 'aside' ),
								'default'     => 'section',
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Content blocks inside the section', 'designsetgo' ),
						'items'       => array(
							'type' => 'object',
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
	 * @return bool|WP_Error
	 */
	public function check_permission_callback() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to insert sections.', 'designsetgo' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
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
			return new WP_Error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Validate inner blocks.
		if ( ! empty( $inner_blocks ) ) {
			$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
			if ( is_wp_error( $validation ) ) {
				return $validation;
			}
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/section',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
