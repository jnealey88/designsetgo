<?php
/**
 * Uninstall DesignSetGo Plugin
 *
 * Fired when plugin is deleted (not deactivated).
 * Removes all plugin data from database.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

// Exit if not called by WordPress uninstaller.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

global $wpdb;

// 1. Delete all form submissions (custom post type).
$wpdb->query(
	"DELETE FROM {$wpdb->posts} WHERE post_type = 'dsg_form_submission'"
);

// 2. Delete orphaned post meta.
$wpdb->query(
	"DELETE FROM {$wpdb->postmeta} WHERE meta_key LIKE '_dsg_%'"
);

// 3. Delete plugin options.
delete_option( 'designsetgo_global_styles' );
delete_option( 'designsetgo_settings' );

// 4. Delete all plugin transients (rate limiting).
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->options}
		 WHERE option_name LIKE %s
		    OR option_name LIKE %s",
		$wpdb->esc_like( '_transient_form_submit_' ) . '%',
		$wpdb->esc_like( '_transient_dsg_has_blocks_' ) . '%'
	)
);

// 5. Delete transient timeout entries.
$wpdb->query(
	"DELETE FROM {$wpdb->options}
	 WHERE option_name LIKE '_transient_timeout_form_submit_%'
	    OR option_name LIKE '_transient_timeout_dsg_has_blocks_%'"
);

// 6. Clear object cache.
wp_cache_delete_group( 'designsetgo' );

// Log uninstallation for debugging.
if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
	error_log( 'DesignSetGo: Plugin data cleaned up successfully.' );
}
