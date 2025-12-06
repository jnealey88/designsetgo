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
	 * @return void
	 */
	private function initialize_abilities(): void {
		// Info abilities.
		if ( class_exists( 'DesignSetGo\Abilities\Info\List_Blocks' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Info\List_Blocks() );
		}

		// Inserter abilities - Containers.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Flex_Container' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Flex_Container() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Grid_Container' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Grid_Container() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Stack_Container' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Stack_Container() );
		}

		// Inserter abilities - Visual elements.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Icon' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Icon() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Icon_Button' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Icon_Button() );
		}

		// Inserter abilities - Dynamic elements.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Progress_Bar' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Progress_Bar() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Counter_Group' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Counter_Group() );
		}

		// Inserter abilities - Interactive elements.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Tabs' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Tabs() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Accordion' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Accordion() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Flip_Card' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Flip_Card() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Reveal' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Reveal() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Scroll_Accordion' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Scroll_Accordion() );
		}

		// Inserter abilities - Content elements.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Icon_List' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Icon_List() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Icon_List_Item' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Icon_List_Item() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Scroll_Marquee' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Scroll_Marquee() );
		}

		// Inserter abilities - Modal elements.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Modal' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Modal() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Modal_Trigger' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Modal_Trigger() );
		}

		// Inserter abilities - Media elements.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Slider' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Slider() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Card' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Card() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Image_Accordion' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Image_Accordion() );
		}

		// Inserter abilities - Page structure.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Divider' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Divider() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Breadcrumbs' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Breadcrumbs() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Table_Of_Contents' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Table_Of_Contents() );
		}

		// Inserter abilities - Data display.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Counter' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Counter() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Countdown_Timer' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Countdown_Timer() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Map' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Map() );
		}

		// Inserter abilities - UI elements.
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Pill' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Pill() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Inserters\Insert_Form_Builder' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Inserters\Insert_Form_Builder() );
		}

		// Configurator abilities.
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Configure_Counter_Animation' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Configure_Counter_Animation() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Apply_Animation' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Apply_Animation() );
		}

		// Configurator abilities - Scroll effects (v1.3.0).
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Apply_Scroll_Parallax' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Apply_Scroll_Parallax() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Apply_Text_Reveal' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Apply_Text_Reveal() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Apply_Expanding_Background' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Apply_Expanding_Background() );
		}

		// Configurator abilities - Extension controls.
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Configure_Background_Video' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Configure_Background_Video() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Configure_Clickable_Group' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Configure_Clickable_Group() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Configure_Custom_CSS' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Configure_Custom_CSS() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Configure_Responsive_Visibility' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Configure_Responsive_Visibility() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Configurators\Configure_Max_Width' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Configurators\Configure_Max_Width() );
		}

		// Generator abilities.
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Hero_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Hero_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Feature_Grid' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Feature_Grid() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Stats_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Stats_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_FAQ_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_FAQ_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Contact_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Contact_Section() );
		}

		// Generator abilities - Additional section types.
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Pricing_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Pricing_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Team_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Team_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Testimonial_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Testimonial_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_CTA_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_CTA_Section() );
		}
		if ( class_exists( 'DesignSetGo\Abilities\Generators\Generate_Gallery_Section' ) ) {
			$this->add_ability( new \DesignSetGo\Abilities\Generators\Generate_Gallery_Section() );
		}
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
