<?php
/**
 * Test Block Loader
 *
 * @package DesignSetGo
 * @subpackage Tests
 */

/**
 * Tests for the Block Loader class.
 */
class Test_Block_Loader extends WP_UnitTestCase {

	/**
	 * Test that Block_Loader class exists.
	 */
	public function test_loader_class_exists() {
		$this->assertTrue( class_exists( 'DesignSetGo\Blocks\Loader' ) );
	}

	/**
	 * Test that all block directories have required files.
	 */
	public function test_block_directories_valid() {
		$blocks_dir = DESIGNSETGO_PATH . 'src/blocks';

		if ( ! is_dir( $blocks_dir ) ) {
			$this->markTestSkipped( 'Blocks directory not found' );
		}

		$block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

		// Skip non-block folders.
		$skip_folders = array( 'shared' );

		foreach ( $block_folders as $folder ) {
			$folder_name = basename( $folder );

			// Skip non-block folders.
			if ( in_array( $folder_name, $skip_folders, true ) ) {
				continue;
			}

			$block_json = $folder . '/block.json';

			// Each block should have a block.json file
			$this->assertFileExists(
				$block_json,
				"Block folder " . $folder_name . " should contain block.json"
			);

			// Validate block.json is valid JSON
			$json_content = file_get_contents( $block_json );
			$decoded = json_decode( $json_content, true );

			$this->assertNotNull(
				$decoded,
				"block.json in " . basename( $folder ) . " should be valid JSON"
			);

			// Block.json should have required fields
			$this->assertArrayHasKey(
				'name',
				$decoded,
				"block.json in " . basename( $folder ) . " should have 'name' field"
			);

			$this->assertArrayHasKey(
				'title',
				$decoded,
				"block.json in " . basename( $folder ) . " should have 'title' field"
			);
		}
	}

	/**
	 * Test that block.json names follow naming convention.
	 */
	public function test_block_naming_convention() {
		$blocks_dir = DESIGNSETGO_PATH . 'src/blocks';

		if ( ! is_dir( $blocks_dir ) ) {
			$this->markTestSkipped( 'Blocks directory not found' );
		}

		$block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

		foreach ( $block_folders as $folder ) {
			$block_json = $folder . '/block.json';

			if ( ! file_exists( $block_json ) ) {
				continue;
			}

			$json_content = file_get_contents( $block_json );
			$decoded = json_decode( $json_content, true );

			if ( isset( $decoded['name'] ) ) {
				$this->assertStringStartsWith(
					'designsetgo/',
					$decoded['name'],
					"Block name should start with 'designsetgo/' namespace"
				);
			}
		}
	}

	/**
	 * Test that blocks have proper textdomain.
	 */
	public function test_blocks_have_textdomain() {
		$blocks_dir = DESIGNSETGO_PATH . 'src/blocks';

		if ( ! is_dir( $blocks_dir ) ) {
			$this->markTestSkipped( 'Blocks directory not found' );
		}

		$block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

		foreach ( $block_folders as $folder ) {
			$block_json = $folder . '/block.json';

			if ( ! file_exists( $block_json ) ) {
				continue;
			}

			$json_content = file_get_contents( $block_json );
			$decoded = json_decode( $json_content, true );

			// Blocks should have textDomain set for internationalization
			$this->assertArrayHasKey(
				'textdomain',
				$decoded,
				"Block " . basename( $folder ) . " should have textdomain for i18n"
			);

			$this->assertEquals(
				'designsetgo',
				$decoded['textdomain'],
				"Block " . basename( $folder ) . " should use 'designsetgo' textdomain"
			);
		}
	}
}
