<?php
/**
 * Abilities Registry for DesignSetGo.
 *
 * Central registry that manages all DesignSetGo abilities, providing
 * AI agents and automation tools with programmatic access to block
 * insertion, configuration, and layout generation.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Abilities Registry class.
 */
class Abilities_Registry {

	/**
	 * Registered abilities.
	 *
	 * @var array<Abstract_Ability>
	 */
	private array $abilities = array();

	/**
	 * Singleton instance.
	 *
	 * @var Abilities_Registry|null
	 */
	private static ?Abilities_Registry $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Abilities_Registry
	 */
	public static function get_instance(): Abilities_Registry {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->init();
	}

	/**
	 * Initialize the registry.
	 *
	 * @return void
	 */
	private function init(): void {
		// Register ability categories on the WordPress wp_abilities_api_categories_init hook.
		add_action( 'wp_abilities_api_categories_init', array( $this, 'register_ability_categories' ) );

		// Register abilities on the WordPress wp_abilities_api_init hook.
		add_action( 'wp_abilities_api_init', array( $this, 'register_abilities' ) );

		// Load ability classes.
		$this->load_ability_classes();

		// Initialize abilities.
		$this->initialize_abilities();
	}

	/**
	 * Load all ability class files.
	 *
	 * @return void
	 */
	private function load_ability_classes(): void {
		$base_path = __DIR__;

		// Load base abstract class (already loaded, but for clarity).
		require_once $base_path . '/class-abstract-ability.php';

		// Load helper classes.
		$helpers = array(
			'class-block-inserter.php',
			'class-block-configurator.php',
			'class-css-sanitizer.php',
		);

		foreach ( $helpers as $helper ) {
			$helper_path = $base_path . '/' . $helper;
			if ( file_exists( $helper_path ) ) {
				require_once $helper_path;
			}
		}

		// Load ability classes from subdirectories.
		$this->load_abilities_from_directory( $base_path . '/info' );
		$this->load_abilities_from_directory( $base_path . '/inserters' );
		$this->load_abilities_from_directory( $base_path . '/configurators' );
		$this->load_abilities_from_directory( $base_path . '/generators' );
	}

	/**
	 * Load ability classes from a directory.
	 *
	 * @param string $directory Directory path.
	 * @return void
	 */
	private function load_abilities_from_directory( string $directory ): void {
		if ( ! is_dir( $directory ) ) {
			return;
		}

		$files = glob( $directory . '/class-*.php' );

		if ( ! $files ) {
			return;
		}

		foreach ( $files as $file ) {
			require_once $file;
		}
	}

	/**
	 * Initialize ability instances.
	 *
	 * Auto-discovers and instantiates all ability classes from subdirectories.
	 * This eliminates the need to manually register each ability - simply
	 * create a new class file in the appropriate directory and it will be
	 * automatically loaded and registered.
	 *
	 * @return void
	 */
	private function initialize_abilities(): void {
		$directories = array(
			'info'          => 'DesignSetGo\\Abilities\\Info\\',
			'inserters'     => 'DesignSetGo\\Abilities\\Inserters\\',
			'configurators' => 'DesignSetGo\\Abilities\\Configurators\\',
			'generators'    => 'DesignSetGo\\Abilities\\Generators\\',
		);

		foreach ( $directories as $dir => $namespace ) {
			$this->load_abilities_from_namespace( __DIR__ . '/' . $dir, $namespace );
		}
	}

	/**
	 * Load and instantiate abilities from a directory with given namespace.
	 *
	 * @param string $directory Directory path containing ability classes.
	 * @param string $namespace PHP namespace for the classes.
	 * @return void
	 */
	private function load_abilities_from_namespace( string $directory, string $namespace ): void {
		if ( ! is_dir( $directory ) ) {
			return;
		}

		$files = glob( $directory . '/class-*.php' );

		if ( ! $files ) {
			return;
		}

		foreach ( $files as $file ) {
			$class_name = $this->file_to_class_name( $file, $namespace );

			if ( class_exists( $class_name ) && is_subclass_of( $class_name, Abstract_Ability::class ) ) {
				$this->add_ability( new $class_name() );
			}
		}
	}

	/**
	 * Convert a file path to a fully qualified class name.
	 *
	 * Transforms file names like 'class-insert-section.php' to 'Insert_Section'.
	 *
	 * @param string $file_path Full path to the PHP file.
	 * @param string $namespace PHP namespace prefix.
	 * @return string Fully qualified class name.
	 */
	private function file_to_class_name( string $file_path, string $namespace ): string {
		// Get filename without path and extension.
		$filename = basename( $file_path, '.php' );

		// Remove 'class-' prefix.
		$filename = preg_replace( '/^class-/', '', $filename );

		// Convert kebab-case to Title_Case (WordPress class naming convention).
		$class_name = str_replace( '-', '_', $filename );
		$class_name = implode( '_', array_map( 'ucfirst', explode( '_', $class_name ) ) );

		return $namespace . $class_name;
	}

	/**
	 * Add an ability to the registry.
	 *
	 * @param Abstract_Ability $ability Ability instance.
	 * @return void
	 */
	public function add_ability( Abstract_Ability $ability ): void {
		$this->abilities[ $ability->get_name() ] = $ability;
	}

	/**
	 * Register ability categories with WordPress.
	 *
	 * This must be called on the wp_abilities_api_categories_init hook,
	 * which fires before wp_abilities_api_init.
	 *
	 * @return void
	 */
	public function register_ability_categories(): void {
		// Check if the Abilities API is available.
		if ( ! function_exists( 'wp_register_ability_category' ) ) {
			return;
		}

		wp_register_ability_category(
			'info',
			array(
				'label'       => __( 'Information', 'designsetgo' ),
				'description' => __( 'Abilities that provide information about blocks and capabilities', 'designsetgo' ),
			)
		);

		wp_register_ability_category(
			'blocks',
			array(
				'label'       => __( 'Blocks', 'designsetgo' ),
				'description' => __( 'Abilities for inserting and configuring blocks', 'designsetgo' ),
			)
		);
	}

	/**
	 * Register all abilities with WordPress.
	 *
	 * @return void
	 */
	public function register_abilities(): void {
		// Check if the Abilities API is available.
		if ( ! function_exists( 'wp_register_ability' ) ) {
			return;
		}

		/**
		 * Filter the abilities to register.
		 *
		 * Allows plugins to add or remove abilities.
		 *
		 * @param array<Abstract_Ability> $abilities Registered abilities.
		 */
		$abilities = apply_filters( 'designsetgo_abilities', $this->abilities );

		foreach ( $abilities as $ability ) {
			if ( $ability instanceof Abstract_Ability ) {
				$ability->register();
			}
		}
	}

	/**
	 * Get all registered abilities.
	 *
	 * @return array<Abstract_Ability>
	 */
	public function get_abilities(): array {
		return $this->abilities;
	}

	/**
	 * Get an ability by name.
	 *
	 * @param string $name Ability name.
	 * @return Abstract_Ability|null
	 */
	public function get_ability( string $name ): ?Abstract_Ability {
		return $this->abilities[ $name ] ?? null;
	}

	/**
	 * Check if an ability is registered.
	 *
	 * @param string $name Ability name.
	 * @return bool
	 */
	public function has_ability( string $name ): bool {
		return isset( $this->abilities[ $name ] );
	}
}
