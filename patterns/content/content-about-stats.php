<?php
/**
 * Title: About Section with Stats
 * Slug: designsetgo/content/content-about-stats
 * Categories: dsgo-content
 * Description: A two-column about section combining personal narrative with animated stat counters
 * Keywords: about, stats, counters, portfolio, personal, bio
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'About Section with Stats', 'designsetgo' ),
	'categories' => array( 'dsgo-content' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/grid {"desktopColumns":2,"style":{"spacing":{"blockGap":"var:preset|spacing|70","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"alignItems":"center"} -->
<div class="wp-block-designsetgo-grid alignfull dsgo-grid dsgo-grid-cols-2 dsgo-grid-cols-tablet-2 dsgo-grid-cols-mobile-1 dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-grid__inner" style="display:grid;grid-template-columns:repeat(2, 1fr);align-items:center;row-gap:var(--wp--preset--spacing--70);column-gap:var(--wp--preset--spacing--70)"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"2px"}},"textColor":"contrast-2","fontSize":"small"} -->
<p class="has-contrast-2-color has-text-color has-small-font-size" style="letter-spacing:2px;text-transform:uppercase">About Me</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-x-large-font-size" style="margin-top:var(--wp--preset--spacing--20);font-style:normal;font-weight:700">Designing with Purpose, Creating with Passion</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"fontSize":"medium"} -->
<p class="has-medium-font-size" style="margin-top:var(--wp--preset--spacing--30)">With over 10 years of experience in product design, I have helped companies ranging from early-stage startups to Fortune 500 companies create meaningful digital experiences.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--20)">I believe great design is invisible - it should feel intuitive and delightful without getting in the way. My approach combines user research, strategic thinking, and pixel-perfect execution to deliver results that matter.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--20)">When not designing, you will find me mentoring aspiring designers, speaking at conferences, or exploring hiking trails with my camera.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/counter-group {"columns":2,"animationDuration":2000,"animationDelay":200,"animationEasing":"easeOutExpo","className":"dsgo-counter-group-cols-2 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2"} -->
<div class="wp-block-designsetgo-counter-group dsgo-counter-group dsgo-counter-group-cols-2 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2" style="align-self:stretch;--dsgo-counter-columns-desktop:2;--dsgo-counter-columns-tablet:2;--dsgo-counter-columns-mobile:1;--dsgo-counter-gap:32px" data-animation-duration="2000" data-animation-delay="200" data-animation-easing="easeOutExpo" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter-group__inner dsgo-counter-group__inner--align-center"><!-- wp:designsetgo/counter {"uniqueId":"counter-port-1","endValue":10,"suffix":"+","label":"Years Experience","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-port-1" style="text-align:center" data-start-value="0" data-end-value="10" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Years Experience</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-port-2","suffix":"+","label":"Projects Delivered","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-port-2" style="text-align:center" data-start-value="0" data-end-value="100" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Projects Delivered</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-port-3","endValue":50,"suffix":"+","label":"Happy Clients","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-port-3" style="text-align:center" data-start-value="0" data-end-value="50" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Happy Clients</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-port-4","endValue":5,"label":"Design Awards","className":"dsgo-counter\\u002d\\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-port-4" style="text-align:center" data-start-value="0" data-end-value="5" data-decimals="0" data-prefix="" data-suffix="" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Design Awards</div></div>
<!-- /wp:designsetgo/counter --></div></div>
<!-- /wp:designsetgo/counter-group --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/grid --></div></div>
<!-- /wp:designsetgo/section -->',
);
