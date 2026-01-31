<?php
/**
 * Revision Comparison Page View
 *
 * Renders the visual revision comparison admin page.
 *
 * @package DesignSetGo
 * @since 1.4.0
 *
 * @var WP_Post $post        The post being compared.
 * @var int     $post_id     The post ID.
 * @var int     $revision_id The current revision ID.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Build URLs for navigation.
$standard_url = add_query_arg(
	array(
		'revision' => $revision_id ? $revision_id : '',
		'view'     => 'standard',
	),
	admin_url( 'revision.php' )
);

$edit_url = get_edit_post_link( $post_id, 'raw' ) ?? '';
?>
<div class="wrap dsgo-revisions-wrap">
	<div class="dsgo-revisions-header">
		<h1 class="dsgo-revisions-title">
			<?php
			printf(
				/* translators: %s: post title with link */
				esc_html__( 'Compare Revisions of "%s"', 'designsetgo' ),
				$edit_url ? '<a href="' . esc_url( $edit_url ) . '">' . esc_html( $post->post_title ) . '</a>' : esc_html( $post->post_title )
			);
			?>
		</h1>
		<?php if ( $edit_url ) : ?>
		<a href="<?php echo esc_url( $edit_url ); ?>" class="dsgo-revisions-editor-link">
			<?php esc_html_e( '← Go to editor', 'designsetgo' ); ?>
		</a>
		<?php endif; ?>
		<nav class="dsgo-revisions-tabs" role="tablist">
			<a href="<?php echo esc_url( $standard_url ); ?>" class="dsgo-revisions-tab" role="tab">
				<span class="dashicons dashicons-editor-code"></span>
				<?php esc_html_e( 'Code Changes', 'designsetgo' ); ?>
			</a>
			<span class="dsgo-revisions-tab dsgo-revisions-tab--active" role="tab" aria-selected="true">
				<span class="dashicons dashicons-visibility"></span>
				<?php esc_html_e( 'Visual Comparison', 'designsetgo' ); ?>
			</span>
		</nav>
	</div>
	<div id="designsetgo-revisions-root"></div>
</div>
<style>
	.dsgo-revisions-wrap {
		max-width: 100%;
	}
	.dsgo-revisions-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid #c3c4c7;
	}
	.dsgo-revisions-title {
		margin: 0;
		padding: 0;
		font-size: 23px;
		font-weight: 400;
		line-height: 1.3;
	}
	.dsgo-revisions-title a {
		text-decoration: none;
	}
	.dsgo-revisions-title a:hover {
		text-decoration: underline;
	}
	.dsgo-revisions-editor-link {
		color: #2271b1;
		text-decoration: none;
		font-size: 13px;
	}
	.dsgo-revisions-editor-link:hover {
		color: #135e96;
		text-decoration: underline;
	}
	.dsgo-revisions-tabs {
		display: flex;
		gap: 4px;
		margin-left: auto;
	}
	.dsgo-revisions-tab {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
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
		font-size: 16px;
		width: 16px;
		height: 16px;
	}
</style>
