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

	/**
	 * Test that the safe_style_css filter is registered.
	 */
	public function test_safe_style_css_filter_registered() {
		$this->assertGreaterThan(
			0,
			has_filter( 'safe_style_css', array( \DesignSetGo\Plugin::instance(), 'allow_block_style_properties' ) ),
			'safe_style_css filter should be registered'
		);
	}

	/**
	 * Test that block layout CSS properties survive wp_kses_post().
	 *
	 * Verifies the global safe_style_css filter allows display, gap,
	 * grid-template-columns, and flex properties that blocks use in
	 * their save() output.
	 */
	public function test_kses_preserves_layout_properties() {
		$html = '<div style="display:flex;gap:20px;row-gap:10px;column-gap:15px;grid-template-columns:repeat(3, 1fr)">test</div>';

		$result = wp_kses_post( $html );

		$this->assertStringContainsString( 'display:flex', $result, 'display should survive wp_kses_post' );
		$this->assertStringContainsString( 'gap:20px', $result, 'gap should survive wp_kses_post' );
		$this->assertStringContainsString( 'row-gap:10px', $result, 'row-gap should survive wp_kses_post' );
		$this->assertStringContainsString( 'column-gap:15px', $result, 'column-gap should survive wp_kses_post' );
		$this->assertStringContainsString( 'grid-template-columns:repeat(3, 1fr)', $result, 'grid-template-columns should survive wp_kses_post' );
	}

	/**
	 * Test that flex CSS properties survive wp_kses_post().
	 */
	public function test_kses_preserves_flex_properties() {
		$html = '<div style="flex:1;flex-direction:column;flex-wrap:wrap;flex-shrink:0;align-items:center;justify-content:space-between;align-self:stretch">test</div>';

		$result = wp_kses_post( $html );

		$this->assertStringContainsString( 'flex:1', $result, 'flex should survive wp_kses_post' );
		$this->assertStringContainsString( 'flex-direction:column', $result, 'flex-direction should survive wp_kses_post' );
		$this->assertStringContainsString( 'flex-wrap:wrap', $result, 'flex-wrap should survive wp_kses_post' );
		$this->assertStringContainsString( 'flex-shrink:0', $result, 'flex-shrink should survive wp_kses_post' );
		$this->assertStringContainsString( 'align-items:center', $result, 'align-items should survive wp_kses_post' );
		$this->assertStringContainsString( 'justify-content:space-between', $result, 'justify-content should survive wp_kses_post' );
		$this->assertStringContainsString( 'align-self:stretch', $result, 'align-self should survive wp_kses_post' );
	}

	/**
	 * Test that positioning CSS properties survive wp_kses_post().
	 */
	public function test_kses_preserves_positioning_properties() {
		$html = '<div style="position:absolute;left:-9999px;overflow:hidden">test</div>';

		$result = wp_kses_post( $html );

		$this->assertStringContainsString( 'position:absolute', $result, 'position should survive wp_kses_post' );
		$this->assertStringContainsString( 'left:-9999px', $result, 'left should survive wp_kses_post' );
		$this->assertStringContainsString( 'overflow:hidden', $result, 'overflow should survive wp_kses_post' );
	}

	/**
	 * Test that visual CSS properties survive wp_kses_post().
	 */
	public function test_kses_preserves_visual_properties() {
		$html = '<div style="transform:rotate(45deg);transition:width 0.5s ease-out;aspect-ratio:16/9;object-fit:cover;object-position:50% 50%;box-sizing:border-box">test</div>';

		$result = wp_kses_post( $html );

		$this->assertStringContainsString( 'transform:rotate(45deg)', $result, 'transform should survive wp_kses_post' );
		$this->assertStringContainsString( 'transition:width 0.5s ease-out', $result, 'transition should survive wp_kses_post' );
		$this->assertStringContainsString( 'aspect-ratio:16/9', $result, 'aspect-ratio should survive wp_kses_post' );
		$this->assertStringContainsString( 'object-fit:cover', $result, 'object-fit should survive wp_kses_post' );
		$this->assertStringContainsString( 'object-position:50% 50%', $result, 'object-position should survive wp_kses_post' );
		$this->assertStringContainsString( 'box-sizing:border-box', $result, 'box-sizing should survive wp_kses_post' );
	}

	/**
	 * Test that backdrop-filter survives wp_kses_post().
	 */
	public function test_kses_preserves_backdrop_filter() {
		$html = '<div style="backdrop-filter:blur(10px)">test</div>';

		$result = wp_kses_post( $html );

		$this->assertStringContainsString( 'backdrop-filter:blur(10px)', $result, 'backdrop-filter should survive wp_kses_post' );
	}

	/**
	 * Test that display:grid and display:inline-flex survive wp_kses_post().
	 *
	 * Regression test for the specific display values used by blocks.
	 */
	public function test_kses_preserves_display_variants() {
		$values = array(
			'display:grid'       => '<div style="display:grid">test</div>',
			'display:inline-flex' => '<div style="display:inline-flex">test</div>',
			'display:none'       => '<div style="display:none">test</div>',
		);

		foreach ( $values as $expected => $html ) {
			$result = wp_kses_post( $html );
			$this->assertStringContainsString( $expected, $result, "$expected should survive wp_kses_post" );
		}
	}

	/**
	 * Test realistic block output survives wp_kses_post().
	 *
	 * Uses actual HTML that the Row and Grid blocks produce.
	 */
	public function test_kses_preserves_realistic_block_output() {
		// Row block output.
		$row_html = '<div class="wp-block-designsetgo-row dsgo-flex"><div class="dsgo-flex__inner" style="display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:20px">content</div></div>';

		$result = wp_kses_post( $row_html );

		$this->assertStringContainsString( 'display:flex', $result );
		$this->assertStringContainsString( 'justify-content:center', $result );
		$this->assertStringContainsString( 'align-items:center', $result );
		$this->assertStringContainsString( 'flex-wrap:wrap', $result );
		$this->assertStringContainsString( 'gap:20px', $result );

		// Grid block output.
		$grid_html = '<div class="wp-block-designsetgo-grid dsgo-grid"><div class="dsgo-grid__inner" style="display:grid;grid-template-columns:repeat(3, 1fr);row-gap:20px;column-gap:20px;align-items:stretch">content</div></div>';

		$result = wp_kses_post( $grid_html );

		$this->assertStringContainsString( 'display:grid', $result );
		$this->assertStringContainsString( 'grid-template-columns:repeat(3, 1fr)', $result );
		$this->assertStringContainsString( 'row-gap:20px', $result );
		$this->assertStringContainsString( 'column-gap:20px', $result );
	}
}
