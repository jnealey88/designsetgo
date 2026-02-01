<?php
/**
 * LLMS TXT Controller
 *
 * Main orchestration class for llms.txt functionality.
 *
 * @package DesignSetGo
 * @since 1.4.0
 * @see https://llmstxt.org/
 */

namespace DesignSetGo\LLMS_Txt;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Controller Class
 *
 * Orchestrates llms.txt feature components.
 */
class Controller {
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
	 * File manager instance.
	 *
	 * @var File_Manager
	 */
	private $file_manager;

	/**
	 * Generator instance.
	 *
	 * @var Generator
	 */
	private $generator;

	/**
	 * REST controller instance.
	 *
	 * @var REST_Controller
	 */
	private $rest_controller;

	/**
	 * Conflict detector instance.
	 *
	 * @var Conflict_Detector
	 */
	private $conflict_detector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Initialize components.
		$this->file_manager      = new File_Manager();
		$this->generator         = new Generator( $this->file_manager );
		$this->conflict_detector = new Conflict_Detector();
		$this->rest_controller   = new REST_Controller(
			$this->file_manager,
			$this->generator,
			$this->conflict_detector
		);

		// Register hooks.
		add_action( 'init', array( $this, 'add_rewrite_rule' ) );
		add_filter( 'query_vars', array( $this, 'add_query_var' ) );
		add_action( 'template_redirect', array( $this, 'handle_request' ) );
		add_action( 'save_post', array( $this, 'handle_post_save' ), 10, 2 );
		add_action( 'delete_post', array( $this, 'handle_post_delete' ) );
		add_action( 'transition_post_status', array( $this, 'invalidate_cache' ) );
		add_action( 'update_option_designsetgo_settings', array( $this, 'invalidate_cache' ) );
		add_action( 'init', array( $this, 'register_post_meta' ) );
		add_action( 'rest_api_init', array( $this->rest_controller, 'register_routes' ) );
		add_action( 'admin_notices', array( $this->conflict_detector, 'maybe_show_notice' ) );
	}

	/**
	 * Add rewrite rule for llms.txt.
	 */
	public function add_rewrite_rule(): void {
		add_rewrite_rule( '^llms\.txt$', 'index.php?llms_txt=1', 'top' );

		if ( get_transient( 'designsetgo_llms_txt_flush_rules' ) ) {
			delete_transient( 'designsetgo_llms_txt_flush_rules' );
			flush_rewrite_rules();
		}
	}

	/**
	 * Schedule rewrite rules flush.
	 */
	public static function schedule_flush_rewrite_rules(): void {
		set_transient( 'designsetgo_llms_txt_flush_rules', true, HOUR_IN_SECONDS );
	}

	/**
	 * Add query var for llms.txt.
	 *
	 * @param array $vars Existing query vars.
	 * @return array Modified query vars.
	 */
	public function add_query_var( array $vars ): array {
		$vars[] = 'llms_txt';
		return $vars;
	}

	/**
	 * Handle llms.txt requests.
	 */
	public function handle_request(): void {
		if ( ! get_query_var( 'llms_txt' ) ) {
			return;
		}

		$settings = \DesignSetGo\Admin\Settings::get_settings();
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
	private function serve_llms_txt(): void {
		$content = get_transient( self::CACHE_KEY );

		if ( false === $content ) {
			$content = $this->generator->generate_content();
			set_transient( self::CACHE_KEY, $content, self::CACHE_EXPIRATION );
		}

		header( 'Content-Type: text/plain; charset=utf-8' );
		header( 'X-Robots-Tag: noindex' );
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Plain text file output.
	}

	/**
	 * Handle post save - invalidate cache and regenerate markdown file.
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post object.
	 */
	public function handle_post_save( int $post_id, \WP_Post $post ): void {
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}

		$this->invalidate_cache( $post_id );
		$this->file_manager->generate_file( $post_id );
	}

	/**
	 * Handle post delete - remove markdown file and invalidate cache.
	 *
	 * @param int $post_id Post ID.
	 */
	public function handle_post_delete( int $post_id ): void {
		$this->invalidate_cache( $post_id );
		$this->file_manager->delete_file( $post_id );
	}

	/**
	 * Invalidate the llms.txt cache.
	 *
	 * @param int|null $post_id Optional post ID for individual markdown cache.
	 */
	public function invalidate_cache( $post_id = null ): void {
		delete_transient( self::CACHE_KEY );

		if ( $post_id && is_numeric( $post_id ) ) {
			delete_transient( 'designsetgo_llms_md_' . absint( $post_id ) );
		}
	}

	/**
	 * Register post meta for exclusion toggle.
	 */
	public function register_post_meta(): void {
		$post_types = get_post_types( array( 'public' => true ), 'names' );

		foreach ( $post_types as $post_type ) {
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
					'auth_callback'     => function ( $allowed, $meta_key, $post_id ) {
						if ( ! $post_id || ! is_numeric( $post_id ) ) {
							return false;
						}
						return current_user_can( 'edit_post', (int) $post_id );
					},
				)
			);
		}
	}

	/**
	 * Get the file manager instance.
	 *
	 * @return File_Manager
	 */
	public function get_file_manager(): File_Manager {
		return $this->file_manager;
	}

	/**
	 * Get the generator instance.
	 *
	 * @return Generator
	 */
	public function get_generator(): Generator {
		return $this->generator;
	}
}
