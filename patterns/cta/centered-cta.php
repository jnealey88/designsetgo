<?php
/**
 * Title: Centered Call to Action
 * Slug: designsetgo/cta/centered-cta
 * Categories: dsg-cta
 * Description: A centered CTA section using Container block with content width constraint
 * Keywords: cta, call to action, centered, content width
 */

return array(
	'title'      => __( 'Centered Call to Action', 'designsetgo' ),
	'categories' => array( 'dsg-cta' ),
	'content'    => '<!-- wp:designsetgo/container {"useContentWidth":true,"align":"full","layout":{"type":"flex","orientation":"vertical","justifyContent":"center"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}},"color":{"background":"var:preset|color|accent"}}} -->
<div class="wp-block-designsetgo-container dsg-container alignfull has-background" style="background-color:var(--wp--preset--color--accent);padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
	<div class="dsg-container__inner-wrapper has-content-width" style="position:relative;z-index:2;max-width:800px;margin-left:auto;margin-right:auto;width:100%">
		<div class="dsg-container__inner">
			<!-- wp:heading {"textAlign":"center","level":2} -->
			<h2 class="wp-block-heading has-text-align-center">Ready to Get Started?</h2>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center"} -->
			<p class="has-text-align-center">Join thousands of users who are already creating amazing websites with our tools.</p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
			<div class="wp-block-buttons">
				<!-- wp:button {"backgroundColor":"contrast","textColor":"base","style":{"border":{"radius":"4px"}}} -->
				<div class="wp-block-button"><a class="wp-block-button__link has-base-color has-contrast-background-color has-text-color has-background wp-element-button" style="border-radius:4px">Start Free Trial</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
	</div>
</div>
<!-- /wp:designsetgo/container -->'
);
