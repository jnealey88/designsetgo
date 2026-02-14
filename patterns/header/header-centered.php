<?php
/**
 * Title: Header Centered
 * Slug: designsetgo/header/header-centered
 * Categories: dsgo-header
 * Description: An elegant centered header with site logo above and navigation below
 * Keywords: header, centered, elegant, brand, boutique
 * Block Types: core/template-part/header
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Header Centered', 'designsetgo' ),
	'categories' => array( 'dsgo-header' ),
	'blockTypes' => array( 'core/template-part/header' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"tagName":"header","constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"0"}}} -->
<header class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|30"},"border":{"bottom":{"color":"var:preset|color|contrast","width":"1px","style":"solid"}}},"metadata":{"categories":["dsgo-header"],"patternName":"designsetgo/header/header-centered","name":"Header Centered"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="border-bottom-color:var(--wp--preset--color--contrast);border-bottom-style:solid;border-bottom-width:1px;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:site-logo {"width":150,"shouldSyncIcon":true,"align":"center"} /-->

<!-- wp:navigation {"overlayBackgroundColor":"base","overlayTextColor":"contrast","layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"}} /--></div></div>
<!-- /wp:designsetgo/section --></div></header>
<!-- /wp:designsetgo/section -->',
);
