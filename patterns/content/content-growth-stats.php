<?php
/**
 * Title: Growth Stats Counters
 * Slug: designsetgo/content/content-growth-stats
 * Categories: dsgo-content
 * Description: A statistics section with animated counters showing company growth and trust metrics
 * Keywords: stats, counters, growth, metrics, saas, trust
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Growth Stats Counters', 'designsetgo' ),
	'categories' => array( 'dsgo-content' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"gradient":"vivid-cyan-blue-to-vivid-purple"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-vivid-cyan-blue-to-vivid-purple-gradient-background has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/section {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="margin-bottom:var(--wp--preset--spacing--50);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:heading {"textAlign":"center","textColor":"base","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-base-color has-text-color has-x-large-font-size">Trusted by Growing Companies</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"base","fontSize":"medium"} -->
<p class="has-text-align-center has-base-color has-text-color has-medium-font-size">See the impact we have made together</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/counter-group {"columns":4,"animationDuration":2000,"animationDelay":200,"animationEasing":"easeOutExpo","className":"dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-1","textColor":"base"} -->
<div class="wp-block-designsetgo-counter-group dsgo-counter-group dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-1 has-base-color has-text-color" style="align-self:stretch;--dsgo-counter-columns-desktop:4;--dsgo-counter-columns-tablet:2;--dsgo-counter-columns-mobile:1;--dsgo-counter-gap:32px" data-animation-duration="2000" data-animation-delay="200" data-animation-easing="easeOutExpo" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter-group__inner dsgo-counter-group__inner--align-center"><!-- wp:designsetgo/counter {"uniqueId":"counter-saas-1","endValue":50000,"suffix":"+","label":"Active Users","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-saas-1" style="text-align:center" data-start-value="0" data-end-value="50000" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Active Users</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-saas-2","endValue":99,"suffix":"%","label":"Uptime SLA","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-saas-2" style="text-align:center" data-start-value="0" data-end-value="99" data-decimals="0" data-prefix="" data-suffix="%" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Uptime SLA</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-saas-3","endValue":150,"suffix":"+","label":"Integrations","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-saas-3" style="text-align:center" data-start-value="0" data-end-value="150" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Integrations</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-saas-4","endValue":24,"suffix":"/7","label":"Support","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-saas-4" style="text-align:center" data-start-value="0" data-end-value="24" data-decimals="0" data-prefix="" data-suffix="/7" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Support</div></div>
<!-- /wp:designsetgo/counter --></div></div>
<!-- /wp:designsetgo/counter-group --></div></div>
<!-- /wp:designsetgo/section -->',
);
