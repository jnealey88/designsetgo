<?php
/**
 * Title: Hero Section with Container
 * Slug: designsetgo/hero/container-hero
 * Categories: dsg-hero
 * Description: A full-width hero section using the Container block with centered content
 * Keywords: hero, header, banner, container
 */

return array(
	'title'      => __( 'Hero Section with Container', 'designsetgo' ),
	'categories' => array( 'dsg-hero' ),
	'content'    => '<!-- wp:designsetgo/container {"align":"full","layout":{"type":"flex","orientation":"vertical","justifyContent":"center","verticalAlignment":"center"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}},"color":{"background":"#1a1a1a"}}} -->
<div class="wp-block-designsetgo-container dsg-container alignfull has-background" style="background-color:#1a1a1a;padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
	<div class="dsg-container__inner-wrapper has-content-width" style="position:relative;z-index:2;max-width:800px;margin-left:auto;margin-right:auto;width:100%">
		<div class="dsg-container__inner">
			<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3rem"},"color":{"text":"#ffffff"}}} -->
			<h1 class="wp-block-heading has-text-align-center has-text-color" style="color:#ffffff;font-size:3rem">Welcome to Your Site</h1>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#e0e0e0"}}} -->
			<p class="has-text-align-center has-text-color" style="color:#e0e0e0">Create beautiful layouts with flexible containers, video backgrounds, and responsive grids.</p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
			<div class="wp-block-buttons">
				<!-- wp:button {"backgroundColor":"primary","style":{"border":{"radius":"4px"}}} -->
				<div class="wp-block-button"><a class="wp-block-button__link has-primary-background-color has-background wp-element-button" style="border-radius:4px">Get Started</a></div>
				<!-- /wp:button -->

				<!-- wp:button {"style":{"border":{"radius":"4px","width":"2px"}},"borderColor":"primary","className":"is-style-outline"} -->
				<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-border-color has-primary-border-color wp-element-button" style="border-width:2px;border-radius:4px">Learn More</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
	</div>
</div>
<!-- /wp:designsetgo/container -->'
);
