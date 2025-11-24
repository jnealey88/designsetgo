<?php
/**
 * Generate FAQ Section Ability.
 *
 * Generates an FAQ section with accordion items for questions and answers.
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
 * Generate FAQ Section ability class.
 */
class Generate_FAQ_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-faq-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate FAQ Section', 'designsetgo' ),
			'description'         => __( 'Generates a Frequently Asked Questions section using an accordion with collapsible questions and answers.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating FAQ section...', 'designsetgo' ),
			'success_message'     => __( 'FAQ section generated successfully.', 'designsetgo' ),
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
					'faqs'  => array(
						'type'        => 'array',
						'description' => __( 'Array of FAQ items', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'question' => array(
									'type'        => 'string',
									'description' => __( 'FAQ question', 'designsetgo' ),
								),
								'answer'   => array(
									'type'        => 'string',
									'description' => __( 'FAQ answer', 'designsetgo' ),
								),
							),
							'required'   => array( 'question', 'answer' ),
						),
						'minItems'    => 1,
						'maxItems'    => 20,
					),
					'title' => array(
						'type'        => 'string',
						'description' => __( 'Optional section title', 'designsetgo' ),
						'default'     => 'Frequently Asked Questions',
					),
				)
			),
			'required'             => array( 'post_id', 'faqs' ),
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
		$faqs     = $input['faqs'] ?? array();
		$title    = sanitize_text_field( $input['title'] ?? 'Frequently Asked Questions' );

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Validate FAQs.
		if ( empty( $faqs ) ) {
			return $this->error(
				'missing_faqs',
				__( 'At least one FAQ is required.', 'designsetgo' )
			);
		}

		// Build section inner blocks.
		$section_blocks = array();

		// Add title if provided.
		if ( ! empty( $title ) ) {
			$section_blocks[] = array(
				'name'       => 'core/heading',
				'attributes' => array(
					'level'   => 2,
					'content' => $title,
				),
			);
		}

		// Build accordion items.
		$accordion_items = array();

		foreach ( $faqs as $index => $faq ) {
			$question = sanitize_text_field( $faq['question'] ?? '' );
			$answer   = wp_kses_post( $faq['answer'] ?? '' );

			if ( empty( $question ) || empty( $answer ) ) {
				continue;
			}

			$accordion_items[] = array(
				'name'        => 'designsetgo/accordion-item',
				'attributes'  => array(
					'title'  => $question,
					'isOpen' => 0 === $index, // First item open by default.
				),
				'innerBlocks' => array(
					array(
						'name'       => 'core/paragraph',
						'attributes' => array(
							'content' => $answer,
						),
					),
				),
			);
		}

		// Create accordion.
		$section_blocks[] = array(
			'name'        => 'designsetgo/accordion',
			'attributes'  => array(
				'allowMultipleOpen' => false,
				'initiallyOpen'     => 'first',
				'iconStyle'         => 'chevron',
			),
			'innerBlocks' => $accordion_items,
		);

		// Wrap in Stack container.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/stack',
			array(
				'constrainWidth' => true,
			),
			$section_blocks,
			$position
		);
	}
}
