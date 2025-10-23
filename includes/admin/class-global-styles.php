<?php
/**
 * Global Styles Management Class
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Global Styles Class - Integrates with theme.json
 */
class Global_Styles {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'wp_theme_json_data_theme', array( $this, 'extend_theme_json' ) );
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/**
	 * Extend theme.json with DesignSetGo presets.
	 *
	 * @param \WP_Theme_JSON_Data $theme_json Theme JSON object.
	 * @return \WP_Theme_JSON_Data Modified theme JSON.
	 */
	public function extend_theme_json( $theme_json ) {
		$dsg_settings = array(
			'version'  => 2,
			'settings' => array(
				'color'      => array(
					'palette' => array(
						array(
							'slug'  => 'dsg-primary',
							'color' => '#2563eb',
							'name'  => __( 'DesignSetGo Primary', 'designsetgo' ),
						),
						array(
							'slug'  => 'dsg-secondary',
							'color' => '#7c3aed',
							'name'  => __( 'DesignSetGo Secondary', 'designsetgo' ),
						),
						array(
							'slug'  => 'dsg-accent',
							'color' => '#f59e0b',
							'name'  => __( 'DesignSetGo Accent', 'designsetgo' ),
						),
					),
					'gradients' => array(
						array(
							'slug'     => 'dsg-primary-to-secondary',
							'gradient' => 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
							'name'     => __( 'Primary to Secondary', 'designsetgo' ),
						),
					),
				),
				'spacing'    => array(
					'spacingScale' => array(
						'steps' => 0,
					),
					'spacingSizes' => array(
						array(
							'slug' => 'xs',
							'size' => '0.5rem',
							'name' => __( 'Extra Small', 'designsetgo' ),
						),
						array(
							'slug' => 'sm',
							'size' => '1rem',
							'name' => __( 'Small', 'designsetgo' ),
						),
						array(
							'slug' => 'md',
							'size' => '1.5rem',
							'name' => __( 'Medium', 'designsetgo' ),
						),
						array(
							'slug' => 'lg',
							'size' => '2rem',
							'name' => __( 'Large', 'designsetgo' ),
						),
						array(
							'slug' => 'xl',
							'size' => '3rem',
							'name' => __( 'Extra Large', 'designsetgo' ),
						),
					),
				),
				'typography' => array(
					'fontSizes' => array(
						array(
							'slug' => 'small',
							'size' => '14px',
							'name' => __( 'Small', 'designsetgo' ),
						),
						array(
							'slug' => 'medium',
							'size' => '16px',
							'name' => __( 'Medium', 'designsetgo' ),
						),
						array(
							'slug' => 'large',
							'size' => '24px',
							'name' => __( 'Large', 'designsetgo' ),
						),
						array(
							'slug' => 'x-large',
							'size' => '32px',
							'name' => __( 'Extra Large', 'designsetgo' ),
						),
					),
				),
			),
		);

		return $theme_json->update_with( $dsg_settings );
	}

	/**
	 * Add admin menu page.
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'DesignSetGo', 'designsetgo' ),
			__( 'DesignSetGo', 'designsetgo' ),
			'manage_options',
			'designsetgo',
			array( $this, 'render_admin_page' ),
			'dashicons-layout',
			59
		);
	}

	/**
	 * Render admin page.
	 */
	public function render_admin_page() {
		echo '<div id="designsetgo-admin-root"></div>';

		// Enqueue admin script.
		$asset_file = include DESIGNSETGO_PATH . 'build/admin.asset.php';

		wp_enqueue_script(
			'designsetgo-admin',
			DESIGNSETGO_URL . 'build/admin.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_enqueue_style(
			'designsetgo-admin',
			DESIGNSETGO_URL . 'build/admin.css',
			array( 'wp-components' ),
			$asset_file['version']
		);
	}

	/**
	 * Register REST API routes.
	 */
	public function register_rest_routes() {
		register_rest_route(
			'designsetgo/v1',
			'/global-styles',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_global_styles' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		register_rest_route(
			'designsetgo/v1',
			'/global-styles',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_global_styles' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	/**
	 * Get global styles via REST API.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_global_styles() {
		$styles = get_option( 'designsetgo_global_styles', array() );
		return rest_ensure_response( $styles );
	}

	/**
	 * Update global styles via REST API.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_global_styles( $request ) {
		$styles = $request->get_json_params();
		update_option( 'designsetgo_global_styles', $styles );
		return rest_ensure_response( array( 'success' => true ) );
	}
}
