<?php
/**
 * Title: Footer Minimal
 * Slug: designsetgo/footer/footer-minimal
 * Categories: dsgo-footer
 * Description: A minimal single-line footer with copyright and navigation links
 * Keywords: footer, minimal, simple, clean, copyright
 * Block Types: core/template-part/footer
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Footer Minimal', 'designsetgo' ),
	'categories' => array( 'dsgo-footer' ),
	'blockTypes' => array( 'core/template-part/footer' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"tagName":"footer","constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"0"}}} -->
<footer class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"top":{"color":"var:preset|color|contrast","width":"1px","style":"solid"}}},"metadata":{"categories":["dsgo-footer"],"patternName":"designsetgo/footer/footer-minimal","name":"Footer Minimal"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="border-top-color:var(--wp--preset--color--contrast);border-top-style:solid;border-top-width:1px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-bottom:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap"><!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">© 2025 Your Company. All rights reserved.</p>
<!-- /wp:paragraph -->

<!-- wp:navigation {"overlayBackgroundColor":"base","overlayTextColor":"contrast","layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"},"fontSize":"small"} /--></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/section --></div></footer>
<!-- /wp:designsetgo/section -->',
);
