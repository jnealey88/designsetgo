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
		// Temporarily disabled - no settings page needed at this time.
		// add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/**
	 * Extend theme.json with DesignSetGo presets.
	 *
	 * @param \WP_Theme_JSON_Data $theme_json Theme JSON object.
	 * @return \WP_Theme_JSON_Data Modified theme JSON.
	 */
	public function extend_theme_json( $theme_json ) {
		// Get user-saved global styles (if any).
		$saved_styles = get_option( 'designsetgo_global_styles', array() );

		$dsg_settings = array(
			'version'  => 2,
			'settings' => array(
				'color'      => array(
					'palette' => $this->get_color_palette( $saved_styles ),
					'gradients' => $this->get_gradients( $saved_styles ),
					'duotone' => array(
						array(
							'slug'   => 'dsg-blue-orange',
							'colors' => array( '#2563eb', '#f59e0b' ),
							'name'   => __( 'Blue and Orange', 'designsetgo' ),
						),
					),
				),
				'spacing'    => array(
					'spacingScale' => array(
						'steps' => 0,
					),
					'spacingSizes' => $this->get_spacing_sizes( $saved_styles ),
					'units' => array( 'px', 'em', 'rem', 'vh', 'vw', '%' ),
				),
				'typography' => array(
					'fontSizes' => $this->get_font_sizes( $saved_styles ),
					'fontFamilies' => array(
						array(
							'slug'       => 'system',
							'fontFamily' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
							'name'       => __( 'System Font', 'designsetgo' ),
						),
					),
				),
				'custom' => array(
					'designsetgo' => array(
						'borderRadius' => array(
							'none'   => '0',
							'small'  => '0.25rem',
							'medium' => '0.5rem',
							'large'  => '1rem',
							'full'   => '9999px',
						),
						'shadow' => array(
							'small'  => '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
							'medium' => '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							'large'  => '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
							'xlarge' => '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
						),
					),
				),
			),
			'styles'   => array(
				'blocks' => array(
					'designsetgo/container' => $this->get_container_block_styles( $saved_styles ),
					'designsetgo/tabs'      => $this->get_tabs_block_styles( $saved_styles ),
					'designsetgo/tab'       => $this->get_tab_block_styles( $saved_styles ),
				),
			),
		);

		return $theme_json->update_with( $dsg_settings );
	}

	/**
	 * Get color palette with user customizations.
	 *
	 * Uses Twenty Twenty-Five (TT5) semantic color system:
	 * - Base: Default background (usually white/light)
	 * - Contrast: Text color (usually black/dark)
	 * - Accent 1-6: Semantic purpose colors
	 *
	 * @param array $saved_styles Saved user styles.
	 * @return array Color palette.
	 */
	private function get_color_palette( $saved_styles ) {
		$defaults = array(
			// Core semantic colors
			array(
				'slug'  => 'base',
				'color' => '#ffffff',
				'name'  => __( 'Base / Background', 'designsetgo' ),
			),
			array(
				'slug'  => 'contrast',
				'color' => '#000000',
				'name'  => __( 'Contrast / Text', 'designsetgo' ),
			),

			// Accent colors - semantic purposes
			array(
				'slug'  => 'accent-1',
				'color' => '#f5f5f5',
				'name'  => __( 'Accent 1 / Light Background', 'designsetgo' ),
			),
			array(
				'slug'  => 'accent-2',
				'color' => '#2563eb',
				'name'  => __( 'Accent 2 / Primary Brand', 'designsetgo' ),
			),
			array(
				'slug'  => 'accent-3',
				'color' => '#1e293b',
				'name'  => __( 'Accent 3 / Dark Background', 'designsetgo' ),
			),
			array(
				'slug'  => 'accent-4',
				'color' => '#334155',
				'name'  => __( 'Accent 4 / Dark Variant', 'designsetgo' ),
			),
			array(
				'slug'  => 'accent-5',
				'color' => '#94a3b8',
				'name'  => __( 'Accent 5 / Neutral', 'designsetgo' ),
			),
			array(
				'slug'  => 'accent-6',
				'color' => 'rgba(37, 99, 235, 0.1)',
				'name'  => __( 'Accent 6 / Transparent', 'designsetgo' ),
			),

			// Utility colors (for backwards compatibility)
			array(
				'slug'  => 'success',
				'color' => '#10b981',
				'name'  => __( 'Success', 'designsetgo' ),
			),
			array(
				'slug'  => 'warning',
				'color' => '#f59e0b',
				'name'  => __( 'Warning', 'designsetgo' ),
			),
			array(
				'slug'  => 'error',
				'color' => '#ef4444',
				'name'  => __( 'Error', 'designsetgo' ),
			),
		);

		// Merge with saved colors if available.
		if ( isset( $saved_styles['colors'] ) && is_array( $saved_styles['colors'] ) ) {
			foreach ( $saved_styles['colors'] as $slug => $color ) {
				foreach ( $defaults as $key => $default ) {
					if ( $default['slug'] === $slug ) {
						$defaults[ $key ]['color'] = $color;
					}
				}
			}
		}

		return $defaults;
	}

	/**
	 * Get gradients with user customizations.
	 *
	 * Uses TT5 semantic color system for dynamic gradients.
	 *
	 * @param array $saved_styles Saved user styles.
	 * @return array Gradients.
	 */
	private function get_gradients( $saved_styles ) {
		return array(
			// Primary gradients using accent colors
			array(
				'slug'     => 'primary-gradient',
				'gradient' => 'linear-gradient(135deg, var(--wp--preset--color--accent-2) 0%, var(--wp--preset--color--accent-4) 100%)',
				'name'     => __( 'Primary Gradient', 'designsetgo' ),
			),
			array(
				'slug'     => 'dark-overlay',
				'gradient' => 'linear-gradient(180deg, transparent 0%, var(--wp--preset--color--accent-3) 100%)',
				'name'     => __( 'Dark Overlay', 'designsetgo' ),
			),
			array(
				'slug'     => 'subtle-light',
				'gradient' => 'linear-gradient(135deg, var(--wp--preset--color--base) 0%, var(--wp--preset--color--accent-1) 100%)',
				'name'     => __( 'Subtle Light', 'designsetgo' ),
			),
			array(
				'slug'     => 'brand-fade',
				'gradient' => 'linear-gradient(90deg, var(--wp--preset--color--accent-2) 0%, var(--wp--preset--color--accent-6) 100%)',
				'name'     => __( 'Brand Fade', 'designsetgo' ),
			),
			array(
				'slug'     => 'vivid',
				'gradient' => 'linear-gradient(135deg, var(--wp--preset--color--accent-2) 0%, var(--wp--preset--color--success) 100%)',
				'name'     => __( 'Vivid', 'designsetgo' ),
			),
		);
	}

	/**
	 * Get spacing sizes with user customizations.
	 *
	 * Expanded spacing scale for flexible layouts.
	 * Follows a consistent scale for predictable sizing.
	 *
	 * @param array $saved_styles Saved user styles.
	 * @return array Spacing sizes.
	 */
	private function get_spacing_sizes( $saved_styles ) {
		return array(
			array(
				'slug' => 'xxs',
				'size' => '0.25rem',
				'name' => __( '2XS — 4px', 'designsetgo' ),
			),
			array(
				'slug' => 'xs',
				'size' => '0.5rem',
				'name' => __( 'XS — 8px', 'designsetgo' ),
			),
			array(
				'slug' => 'sm',
				'size' => '0.75rem',
				'name' => __( 'S — 12px', 'designsetgo' ),
			),
			array(
				'slug' => 'md',
				'size' => '1rem',
				'name' => __( 'M — 16px', 'designsetgo' ),
			),
			array(
				'slug' => 'lg',
				'size' => '1.5rem',
				'name' => __( 'L — 24px', 'designsetgo' ),
			),
			array(
				'slug' => 'xl',
				'size' => '2rem',
				'name' => __( 'XL — 32px', 'designsetgo' ),
			),
			array(
				'slug' => 'xxl',
				'size' => '3rem',
				'name' => __( '2XL — 48px', 'designsetgo' ),
			),
			array(
				'slug' => 'xxxl',
				'size' => '4rem',
				'name' => __( '3XL — 64px', 'designsetgo' ),
			),
			array(
				'slug' => 'xxxxl',
				'size' => '5rem',
				'name' => __( '4XL — 80px', 'designsetgo' ),
			),
			array(
				'slug' => 'xxxxxl',
				'size' => '6rem',
				'name' => __( '5XL — 96px', 'designsetgo' ),
			),
			array(
				'slug' => 'jumbo',
				'size' => '8rem',
				'name' => __( 'Jumbo — 128px', 'designsetgo' ),
			),
			array(
				'slug' => 'mega',
				'size' => '10rem',
				'name' => __( 'Mega — 160px', 'designsetgo' ),
			),
		);
	}

	/**
	 * Get font sizes with user customizations.
	 *
	 * @param array $saved_styles Saved user styles.
	 * @return array Font sizes.
	 */
	private function get_font_sizes( $saved_styles ) {
		return array(
			array(
				'slug' => 'small',
				'size' => '0.875rem',
				'name' => __( 'Small (14px)', 'designsetgo' ),
			),
			array(
				'slug' => 'medium',
				'size' => '1rem',
				'name' => __( 'Medium (16px)', 'designsetgo' ),
			),
			array(
				'slug' => 'large',
				'size' => '1.5rem',
				'name' => __( 'Large (24px)', 'designsetgo' ),
			),
			array(
				'slug' => 'x-large',
				'size' => '2rem',
				'name' => __( 'XL (32px)', 'designsetgo' ),
			),
			array(
				'slug' => 'xx-large',
				'size' => '2.5rem',
				'name' => __( 'XXL (40px)', 'designsetgo' ),
			),
		);
	}

	/**
	 * Get Container block global styles.
	 *
	 * This defines how the Container block appears by default and what
	 * users can customize from Styles → Blocks → Container in Site Editor.
	 *
	 * @param array $saved_styles Saved user styles.
	 * @return array Container block styles.
	 */
	private function get_container_block_styles( $saved_styles ) {
		return array(
			'spacing' => array(
				'padding' => array(
					'top'    => 'var(--wp--preset--spacing--lg)',
					'bottom' => 'var(--wp--preset--spacing--lg)',
					'left'   => 'var(--wp--preset--spacing--xs)',
					'right'  => 'var(--wp--preset--spacing--xs)',
				),
				'blockGap' => 'var(--wp--preset--spacing--md)',
			),
			'border' => array(
				'radius' => 'var(--wp--custom--designsetgo--border-radius--medium)',
			),
			'color' => array(
				'background' => 'transparent',
			),
		);
	}

	/**
	 * Get Tabs block global styles.
	 *
	 * This defines how the Tabs block appears by default and what
	 * users can customize from Styles → Blocks → Tabs in Site Editor.
	 *
	 * Uses TT5 semantic colors for theme consistency.
	 *
	 * @param array $saved_styles Saved user styles.
	 * @return array Tabs block styles.
	 */
	private function get_tabs_block_styles( $saved_styles ) {
		return array(
			'spacing' => array(
				'margin' => array(
					'top'    => 'var(--wp--preset--spacing--lg)',
					'bottom' => 'var(--wp--preset--spacing--lg)',
				),
			),
			'typography' => array(
				'fontSize' => 'var(--wp--preset--font-size--medium)',
				'fontWeight' => '500',
			),
			'color' => array(
				'text' => 'var(--wp--preset--color--contrast)',
			),
			'elements' => array(
				'button' => array(
					'color' => array(
						'text' => 'var(--wp--preset--color--contrast)',
						'background' => 'transparent',
					),
					':hover' => array(
						'color' => array(
							'text' => 'var(--wp--preset--color--accent-2)',
						),
					),
					':active' => array(
						'color' => array(
							'text' => 'var(--wp--preset--color--accent-2)',
							'background' => 'var(--wp--preset--color--base)',
						),
						'border' => array(
							'color' => 'var(--wp--preset--color--accent-2)',
							'width' => '2px',
						),
					),
				),
			),
		);
	}

	/**
	 * Get Tab block global styles.
	 *
	 * This defines how individual Tab panels appear by default and what
	 * users can customize from Styles → Blocks → Tab in Site Editor.
	 *
	 * Uses TT5 semantic colors for theme consistency.
	 *
	 * @param array $saved_styles Saved user styles.
	 * @return array Tab block styles.
	 */
	private function get_tab_block_styles( $saved_styles ) {
		return array(
			'spacing' => array(
				'padding' => array(
					'top'    => 'var(--wp--preset--spacing--xl)',
					'bottom' => 'var(--wp--preset--spacing--xl)',
					'left'   => 'var(--wp--preset--spacing--lg)',
					'right'  => 'var(--wp--preset--spacing--lg)',
				),
				'blockGap' => 'var(--wp--preset--spacing--md)',
			),
			'color' => array(
				'background' => 'transparent',
				'text' => 'var(--wp--preset--color--contrast)',
			),
		);
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
		// Verify user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'designsetgo' ) );
		}

		// Add REST API nonce for security.
		$nonce = wp_create_nonce( 'wp_rest' );
		echo '<div id="designsetgo-admin-root" data-nonce="' . esc_attr( $nonce ) . '"></div>';

		// Enqueue admin script.
		$asset_file_path = DESIGNSETGO_PATH . 'build/admin.asset.php';

		if ( ! file_exists( $asset_file_path ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'DesignSetGo: Admin asset file not found. Run `npm run build`.' );
			}
			return;
		}

		$asset_file = include $asset_file_path;

		if ( ! is_array( $asset_file ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'DesignSetGo: Invalid admin asset file format.' );
			}
			return;
		}

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
				'permission_callback' => array( $this, 'check_read_permission' ),
			)
		);

		register_rest_route(
			'designsetgo/v1',
			'/global-styles',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_global_styles' ),
				'permission_callback' => array( $this, 'check_write_permission' ),
			)
		);
	}

	/**
	 * Check read permission for REST API.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_read_permission( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check write permission for REST API.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool|\WP_Error True if user has permission, WP_Error otherwise.
	 */
	public function check_write_permission( $request ) {
		// Check nonce.
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new \WP_Error(
				'invalid_nonce',
				__( 'Invalid security token.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		return current_user_can( 'manage_options' );
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
	 * @return \WP_REST_Response|\WP_Error Response or error.
	 */
	public function update_global_styles( $request ) {
		$styles = $request->get_json_params();

		// Validate and sanitize input.
		$sanitized_styles = $this->sanitize_global_styles( $styles );

		if ( is_wp_error( $sanitized_styles ) ) {
			return $sanitized_styles;
		}

		update_option( 'designsetgo_global_styles', $sanitized_styles );
		return rest_ensure_response( array( 'success' => true ) );
	}

	/**
	 * Sanitize global styles data.
	 *
	 * @param mixed $styles Styles data to sanitize.
	 * @return array|\WP_Error Sanitized styles or error.
	 */
	private function sanitize_global_styles( $styles ) {
		if ( ! is_array( $styles ) ) {
			return new \WP_Error(
				'invalid_format',
				__( 'Styles data must be an array.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		$sanitized = array();

		// Sanitize each key-value pair.
		foreach ( $styles as $key => $value ) {
			$sanitized_key = sanitize_key( $key );

			// Handle nested arrays (for complex style structures).
			if ( is_array( $value ) ) {
				$sanitized[ $sanitized_key ] = $this->sanitize_styles_array( $value );
			} else {
				$sanitized[ $sanitized_key ] = sanitize_text_field( $value );
			}
		}

		return $sanitized;
	}

	/**
	 * Recursively sanitize nested style arrays.
	 *
	 * @param array $array Array to sanitize.
	 * @return array Sanitized array.
	 */
	private function sanitize_styles_array( $array ) {
		$sanitized = array();

		foreach ( $array as $key => $value ) {
			$sanitized_key = sanitize_key( $key );

			if ( is_array( $value ) ) {
				$sanitized[ $sanitized_key ] = $this->sanitize_styles_array( $value );
			} else {
				// Sanitize based on expected value type.
				if ( is_numeric( $value ) ) {
					$sanitized[ $sanitized_key ] = floatval( $value );
				} elseif ( is_bool( $value ) ) {
					$sanitized[ $sanitized_key ] = (bool) $value;
				} else {
					$sanitized[ $sanitized_key ] = sanitize_text_field( $value );
				}
			}
		}

		return $sanitized;
	}
}
