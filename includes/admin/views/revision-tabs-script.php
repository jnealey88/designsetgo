<?php
/**
 * Revision Tabs Script View
 *
 * Outputs the CSS and JavaScript for adding visual comparison tabs
 * to the WordPress revision comparison screen.
 *
 * @package DesignSetGo
 * @since 1.4.0
 *
 * @var WP_Post $post     The post being compared.
 * @var int     $revision_id The current revision ID.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<style>
	.dsgo-revisions-tabs {
		display: inline-flex;
		gap: 4px;
		position: absolute;
		right: 20px;
		top: 12px;
	}
	.wrap {
		position: relative;
	}
	.dsgo-revisions-tab {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		background: #f0f0f1;
		border: 1px solid #c3c4c7;
		border-radius: 4px;
		color: #50575e;
		text-decoration: none;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}
	.dsgo-revisions-tab:hover {
		background: #fff;
		border-color: #2271b1;
		color: #2271b1;
	}
	.dsgo-revisions-tab--active {
		background: #2271b1;
		border-color: #2271b1;
		color: #fff;
		cursor: default;
	}
	.dsgo-revisions-tab--active:hover {
		background: #2271b1;
		border-color: #2271b1;
		color: #fff;
	}
	.dsgo-revisions-tab .dashicons {
		font-size: 14px;
		width: 14px;
		height: 14px;
		line-height: 14px;
	}
</style>
<script>
(function() {
	var postId = <?php echo wp_json_encode( $post->ID ); ?>;
	var adminUrl = <?php echo wp_json_encode( admin_url( 'admin.php' ) ); ?>;

	function getVisualComparisonUrl() {
		// Get current revision from URL (WordPress updates this when slider moves)
		var urlParams = new URLSearchParams(window.location.search);
		var revisionId = urlParams.get('revision') || <?php echo wp_json_encode( $revision_id ); ?>;
		return adminUrl + '?page=designsetgo-revisions&post_id=' + postId + '&revision=' + revisionId;
	}

	function updateVisualTabHref() {
		var visualTab = document.querySelector('#dsgo-revisions-tabs a[href*="designsetgo-revisions"]');
		if (visualTab) {
			visualTab.href = getVisualComparisonUrl();
		}
	}

	function addVisualComparisonTabs() {
		// Check if tabs already exist.
		if (document.getElementById('dsgo-revisions-tabs')) {
			return;
		}

		var tabsNav = document.createElement('nav');
		tabsNav.id = 'dsgo-revisions-tabs';
		tabsNav.className = 'dsgo-revisions-tabs';
		tabsNav.setAttribute('role', 'tablist');

		// Code Changes tab (active on this page)
		var codeTab = document.createElement('span');
		codeTab.className = 'dsgo-revisions-tab dsgo-revisions-tab--active';
		codeTab.setAttribute('role', 'tab');
		codeTab.setAttribute('aria-selected', 'true');
		codeTab.innerHTML = '<span class="dashicons dashicons-editor-code"></span>' + <?php echo wp_json_encode( __( 'Code Changes', 'designsetgo' ) ); ?>;

		// Visual Comparison tab - dynamically get URL
		var visualTab = document.createElement('a');
		visualTab.href = getVisualComparisonUrl();
		visualTab.className = 'dsgo-revisions-tab';
		visualTab.setAttribute('role', 'tab');
		visualTab.innerHTML = '<span class="dashicons dashicons-visibility"></span>' + <?php echo wp_json_encode( __( 'Visual Comparison', 'designsetgo' ) ); ?>;

		tabsNav.appendChild(codeTab);
		tabsNav.appendChild(visualTab);

		// Append to .wrap container (tabs are absolutely positioned to the right)
		var wrap = document.querySelector('.wrap');
		if (wrap) {
			wrap.appendChild(tabsNav);
		}
	}

	// Try immediately and also on DOMContentLoaded.
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', addVisualComparisonTabs);
	} else {
		addVisualComparisonTabs();
	}

	// Also try after a short delay for React-based revision screen.
	setTimeout(addVisualComparisonTabs, 500);
	setTimeout(addVisualComparisonTabs, 1500);

	// Listen for URL changes (WordPress updates URL when slider moves)
	// Use popstate for back/forward and also poll for pushState/replaceState changes
	window.addEventListener('popstate', updateVisualTabHref);

	// Poll for URL changes since WordPress uses replaceState which doesn't fire popstate
	var lastUrl = window.location.href;
	setInterval(function() {
		if (window.location.href !== lastUrl) {
			lastUrl = window.location.href;
			updateVisualTabHref();
		}
	}, 500);
})();
</script>
