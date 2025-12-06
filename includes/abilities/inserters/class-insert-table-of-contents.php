<?php
/**
 * Insert Table of Contents Ability.
 *
 * Inserts a Table of Contents block that automatically generates
 * navigation from page headings.
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
 * Insert Table of Contents ability class.
 */
class Insert_Table_Of_Contents extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-table-of-contents';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Table of Contents', 'designsetgo' ),
			'description'         => __( 'Inserts a Table of Contents block that automatically generates navigation links from page headings. Perfect for long-form content, documentation, and articles.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating table of contents...', 'designsetgo' ),
			'success_message'     => __( 'Table of contents inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Table of contents attributes', 'designsetgo' ),
						'properties'  => array(
							'title'             => array(
								'type'        => 'string',
								'description' => __( 'Title shown above the table of contents', 'designsetgo' ),
								'default'     => 'Table of Contents',
							),
							'showTitle'         => array(
								'type'        => 'boolean',
								'description' => __( 'Show the title', 'designsetgo' ),
								'default'     => true,
							),
							'minLevel'          => array(
								'type'        => 'number',
								'description' => __( 'Minimum heading level to include (1-6)', 'designsetgo' ),
								'default'     => 2,
								'minimum'     => 1,
								'maximum'     => 6,
							),
							'maxLevel'          => array(
								'type'        => 'number',
								'description' => __( 'Maximum heading level to include (1-6)', 'designsetgo' ),
								'default'     => 4,
								'minimum'     => 1,
								'maximum'     => 6,
							),
							'listStyle'         => array(
								'type'        => 'string',
								'description' => __( 'List style for items', 'designsetgo' ),
								'enum'        => array( 'none', 'disc', 'decimal', 'circle' ),
								'default'     => 'none',
							),
							'showNumbers'       => array(
								'type'        => 'boolean',
								'description' => __( 'Show numbered list', 'designsetgo' ),
								'default'     => true,
							),
							'hierarchical'      => array(
								'type'        => 'boolean',
								'description' => __( 'Show nested hierarchy based on heading levels', 'designsetgo' ),
								'default'     => true,
							),
							'smoothScroll'      => array(
								'type'        => 'boolean',
								'description' => __( 'Enable smooth scroll to anchors', 'designsetgo' ),
								'default'     => true,
							),
							'highlightActive'   => array(
								'type'        => 'boolean',
								'description' => __( 'Highlight current section in viewport', 'designsetgo' ),
								'default'     => true,
							),
							'sticky'            => array(
								'type'        => 'boolean',
								'description' => __( 'Make ToC sticky on scroll', 'designsetgo' ),
								'default'     => false,
							),
							'collapsible'       => array(
								'type'        => 'boolean',
								'description' => __( 'Allow collapsing the ToC', 'designsetgo' ),
								'default'     => false,
							),
							'defaultCollapsed'  => array(
								'type'        => 'boolean',
								'description' => __( 'Start in collapsed state', 'designsetgo' ),
								'default'     => false,
							),
							'backgroundColor'   => array(
								'type'        => 'string',
								'description' => __( 'Background color', 'designsetgo' ),
							),
							'textColor'         => array(
								'type'        => 'string',
								'description' => __( 'Text/link color', 'designsetgo' ),
							),
							'activeColor'       => array(
								'type'        => 'string',
								'description' => __( 'Active item color', 'designsetgo' ),
							),
							'borderColor'       => array(
								'type'        => 'string',
								'description' => __( 'Border color', 'designsetgo' ),
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
				__( 'Sorry, you are not allowed to insert table of contents.', 'designsetgo' ),
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

		// Insert the block (ToC doesn't have inner blocks - it generates content dynamically).
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/table-of-contents',
			$attributes,
			array(),
			$position
		);
	}
}
