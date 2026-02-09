<?php
/**
 * Tests for the Patterns Loader
 *
 * Tests performance optimizations and security hardening:
 * - Front-end request gating (patterns skip non-editor requests)
 * - Transient-based file map caching
 * - Cache validation and invalidation
 * - Relative path security validation
 * - Pattern registration and category registration
 *
 * @package DesignSetGo
 * @subpackage Tests
 */

namespace DesignSetGo\Tests;

use WP_UnitTestCase;
use DesignSetGo\Patterns\Loader;
use ReflectionClass;

/**
 * Patterns Loader Test Case
 */
class Test_Patterns_Loader extends WP_UnitTestCase {

	/**
	 * Loader instance.
	 *
	 * @var Loader
	 */
	private $loader;

	/**
	 * Reflection instance for accessing private methods.
	 *
	 * @var ReflectionClass
	 */
	private $reflection;

	/**
	 * Set up test fixtures.
	 */
	public function set_up() {
		parent::set_up();
		$this->loader     = new Loader();
		$this->reflection = new ReflectionClass( $this->loader );
	}

	/**
	 * Tear down after each test.
	 */
	public function tear_down() {
		// Always clean up cached transient.
		delete_transient( Loader::CACHE_TRANSIENT );
		parent::tear_down();
	}

	/**
	 * Helper to call private/static methods for testing.
	 *
	 * @param string $method Method name.
	 * @param array  $args   Method arguments.
	 * @return mixed Method result.
	 */
	private function call_private_method( $method, $args = array() ) {
		$method_ref = $this->reflection->getMethod( $method );
		$method_ref->setAccessible( true );
		return $method_ref->invokeArgs( $this->loader, $args );
	}

	/**
	 * Helper to call private static methods for testing.
	 *
	 * @param string $method Method name.
	 * @param array  $args   Method arguments.
	 * @return mixed Method result.
	 */
	private function call_private_static_method( $method, $args = array() ) {
		$method_ref = $this->reflection->getMethod( $method );
		$method_ref->setAccessible( true );
		return $method_ref->invokeArgs( null, $args );
	}

	// -------------------------------------------------------------------------
	// Class structure tests
	// -------------------------------------------------------------------------

	/**
	 * Test that the Loader class exists.
	 */
	public function test_loader_class_exists() {
		$this->assertTrue( class_exists( 'DesignSetGo\Patterns\Loader' ) );
	}

	/**
	 * Test that ALLOWED_CATEGORIES constant contains expected categories.
	 */
	public function test_allowed_categories_defined() {
		$expected = array(
			'homepage',
			'hero',
			'features',
			'pricing',
			'testimonials',
			'team',
			'cta',
			'content',
			'faq',
			'modal',
			'gallery',
			'contact',
			'services',
		);

		$this->assertSame( $expected, Loader::ALLOWED_CATEGORIES );
	}

	/**
	 * Test that CACHE_TRANSIENT constant is defined.
	 */
	public function test_cache_transient_constant() {
		$this->assertSame( 'dsgo_pattern_files', Loader::CACHE_TRANSIENT );
	}

	// -------------------------------------------------------------------------
	// is_editor_request() tests
	// -------------------------------------------------------------------------

	/**
	 * Test is_editor_request returns true in admin context.
	 */
	public function test_is_editor_request_in_admin() {
		// PHPUnit runs via CLI where is_admin() is false.
		// Simulate an admin screen to flip it to true.
		set_current_screen( 'edit-post' );

		$result = $this->call_private_static_method( 'is_editor_request' );
		$this->assertTrue( $result, 'is_editor_request should return true in admin context' );

		// Restore non-admin context.
		set_current_screen( 'front' );
	}

	/**
	 * Test is_editor_request returns false on front-end requests.
	 */
	public function test_is_editor_request_false_on_frontend() {
		// Ensure we are in a non-admin, non-REST, non-CLI context.
		set_current_screen( 'front' );

		// Temporarily unset REQUEST_URI to prevent URL-based REST detection.
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- saving raw superglobal for test restore.
		$saved_uri = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : null;
		unset( $_SERVER['REQUEST_URI'] );

		$result = $this->call_private_static_method( 'is_editor_request' );
		$this->assertFalse( $result, 'is_editor_request should return false on front-end' );

		// Restore.
		if ( null !== $saved_uri ) {
			$_SERVER['REQUEST_URI'] = $saved_uri;
		}
	}

	// -------------------------------------------------------------------------
	// is_valid_relative_path() tests
	// -------------------------------------------------------------------------

	/**
	 * Test valid relative paths are accepted.
	 */
	public function test_valid_relative_paths() {
		$valid_paths = array(
			'hero/hero-centered.php',
			'homepage/homepage-agency.php',
			'content/content-timeline.php',
			'cta/cta-banner-gradient.php',
		);

		foreach ( $valid_paths as $path ) {
			$this->assertTrue(
				$this->call_private_static_method( 'is_valid_relative_path', array( $path ) ),
				"Path '$path' should be valid"
			);
		}
	}

	/**
	 * Test directory traversal sequences are rejected.
	 */
	public function test_rejects_directory_traversal() {
		$malicious_paths = array(
			'../../../etc/passwd',
			'hero/../../../wp-config.php',
			'..\\..\\wp-config.php',
		);

		foreach ( $malicious_paths as $path ) {
			$this->assertFalse(
				$this->call_private_static_method( 'is_valid_relative_path', array( $path ) ),
				"Path '$path' should be rejected (directory traversal)"
			);
		}
	}

	/**
	 * Test absolute paths are rejected.
	 */
	public function test_rejects_absolute_paths() {
		$absolute_paths = array(
			'/etc/passwd',
			'/tmp/malicious.php',
			'\\windows\\system32\\cmd.php',
		);

		foreach ( $absolute_paths as $path ) {
			$this->assertFalse(
				$this->call_private_static_method( 'is_valid_relative_path', array( $path ) ),
				"Path '$path' should be rejected (absolute path)"
			);
		}
	}

	/**
	 * Test non-PHP extensions are rejected.
	 */
	public function test_rejects_non_php_extensions() {
		$wrong_extensions = array(
			'hero/hero-centered.html',
			'hero/hero-centered.phtml',
			'hero/hero-centered.txt',
			'hero/hero-centered.php.bak',
			'hero/hero-centered',
		);

		foreach ( $wrong_extensions as $path ) {
			$this->assertFalse(
				$this->call_private_static_method( 'is_valid_relative_path', array( $path ) ),
				"Path '$path' should be rejected (wrong extension)"
			);
		}
	}

	/**
	 * Test empty and non-string values are rejected.
	 */
	public function test_rejects_empty_and_non_string() {
		$this->assertFalse(
			$this->call_private_static_method( 'is_valid_relative_path', array( '' ) ),
			'Empty string should be rejected'
		);

		$this->assertFalse(
			$this->call_private_static_method( 'is_valid_relative_path', array( null ) ),
			'Null should be rejected'
		);

		$this->assertFalse(
			$this->call_private_static_method( 'is_valid_relative_path', array( 123 ) ),
			'Integer should be rejected'
		);

		$this->assertFalse(
			$this->call_private_static_method( 'is_valid_relative_path', array( array() ) ),
			'Array should be rejected'
		);
	}

	// -------------------------------------------------------------------------
	// Pattern category registration tests
	// -------------------------------------------------------------------------

	/**
	 * Test that pattern categories are registered.
	 */
	public function test_pattern_categories_registered() {
		$this->loader->register_pattern_categories();

		$registry = \WP_Block_Pattern_Categories_Registry::get_instance();

		$expected_categories = array(
			'dsgo-homepage',
			'dsgo-hero',
			'dsgo-features',
			'dsgo-pricing',
			'dsgo-testimonials',
			'dsgo-team',
			'dsgo-cta',
			'dsgo-content',
			'dsgo-faq',
			'dsgo-modal',
			'dsgo-gallery',
			'dsgo-contact',
		);

		foreach ( $expected_categories as $slug ) {
			$this->assertTrue(
				$registry->is_registered( $slug ),
				"Pattern category '$slug' should be registered"
			);
		}
	}

	/**
	 * Test that duplicate category registration is safe.
	 */
	public function test_duplicate_category_registration_safe() {
		// Register twice — should not error.
		$this->loader->register_pattern_categories();
		$this->loader->register_pattern_categories();

		$registry = \WP_Block_Pattern_Categories_Registry::get_instance();
		$this->assertTrue( $registry->is_registered( 'dsgo-hero' ) );
	}

	// -------------------------------------------------------------------------
	// Transient cache tests
	// -------------------------------------------------------------------------

	/**
	 * Test that get_pattern_file_map stores results in transient.
	 */
	public function test_file_map_cached_in_transient() {
		// Clear any existing cache.
		delete_transient( Loader::CACHE_TRANSIENT );

		// Call get_pattern_file_map to populate cache.
		$this->call_private_method( 'get_pattern_file_map' );

		$cached = get_transient( Loader::CACHE_TRANSIENT );

		$this->assertIsArray( $cached, 'Transient should contain an array' );
		$this->assertArrayHasKey( 'version', $cached, 'Cache should include version key' );
		$this->assertArrayHasKey( 'map', $cached, 'Cache should include map key' );
		$this->assertSame( DESIGNSETGO_VERSION, $cached['version'], 'Cached version should match plugin version' );
		$this->assertIsArray( $cached['map'], 'Cached map should be an array' );
	}

	/**
	 * Test that cached file map is returned on subsequent calls.
	 */
	public function test_file_map_returns_cached_data() {
		// Seed a fake transient with known data.
		$fake_map = array(
			'hero' => array( 'hero/hero-test.php' ),
		);

		set_transient(
			Loader::CACHE_TRANSIENT,
			array(
				'version' => DESIGNSETGO_VERSION,
				'map'     => $fake_map,
			),
			DAY_IN_SECONDS
		);

		$result = $this->call_private_method( 'get_pattern_file_map' );

		$this->assertSame( $fake_map, $result, 'Should return cached map without re-scanning' );
	}

	/**
	 * Test that stale cache (wrong version) triggers a fresh scan.
	 */
	public function test_stale_version_cache_ignored() {
		// Seed a transient with a mismatched version.
		set_transient(
			Loader::CACHE_TRANSIENT,
			array(
				'version' => '0.0.0-old',
				'map'     => array( 'fake' => array( 'fake/fake.php' ) ),
			),
			DAY_IN_SECONDS
		);

		$result = $this->call_private_method( 'get_pattern_file_map' );

		// Result should NOT contain our fake data — it should be a fresh scan.
		$this->assertArrayNotHasKey( 'fake', $result, 'Stale cache should be discarded' );
	}

	/**
	 * Test that malformed cache data triggers a fresh scan.
	 */
	public function test_malformed_cache_ignored() {
		// Missing 'map' key.
		set_transient(
			Loader::CACHE_TRANSIENT,
			array( 'version' => DESIGNSETGO_VERSION ),
			DAY_IN_SECONDS
		);

		$result = $this->call_private_method( 'get_pattern_file_map' );

		// Should return a real file map, not null/empty from bad cache.
		$this->assertIsArray( $result );
	}

	/**
	 * Test that non-array map value in cache triggers a fresh scan.
	 */
	public function test_non_array_map_cache_ignored() {
		set_transient(
			Loader::CACHE_TRANSIENT,
			array(
				'version' => DESIGNSETGO_VERSION,
				'map'     => 'not-an-array',
			),
			DAY_IN_SECONDS
		);

		$result = $this->call_private_method( 'get_pattern_file_map' );

		$this->assertIsArray( $result, 'Should return fresh array, not cached string' );
	}

	/**
	 * Test that clear_cache removes the transient.
	 */
	public function test_clear_cache() {
		set_transient(
			Loader::CACHE_TRANSIENT,
			array(
				'version' => DESIGNSETGO_VERSION,
				'map'     => array(),
			),
			DAY_IN_SECONDS
		);

		Loader::clear_cache();

		$this->assertFalse( get_transient( Loader::CACHE_TRANSIENT ), 'Transient should be deleted after clear_cache()' );
	}

	// -------------------------------------------------------------------------
	// File map content tests
	// -------------------------------------------------------------------------

	/**
	 * Test that file map contains expected categories from disk.
	 */
	public function test_file_map_contains_pattern_categories() {
		delete_transient( Loader::CACHE_TRANSIENT );

		$file_map = $this->call_private_method( 'get_pattern_file_map' );

		// At minimum, these categories should have patterns on disk.
		$expected_populated = array( 'hero', 'homepage', 'features', 'cta', 'content' );

		foreach ( $expected_populated as $category ) {
			$this->assertArrayHasKey(
				$category,
				$file_map,
				"File map should include '$category' category"
			);
			$this->assertNotEmpty(
				$file_map[ $category ],
				"Category '$category' should have pattern files"
			);
		}
	}

	/**
	 * Test that file map stores relative paths, not absolute.
	 */
	public function test_file_map_stores_relative_paths() {
		delete_transient( Loader::CACHE_TRANSIENT );

		$file_map = $this->call_private_method( 'get_pattern_file_map' );

		foreach ( $file_map as $category => $paths ) {
			foreach ( $paths as $path ) {
				$this->assertStringStartsWith(
					$category . '/',
					$path,
					"Path '$path' should be relative, starting with category prefix"
				);
				$this->assertStringEndsWith(
					'.php',
					$path,
					"Path '$path' should end with .php"
				);
				// Should not be an absolute path.
				$this->assertStringStartsNotWith(
					'/',
					$path,
					"Path '$path' should not be absolute"
				);
			}
		}
	}

	/**
	 * Test that excluded categories (navigation) are not in file map.
	 */
	public function test_excluded_categories_not_in_file_map() {
		delete_transient( Loader::CACHE_TRANSIENT );

		$file_map = $this->call_private_method( 'get_pattern_file_map' );

		$this->assertArrayNotHasKey( 'navigation', $file_map, 'Navigation should be excluded from file map' );
	}

	/**
	 * Test that invalid categories in cached data are skipped during registration.
	 */
	public function test_register_patterns_skips_invalid_cached_categories() {
		$this->loader->register_pattern_categories();

		// Seed cache with a poisoned category key alongside a valid one.
		set_transient(
			Loader::CACHE_TRANSIENT,
			array(
				'version' => DESIGNSETGO_VERSION,
				'map'     => array(
					'../../../../etc' => array( '../../../../etc/passwd.php' ),
					'hero'            => array( 'hero/hero-centered.php' ),
				),
			),
			DAY_IN_SECONDS
		);

		$this->loader->register_patterns();

		$registry = \WP_Block_Patterns_Registry::get_instance();

		// The valid pattern should still register.
		$this->assertTrue(
			$registry->is_registered( 'designsetgo/hero/hero-centered' ),
			'Valid pattern should still be registered'
		);
	}

	// -------------------------------------------------------------------------
	// Pattern registration tests
	// -------------------------------------------------------------------------

	/**
	 * Test that patterns are registered with correct slugs.
	 */
	public function test_patterns_registered_with_correct_slugs() {
		$this->loader->register_pattern_categories();
		$this->loader->register_patterns();

		$registry = \WP_Block_Patterns_Registry::get_instance();

		// Spot-check a few known patterns.
		$expected_slugs = array(
			'designsetgo/hero/hero-centered',
			'designsetgo/hero/hero-split',
			'designsetgo/cta/cta-banner',
			'designsetgo/content/content-timeline',
		);

		foreach ( $expected_slugs as $slug ) {
			$this->assertTrue(
				$registry->is_registered( $slug ),
				"Pattern '$slug' should be registered"
			);
		}
	}

	/**
	 * Test that registered patterns have required content key.
	 */
	public function test_registered_patterns_have_content() {
		$this->loader->register_pattern_categories();
		$this->loader->register_patterns();

		$registry = \WP_Block_Patterns_Registry::get_instance();
		$patterns = $registry->get_all_registered();

		// Filter to only DesignSetGo patterns.
		$dsgo_patterns = array_filter(
			$patterns,
			function ( $pattern ) {
				return isset( $pattern['name'] ) && 0 === strpos( $pattern['name'], 'designsetgo/' );
			}
		);

		$this->assertNotEmpty( $dsgo_patterns, 'Should have registered DesignSetGo patterns' );

		foreach ( $dsgo_patterns as $pattern ) {
			$this->assertArrayHasKey(
				'content',
				$pattern,
				"Pattern '{$pattern['name']}' should have content"
			);
			$this->assertNotEmpty(
				$pattern['content'],
				"Pattern '{$pattern['name']}' content should not be empty"
			);
		}
	}

	// -------------------------------------------------------------------------
	// Cache duration filter test
	// -------------------------------------------------------------------------

	/**
	 * Test that the designsetgo_pattern_cache_duration filter works.
	 */
	public function test_cache_duration_filter() {
		delete_transient( Loader::CACHE_TRANSIENT );

		$custom_duration = HOUR_IN_SECONDS;

		add_filter(
			'designsetgo_pattern_cache_duration',
			function () use ( $custom_duration ) {
				return $custom_duration;
			}
		);

		// Trigger cache population.
		$this->call_private_method( 'get_pattern_file_map' );

		// Verify transient was set (it exists).
		$cached = get_transient( Loader::CACHE_TRANSIENT );
		$this->assertIsArray( $cached, 'Cache should be set even with custom duration' );

		remove_all_filters( 'designsetgo_pattern_cache_duration' );
	}
}
