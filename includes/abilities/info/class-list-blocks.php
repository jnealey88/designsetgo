<?php
/**
 * List Blocks Ability.
 *
 * Provides a complete catalog of all DesignSetGo blocks with their
 * descriptions, categories, and available attributes.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Info;

use DesignSetGo\Abilities\Abstract_Ability;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * List Blocks ability class.
 */
class List_Blocks extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/list-blocks';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'List DesignSetGo Blocks', 'designsetgo' ),
			'description'         => __( 'Returns a comprehensive list of all available DesignSetGo blocks with their capabilities, attributes, and metadata.', 'designsetgo' ),
			'thinking_message'    => __( 'Retrieving available blocks...', 'designsetgo' ),
			'success_message'     => __( 'Successfully retrieved block list.', 'designsetgo' ),
			'category'            => 'info',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => $this->get_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		return array(
			'type'                 => 'object',
			'properties'           => array(
				'category' => array(
					'type'        => 'string',
					'description' => __( 'Filter by category', 'designsetgo' ),
					'enum'        => array( 'all', 'layout', 'interactive', 'visual', 'dynamic' ),
					'default'     => 'all',
				),
			),
			'additionalProperties' => false,
		);
	}

	/**
	 * Get output schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'blocks' => array(
					'type'  => 'array',
					'items' => array(
						'type'       => 'object',
						'properties' => array(
							'name'        => array(
								'type'        => 'string',
								'description' => __( 'Block name', 'designsetgo' ),
							),
							'title'       => array(
								'type'        => 'string',
								'description' => __( 'Human-readable title', 'designsetgo' ),
							),
							'description' => array(
								'type'        => 'string',
								'description' => __( 'Block description', 'designsetgo' ),
							),
							'category'    => array(
								'type'        => 'string',
								'description' => __( 'Block category', 'designsetgo' ),
							),
							'attributes'  => array(
								'type'        => 'object',
								'description' => __( 'Available block attributes', 'designsetgo' ),
							),
							'supports'    => array(
								'type'        => 'object',
								'description' => __( 'Block support features', 'designsetgo' ),
							),
						),
					),
				),
				'total'  => array(
					'type'        => 'integer',
					'description' => __( 'Total number of blocks returned', 'designsetgo' ),
				),
			),
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool
	 */
	public function check_permission_callback(): bool {
		// Anyone who can read content can list blocks.
		return $this->check_permission( 'read' );
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>
	 */
	public function execute( array $input ): array {
		$category = $input['category'] ?? 'all';

		// Get all DesignSetGo blocks.
		$all_blocks = $this->get_all_blocks();

		// Filter by category if specified.
		if ( 'all' !== $category ) {
			$all_blocks = array_filter(
				$all_blocks,
				function ( $block ) use ( $category ) {
					return $block['category'] === $category;
				}
			);
		}

		return array(
			'blocks' => array_values( $all_blocks ),
			'total'  => count( $all_blocks ),
		);
	}

	/**
	 * Get all DesignSetGo blocks with their metadata.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function get_all_blocks(): array {
		return array(
			// Layout Containers.
			array(
				'name'        => 'designsetgo/row',
				'title'       => __( 'Row Container', 'designsetgo' ),
				'description' => __( 'Flexible horizontal or vertical layout container with customizable alignment, gap, and wrapping.', 'designsetgo' ),
				'category'    => 'layout',
				'attributes'  => array(
					'direction'      => array(
						'type' => 'string',
						'enum' => array( 'row', 'column' ),
					),
					'justifyContent' => array( 'type' => 'string' ),
					'alignItems'     => array( 'type' => 'string' ),
					'wrap'           => array( 'type' => 'boolean' ),
					'gap'            => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/grid',
				'title'       => __( 'Grid Container', 'designsetgo' ),
				'description' => __( 'Responsive grid layout with customizable columns for desktop, tablet, and mobile.', 'designsetgo' ),
				'category'    => 'layout',
				'attributes'  => array(
					'columnsDesktop' => array( 'type' => 'integer' ),
					'columnsTablet'  => array( 'type' => 'integer' ),
					'columnsMobile'  => array( 'type' => 'integer' ),
					'gap'            => array( 'type' => 'string' ),
					'rowGap'         => array( 'type' => 'string' ),
					'columnGap'      => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/section',
				'title'       => __( 'Section Container', 'designsetgo' ),
				'description' => __( 'Vertical stacking container with consistent spacing between elements.', 'designsetgo' ),
				'category'    => 'layout',
				'attributes'  => array(
					'gap'       => array( 'type' => 'string' ),
					'alignment' => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),

			// Interactive Elements.
			array(
				'name'        => 'designsetgo/accordion',
				'title'       => __( 'Accordion', 'designsetgo' ),
				'description' => __( 'Collapsible accordion container for FAQ sections and content organization.', 'designsetgo' ),
				'category'    => 'interactive',
				'attributes'  => array(
					'allowMultiple' => array( 'type' => 'boolean' ),
					'firstOpen'     => array( 'type' => 'boolean' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/accordion-item',
				'title'       => __( 'Accordion Item', 'designsetgo' ),
				'description' => __( 'Individual item within an accordion with title and content.', 'designsetgo' ),
				'category'    => 'interactive',
				'attributes'  => array(
					'title'    => array( 'type' => 'string' ),
					'isOpen'   => array( 'type' => 'boolean' ),
					'iconType' => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing' ),
			),
			array(
				'name'        => 'designsetgo/tabs',
				'title'       => __( 'Tabs', 'designsetgo' ),
				'description' => __( 'Tabbed interface for organizing content into switchable panels.', 'designsetgo' ),
				'category'    => 'interactive',
				'attributes'  => array(
					'defaultTab'    => array( 'type' => 'integer' ),
					'tabsAlignment' => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/tab',
				'title'       => __( 'Tab', 'designsetgo' ),
				'description' => __( 'Individual tab within a tabs container.', 'designsetgo' ),
				'category'    => 'interactive',
				'attributes'  => array(
					'title' => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing' ),
			),
			array(
				'name'        => 'designsetgo/scroll-accordion',
				'title'       => __( 'Scroll Accordion', 'designsetgo' ),
				'description' => __( 'Sticky stacking accordion that reveals items on scroll.', 'designsetgo' ),
				'category'    => 'interactive',
				'attributes'  => array(
					'gap' => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/scroll-accordion-item',
				'title'       => __( 'Scroll Accordion Item', 'designsetgo' ),
				'description' => __( 'Individual item within a scroll accordion.', 'designsetgo' ),
				'category'    => 'interactive',
				'attributes'  => array(),
				'supports'    => array( 'color', 'spacing' ),
			),

			// Visual Elements.
			array(
				'name'        => 'designsetgo/icon',
				'title'       => __( 'Icon', 'designsetgo' ),
				'description' => __( 'SVG icon with customizable size, color, and rotation.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'iconName'  => array( 'type' => 'string' ),
					'iconSize'  => array( 'type' => 'number' ),
					'iconColor' => array( 'type' => 'string' ),
					'rotate'    => array( 'type' => 'number' ),
				),
				'supports'    => array( 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/icon-button',
				'title'       => __( 'Icon Button', 'designsetgo' ),
				'description' => __( 'Button with icon and optional text label.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'iconName'     => array( 'type' => 'string' ),
					'text'         => array( 'type' => 'string' ),
					'url'          => array( 'type' => 'string' ),
					'linkTarget'   => array( 'type' => 'string' ),
					'rel'          => array( 'type' => 'string' ),
					'iconPosition' => array(
						'type' => 'string',
						'enum' => array( 'left', 'right' ),
					),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/pill',
				'title'       => __( 'Pill', 'designsetgo' ),
				'description' => __( 'Rounded pill-shaped badge or tag element.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'text'      => array( 'type' => 'string' ),
					'pillColor' => array( 'type' => 'string' ),
					'textColor' => array( 'type' => 'string' ),
				),
				'supports'    => array( 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/icon-list',
				'title'       => __( 'Icon List', 'designsetgo' ),
				'description' => __( 'List with icons for each item, perfect for features or benefits.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'gap' => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/icon-list-item',
				'title'       => __( 'Icon List Item', 'designsetgo' ),
				'description' => __( 'Individual item within an icon list.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'iconName'  => array( 'type' => 'string' ),
					'iconColor' => array( 'type' => 'string' ),
					'iconSize'  => array( 'type' => 'number' ),
				),
				'supports'    => array( 'color', 'spacing' ),
			),
			array(
				'name'        => 'designsetgo/flip-card',
				'title'       => __( 'Flip Card', 'designsetgo' ),
				'description' => __( '3D card that flips on hover to reveal back content.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'height'        => array( 'type' => 'string' ),
					'flipDirection' => array(
						'type' => 'string',
						'enum' => array( 'horizontal', 'vertical' ),
					),
				),
				'supports'    => array( 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/flip-card-front',
				'title'       => __( 'Flip Card Front', 'designsetgo' ),
				'description' => __( 'Front face of a flip card.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(),
				'supports'    => array( 'color', 'spacing' ),
			),
			array(
				'name'        => 'designsetgo/flip-card-back',
				'title'       => __( 'Flip Card Back', 'designsetgo' ),
				'description' => __( 'Back face of a flip card.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(),
				'supports'    => array( 'color', 'spacing' ),
			),
			array(
				'name'        => 'designsetgo/reveal',
				'title'       => __( 'Reveal', 'designsetgo' ),
				'description' => __( 'Content that reveals on scroll with customizable animations.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'animation' => array( 'type' => 'string' ),
					'duration'  => array( 'type' => 'number' ),
					'delay'     => array( 'type' => 'number' ),
				),
				'supports'    => array( 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/scroll-marquee',
				'title'       => __( 'Scroll Marquee', 'designsetgo' ),
				'description' => __( 'Infinite scrolling marquee for logos or content.', 'designsetgo' ),
				'category'    => 'visual',
				'attributes'  => array(
					'speed'        => array( 'type' => 'number' ),
					'direction'    => array(
						'type' => 'string',
						'enum' => array( 'left', 'right' ),
					),
					'pauseOnHover' => array( 'type' => 'boolean' ),
				),
				'supports'    => array( 'align', 'anchor' ),
			),

			// Dynamic/Animated Elements.
			array(
				'name'        => 'designsetgo/counter',
				'title'       => __( 'Counter', 'designsetgo' ),
				'description' => __( 'Animated counter that counts up to a target value.', 'designsetgo' ),
				'category'    => 'dynamic',
				'attributes'  => array(
					'startValue' => array( 'type' => 'number' ),
					'endValue'   => array( 'type' => 'number' ),
					'duration'   => array( 'type' => 'number' ),
					'prefix'     => array( 'type' => 'string' ),
					'suffix'     => array( 'type' => 'string' ),
					'decimals'   => array( 'type' => 'integer' ),
				),
				'supports'    => array( 'color', 'typography', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/counter-group',
				'title'       => __( 'Counter Group', 'designsetgo' ),
				'description' => __( 'Group of animated counters for statistics sections.', 'designsetgo' ),
				'category'    => 'dynamic',
				'attributes'  => array(
					'columns' => array( 'type' => 'integer' ),
					'gap'     => array( 'type' => 'string' ),
				),
				'supports'    => array( 'color', 'spacing', 'align', 'anchor' ),
			),
			array(
				'name'        => 'designsetgo/progress-bar',
				'title'       => __( 'Progress Bar', 'designsetgo' ),
				'description' => __( 'Animated progress bar with customizable colors and value.', 'designsetgo' ),
				'category'    => 'dynamic',
				'attributes'  => array(
					'value'           => array( 'type' => 'number' ),
					'label'           => array( 'type' => 'string' ),
					'showValue'       => array( 'type' => 'boolean' ),
					'barColor'        => array( 'type' => 'string' ),
					'backgroundColor' => array( 'type' => 'string' ),
					'height'          => array( 'type' => 'string' ),
				),
				'supports'    => array( 'align', 'anchor' ),
			),
		);
	}
}
