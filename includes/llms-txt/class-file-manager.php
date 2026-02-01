<?php
/**
 * LLMS TXT File Manager
 *
 * Manages static markdown file generation and storage.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

namespace DesignSetGo\LLMS_Txt;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * File_Manager Class
 *
 * Handles static markdown file operations.
 */
class File_Manager {
	/**
	 * Directory for static markdown files (relative to uploads).
	 */
	const MARKDOWN_DIR = 'designsetgo/llms';

	/**
	 * Post meta key for exclusion.
	 */
	const EXCLUDE_META_KEY = '_designsetgo_exclude_llms';

	/**
	 * Get the full path to the markdown files directory.
	 *
	 * @return string Directory path.
	 */
	public function get_directory(): string {
		$upload_dir = wp_upload_dir();
		return trailingslashit( $upload_dir['basedir'] ) . self::MARKDOWN_DIR;
	}

	/**
	 * Get the URL for a markdown file.
	 *
	 * @param int $post_id Post ID.
	 * @return string File URL.
	 */
	public function get_url( int $post_id ): string {
		$upload_dir = wp_upload_dir();
		return trailingslashit( $upload_dir['baseurl'] ) . self::MARKDOWN_DIR . '/' . $post_id . '.md';
	}

	/**
	 * Check if a static markdown file exists for a post.
	 *
	 * @param int $post_id Post ID.
	 * @return bool True if file exists.
	 */
	public function file_exists( int $post_id ): bool {
		$file_path = $this->get_directory() . '/' . $post_id . '.md';
		return file_exists( $file_path );
	}

	/**
	 * Ensure the markdown directory exists.
	 *
	 * @return bool True if directory exists or was created.
	 */
	public function ensure_directory(): bool {
		$dir = $this->get_directory();

		if ( ! file_exists( $dir ) ) {
			return wp_mkdir_p( $dir );
		}

		return is_dir( $dir ) && is_writable( $dir );
	}

	/**
	 * Generate a static markdown file for a post.
	 *
	 * @param int $post_id Post ID.
	 * @return bool|\WP_Error True on success, WP_Error on failure.
	 */
	public function generate_file( int $post_id ) {
		$post = get_post( $post_id );

		if ( ! $post ) {
			return new \WP_Error( 'not_found', __( 'Post not found.', 'designsetgo' ) );
		}

		if ( 'publish' !== $post->post_status ) {
			$this->delete_file( $post_id );
			return new \WP_Error( 'not_published', __( 'Post is not published.', 'designsetgo' ) );
		}

		// Reject password-protected or otherwise non-public posts.
		if ( post_password_required( $post ) || ! is_post_publicly_viewable( $post ) ) {
			$this->delete_file( $post_id );
			return new \WP_Error( 'not_public', __( 'Post is not publicly accessible.', 'designsetgo' ) );
		}

		// Check if post is excluded.
		$excluded = get_post_meta( $post_id, self::EXCLUDE_META_KEY, true );
		if ( $excluded ) {
			$this->delete_file( $post_id );
			return new \WP_Error( 'excluded', __( 'Post is excluded from llms.txt.', 'designsetgo' ) );
		}

		// Check if feature is enabled.
		$settings = \DesignSetGo\Admin\Settings::get_settings();
		if ( empty( $settings['llms_txt']['enable'] ) ) {
			return new \WP_Error( 'feature_disabled', __( 'llms.txt feature is not enabled.', 'designsetgo' ) );
		}

		// Check if post type is enabled.
		$enabled_post_types = $settings['llms_txt']['post_types'] ?? array( 'page', 'post' );
		if ( ! in_array( $post->post_type, $enabled_post_types, true ) ) {
			$this->delete_file( $post_id );
			return new \WP_Error( 'post_type_disabled', __( 'Post type is not enabled.', 'designsetgo' ) );
		}

		// Ensure directory exists.
		if ( ! $this->ensure_directory() ) {
			return new \WP_Error( 'directory_error', __( 'Could not create markdown directory.', 'designsetgo' ) );
		}

		// Convert to markdown.
		$converter = new \DesignSetGo\Markdown\Converter();
		$markdown  = $converter->convert( $post );

		// Write the file.
		$file_path = $this->get_directory() . '/' . $post_id . '.md';

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- Direct file write required for performance.
		$result = file_put_contents( $file_path, $markdown );

		if ( false === $result ) {
			return new \WP_Error( 'write_error', __( 'Could not write markdown file.', 'designsetgo' ) );
		}

		return true;
	}

	/**
	 * Delete a static markdown file for a post.
	 *
	 * @param int $post_id Post ID.
	 * @return bool True if file was deleted or didn't exist.
	 */
	public function delete_file( int $post_id ): bool {
		$file_path = $this->get_directory() . '/' . $post_id . '.md';

		if ( file_exists( $file_path ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink -- Direct file operation required.
			return unlink( $file_path );
		}

		return true;
	}

	/**
	 * Generate markdown files for all enabled posts.
	 *
	 * @param Generator $generator Content generator instance.
	 * @return array Result with generated count and errors.
	 */
	public function generate_all_files( Generator $generator ): array {
		$settings = \DesignSetGo\Admin\Settings::get_settings();

		if ( empty( $settings['llms_txt']['enable'] ) ) {
			return array(
				'success'         => false,
				'generated_count' => 0,
				'errors'          => array( __( 'llms.txt feature is not enabled.', 'designsetgo' ) ),
			);
		}

		$post_types = $settings['llms_txt']['post_types'] ?? array( 'page', 'post' );
		$generated  = 0;
		$errors     = array();

		foreach ( $post_types as $post_type ) {
			$posts = $generator->get_public_content( $post_type );

			foreach ( $posts as $post ) {
				$result = $this->generate_file( $post->ID );

				if ( is_wp_error( $result ) ) {
					$errors[] = sprintf(
						/* translators: 1: Post title, 2: Error message */
						__( 'Failed to generate %1$s: %2$s', 'designsetgo' ),
						$post->post_title,
						$result->get_error_message()
					);
				} else {
					++$generated;
				}
			}
		}

		return array(
			'success'         => empty( $errors ),
			'generated_count' => $generated,
			'errors'          => $errors,
		);
	}
}
