<?php
/**
 * Title: Footer Classic
 * Slug: designsetgo/footer/footer-classic
 * Categories: dsgo-footer
 * Description: A clean footer with site logo, horizontal navigation, and copyright line
 * Keywords: footer, classic, simple, professional, copyright
 * Block Types: core/template-part/footer
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Footer Classic', 'designsetgo' ),
	'categories' => array( 'dsgo-footer' ),
	'blockTypes' => array( 'core/template-part/footer' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"tagName":"footer","constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"0"}},"metadata":{"categories":["dsgo-footer"],"patternName":"designsetgo/footer/footer-classic","name":"Footer Classic"}} -->
<footer class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|30","right":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|40"},"border":{"top":{"color":"var:preset|color|contrast","width":"1px","style":"solid"}}},"metadata":{"categories":["dsgo-footer"],"patternName":"designsetgo/footer/footer-classic","name":"Footer Classic"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="border-top-color:var(--wp--preset--color--contrast);border-top-style:solid;border-top-width:1px;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:site-logo {"width":150,"shouldSyncIcon":true,"align":"center"} /-->

<!-- wp:navigation {"overlayBackgroundColor":"base","overlayTextColor":"contrast","layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"}} /-->

<!-- wp:social-links {"size":"has-normal-icon-size","className":"is-style-logos-only","layout":{"type":"flex","justifyContent":"center"}} -->
<ul class="wp-block-social-links has-normal-icon-size is-style-logos-only"><!-- wp:social-link {"url":"#","service":"facebook"} /-->

<!-- wp:social-link {"url":"#","service":"x"} /-->

<!-- wp:social-link {"url":"#","service":"instagram"} /-->

<!-- wp:social-link {"url":"#","service":"linkedin"} /--></ul>
<!-- /wp:social-links -->

<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size">© 2025 Your Company. All rights reserved.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section --></div></footer>
<!-- /wp:designsetgo/section -->',
);
