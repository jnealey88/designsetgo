<?php
/**
 * Insert Breadcrumbs Ability.
 *
 * Inserts a Breadcrumbs block for displaying navigation trails
 * with customizable separators and styling.
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
 * Insert Breadcrumbs ability class.
 */
class Insert_Breadcrumbs extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-breadcrumbs';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Breadcrumbs', 'designsetgo' ),
			'description'         => __( 'Inserts a Breadcrumbs block for displaying navigation trails. Automatically generates breadcrumb links based on page hierarchy. Perfect for improving site navigation and SEO.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating breadcrumbs...', 'designsetgo' ),
			'success_message'     => __( 'Breadcrumbs inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Breadcrumbs attributes', 'designsetgo' ),
						'properties'  => array(
							'separator'        => array(
								'type'        => 'string',
								'description' => __( 'Separator between breadcrumb items', 'designsetgo' ),
								'default'     => '/',
							),
							'separatorIcon'    => array(
								'type'        => 'string',
								'description' => __( 'Icon name to use as separator (overrides text separator)', 'designsetgo' ),
								'enum'        => array( 'chevron-right', 'arrow-right', 'slash', 'dot' ),
							),
							'showHome'         => array(
								'type'        => 'boolean',
								'description' => __( 'Show home link as first item', 'designsetgo' ),
								'default'     => true,
							),
							'homeLabel'        => array(
								'type'        => 'string',
								'description' => __( 'Label for home link', 'designsetgo' ),
								'default'     => 'Home',
							),
							'homeIcon'         => array(
								'type'        => 'boolean',
								'description' => __( 'Show home icon instead of text', 'designsetgo' ),
								'default'     => false,
							),
							'showCurrent'      => array(
								'type'        => 'boolean',
								'description' => __( 'Show current page in breadcrumbs', 'designsetgo' ),
								'default'     => true,
							),
							'linkCurrent'      => array(
								'type'        => 'boolean',
								'description' => __( 'Make current page a clickable link', 'designsetgo' ),
								'default'     => false,
							),
							'textColor'        => array(
								'type'        => 'string',
								'description' => __( 'Text color for breadcrumb links', 'designsetgo' ),
							),
							'separatorColor'   => array(
								'type'        => 'string',
								'description' => __( 'Separator color', 'designsetgo' ),
							),
							'currentColor'     => array(
								'type'        => 'string',
								'description' => __( 'Current page text color', 'designsetgo' ),
							),
							'fontSize'         => array(
								'type'        => 'string',
								'description' => __( 'Font size', 'designsetgo' ),
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
				__( 'Sorry, you are not allowed to insert breadcrumbs.', 'designsetgo' ),
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
			'designsetgo/breadcrumbs',
			$attributes,
			array(),
			$position
		);
	}
}
