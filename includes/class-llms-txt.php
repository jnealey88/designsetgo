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
		$lines[] = '# ' . get_bloginfo( 'name' );
		$lines[] = '';

		// Blockquote - Site description (optional).
		$description = get_bloginfo( 'description' );
		if ( ! empty( $description ) ) {
			$lines[] = '> ' . $description;
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

			$lines[] = '## ' . $post_type_obj->labels->name;
			$lines[] = '';

			foreach ( $posts as $post ) {
				$title = $post->post_title;
				$url   = get_permalink( $post );
				$lines[] = '- [' . $title . '](' . $url . ')';
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
	private function get_public_content( $post_type ) {
		$args = array(
			'post_type'      => $post_type,
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'menu_order date',
			'order'          => 'ASC',
			'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'relation' => 'OR',
				array(
					'key'     => self::EXCLUDE_META_KEY,
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'     => self::EXCLUDE_META_KEY,
					'value'   => '1',
					'compare' => '!=',
				),
			),
		);

		return get_posts( $args );
	}

	/**
	 * Invalidate the llms.txt cache.
	 */
	public function invalidate_cache() {
		delete_transient( self::CACHE_KEY );
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
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
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
}
