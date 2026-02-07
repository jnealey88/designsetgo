<?php
/**
 * Title: Impact Stats Counters
 * Slug: designsetgo/content/content-impact-stats
 * Categories: dsgo-content
 * Description: A light statistics bar showing key nonprofit impact metrics like lives changed, communities, and volunteers
 * Keywords: stats, counters, impact, nonprofit, charity, metrics
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Impact Stats Counters', 'designsetgo' ),
	'categories' => array( 'dsgo-content' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"base-2"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-2-background-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/counter-group {"columns":4,"animationDuration":2000,"animationDelay":200,"animationEasing":"easeOutExpo","className":"dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2"} -->
<div class="wp-block-designsetgo-counter-group dsgo-counter-group dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2" style="align-self:stretch;--dsgo-counter-columns-desktop:4;--dsgo-counter-columns-tablet:2;--dsgo-counter-columns-mobile:1;--dsgo-counter-gap:32px" data-animation-duration="2000" data-animation-delay="200" data-animation-easing="easeOutExpo" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter-group__inner dsgo-counter-group__inner--align-center"><!-- wp:designsetgo/counter {"uniqueId":"np-1","endValue":50000,"suffix":"+","label":"Lives Changed"} -->
<div class="wp-block-designsetgo-counter dsgo-counter" id="np-1" style="text-align:center" data-start-value="0" data-end-value="50000" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Lives Changed</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"np-2","endValue":25,"label":"Countries Reached"} -->
<div class="wp-block-designsetgo-counter dsgo-counter" id="np-2" style="text-align:center" data-start-value="0" data-end-value="25" data-decimals="0" data-prefix="" data-suffix="" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Countries Reached</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"np-3","endValue":1000,"suffix":"+","label":"Volunteers"} -->
<div class="wp-block-designsetgo-counter dsgo-counter" id="np-3" style="text-align:center" data-start-value="0" data-end-value="1000" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Volunteers</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"np-4","endValue":5,"prefix":"$","suffix":"M+","label":"Raised"} -->
<div class="wp-block-designsetgo-counter dsgo-counter" id="np-4" style="text-align:center" data-start-value="0" data-end-value="5" data-decimals="0" data-prefix="$" data-suffix="M+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Raised</div></div>
<!-- /wp:designsetgo/counter --></div></div>
<!-- /wp:designsetgo/counter-group --></div></div>
<!-- /wp:designsetgo/section -->',
);
