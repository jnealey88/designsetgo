<?php
/**
 * Title: Three Column Feature Grid
 * Slug: designsetgo/features/three-column-grid
 * Categories: dsg-features
 * Description: A responsive 3-column grid using Container block with WordPress Grid layout
 * Keywords: features, grid, columns, responsive
 */

return array(
	'title'      => __( 'Three Column Feature Grid', 'designsetgo' ),
	'categories' => array( 'dsg-features' ),
	'content'    => '<!-- wp:designsetgo/container {"gridColumns":3,"gridColumnsTablet":2,"gridColumnsMobile":1,"layout":{"type":"grid","columnCount":3},"style":{"spacing":{"padding":{"top":"var:preset|spacing|lg","bottom":"var:preset|spacing|lg"},"blockGap":"var:preset|spacing|md"}}} -->
<div class="wp-block-designsetgo-container dsg-container" style="padding-top:var(--wp--preset--spacing--lg);padding-bottom:var(--wp--preset--spacing--lg)">
	<div class="dsg-container__inner-wrapper has-content-width" style="position:relative;z-index:2;max-width:800px;margin-left:auto;margin-right:auto;width:100%">
		<div class="dsg-container__inner dsg-responsive-grid dsg-grid-cols-3 dsg-grid-cols-tablet-2 dsg-grid-cols-mobile-1">
			<!-- wp:group {"style":{"spacing":{"padding":"var:preset|spacing|md"},"border":{"radius":"8px","width":"1px"}},"borderColor":"contrast-2","layout":{"type":"flex","orientation":"vertical"}} -->
			<div class="wp-block-group has-border-color has-contrast-2-border-color" style="border-width:1px;border-radius:8px;padding:var(--wp--preset--spacing--md)">
				<!-- wp:heading {"level":3} -->
				<h3 class="wp-block-heading">Feature One</h3>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Describe your first amazing feature here. Make it compelling and clear.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->

			<!-- wp:group {"style":{"spacing":{"padding":"var:preset|spacing|md"},"border":{"radius":"8px","width":"1px"}},"borderColor":"contrast-2","layout":{"type":"flex","orientation":"vertical"}} -->
			<div class="wp-block-group has-border-color has-contrast-2-border-color" style="border-width:1px;border-radius:8px;padding:var(--wp--preset--spacing--md)">
				<!-- wp:heading {"level":3} -->
				<h3 class="wp-block-heading">Feature Two</h3>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Describe your second amazing feature here. Make it compelling and clear.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->

			<!-- wp:group {"style":{"spacing":{"padding":"var:preset|spacing|md"},"border":{"radius":"8px","width":"1px"}},"borderColor":"contrast-2","layout":{"type":"flex","orientation":"vertical"}} -->
			<div class="wp-block-group has-border-color has-contrast-2-border-color" style="border-width:1px;border-radius:8px;padding:var(--wp--preset--spacing--md)">
				<!-- wp:heading {"level":3} -->
				<h3 class="wp-block-heading">Feature Three</h3>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Describe your third amazing feature here. Make it compelling and clear.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
	</div>
</div>
<!-- /wp:designsetgo/container -->'
);
