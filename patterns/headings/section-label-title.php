<?php
/**
 * Title: Section Label + Title
 * Slug: designsetgo/headings/section-label-title
 * Categories: dsgo-headings
 * Description: Section heading with a small uppercase label and large title using the Advanced Heading block, followed by a description
 * Keywords: heading, typography, label, section, title, uppercase, advanced
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'         => __( 'Section Label + Title', 'designsetgo' ),
	'categories'    => array( 'dsgo-headings' ),
	'viewportWidth' => 1200,
	'content'       => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"metadata":{"categories":["dsgo-headings"],"patternName":"designsetgo/headings/section-label-title","name":"Section Label + Title"}} --><div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/advanced-heading {"level":2,"style":{"spacing":{"blockGap":"0.5em"}},"fontSize":"x-large"} --><div class="wp-block-designsetgo-advanced-heading dsgo-advanced-heading has-x-large-font-size"><h2 class="dsgo-advanced-heading__inner" style="--dsgo-segment-gap:0.5em"><!-- wp:designsetgo/heading-segment {"style":{"typography":{"fontWeight":"600","textTransform":"uppercase","letterSpacing":"2px"}},"textColor":"accent-3","fontSize":"small"} --><span class="wp-block-designsetgo-heading-segment dsgo-heading-segment has-accent-3-color has-text-color has-small-font-size" style="font-weight:600;letter-spacing:2px;text-transform:uppercase"><span class="dsgo-heading-segment__text">Our Services</span></span><!-- /wp:designsetgo/heading-segment --><!-- wp:designsetgo/heading-segment {"style":{"typography":{"fontWeight":"700"}}} --><span class="wp-block-designsetgo-heading-segment dsgo-heading-segment" style="font-weight:700"><span class="dsgo-heading-segment__text">What we do best</span></span><!-- /wp:designsetgo/heading-segment --></h2></div><!-- /wp:designsetgo/advanced-heading --><!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"textColor":"contrast-2","fontSize":"medium"} --><p class="has-contrast-2-color has-text-color has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20)">We combine strategy, design, and technology to create digital experiences that drive real results for your business.</p><!-- /wp:paragraph --><!-- wp:designsetgo/divider {"thickness":1,"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} --><div class="wp-block-designsetgo-divider dsgo-divider dsgo-divider--solid" style="margin-top:var(--wp--preset--spacing--40)"><div class="dsgo-divider__container" style="width:100%"><div class="dsgo-divider__line" style="height:1px"></div></div></div><!-- /wp:designsetgo/divider --></div></div><!-- /wp:designsetgo/section -->',
);
