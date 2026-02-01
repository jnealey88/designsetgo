<?php
/**
 * LLMS TXT Content Generator
 *
 * Generates the content for the llms.txt file.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

namespace DesignSetGo\LLMS_Txt;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Generator Class
 *
 * Handles content generation for llms.txt.
 */
class Generator {
	/**
	 * Post meta key for exclusion.
	 */
	const EXCLUDE_META_KEY = '_designsetgo_exclude_llms';

	/**
	 * Default maximum posts per post type.
	 */
	const DEFAULT_POSTS_LIMIT = 500;

	/**
	 * File manager instance.
	 *
	 * @var File_Manager
	 */
	private $file_manager;

	/**
	 * Constructor.
	 *
	 * @param File_Manager $file_manager File manager instance.
	 */
	public function __construct( File_Manager $file_manager ) {
		$this->file_manager = $file_manager;
	}

	/**
	 * Generate llms.txt content following the specification.
	 *
	 * @return string Generated content.
	 */
	public function generate_content(): string {
		$settings      = \DesignSetGo\Admin\Settings::get_settings();
		$llms_settings = wp_parse_args(
			$settings['llms_txt'] ?? array(),
			\DesignSetGo\Admin\Settings::get_defaults()['llms_txt']
		);

		$lines = array();

		// H1 - Site name (required).
		$lines[] = '# ' . $this->escape_markdown( get_bloginfo( 'name' ) );
		$lines[] = '';

		// Blockquote - Site description (optional).
		$description = get_bloginfo( 'description' );
		if ( ! empty( $description ) ) {
			$lines[] = '> ' . $this->escape_markdown( $description );
			$lines[] = '';
		}

		// Get enabled post types.
		$post_types = $llms_settings['post_types'] ?? array( 'page', 'post' );

		// Generate sections for each post type.
		foreach ( $post_types as $post_type ) {
			$posts = $this->get_public_content( $post_type );

			if ( empty( $posts ) ) {
				continue;
			}

			$post_type_obj = get_post_type_object( $post_type );
			if ( ! $post_type_obj ) {
				continue;
			}

			$lines[] = '## ' . $this->escape_markdown( $post_type_obj->labels->name );
			$lines[] = '';

			foreach ( $posts as $post ) {
				$title = $this->escape_markdown_link( $post->post_title );
				$url   = get_permalink( $post );

				// Use static file URL if it exists, otherwise fall back to API.
				if ( $this->file_manager->file_exists( $post->ID ) ) {
					$markdown_url = $this->file_manager->get_url( $post->ID );
				} else {
					$markdown_url = rest_url( 'designsetgo/v1/llms-txt/markdown/' . $post->ID );
				}

				$lines[] = '- [' . $title . '](' . $url . ') ([markdown](' . $markdown_url . '))';
			}

			$lines[] = '';
		}

		return implode( "\n", $lines );
	}

	/**
	 * Get public content for a post type, excluding marked posts.
	 *
	 * @param string $post_type Post type name.
	 * @return array Array of WP_Post objects.
	 */
	public function get_public_content( string $post_type ): array {
		/**
		 * Filter the maximum number of posts to include per post type.
		 *
		 * @since 1.4.0
		 *
		 * @param int    $limit     Maximum posts per post type.
		 * @param string $post_type Post type being queried.
		 */
		$posts_limit = apply_filters(
			'designsetgo_llms_txt_posts_limit',
			self::DEFAULT_POSTS_LIMIT,
			$post_type
		);

		/**
		 * Filter the query arguments for fetching public content.
		 *
		 * @since 1.4.0
		 *
		 * @param array  $args      Query arguments.
		 * @param string $post_type Post type being queried.
		 */
		$args = apply_filters(
			'designsetgo_llms_txt_query_args',
			array(
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => $posts_limit,
				'orderby'        => 'menu_order date',
				'order'          => 'ASC',
				'has_password'   => false, // Exclude password-protected posts.
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- Required for exclusion feature.
				'meta_query'     => array(
					'relation' => 'OR',
					// Include posts without the meta key (not explicitly excluded).
					array(
						'key'     => self::EXCLUDE_META_KEY,
						'compare' => 'NOT EXISTS',
					),
					// Include posts where meta is explicitly false/0/empty.
					array(
						'key'     => self::EXCLUDE_META_KEY,
						'value'   => array( '', '0', 'false' ),
						'compare' => 'IN',
					),
				),
			),
			$post_type
		);

		return get_posts( $args );
	}

	/**
	 * Escape special markdown characters in text.
	 *
	 * @param string $text Text to escape.
	 * @return string Escaped text.
	 */
	public function escape_markdown( string $text ): string {
		$special_chars = array( '\\', '`', '*', '_', '{', '}', '[', ']', '(', ')', '#', '+', '-', '.', '!', '|' );
		foreach ( $special_chars as $char ) {
			$text = str_replace( $char, '\\' . $char, $text );
		}
		return $text;
	}

	/**
	 * Escape special characters in markdown link text.
	 *
	 * @param string $text Link text to escape.
	 * @return string Escaped text.
	 */
	public function escape_markdown_link( string $text ): string {
		$text = str_replace( '\\', '\\\\', $text );
		$text = str_replace( '[', '\\[', $text );
		$text = str_replace( ']', '\\]', $text );
		$text = str_replace( '(', '\\(', $text );
		$text = str_replace( ')', '\\)', $text );
		return $text;
	}
}
