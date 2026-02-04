<?php
/**
 * Title: Skills Progress Bars
 * Slug: designsetgo/content/content-progress-skills
 * Categories: dsgo-content
 * Description: Skills or expertise showcase with animated progress bars and statistics
 * Keywords: skills, progress, bars, expertise, about, stats
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Skills Progress Bars', 'designsetgo' ),
	'categories' => array( 'dsgo-content' ),
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"base-2"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-2-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/grid {"desktopColumns":2,"style":{"spacing":{"blockGap":"var:preset|spacing|60","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"alignItems":"center"} -->
<div class="wp-block-designsetgo-grid alignfull dsgo-grid dsgo-grid-cols-2 dsgo-grid-cols-tablet-2 dsgo-grid-cols-mobile-1 dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-grid__inner" style="display:grid;grid-template-columns:repeat(2, 1fr);align-items:center;row-gap:var(--wp--preset--spacing--60);column-gap:var(--wp--preset--spacing--60)"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInLeft","dsgoAnimationDuration":600} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-dsgo-animation dsgo-animation-fadeInLeft" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInLeft" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="600" data-dsgo-animation-delay="0" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"3px"},"color":{"text":"#6366f1"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#6366f1;letter-spacing:3px;text-transform:uppercase">Our Expertise</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-x-large-font-size" style="margin-top:var(--wp--preset--spacing--10);font-style:normal;font-weight:700">Skills That Drive Results</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}},"color":{"text":"#64748b"}},"fontSize":"medium"} -->
<p class="has-text-color has-medium-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--20)">With years of experience and continuous learning, we have developed expertise across multiple domains to deliver exceptional results for our clients.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/counter-group {"columns":2,"animationDuration":2000,"animationEasing":"easeOutExpo","className":"dsgo-counter-group-cols-2 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2","style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
<div class="wp-block-designsetgo-counter-group dsgo-counter-group dsgo-counter-group-cols-2 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-2" style="margin-top:var(--wp--preset--spacing--40);align-self:stretch;--dsgo-counter-columns-desktop:2;--dsgo-counter-columns-tablet:2;--dsgo-counter-columns-mobile:1;--dsgo-counter-gap:32px" data-animation-duration="2000" data-animation-delay="0" data-animation-easing="easeOutExpo" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter-group__inner dsgo-counter-group__inner--align-center"><!-- wp:designsetgo/counter {"uniqueId":"skill-stat-1","endValue":150,"suffix":"+","label":"Projects Completed"} -->
<div class="wp-block-designsetgo-counter dsgo-counter" id="skill-stat-1" style="text-align:center" data-start-value="0" data-end-value="150" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Projects Completed</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"skill-stat-2","endValue":98,"suffix":"%","label":"Client Satisfaction"} -->
<div class="wp-block-designsetgo-counter dsgo-counter" id="skill-stat-2" style="text-align:center" data-start-value="0" data-end-value="98" data-decimals="0" data-prefix="" data-suffix="%" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Client Satisfaction</div></div>
<!-- /wp:designsetgo/counter --></div></div>
<!-- /wp:designsetgo/counter-group --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInRight","dsgoAnimationDuration":600} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-dsgo-animation dsgo-animation-fadeInRight" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInRight" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="600" data-dsgo-animation-delay="0" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/section {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|25"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="margin-bottom:var(--wp--preset--spacing--25);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;flex-wrap:nowrap"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="font-style:normal;font-weight:600">Web Development</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#6366f1"},"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#6366f1;font-style:normal;font-weight:600">95%</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:designsetgo/progress-bar {"progress":95,"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"height":"8px","backgroundColor":"#e2e8f0","progressColor":"#6366f1","borderRadius":"4px","animateOnScroll":true} -->
<div class="wp-block-designsetgo-progress-bar dsgo-progress-bar" style="margin-top:var(--wp--preset--spacing--10);--dsgo-progress-height:8px;--dsgo-progress-bg:#e2e8f0;--dsgo-progress-color:#6366f1;--dsgo-progress-radius:4px" data-progress="95" data-animate="true" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"><div class="dsgo-progress-bar__track"><div class="dsgo-progress-bar__fill" style="width:95%"></div></div></div>
<!-- /wp:designsetgo/progress-bar --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|25"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="margin-bottom:var(--wp--preset--spacing--25);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;flex-wrap:nowrap"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="font-style:normal;font-weight:600">UI/UX Design</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#10b981"},"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#10b981;font-style:normal;font-weight:600">90%</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:designsetgo/progress-bar {"progress":90,"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"height":"8px","backgroundColor":"#e2e8f0","progressColor":"#10b981","borderRadius":"4px","animateOnScroll":true} -->
<div class="wp-block-designsetgo-progress-bar dsgo-progress-bar" style="margin-top:var(--wp--preset--spacing--10);--dsgo-progress-height:8px;--dsgo-progress-bg:#e2e8f0;--dsgo-progress-color:#10b981;--dsgo-progress-radius:4px" data-progress="90" data-animate="true" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"><div class="dsgo-progress-bar__track"><div class="dsgo-progress-bar__fill" style="width:90%"></div></div></div>
<!-- /wp:designsetgo/progress-bar --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|25"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="margin-bottom:var(--wp--preset--spacing--25);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;flex-wrap:nowrap"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="font-style:normal;font-weight:600">Digital Marketing</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#f59e0b"},"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#f59e0b;font-style:normal;font-weight:600">85%</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:designsetgo/progress-bar {"progress":85,"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"height":"8px","backgroundColor":"#e2e8f0","progressColor":"#f59e0b","borderRadius":"4px","animateOnScroll":true} -->
<div class="wp-block-designsetgo-progress-bar dsgo-progress-bar" style="margin-top:var(--wp--preset--spacing--10);--dsgo-progress-height:8px;--dsgo-progress-bg:#e2e8f0;--dsgo-progress-color:#f59e0b;--dsgo-progress-radius:4px" data-progress="85" data-animate="true" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"><div class="dsgo-progress-bar__track"><div class="dsgo-progress-bar__fill" style="width:85%"></div></div></div>
<!-- /wp:designsetgo/progress-bar --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;flex-wrap:nowrap"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="font-style:normal;font-weight:600">SEO Optimization</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#ec4899"},"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#ec4899;font-style:normal;font-weight:600">88%</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:designsetgo/progress-bar {"progress":88,"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"height":"8px","backgroundColor":"#e2e8f0","progressColor":"#ec4899","borderRadius":"4px","animateOnScroll":true} -->
<div class="wp-block-designsetgo-progress-bar dsgo-progress-bar" style="margin-top:var(--wp--preset--spacing--10);--dsgo-progress-height:8px;--dsgo-progress-bg:#e2e8f0;--dsgo-progress-color:#ec4899;--dsgo-progress-radius:4px" data-progress="88" data-animate="true" role="progressbar" aria-valuenow="88" aria-valuemin="0" aria-valuemax="100"><div class="dsgo-progress-bar__track"><div class="dsgo-progress-bar__fill" style="width:88%"></div></div></div>
<!-- /wp:designsetgo/progress-bar --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/grid --></div></div>
<!-- /wp:designsetgo/section -->',
);
