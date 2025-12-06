<?php
/**
 * Generate Testimonial Section Ability.
 *
 * Generates a testimonials section with customer reviews
 * in grid or slider format.
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
 * Generate Testimonial Section ability class.
 */
class Generate_Testimonial_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-testimonial-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Testimonial Section', 'designsetgo' ),
			'description'         => __( 'Generates a testimonials section with customer reviews. Supports grid or slider layout with quotes, author info, and ratings.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating testimonial section...', 'designsetgo' ),
			'success_message'     => __( 'Testimonial section generated successfully.', 'designsetgo' ),
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
					'heading'      => array(
						'type'        => 'string',
						'description' => __( 'Section heading text', 'designsetgo' ),
						'default'     => 'What Our Customers Say',
					),
					'headingLevel' => array(
						'type'        => 'integer',
						'description' => __( 'Heading level (1-6)', 'designsetgo' ),
						'minimum'     => 1,
						'maximum'     => 6,
						'default'     => 2,
					),
					'description'  => array(
						'type'        => 'string',
						'description' => __( 'Section description text', 'designsetgo' ),
						'default'     => '',
					),
					'layout'       => array(
						'type'        => 'string',
						'description' => __( 'Display layout', 'designsetgo' ),
						'enum'        => array( 'grid', 'slider' ),
						'default'     => 'grid',
					),
					'columns'      => array(
						'type'        => 'number',
						'description' => __( 'Number of columns for grid layout (2-4)', 'designsetgo' ),
						'default'     => 3,
						'minimum'     => 2,
						'maximum'     => 4,
					),
					'showRating'   => array(
						'type'        => 'boolean',
						'description' => __( 'Show star ratings', 'designsetgo' ),
						'default'     => true,
					),
					'testimonials' => array(
						'type'        => 'array',
						'description' => __( 'Testimonial definitions', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'quote'    => array(
									'type'        => 'string',
									'description' => __( 'Testimonial quote text', 'designsetgo' ),
								),
								'author'   => array(
									'type'        => 'string',
									'description' => __( 'Author name', 'designsetgo' ),
								),
								'role'     => array(
									'type'        => 'string',
									'description' => __( 'Author role/title', 'designsetgo' ),
								),
								'company'  => array(
									'type'        => 'string',
									'description' => __( 'Company name', 'designsetgo' ),
								),
								'imageUrl' => array(
									'type'        => 'string',
									'description' => __( 'Author photo URL', 'designsetgo' ),
								),
								'imageId'  => array(
									'type'        => 'number',
									'description' => __( 'Author photo attachment ID', 'designsetgo' ),
								),
								'rating'   => array(
									'type'        => 'number',
									'description' => __( 'Star rating (1-5)', 'designsetgo' ),
									'default'     => 5,
									'minimum'     => 1,
									'maximum'     => 5,
								),
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
		$post_id       = (int) ( $input['post_id'] ?? 0 );
		$position      = (int) ( $input['position'] ?? -1 );
		$heading       = sanitize_text_field( $input['heading'] ?? 'What Our Customers Say' );
		$heading_level = (int) ( $input['headingLevel'] ?? 2 );
		$description   = sanitize_textarea_field( $input['description'] ?? '' );
		$layout        = $input['layout'] ?? 'grid';
		$columns       = (int) ( $input['columns'] ?? 3 );
		$show_rating   = (bool) ( $input['showRating'] ?? true );
		$testimonials  = $input['testimonials'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Validate heading level.
		$heading_level = max( 1, min( 6, $heading_level ) );

		// Default testimonials if none provided.
		if ( empty( $testimonials ) ) {
			$testimonials = array(
				array(
					'quote'   => 'This product has completely transformed how we work. The team is more productive than ever.',
					'author'  => 'Jane Doe',
					'role'    => 'CEO',
					'company' => 'TechCorp',
					'rating'  => 5,
				),
				array(
					'quote'   => 'Incredible customer support and a product that just works. Highly recommended!',
					'author'  => 'John Smith',
					'role'    => 'Marketing Director',
					'company' => 'StartupXYZ',
					'rating'  => 5,
				),
				array(
					'quote'   => 'We saw a 40% increase in efficiency within the first month of implementation.',
					'author'  => 'Sarah Wilson',
					'role'    => 'Operations Manager',
					'company' => 'Enterprise Inc',
					'rating'  => 5,
				),
			);
		}

		// Build testimonial cards.
		$testimonial_cards = array();
		foreach ( $testimonials as $testimonial ) {
			$card_inner = array();

			// Rating stars.
			if ( $show_rating && ! empty( $testimonial['rating'] ) ) {
				$stars = str_repeat( '★', (int) $testimonial['rating'] ) . str_repeat( '☆', 5 - (int) $testimonial['rating'] );
				$card_inner[] = array(
					'name'       => 'core/paragraph',
					'attributes' => array(
						'content' => '<span style="color:#fbbf24;font-size:1.25rem;">' . $stars . '</span>',
					),
				);
			}

			// Quote.
			$card_inner[] = array(
				'name'       => 'core/quote',
				'attributes' => array(
					'citation' => '',
				),
				'innerBlocks' => array(
					array(
						'name'       => 'core/paragraph',
						'attributes' => array(
							'content' => sanitize_text_field( $testimonial['quote'] ?? '' ),
						),
					),
				),
			);

			// Author info.
			$author_blocks = array();

			// Avatar.
			if ( ! empty( $testimonial['imageUrl'] ) || ! empty( $testimonial['imageId'] ) ) {
				$img_attrs = array(
					'width'    => 50,
					'height'   => 50,
					'sizeSlug' => 'thumbnail',
					'style'    => array( 'border' => array( 'radius' => '50%' ) ),
				);
				if ( ! empty( $testimonial['imageId'] ) ) {
					$img_attrs['id'] = (int) $testimonial['imageId'];
				}
				if ( ! empty( $testimonial['imageUrl'] ) ) {
					$img_attrs['url'] = esc_url( $testimonial['imageUrl'] );
				}
				$author_blocks[] = array(
					'name'       => 'core/image',
					'attributes' => $img_attrs,
				);
			}

			// Name and role.
			$author_text = '<strong>' . sanitize_text_field( $testimonial['author'] ?? '' ) . '</strong>';
			if ( ! empty( $testimonial['role'] ) || ! empty( $testimonial['company'] ) ) {
				$author_text .= '<br>';
				$role_parts = array();
				if ( ! empty( $testimonial['role'] ) ) {
					$role_parts[] = sanitize_text_field( $testimonial['role'] );
				}
				if ( ! empty( $testimonial['company'] ) ) {
					$role_parts[] = sanitize_text_field( $testimonial['company'] );
				}
				$author_text .= implode( ', ', $role_parts );
			}

			$author_blocks[] = array(
				'name'       => 'core/paragraph',
				'attributes' => array(
					'content'  => $author_text,
					'fontSize' => 'small',
				),
			);

			$card_inner[] = array(
				'name'        => 'designsetgo/flex',
				'attributes'  => array(
					'alignItems' => 'center',
					'gap'        => '1rem',
				),
				'innerBlocks' => $author_blocks,
			);

			$testimonial_cards[] = array(
				'name'        => 'designsetgo/stack',
				'attributes'  => array(),
				'innerBlocks' => array(
					array(
						'name'        => 'designsetgo/card',
						'attributes'  => array(
							'layoutPreset' => 'standard',
							'visualStyle'  => 'outlined',
						),
						'innerBlocks' => $card_inner,
					),
				),
			);
		}

		// Build section structure.
		$inner_blocks = array();

		// Header.
		$inner_blocks[] = array(
			'name'       => 'core/heading',
			'attributes' => array(
				'level'     => $heading_level,
				'content'   => $heading,
				'textAlign' => 'center',
			),
		);

		if ( ! empty( $description ) ) {
			$inner_blocks[] = array(
				'name'       => 'core/paragraph',
				'attributes' => array(
					'content' => $description,
					'align'   => 'center',
				),
			);
		}

		// Testimonials container.
		if ( 'slider' === $layout ) {
			// Slider layout.
			$slides = array();
			foreach ( $testimonial_cards as $card ) {
				$slides[] = array(
					'name'        => 'designsetgo/slide',
					'attributes'  => array(),
					'innerBlocks' => array( $card ),
				);
			}

			$inner_blocks[] = array(
				'name'        => 'designsetgo/slider',
				'attributes'  => array(
					'slidesPerView' => 1,
					'showArrows'    => true,
					'showDots'      => true,
					'autoplay'      => true,
					'loop'          => true,
				),
				'innerBlocks' => $slides,
			);
		} else {
			// Grid layout.
			$inner_blocks[] = array(
				'name'        => 'designsetgo/grid',
				'attributes'  => array(
					'columnsDesktop' => min( $columns, 4 ),
					'columnsTablet'  => min( $columns, 2 ),
					'columnsMobile'  => 1,
					'gap'            => 'var(--wp--preset--spacing--50, 1.5rem)',
				),
				'innerBlocks' => $testimonial_cards,
			);
		}

		// Create section container.
		$section_attributes = array(
			'constrainWidth' => true,
		);

		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/section',
			$section_attributes,
			$inner_blocks,
			$position
		);
	}
}
