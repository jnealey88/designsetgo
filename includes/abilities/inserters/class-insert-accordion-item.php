<?php
/**
 * Insert Accordion Item Ability.
 *
 * Inserts an accordion item block into an existing accordion container.
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
 * Insert Accordion Item ability class.
 */
class Insert_Accordion_Item extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-accordion-item';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Accordion Item', 'designsetgo' ),
			'description'         => __( 'Inserts an accordion item with title and content into an existing accordion container.', 'designsetgo' ),
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
		return array(
			'type'                 => 'object',
			'properties'           => array(
				'post_id'             => array(
					'type'        => 'integer',
					'description' => __( 'Post ID containing the accordion', 'designsetgo' ),
				),
				'accordion_client_id' => array(
					'type'        => 'string',
					'description' => __( 'Client ID of the parent accordion (optional - uses first accordion if not specified)', 'designsetgo' ),
				),
				'title'               => array(
					'type'        => 'string',
					'description' => __( 'Accordion item title/question', 'designsetgo' ),
				),
				'content'             => array(
					'type'        => 'string',
					'description' => __( 'Accordion item content/answer (HTML supported)', 'designsetgo' ),
				),
				'is_open'             => array(
					'type'        => 'boolean',
					'description' => __( 'Whether the item should be initially open', 'designsetgo' ),
					'default'     => false,
				),
				'position'            => array(
					'type'        => 'integer',
					'description' => __( 'Position within the accordion (-1 = append, 0 = prepend)', 'designsetgo' ),
					'default'     => -1,
				),
			),
			'required'             => array( 'post_id', 'title', 'content' ),
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
		$post_id             = (int) ( $input['post_id'] ?? 0 );
		$accordion_client_id = $input['accordion_client_id'] ?? null;
		$title               = sanitize_text_field( $input['title'] ?? '' );
		$content             = wp_kses_post( $input['content'] ?? '' );
		$is_open             = (bool) ( $input['is_open'] ?? false );
		$position            = (int) ( $input['position'] ?? -1 );

		// Validate required parameters.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		if ( empty( $title ) ) {
			return $this->error(
				'missing_title',
				__( 'Accordion item title is required.', 'designsetgo' )
			);
		}

		if ( empty( $content ) ) {
			return $this->error(
				'missing_content',
				__( 'Accordion item content is required.', 'designsetgo' )
			);
		}

		// Validate post exists.
		$post = get_post( $post_id );
		if ( ! $post ) {
			return $this->error(
				'invalid_post',
				__( 'Post not found.', 'designsetgo' )
			);
		}

		// Check permission for this specific post.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $this->permission_error();
		}

		// Parse blocks.
		$blocks = parse_blocks( $post->post_content );

		// Find the accordion block.
		$accordion_found = false;
		$blocks          = $this->add_item_to_accordion(
			$blocks,
			$accordion_client_id,
			$title,
			$content,
			$is_open,
			$position,
			$accordion_found
		);

		if ( ! $accordion_found ) {
			return $this->error(
				'accordion_not_found',
				__( 'No accordion block found in the post.', 'designsetgo' )
			);
		}

		// Serialize and update post.
		$new_content = serialize_blocks( $blocks );

		$updated = wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => $new_content,
			),
			true
		);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return array(
			'success'  => true,
			'post_id'  => $post_id,
			'block_id' => wp_unique_id( 'block-' ),
			'position' => $position,
		);
	}

	/**
	 * Add accordion item to an accordion block.
	 *
	 * @param array<int, array<string, mixed>> $blocks     Blocks array.
	 * @param string|null                      $client_id  Target accordion client ID.
	 * @param string                           $title      Item title.
	 * @param string                           $content    Item content.
	 * @param bool                             $is_open    Whether item is open.
	 * @param int                              $position   Position to insert.
	 * @param bool                             $found      Reference to track if found.
	 * @return array<int, array<string, mixed>> Modified blocks.
	 */
	private function add_item_to_accordion(
		array $blocks,
		?string $client_id,
		string $title,
		string $content,
		bool $is_open,
		int $position,
		bool &$found
	): array {
		foreach ( $blocks as &$block ) {
			// Check if this is the target accordion.
			if ( 'designsetgo/accordion' === $block['blockName'] ) {
				// If client_id specified, check it matches.
				if ( $client_id && isset( $block['attrs']['clientId'] ) && $block['attrs']['clientId'] !== $client_id ) {
					continue;
				}

				// Create the accordion item.
				$new_item = array(
					'blockName'    => 'designsetgo/accordion-item',
					'attrs'        => array(
						'title'  => $title,
						'isOpen' => $is_open,
					),
					'innerBlocks'  => array(
						array(
							'blockName'    => 'core/paragraph',
							'attrs'        => array(),
							'innerBlocks'  => array(),
							'innerHTML'    => '<p>' . $content . '</p>',
							'innerContent' => array( '<p>' . $content . '</p>' ),
						),
					),
					'innerHTML'    => '',
					'innerContent' => array( null ),
				);

				// Initialize innerBlocks if not set.
				if ( ! isset( $block['innerBlocks'] ) ) {
					$block['innerBlocks'] = array();
				}

				// Insert at position.
				if ( -1 === $position ) {
					$block['innerBlocks'][] = $new_item;
				} elseif ( 0 === $position ) {
					array_unshift( $block['innerBlocks'], $new_item );
				} else {
					array_splice( $block['innerBlocks'], $position, 0, array( $new_item ) );
				}

				$found = true;
				return $blocks;
			}

			// Check inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = $this->add_item_to_accordion(
					$block['innerBlocks'],
					$client_id,
					$title,
					$content,
					$is_open,
					$position,
					$found
				);

				if ( $found ) {
					return $blocks;
				}
			}
		}

		return $blocks;
	}
}
