<?php
/**
 * Revision Comparison Class
 *
 * Provides visual revision comparison for block-based content.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

namespace DesignSetGo\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Revision_Comparison Class - Visual revision comparison for blocks
 *
 * Handles admin page registration, asset loading, and page rendering.
 * REST API endpoints are handled by Revision_REST_API class.
 * Block diff computation is handled by Block_Differ class.
 */
class Revision_Comparison {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Check if visual comparison is enabled in settings.
		$settings = Settings::get_settings();
		if ( empty( $settings['revisions']['enable_visual_comparison'] ) ) {
			return;
		}

		// Initialize REST API (handles its own action hooks).
		new Revision_REST_API();

		add_action( 'admin_menu', array( $this, 'register_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'setup_revision_button' ) );

		// Redirect to visual comparison by default.
		add_action( 'admin_init', array( $this, 'maybe_redirect_to_visual_comparison' ) );
	}

	/**
	 * Maybe redirect to visual comparison page
	 *
	 * Redirects users from the standard revision.php page to visual comparison by default.
	 */
	public function maybe_redirect_to_visual_comparison() {
		// Only redirect on revision.php page.
		global $pagenow;

		if ( 'revision.php' !== $pagenow ) {
			return;
		}

		// Check if visual comparison redirect is enabled in settings.
		$settings = Settings::get_settings();
		if ( empty( $settings['revisions']['default_to_visual'] ) ) {
			return;
		}

		// Don't redirect if an action is being performed (e.g., restore).
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameter check.
		if ( isset( $_GET['action'] ) ) {
			return;
		}

		// Check if user explicitly wants standard view.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameter check.
		if ( isset( $_GET['view'] ) && 'standard' === $_GET['view'] ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameter check.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		if ( ! $revision_id ) {
			return;
		}

		$revision = wp_get_post_revision( $revision_id );

		if ( ! $revision ) {
			return;
		}

		$post = get_post( $revision->post_parent );

		if ( ! $post || ! current_user_can( 'edit_post', $post->ID ) ) {
			return;
		}

		$visual_url = add_query_arg(
			array(
				'page'     => 'designsetgo-revisions',
				'post_id'  => $post->ID,
				'revision' => $revision_id,
			),
			admin_url( 'admin.php' )
		);

		wp_safe_redirect( $visual_url );
		exit;
	}

	/**
	 * Register hidden admin page for visual revision comparison
	 */
	public function register_page() {
		add_submenu_page(
			'options.php', // Hidden from menu (options.php is not displayed).
			__( 'Visual Revision Comparison', 'designsetgo' ),
			__( 'Visual Revision Comparison', 'designsetgo' ),
			'edit_posts',
			'designsetgo-revisions',
			array( $this, 'render_page' )
		);
	}

	/**
	 * Setup visual comparison button on revision screen
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function setup_revision_button( $hook ) {
		if ( 'revision.php' !== $hook ) {
			return;
		}

		// Add the button via admin_footer for reliability.
		add_action( 'admin_footer', array( $this, 'output_revision_button_script' ) );
	}

	/**
	 * Output the script that adds the visual comparison tab navigation
	 */
	public function output_revision_button_script() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameter check.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		if ( ! $revision_id ) {
			return;
		}

		$revision = wp_get_post_revision( $revision_id );

		if ( ! $revision ) {
			return;
		}

		$post = get_post( $revision->post_parent );

		if ( ! $post || ! current_user_can( 'edit_post', $post->ID ) ) {
			return;
		}

		require DESIGNSETGO_PATH . 'includes/admin/views/revision-tabs-script.php';
	}

	/**
	 * Enqueue assets for revision comparison page
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_assets( $hook ) {
		if ( 'admin_page_designsetgo-revisions' !== $hook ) {
			return;
		}

		$asset_file = DESIGNSETGO_PATH . 'build/revisions.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;

		wp_enqueue_script(
			'designsetgo-revisions',
			DESIGNSETGO_URL . 'build/revisions.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_set_script_translations(
			'designsetgo-revisions',
			'designsetgo',
			DESIGNSETGO_PATH . 'languages'
		);

		wp_enqueue_style(
			'designsetgo-revisions',
			DESIGNSETGO_URL . 'build/revisions.css',
			array( 'wp-components' ),
			$asset['version']
		);

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$post_id     = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		// If no post_id but we have a revision, get post_id from revision.
		if ( ! $post_id && $revision_id ) {
			$post_id = $this->get_post_id_from_revision( $revision_id );
		}

		$edit_url = $post_id ? get_edit_post_link( $post_id, 'raw' ) : '';

		wp_localize_script(
			'designsetgo-revisions',
			'designSetGoRevisions',
			array(
				'apiUrl'     => esc_url_raw( rest_url( 'designsetgo/v1' ) ),
				'nonce'      => wp_create_nonce( 'wp_rest' ),
				'postId'     => $post_id,
				'revisionId' => $revision_id,
				'adminUrl'   => esc_url( admin_url() ),
				'editUrl'    => $edit_url ? esc_url( $edit_url ) : '',
			)
		);
	}

	/**
	 * Get post ID from a revision ID
	 *
	 * @param int $revision_id Revision ID.
	 * @return int Post ID or 0.
	 */
	private function get_post_id_from_revision( $revision_id ) {
		$revision = wp_get_post_revision( $revision_id );
		if ( $revision ) {
			return $revision->post_parent;
		}

		// Maybe it's the current post ID, not a revision.
		$maybe_post = get_post( $revision_id );
		if ( $maybe_post && 'revision' !== $maybe_post->post_type ) {
			return $revision_id;
		}

		return 0;
	}

	/**
	 * Render the revision comparison page
	 */
	public function render_page() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		// If no post_id but we have a revision, get post_id from revision.
		if ( ! $post_id && $revision_id ) {
			$post_id = $this->get_post_id_from_revision( $revision_id );
		}

		if ( ! $post_id ) {
			wp_die( esc_html__( 'No post specified.', 'designsetgo' ) );
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			wp_die( esc_html__( 'You do not have permission to view revisions for this post.', 'designsetgo' ) );
		}

		$post = get_post( $post_id );

		if ( ! $post ) {
			wp_die( esc_html__( 'Post not found.', 'designsetgo' ) );
		}

		require DESIGNSETGO_PATH . 'includes/admin/views/revision-comparison-page.php';
	}
}
