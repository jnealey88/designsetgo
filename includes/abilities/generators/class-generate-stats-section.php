<?php
/**
 * Generate Stats Section Ability.
 *
 * Generates a statistics section with animated counters in a Counter Group.
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
 * Generate Stats Section ability class.
 */
class Generate_Stats_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-stats-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Stats Section', 'designsetgo' ),
			'description'         => __( 'Generates a statistics section with animated counters. Perfect for showcasing metrics, achievements, or key numbers.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating stats section...', 'designsetgo' ),
			'success_message'     => __( 'Stats section generated successfully.', 'designsetgo' ),
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
					'stats'   => array(
						'type'        => 'array',
						'description' => __( 'Array of statistics to display', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'value'    => array(
									'type'        => 'number',
									'description' => __( 'Stat value/number', 'designsetgo' ),
									'default'     => 100,
								),
								'prefix'   => array(
									'type'        => 'string',
									'description' => __( 'Optional prefix (e.g., "$")', 'designsetgo' ),
									'default'     => '',
								),
								'suffix'   => array(
									'type'        => 'string',
									'description' => __( 'Optional suffix (e.g., "+", "%", "K")', 'designsetgo' ),
									'default'     => '',
								),
								'label'    => array(
									'type'        => 'string',
									'description' => __( 'Stat label/description', 'designsetgo' ),
									'default'     => 'Stat Label',
								),
								'decimals' => array(
									'type'        => 'number',
									'description' => __( 'Number of decimal places', 'designsetgo' ),
									'default'     => 0,
									'minimum'     => 0,
									'maximum'     => 3,
								),
							),
							'required'   => array( 'value', 'label' ),
						),
						'minItems'    => 1,
						'maxItems'    => 6,
					),
					'columns' => array(
						'type'        => 'number',
						'description' => __( 'Number of columns on desktop', 'designsetgo' ),
						'default'     => 3,
						'minimum'     => 1,
						'maximum'     => 6,
					),
				)
			),
			'required'             => array( 'post_id', 'stats' ),
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
		$stats    = $input['stats'] ?? array();
		$columns  = (int) ( $input['columns'] ?? 3 );

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Validate stats.
		if ( empty( $stats ) ) {
			return $this->error(
				'missing_stats',
				__( 'At least one stat is required.', 'designsetgo' )
			);
		}

		// Build counter blocks.
		$counter_blocks = array();

		foreach ( $stats as $stat ) {
			$value    = floatval( $stat['value'] ?? 100 );
			$prefix   = sanitize_text_field( $stat['prefix'] ?? '' );
			$suffix   = sanitize_text_field( $stat['suffix'] ?? '' );
			$label    = sanitize_text_field( $stat['label'] ?? 'Stat Label' );
			$decimals = (int) ( $stat['decimals'] ?? 0 );

			$counter_blocks[] = array(
				'name'       => 'designsetgo/counter',
				'attributes' => array(
					'endValue' => $value,
					'prefix'   => $prefix,
					'suffix'   => $suffix,
					'label'    => $label,
					'decimals' => $decimals,
				),
			);
		}

		// Create Counter Group attributes.
		$group_attributes = array(
			'columns'           => $columns,
			'columnsTablet'     => min( 2, $columns ),
			'columnsMobile'     => 1,
			'alignContent'      => 'center',
			'animationDuration' => 2,
		);

		// Insert the stats section.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/counter-group',
			$group_attributes,
			$counter_blocks,
			$position
		);
	}
}
