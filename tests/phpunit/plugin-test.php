<?php
/**
 * Test Plugin Initialization
 *
 * @package DesignSetGo
 * @subpackage Tests
 */

/**
 * Tests for basic plugin functionality.
 */
class Test_Plugin extends WP_UnitTestCase {

	/**
	 * Test that the plugin is loaded.
	 */
	public function test_plugin_loaded() {
		$this->assertTrue( class_exists( 'DesignSetGo\Plugin' ) );
	}

	/**
	 * Test that plugin constants are defined.
	 */
	public function test_plugin_constants() {
		$this->assertTrue( defined( 'DESIGNSETGO_VERSION' ) );
		$this->assertTrue( defined( 'DESIGNSETGO_PATH' ) );
		$this->assertTrue( defined( 'DESIGNSETGO_URL' ) );
		$this->assertTrue( defined( 'DESIGNSETGO_FILE' ) );
		$this->assertTrue( defined( 'DESIGNSETGO_BASENAME' ) );
	}

	/**
	 * Test singleton pattern.
	 */
	public function test_singleton_instance() {
		$instance1 = \DesignSetGo\Plugin::instance();
		$instance2 = \DesignSetGo\Plugin::instance();

		// Should return the same instance.
		$this->assertSame( $instance1, $instance2 );
	}

	/**
	 * Test plugin components are initialized.
	 */
	public function test_components_initialized() {
		$instance = \DesignSetGo\Plugin::instance();

		// Check that key components are loaded.
		$this->assertNotNull( $instance->assets );
		$this->assertNotNull( $instance->blocks );
		$this->assertNotNull( $instance->custom_css_renderer );
		$this->assertNotNull( $instance->section_styles );
	}

	/**
	 * Test that blocks are registered.
	 *
	 * Note: This test is skipped because block registration requires
	 * built JavaScript assets which may not be available in test environment.
	 */
	public function test_blocks_registered() {
		$this->markTestSkipped( 'Block registration requires built assets and init hook execution' );

		$registry = WP_Block_Type_Registry::get_instance();

		// Test a few core blocks from the plugin
		$blocks_to_test = array(
			'designsetgo/flex',
			'designsetgo/grid',
			'designsetgo/stack',
			'designsetgo/tabs',
		);

		foreach ( $blocks_to_test as $block_name ) {
			$this->assertTrue(
				$registry->is_registered( $block_name ),
				"Block {$block_name} should be registered"
			);
		}
	}

	/**
	 * Test that plugin version is valid.
	 */
	public function test_valid_version() {
		$this->assertMatchesRegularExpression(
			'/^\d+\.\d+\.\d+$/',
			DESIGNSETGO_VERSION,
			'Version should follow semantic versioning (X.Y.Z)'
		);
	}

	/**
	 * Test that block category is registered.
	 */
	public function test_block_category() {
		$categories = get_block_categories( get_post() );
		$category_slugs = wp_list_pluck( $categories, 'slug' );

		$this->assertContains(
			'designsetgo',
			$category_slugs,
			'DesignSetGo block category should be registered'
		);
	}
}
