<?php
/**
 * Insert Pill Ability.
 *
 * Inserts a Pill/Badge block for displaying labels, tags,
 * status indicators, and other small styled text elements.
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
 * Insert Pill ability class.
 */
class Insert_Pill extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-pill';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Pill', 'designsetgo' ),
			'description'         => __( 'Inserts a Pill/Badge block for displaying labels, tags, and status indicators. Perfect for category tags, feature badges, pricing labels, and notification badges.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating pill...', 'designsetgo' ),
			'success_message'     => __( 'Pill inserted successfully.', 'designsetgo' ),
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
					'attributes' => array(
						'type'        => 'object',
						'description' => __( 'Pill attributes', 'designsetgo' ),
						'properties'  => array(
							'text'            => array(
								'type'        => 'string',
								'description' => __( 'Pill text content', 'designsetgo' ),
								'default'     => '',
							),
							'size'            => array(
								'type'        => 'string',
								'description' => __( 'Pill size', 'designsetgo' ),
								'enum'        => array( 'small', 'medium', 'large' ),
								'default'     => 'medium',
							),
							'variant'         => array(
								'type'        => 'string',
								'description' => __( 'Visual style variant', 'designsetgo' ),
								'enum'        => array( 'filled', 'outlined', 'soft' ),
								'default'     => 'filled',
							),
							'shape'           => array(
								'type'        => 'string',
								'description' => __( 'Pill shape', 'designsetgo' ),
								'enum'        => array( 'rounded', 'square', 'pill' ),
								'default'     => 'pill',
							),
							'backgroundColor' => array(
								'type'        => 'string',
								'description' => __( 'Background color', 'designsetgo' ),
							),
							'textColor'       => array(
								'type'        => 'string',
								'description' => __( 'Text color', 'designsetgo' ),
							),
							'borderColor'     => array(
								'type'        => 'string',
								'description' => __( 'Border color (for outlined variant)', 'designsetgo' ),
							),
							'iconName'        => array(
								'type'        => 'string',
								'description' => __( 'Optional icon name from Lucide icon set', 'designsetgo' ),
							),
							'iconPosition'    => array(
								'type'        => 'string',
								'description' => __( 'Icon position relative to text', 'designsetgo' ),
								'enum'        => array( 'left', 'right' ),
								'default'     => 'left',
							),
							'url'             => array(
								'type'        => 'string',
								'description' => __( 'Optional link URL', 'designsetgo' ),
							),
							'openInNewTab'    => array(
								'type'        => 'boolean',
								'description' => __( 'Open link in new tab', 'designsetgo' ),
								'default'     => false,
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
	 * @return bool|WP_Error
	 */
	public function check_permission_callback() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to insert pills.', 'designsetgo' ),
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
		$post_id    = (int) ( $input['post_id'] ?? 0 );
		$position   = (int) ( $input['position'] ?? -1 );
		$attributes = $input['attributes'] ?? array();

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

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/pill',
			$attributes,
			array(),
			$position
		);
	}
}
