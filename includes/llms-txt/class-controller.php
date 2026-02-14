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
	 * Option key tracking ownership of the physical llms.txt file.
	 */
	const PHYSICAL_FILE_OPTION = 'designsetgo_llms_txt_physical';

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
		add_filter( 'redirect_canonical', array( $this, 'prevent_trailing_slash' ) );
		add_action( 'template_redirect', array( $this, 'handle_request' ) );
		add_action( 'save_post', array( $this, 'handle_post_save' ), 10, 2 );
		add_action( 'delete_post', array( $this, 'handle_post_delete' ) );
		add_action( 'transition_post_status', array( $this, 'invalidate_cache' ) );
		add_action( 'update_option_designsetgo_settings', array( $this, 'handle_settings_update' ), 10, 2 );
		add_action( 'init', array( $this, 'register_post_meta' ) );
		add_action( 'rest_api_init', array( $this->rest_controller, 'register_routes' ) );
		add_action( 'admin_notices', array( $this->conflict_detector, 'maybe_show_notice' ) );
		add_action( 'admin_init', array( $this->conflict_detector, 'handle_dismiss_action' ) );
	}

	/**
	 * Rewrite rule pattern for llms.txt.
	 */
	const REWRITE_PATTERN = '^llms\\.txt/?$';

	/**
	 * Add rewrite rule for llms.txt.
	 */
	public function add_rewrite_rule(): void {
		add_rewrite_rule( self::REWRITE_PATTERN, 'index.php?llms_txt=1', 'top' );

		if ( get_transient( 'designsetgo_llms_txt_flush_rules' ) ) {
			delete_transient( 'designsetgo_llms_txt_flush_rules' );
			flush_rewrite_rules();
			return;
		}

		// Flush if our rule is missing from stored rules (covers updates without activation).
		$rules = get_option( 'rewrite_rules' );
		if ( is_array( $rules ) && ! isset( $rules[ self::REWRITE_PATTERN ] ) ) {
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
	 * Prevent WordPress from adding a trailing slash to llms.txt.
	 *
	 * @param string $redirect_url The redirect URL.
	 * @return string|false The redirect URL, or false to cancel the redirect.
	 */
	public function prevent_trailing_slash( $redirect_url ) {
		if ( get_query_var( 'llms_txt' ) === '1' ) {
			return false;
		}
		return $redirect_url;
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
		$this->refresh_physical_file();
	}

	/**
	 * Handle post delete - remove markdown file and invalidate cache.
	 *
	 * @param int $post_id Post ID.
	 */
	public function handle_post_delete( int $post_id ): void {
		$this->invalidate_cache( $post_id );
		$this->file_manager->delete_file( $post_id );
		$this->refresh_physical_file();
	}

	/**
	 * Refresh the physical llms.txt file if we maintain one.
	 */
	private function refresh_physical_file(): void {
		if ( get_option( self::PHYSICAL_FILE_OPTION ) ) {
			$this->write_physical_file();
		}
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
	 * Handle settings update — invalidate cache and flush rewrite rules when needed.
	 *
	 * @param array $old_value Previous settings value.
	 * @param array $new_value Updated settings value.
	 */
	public function handle_settings_update( $old_value, $new_value ): void {
		$this->invalidate_cache();

		$was_enabled = ! empty( $old_value['llms_txt']['enable'] );
		$is_enabled  = ! empty( $new_value['llms_txt']['enable'] );

		if ( $is_enabled !== $was_enabled ) {
			// Flush immediately so the rule is active before the next request.
			// Must register the rule first since this may run outside of init.
			add_rewrite_rule( self::REWRITE_PATTERN, 'index.php?llms_txt=1', 'top' );
			flush_rewrite_rules();

			if ( $is_enabled ) {
				$this->write_physical_file();
			} else {
				$this->delete_physical_file();
			}
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
	 * Write a physical llms.txt file to the site root.
	 *
	 * This ensures /llms.txt works regardless of permalink structure.
	 * Apache serves physical files directly, bypassing WordPress rewrite rules.
	 *
	 * @return bool True on success.
	 */
	public function write_physical_file(): bool {
		$settings = \DesignSetGo\Admin\Settings::get_settings();
		if ( empty( $settings['llms_txt']['enable'] ) ) {
			return false;
		}

		$content = $this->generator->generate_content();
		if ( empty( $content ) ) {
			return false;
		}

		$file_path = ABSPATH . 'llms.txt';

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- Direct write for performance.
		$result = file_put_contents( $file_path, $content );

		if ( false !== $result ) {
			update_option( self::PHYSICAL_FILE_OPTION, true, true );
			return true;
		}

		return false;
	}

	/**
	 * Delete the physical llms.txt file if we own it.
	 */
	public function delete_physical_file(): void {
		if ( ! get_option( self::PHYSICAL_FILE_OPTION ) ) {
			return;
		}

		$file_path = ABSPATH . 'llms.txt';
		if ( file_exists( $file_path ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink -- Direct file operation required.
			unlink( $file_path );
		}

		delete_option( self::PHYSICAL_FILE_OPTION );
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
