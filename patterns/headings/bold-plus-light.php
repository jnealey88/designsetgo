<?php
/**
 * Title: Bold + Light Heading
 * Slug: designsetgo/headings/bold-plus-light
 * Categories: dsgo-headings
 * Description: Two-segment heading with bold and light font weights for dramatic contrast
 * Keywords: heading, typography, bold, light, weight, contrast
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'         => __( 'Bold + Light Heading', 'designsetgo' ),
	'categories'    => array( 'dsgo-headings' ),
	'viewportWidth' => 1200,
	'content'       => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"metadata":{"categories":["dsgo-headings"],"patternName":"designsetgo/headings/bold-plus-light","name":"Bold + Light Heading"}} --><div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/advanced-heading {"level":2,"textAlign":"center","fontSize":"x-large"} --><div class="wp-block-designsetgo-advanced-heading dsgo-advanced-heading has-text-align-center has-x-large-font-size"><h2 class="dsgo-advanced-heading__inner"><!-- wp:designsetgo/heading-segment {"style":{"typography":{"fontWeight":"900"}}} --><span class="wp-block-designsetgo-heading-segment dsgo-heading-segment" style="font-weight:900"><span class="dsgo-heading-segment__text">Build</span></span><!-- /wp:designsetgo/heading-segment --><!-- wp:designsetgo/heading-segment {"style":{"typography":{"fontWeight":"300"}}} --><span class="wp-block-designsetgo-heading-segment dsgo-heading-segment" style="font-weight:300"><span class="dsgo-heading-segment__text">something amazing.</span></span><!-- /wp:designsetgo/heading-segment --></h2></div><!-- /wp:designsetgo/advanced-heading --></div></div><!-- /wp:designsetgo/section -->',
);
