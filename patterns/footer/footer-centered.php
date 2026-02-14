<?php
/**
 * Title: Footer Centered
 * Slug: designsetgo/footer/footer-centered
 * Categories: dsgo-footer
 * Description: An elegant centered footer with stacked logo, navigation, social links, and copyright
 * Keywords: footer, centered, elegant, social, brand
 * Block Types: core/template-part/footer
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Footer Centered', 'designsetgo' ),
	'categories' => array( 'dsgo-footer' ),
	'blockTypes' => array( 'core/template-part/footer' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"tagName":"footer","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|30","right":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|40"}},"metadata":{"categories":["dsgo-footer"],"patternName":"designsetgo/footer/footer-centered","name":"Footer Centered"}} -->
<footer class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-bottom:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap"><!-- wp:site-logo /-->

<!-- wp:navigation {"overlayBackgroundColor":"base","overlayTextColor":"contrast","layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} /--></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size">© 2025 Your Company. All rights reserved.</p>
<!-- /wp:paragraph --></div></footer>
<!-- /wp:designsetgo/section -->',
);
