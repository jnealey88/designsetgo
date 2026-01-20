<?php
/**
 * LLMS TXT Generator Class
 *
 * Serves a dynamic llms.txt file at the site root to help
 * AI language models understand site content.
 *
 * @package DesignSetGo
 * @since 1.4.0
 * @see https://llmstxt.org/
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * LLMS_Txt Class - Generates and serves llms.txt
 */
class LLMS_Txt {
	/**
	 * Cache key for transient storage.
	 */
	const CACHE_KEY = 'designsetgo_llms_txt_cache';

	/**
	 * Cache expiration in seconds (1 day).
	 */
	const CACHE_EXPIRATION = DAY_IN_SECONDS;

	/**
	 * Post meta key for exclusion.
	 */
	const EXCLUDE_META_KEY = '_designsetgo_exclude_llms';

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Register rewrite rule and query var.
		add_action( 'init', array( $this, 'add_rewrite_rule' ) );
		add_filter( 'query_vars', array( $this, 'add_query_var' ) );

		// Handle llms.txt requests.
		add_action( 'template_redirect', array( $this, 'handle_request' ) );

		// Cache invalidation hooks.
		add_action( 'save_post', array( $this, 'invalidate_cache' ) );
		add_action( 'delete_post', array( $this, 'invalidate_cache' ) );
		add_action( 'transition_post_status', array( $this, 'invalidate_cache' ) );
		// Invalidate cache when settings are updated.
		add_action( 'update_option_designsetgo_settings', array( $this, 'invalidate_cache' ) );

		// Register post meta for exclusion.
		add_action( 'init', array( $this, 'register_post_meta' ) );

		// Register REST endpoint for post types.
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/**
	 * Add rewrite rule for llms.txt.
	 */
	public function add_rewrite_rule() {
		add_rewrite_rule( '^llms\.txt$', 'index.php?llms_txt=1', 'top' );

		// Flush rewrite rules once after feature is first initialized.
		// This ensures llms.txt URL works without manual permalink save.
		if ( get_transient( 'designsetgo_llms_txt_flush_rules' ) ) {
			delete_transient( 'designsetgo_llms_txt_flush_rules' );
			flush_rewrite_rules();
		}
	}

	/**
	 * Schedule rewrite rules flush.
	 *
	 * Call this method when the feature is first enabled or after plugin activation.
	 */
	public static function schedule_flush_rewrite_rules() {
		set_transient( 'designsetgo_llms_txt_flush_rules', true, HOUR_IN_SECONDS );
	}

	/**
	 * Add query var for llms.txt.
	 *
	 * @param array $vars Existing query vars.
	 * @return array Modified query vars.
	 */
	public function add_query_var( $vars ) {
		$vars[] = 'llms_txt';
		return $vars;
	}

	/**
	 * Handle llms.txt requests.
	 */
	public function handle_request() {
		if ( ! get_query_var( 'llms_txt' ) ) {
			return;
		}

		// Check if feature is enabled.
		$settings = Admin\Settings::get_settings();
		if ( empty( $settings['llms_txt']['enable'] ) ) {
			status_header( 404 );
			exit;
		}

		$this->serve_llms_txt();
		exit;
	}

	/**
	 * Serve the llms.txt content.
	 */
	private function serve_llms_txt() {
		// Try cache first.
		$content = get_transient( self::CACHE_KEY );

		if ( false === $content ) {
			$content = $this->generate_content();
			set_transient( self::CACHE_KEY, $content, self::CACHE_EXPIRATION );
		}

		// Serve with proper headers.
		header( 'Content-Type: text/plain; charset=utf-8' );
		header( 'X-Robots-Tag: noindex' );
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Plain text file output.
	}

	/**
	 * Generate llms.txt content following the specification.
	 *
	 * @return string Generated content.
	 */
	private function generate_content() {
		$settings      = Admin\Settings::get_settings();
		$llms_settings = wp_parse_args(
			$settings['llms_txt'] ?? array(),
			Admin\Settings::get_defaults()['llms_txt']
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
				$lines[] = '- [' . $title . '](' . $url . ')';
			}

			$lines[] = '';
		}

		return implode( "\n", $lines );
	}

	/**
	 * Escape special markdown characters in text.
	 *
	 * @param string $text Text to escape.
	 * @return string Escaped text.
	 */
	private function escape_markdown( $text ) {
		// Escape common markdown special characters.
		$special_chars = array( '\\', '`', '*', '_', '{', '}', '[', ']', '(', ')', '#', '+', '-', '.', '!', '|' );
		foreach ( $special_chars as $char ) {
			$text = str_replace( $char, '\\' . $char, $text );
		}
		return $text;
	}

	/**
	 * Escape special characters in markdown link text.
	 *
	 * Only escapes characters that would break link syntax.
	 *
	 * @param string $text Link text to escape.
	 * @return string Escaped text.
	 */
	private function escape_markdown_link( $text ) {
		// Only escape characters that break link syntax: [ ] ( ).
		$text = str_replace( '\\', '\\\\', $text );
		$text = str_replace( '[', '\\[', $text );
		$text = str_replace( ']', '\\]', $text );
		$text = str_replace( '(', '\\(', $text );
		$text = str_replace( ')', '\\)', $text );
		return $text;
	}

	/**
	 * Get public content for a post type, excluding marked posts.
	 *
	 * @param string $post_type Post type name.
	 * @return array Array of WP_Post objects.
	 */
	private function get_public_content( $post_type ) {
		/**
		 * Filter the query arguments for fetching public content.
		 *
		 * Note: Uses posts_per_page => -1 which fetches all posts. For sites with
		 * thousands of posts, results are cached via transients to mitigate performance.
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
				'posts_per_page' => -1,
				'orderby'        => 'menu_order date',
				'order'          => 'ASC',
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
	 * Invalidate the llms.txt cache.
	 *
	 * @param int|null $post_id Optional post ID for individual markdown cache.
	 */
	public function invalidate_cache( $post_id = null ) {
		// Always invalidate the main llms.txt cache.
		delete_transient( self::CACHE_KEY );

		// If post_id provided, also invalidate its markdown cache.
		if ( $post_id && is_numeric( $post_id ) ) {
			$this->invalidate_markdown_cache( absint( $post_id ) );
		}
	}

	/**
	 * Register post meta for exclusion toggle.
	 */
	public function register_post_meta() {
		$post_types = get_post_types( array( 'public' => true ), 'names' );

		foreach ( $post_types as $post_type ) {
			// Skip attachments.
			if ( 'attachment' === $post_type ) {
				continue;
			}

			register_post_meta(
				$post_type,
				self::EXCLUDE_META_KEY,
				array(
					'type'              => 'boolean',
					'description'       => __( 'Exclude this content from llms.txt', 'designsetgo' ),
					'single'            => true,
					'default'           => false,
					'show_in_rest'      => true,
					'sanitize_callback' => 'rest_sanitize_boolean',
					'auth_callback'     => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}

	/**
	 * Register REST API routes.
	 */
	public function register_rest_routes() {
		register_rest_route(
			'designsetgo/v1',
			'/llms-txt/post-types',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_post_types_endpoint' ),
				// Note: Uses 'manage_options' (admin-only) because this endpoint is for
				// settings configuration. The per-post exclusion meta uses 'edit_posts'
				// so editors can exclude their own content without accessing settings.
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Markdown endpoint for individual posts.
		register_rest_route(
			'designsetgo/v1',
			'/llms-txt/markdown/(?P<post_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_post_markdown_endpoint' ),
				// Public endpoint - allows LLMs to fetch content without authentication.
				'permission_callback' => '__return_true',
				'args'                => array(
					'post_id' => array(
						'description'       => __( 'Post ID to convert to markdown.', 'designsetgo' ),
						'type'              => 'integer',
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param ) && $param > 0;
						},
					),
				),
			)
		);
	}

	/**
	 * Get available post types endpoint.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_post_types_endpoint() {
		$post_types = get_post_types(
			array( 'public' => true ),
			'objects'
		);

		$result = array();
		foreach ( $post_types as $post_type ) {
			// Skip attachments.
			if ( 'attachment' === $post_type->name ) {
				continue;
			}

			$result[] = array(
				'name'  => $post_type->name,
				'label' => $post_type->labels->name,
			);
		}

		return rest_ensure_response( $result );
	}

	/**
	 * Get post content as markdown endpoint.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response or error.
	 */
	public function get_post_markdown_endpoint( $request ) {
		$post_id = absint( $request->get_param( 'post_id' ) );
		$post    = get_post( $post_id );

		// Validate post exists.
		if ( ! $post ) {
			return new \WP_Error(
				'not_found',
				__( 'Post not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		// Validate post is published.
		if ( 'publish' !== $post->post_status ) {
			return new \WP_Error(
				'not_published',
				__( 'Post is not published.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		// Check if post is excluded from llms.txt.
		$excluded = get_post_meta( $post_id, self::EXCLUDE_META_KEY, true );
		if ( $excluded ) {
			return new \WP_Error(
				'excluded',
				__( 'This post is excluded from llms.txt.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		// Check if feature is enabled.
		$settings = Admin\Settings::get_settings();
		if ( empty( $settings['llms_txt']['enable'] ) ) {
			return new \WP_Error(
				'feature_disabled',
				__( 'llms.txt feature is not enabled.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		// Check if post type is enabled.
		$enabled_post_types = $settings['llms_txt']['post_types'] ?? array( 'page', 'post' );
		if ( ! in_array( $post->post_type, $enabled_post_types, true ) ) {
			return new \WP_Error(
				'post_type_disabled',
				__( 'This post type is not enabled for llms.txt.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		// Try cache first.
		$cache_key = 'designsetgo_llms_md_' . $post_id;
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return rest_ensure_response( $cached );
		}

		// Convert to markdown.
		$converter = new Markdown_Converter();
		$markdown  = $converter->convert( $post );

		$result = array(
			'id'       => $post->ID,
			'title'    => $post->post_title,
			'url'      => get_permalink( $post ),
			'updated'  => get_post_modified_time( 'c', true, $post ),
			'markdown' => $markdown,
		);

		// Cache the result.
		set_transient( $cache_key, $result, self::CACHE_EXPIRATION );

		return rest_ensure_response( $result );
	}

	/**
	 * Invalidate markdown cache for a specific post.
	 *
	 * @param int $post_id Post ID.
	 */
	public function invalidate_markdown_cache( $post_id ) {
		delete_transient( 'designsetgo_llms_md_' . $post_id );
	}
}
