<?php
/**
 * Main Plugin Class
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Plugin Class
 */
class Plugin {
	/**
	 * Instance of this class.
	 *
	 * @var Plugin
	 */
	private static $instance = null;

	/**
	 * Assets instance.
	 *
	 * @var Assets
	 */
	public $assets;

	/**
	 * Blocks Loader instance.
	 *
	 * @var Blocks\Loader
	 */
	public $blocks;

	/**
	 * Form Handler instance.
	 *
	 * @var Blocks\Form_Handler
	 */
	public $form_handler;

	/**
	 * Form Submissions instance.
	 *
	 * @var Blocks\Form_Submissions
	 */
	public $form_submissions;

	/**
	 * Patterns Loader instance.
	 *
	 * @var Patterns\Loader
	 */
	public $patterns;

	/**
	 * Global Styles instance.
	 *
	 * @var Admin\Global_Styles
	 */
	public $global_styles;

	/**
	 * Admin Menu instance.
	 *
	 * @var Admin\Admin_Menu
	 */
	public $admin_menu;

	/**
	 * Settings instance.
	 *
	 * @var Admin\Settings
	 */
	public $settings;

	/**
	 * Block Manager instance.
	 *
	 * @var Admin\Block_Manager
	 */
	public $block_manager;

	/**
	 * Custom CSS Renderer instance.
	 *
	 * @var Custom_CSS_Renderer
	 */
	public $custom_css_renderer;

	/**
	 * Abilities Registry instance.
	 *
	 * @var Abilities\Abilities_Registry
	 */
	public $abilities_registry;

	/**
	 * Section Styles instance.
	 *
	 * @var Section_Styles
	 */
	public $section_styles;

	/**
	 * Returns the instance.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->load_dependencies();
		$this->init();
	}

	/**
	 * Load required files.
	 */
	private function load_dependencies() {
		require_once DESIGNSETGO_PATH . 'includes/class-assets.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-loader.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-form-handler.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-form-submissions.php';
		require_once DESIGNSETGO_PATH . 'includes/patterns/class-loader.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-global-styles.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-settings.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-block-manager.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-gdpr-compliance.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-admin-menu.php';
		require_once DESIGNSETGO_PATH . 'includes/class-custom-css-renderer.php';
		require_once DESIGNSETGO_PATH . 'includes/class-section-styles.php';
		require_once DESIGNSETGO_PATH . 'includes/helpers.php';

		// Load Composer autoloader if available.
		if ( file_exists( DESIGNSETGO_PATH . 'vendor/autoload.php' ) ) {
			require_once DESIGNSETGO_PATH . 'vendor/autoload.php';
		}

		// Load WordPress Abilities API if available.
		if ( file_exists( DESIGNSETGO_PATH . 'vendor/wordpress/abilities-api/includes/bootstrap.php' ) ) {
			if ( ! defined( 'WP_ABILITIES_API_DIR' ) ) {
				define( 'WP_ABILITIES_API_DIR', DESIGNSETGO_PATH . 'vendor/wordpress/abilities-api/' );
			}
			require_once DESIGNSETGO_PATH . 'vendor/wordpress/abilities-api/includes/bootstrap.php';
		}

		// Load Abilities Registry.
		require_once DESIGNSETGO_PATH . 'includes/abilities/class-abilities-registry.php';
	}

	/**
	 * Initialize the plugin.
	 */
	private function init() {
		// Initialize components.
		$this->assets              = new Assets();
		$this->blocks              = new Blocks\Loader();
		$this->form_handler        = new Blocks\Form_Handler();
		$this->form_submissions    = new Blocks\Form_Submissions();
		$this->patterns            = new Patterns\Loader();
		$this->global_styles       = new Admin\Global_Styles();
		$this->settings            = new Admin\Settings();
		$this->block_manager       = new Admin\Block_Manager();
		$this->gdpr_compliance     = new Admin\GDPR_Compliance();
		$this->custom_css_renderer = new Custom_CSS_Renderer();
		$this->section_styles      = new Section_Styles();
		$this->section_styles->init();

		// Initialize admin menu (only in admin area).
		if ( is_admin() ) {
			$this->admin_menu = new Admin\Admin_Menu();
		}

		// Initialize Abilities Registry (AI-native API).
		if ( class_exists( 'DesignSetGo\Abilities\Abilities_Registry' ) ) {
			$this->abilities_registry = Abilities\Abilities_Registry::get_instance();
		}

		// Hook into WordPress.
		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ) );

		// Add block category.
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );
	}

	/**
	 * Load plugin textdomain.
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'designsetgo',
			false,
			dirname( DESIGNSETGO_BASENAME ) . '/languages'
		);
	}

	/**
	 * Enqueue editor assets.
	 *
	 * Note: Block-specific assets are loaded automatically via block.json.
	 */
	public function editor_assets() {
		// Enqueue block category filter to show blocks in multiple categories.
		$asset_file = DESIGNSETGO_PATH . 'build/block-category-filter.asset.php';

		if ( file_exists( $asset_file ) ) {
			$asset = include $asset_file;

			wp_enqueue_script(
				'designsetgo-block-category-filter',
				DESIGNSETGO_URL . 'build/block-category-filter.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);
		}
	}

	/**
	 * Register DesignSetGo block category.
	 *
	 * @param array    $categories Block categories.
	 * @param \WP_Post $post       Current post object (unused).
	 * @return array Modified categories.
	 */
	public function register_block_category( $categories, $post = null ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		$categories[] = array(
			'slug'  => 'designsetgo',
			'title' => __( 'DesignSetGo', 'designsetgo' ),
			'icon'  => 'layout',
		);

		return $categories;
	}
}
