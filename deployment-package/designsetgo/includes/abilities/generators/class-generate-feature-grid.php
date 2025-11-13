<?php
/**
 * Generate Feature Grid Ability.
 *
 * Generates a responsive grid of features with icons, headings, and descriptions.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Generators;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Generate Feature Grid ability class.
 */
class Generate_Feature_Grid extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-feature-grid';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Feature Grid', 'designsetgo' ),
			'description'         => __( 'Generates a responsive grid of features with icons, headings, and descriptions. Perfect for showcasing product features or services.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating feature grid...', 'designsetgo' ),
			'success_message'     => __( 'Feature grid generated successfully.', 'designsetgo' ),
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
					'features' => array(
						'type'        => 'array',
						'description' => __( 'Array of features to display', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'icon'        => array(
									'type'        => 'string',
									'description' => __( 'Icon name (e.g., "star", "check", "lightbulb")', 'designsetgo' ),
									'default'     => 'star',
								),
								'title'       => array(
									'type'        => 'string',
									'description' => __( 'Feature title', 'designsetgo' ),
									'default'     => 'Feature Title',
								),
								'description' => array(
									'type'        => 'string',
									'description' => __( 'Feature description', 'designsetgo' ),
									'default'     => 'Feature description goes here.',
								),
							),
							'required'   => array( 'title' ),
						),
						'minItems'    => 1,
						'maxItems'    => 12,
					),
					'columns'  => array(
						'type'        => 'number',
						'description' => __( 'Number of columns on desktop', 'designsetgo' ),
						'default'     => 3,
						'minimum'     => 1,
						'maximum'     => 6,
					),
				)
			),
			'required'             => array( 'post_id', 'features' ),
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
		$post_id  = (int) ( $input['post_id'] ?? 0 );
		$position = (int) ( $input['position'] ?? -1 );
		$features = $input['features'] ?? array();
		$columns  = (int) ( $input['columns'] ?? 3 );

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Validate features.
		if ( empty( $features ) ) {
			return $this->error(
				'missing_features',
				__( 'At least one feature is required.', 'designsetgo' )
			);
		}

		// Build feature blocks.
		$feature_blocks = array();

		foreach ( $features as $feature ) {
			$icon        = sanitize_text_field( $feature['icon'] ?? 'star' );
			$title       = sanitize_text_field( $feature['title'] ?? 'Feature Title' );
			$description = sanitize_textarea_field( $feature['description'] ?? 'Feature description goes here.' );

			// Create a Stack container for each feature.
			$feature_blocks[] = array(
				'name'        => 'designsetgo/stack',
				'attributes'  => array(
					'alignItems' => 'center',
					'textAlign'  => 'center',
				),
				'innerBlocks' => array(
					array(
						'name'       => 'designsetgo/icon',
						'attributes' => array(
							'icon'     => $icon,
							'iconSize' => 48,
						),
					),
					array(
						'name'       => 'core/heading',
						'attributes' => array(
							'level'   => 3,
							'content' => $title,
						),
					),
					array(
						'name'       => 'core/paragraph',
						'attributes' => array(
							'content' => $description,
						),
					),
				),
			);
		}

		// Create Grid container attributes.
		$grid_attributes = array(
			'desktopColumns' => $columns,
			'tabletColumns'  => min( 2, $columns ),
			'mobileColumns'  => 1,
		);

		// Insert the feature grid.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/grid',
			$grid_attributes,
			$feature_blocks,
			$position
		);
	}
}
