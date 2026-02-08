<?php
/**
 * Title: Professional Stats Bar
 * Slug: designsetgo/content/content-professional-stats
 * Categories: dsgo-content
 * Description: A dark statistics bar with animated counters for firm credentials like years of experience and cases won
 * Keywords: stats, counters, professional, credentials, firm, experience
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Professional Stats Bar', 'designsetgo' ),
	'categories' => array( 'dsgo-content' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"contrast","textColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-color has-contrast-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/counter-group {"columns":4,"animationDuration":2000,"animationDelay":200,"animationEasing":"easeOutExpo","className":"dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2","textColor":"base","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}}}} -->
<div class="wp-block-designsetgo-counter-group dsgo-counter-group dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2 has-base-color has-text-color has-link-color" style="align-self:stretch;--dsgo-counter-columns-desktop:4;--dsgo-counter-columns-tablet:2;--dsgo-counter-columns-mobile:1;--dsgo-counter-gap:32px" data-animation-duration="2000" data-animation-delay="200" data-animation-easing="easeOutExpo" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter-group__inner dsgo-counter-group__inner--align-center"><!-- wp:designsetgo/counter {"uniqueId":"counter-pro-1","endValue":30,"suffix":"+","label":"Years Experience","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-pro-1" style="text-align:center" data-start-value="0" data-end-value="30" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Years Experience</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-pro-2","endValue":2500,"suffix":"+","label":"Cases Resolved","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-pro-2" style="text-align:center" data-start-value="0" data-end-value="2500" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Cases Resolved</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-pro-3","endValue":98,"suffix":"%","label":"Client Satisfaction","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-pro-3" style="text-align:center" data-start-value="0" data-end-value="98" data-decimals="0" data-prefix="" data-suffix="%" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Client Satisfaction</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-pro-4","endValue":15,"label":"Expert Partners","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-pro-4" style="text-align:center" data-start-value="0" data-end-value="15" data-decimals="0" data-prefix="" data-suffix="" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Expert Partners</div></div>
<!-- /wp:designsetgo/counter --></div></div>
<!-- /wp:designsetgo/counter-group --></div></div>
<!-- /wp:designsetgo/section -->',
);
