<?php
/**
 * Title: Uppercase + Italic Heading
 * Slug: designsetgo/headings/uppercase-plus-italic
 * Categories: dsgo-headings
 * Description: Contrasting typography with an uppercase segment and an italic segment
 * Keywords: heading, typography, uppercase, italic, contrast, editorial
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'         => __( 'Uppercase + Italic Heading', 'designsetgo' ),
	'categories'    => array( 'dsgo-headings' ),
	'viewportWidth' => 1200,
	'content'       => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"metadata":{"categories":["dsgo-headings"],"patternName":"designsetgo/headings/uppercase-plus-italic","name":"Uppercase + Italic Heading"}} --><div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/advanced-heading {"level":2,"fontSize":"x-large"} --><div class="wp-block-designsetgo-advanced-heading dsgo-advanced-heading has-x-large-font-size"><h2 class="dsgo-advanced-heading__inner"><!-- wp:designsetgo/heading-segment {"style":{"typography":{"fontWeight":"800","textTransform":"uppercase","letterSpacing":"3px"}}} --><span class="wp-block-designsetgo-heading-segment dsgo-heading-segment" style="font-weight:800;letter-spacing:3px;text-transform:uppercase"><span class="dsgo-heading-segment__text">The Modern</span></span><!-- /wp:designsetgo/heading-segment --><!-- wp:designsetgo/heading-segment {"style":{"typography":{"fontWeight":"300","fontStyle":"italic"}}} --><span class="wp-block-designsetgo-heading-segment dsgo-heading-segment" style="font-weight:300;font-style:italic"><span class="dsgo-heading-segment__text">approach</span></span><!-- /wp:designsetgo/heading-segment --></h2></div><!-- /wp:designsetgo/advanced-heading --></div></div><!-- /wp:designsetgo/section -->',
);
