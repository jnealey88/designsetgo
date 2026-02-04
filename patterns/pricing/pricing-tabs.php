<?php
/**
 * Title: Pricing Tabs
 * Slug: designsetgo/pricing/pricing-tabs
 * Categories: dsgo-pricing
 * Description: Pricing section with monthly/yearly tabs toggle, animated cards, and icon lists for features
 * Keywords: pricing, tabs, monthly, yearly, toggle, features
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Pricing Tabs', 'designsetgo' ),
	'categories' => array( 'dsgo-pricing' ),
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"base-2"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-2-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/section {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="margin-bottom:var(--wp--preset--spacing--50);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:paragraph {"align":"center","style":{"typography":{"textTransform":"uppercase","letterSpacing":"3px"},"color":{"text":"#6366f1"}},"fontSize":"small"} -->
<p class="has-text-align-center has-text-color has-small-font-size" style="color:#6366f1;letter-spacing:3px;text-transform:uppercase">Pricing</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size" style="margin-top:var(--wp--preset--spacing--10);font-style:normal;font-weight:700">Choose Your Plan</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}},"color":{"text":"#64748b"}},"fontSize":"medium"} -->
<p class="has-text-align-center has-text-color has-medium-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--20)">Save 20% with annual billing. All plans include a 14-day free trial.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/tabs {"tabStyle":"pills","alignment":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-tabs dsgo-tabs dsgo-tabs--pills dsgo-tabs--align-center" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0" data-orientation="horizontal" data-default-tab="0"><div class="dsgo-tabs__nav-wrapper"><div class="dsgo-tabs__nav" role="tablist" aria-orientation="horizontal"><!-- wp:designsetgo/tab-title {"title":"Monthly","tabIndex":0} -->
<button class="wp-block-designsetgo-tab-title dsgo-tab-title dsgo-tab-title--active" role="tab" aria-selected="true" aria-controls="dsgo-tab-panel-0" id="dsgo-tab-0" tabindex="0" data-tab-index="0">Monthly</button>
<!-- /wp:designsetgo/tab-title -->

<!-- wp:designsetgo/tab-title {"title":"Yearly (Save 20%)","tabIndex":1} -->
<button class="wp-block-designsetgo-tab-title dsgo-tab-title" role="tab" aria-selected="false" aria-controls="dsgo-tab-panel-1" id="dsgo-tab-1" tabindex="-1" data-tab-index="1">Yearly (Save 20%)</button>
<!-- /wp:designsetgo/tab-title --></div></div><div class="dsgo-tabs__panels"><!-- wp:designsetgo/tab-panel {"tabIndex":0} -->
<div class="wp-block-designsetgo-tab-panel dsgo-tab-panel dsgo-tab-panel--active" role="tabpanel" aria-labelledby="dsgo-tab-0" id="dsgo-tab-panel-0" tabindex="0" data-tab-index="0"><!-- wp:designsetgo/grid {"style":{"spacing":{"blockGap":"var:preset|spacing|30","padding":{"top":"var:preset|spacing|40","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-grid alignfull dsgo-grid dsgo-grid-cols-3 dsgo-grid-cols-tablet-2 dsgo-grid-cols-mobile-1 dsgo-no-width-constraint" style="padding-top:var(--wp--preset--spacing--40);padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-grid__inner" style="display:grid;grid-template-columns:repeat(3, 1fr);align-items:stretch;row-gap:var(--wp--preset--spacing--30);column-gap:var(--wp--preset--spacing--30)"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"16px"}},"backgroundColor":"base","dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInUp","dsgoAnimationDuration":500} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-background-color has-background has-dsgo-animation dsgo-animation-fadeInUp" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInUp" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="500" data-dsgo-animation-delay="0" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Starter</h3>
<!-- /wp:heading -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"},"blockGap":"0","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="margin-top:var(--wp--preset--spacing--20);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:left;flex-wrap:nowrap;gap:0"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"xx-large"} -->
<p class="has-xx-large-font-size" style="font-style:normal;font-weight:700">$19</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#64748b"}}} -->
<p class="has-text-color" style="color:#64748b">/month</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|15"}},"color":{"text":"#64748b"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--15)">Perfect for individuals and small projects.</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)"/>
<!-- /wp:separator -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":18,"style":{"spacing":{"blockGap":"var:preset|spacing|15"}}} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list" style="--dsgo-icon-list-icon-size:18px;--dsgo-icon-list-icon-color:#10b981;--dsgo-icon-list-gap:var(--wp--preset--spacing--15)"><!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">5 Projects</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">10GB Storage</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Basic Analytics</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Email Support</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list -->

<!-- wp:designsetgo/icon-button {"text":"Get Started","url":"#","icon":"","iconPosition":"none","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"0","right":"0"},"margin":{"top":"var:preset|spacing|30"}},"border":{"radius":"8px","width":"2px"},"color":{"background":"transparent","text":"#0f172a"},"layout":{"selfStretch":"fill","flexSize":null}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background" style="border-width:2px;border-radius:8px;margin-top:var(--wp--preset--spacing--30);display:inline-flex;align-items:center;justify-content:center;gap:0;width:100%;flex-direction:row;background-color:transparent;color:#0f172a;padding-top:var(--wp--preset--spacing--20);padding-right:0;padding-bottom:var(--wp--preset--spacing--20);padding-left:0" href="#" target="_self"><span class="dsgo-icon-button__text">Get Started</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"16px","width":"2px","color":"#6366f1"}},"backgroundColor":"base","dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInUp","dsgoAnimationDuration":500,"dsgoAnimationDelay":100} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-border-color has-base-background-color has-background has-dsgo-animation dsgo-animation-fadeInUp" style="border-color:#6366f1;border-width:2px;border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInUp" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="500" data-dsgo-animation-delay="100" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/pill {"content":"Most Popular","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|15"}},"border":{"radius":"50px"},"color":{"background":"#6366f1","text":"#ffffff"}}} -->
<div class="wp-block-designsetgo-pill dsgo-pill has-text-color has-background has-small-font-size" style="margin-bottom:var(--wp--preset--spacing--15)"><span class="dsgo-pill__content" style="background-color:#6366f1;color:#ffffff;border-radius:50px">Most Popular</span></div>
<!-- /wp:designsetgo/pill -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Professional</h3>
<!-- /wp:heading -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"},"blockGap":"0","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="margin-top:var(--wp--preset--spacing--20);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:left;flex-wrap:nowrap;gap:0"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"xx-large"} -->
<p class="has-xx-large-font-size" style="font-style:normal;font-weight:700">$49</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#64748b"}}} -->
<p class="has-text-color" style="color:#64748b">/month</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|15"}},"color":{"text":"#64748b"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--15)">For growing teams that need more power.</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)"/>
<!-- /wp:separator -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":18,"style":{"spacing":{"blockGap":"var:preset|spacing|15"}}} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list" style="--dsgo-icon-list-icon-size:18px;--dsgo-icon-list-icon-color:#10b981;--dsgo-icon-list-gap:var(--wp--preset--spacing--15)"><!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Unlimited Projects</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">100GB Storage</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Advanced Analytics</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Priority Support</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">API Access</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list -->

<!-- wp:designsetgo/icon-button {"text":"Get Started","url":"#","icon":"","iconPosition":"none","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"0","right":"0"},"margin":{"top":"var:preset|spacing|30"}},"border":{"radius":"8px"},"color":{"background":"#6366f1","text":"#ffffff"},"layout":{"selfStretch":"fill","flexSize":null}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background" style="border-radius:8px;margin-top:var(--wp--preset--spacing--30);display:inline-flex;align-items:center;justify-content:center;gap:0;width:100%;flex-direction:row;background-color:#6366f1;color:#ffffff;padding-top:var(--wp--preset--spacing--20);padding-right:0;padding-bottom:var(--wp--preset--spacing--20);padding-left:0" href="#" target="_self"><span class="dsgo-icon-button__text">Get Started</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"16px"}},"backgroundColor":"base","dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInUp","dsgoAnimationDuration":500,"dsgoAnimationDelay":200} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-background-color has-background has-dsgo-animation dsgo-animation-fadeInUp" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInUp" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="500" data-dsgo-animation-delay="200" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Enterprise</h3>
<!-- /wp:heading -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"},"blockGap":"0","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="margin-top:var(--wp--preset--spacing--20);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:left;flex-wrap:nowrap;gap:0"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"xx-large"} -->
<p class="has-xx-large-font-size" style="font-style:normal;font-weight:700">$99</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#64748b"}}} -->
<p class="has-text-color" style="color:#64748b">/month</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|15"}},"color":{"text":"#64748b"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--15)">For large organizations with custom needs.</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)"/>
<!-- /wp:separator -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":18,"style":{"spacing":{"blockGap":"var:preset|spacing|15"}}} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list" style="--dsgo-icon-list-icon-size:18px;--dsgo-icon-list-icon-color:#10b981;--dsgo-icon-list-gap:var(--wp--preset--spacing--15)"><!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Everything in Pro</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Unlimited Storage</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Custom Integrations</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Dedicated Support</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">SLA Guarantee</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list -->

<!-- wp:designsetgo/icon-button {"text":"Contact Sales","url":"#","icon":"","iconPosition":"none","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"0","right":"0"},"margin":{"top":"var:preset|spacing|30"}},"border":{"radius":"8px","width":"2px"},"color":{"background":"transparent","text":"#0f172a"},"layout":{"selfStretch":"fill","flexSize":null}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background" style="border-width:2px;border-radius:8px;margin-top:var(--wp--preset--spacing--30);display:inline-flex;align-items:center;justify-content:center;gap:0;width:100%;flex-direction:row;background-color:transparent;color:#0f172a;padding-top:var(--wp--preset--spacing--20);padding-right:0;padding-bottom:var(--wp--preset--spacing--20);padding-left:0" href="#" target="_self"><span class="dsgo-icon-button__text">Contact Sales</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/grid --></div>
<!-- /wp:designsetgo/tab-panel -->

<!-- wp:designsetgo/tab-panel {"tabIndex":1} -->
<div class="wp-block-designsetgo-tab-panel dsgo-tab-panel" role="tabpanel" aria-labelledby="dsgo-tab-1" id="dsgo-tab-panel-1" tabindex="0" data-tab-index="1" hidden><!-- wp:designsetgo/grid {"style":{"spacing":{"blockGap":"var:preset|spacing|30","padding":{"top":"var:preset|spacing|40","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-grid alignfull dsgo-grid dsgo-grid-cols-3 dsgo-grid-cols-tablet-2 dsgo-grid-cols-mobile-1 dsgo-no-width-constraint" style="padding-top:var(--wp--preset--spacing--40);padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-grid__inner" style="display:grid;grid-template-columns:repeat(3, 1fr);align-items:stretch;row-gap:var(--wp--preset--spacing--30);column-gap:var(--wp--preset--spacing--30)"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Starter</h3>
<!-- /wp:heading -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"},"blockGap":"var:preset|spacing|10","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="margin-top:var(--wp--preset--spacing--20);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:left;flex-wrap:nowrap;gap:var(--wp--preset--spacing--10)"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"xx-large"} -->
<p class="has-xx-large-font-size" style="font-style:normal;font-weight:700">$15</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#64748b"}}} -->
<p class="has-text-color" style="color:#64748b">/month</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/pill {"content":"Save $48","style":{"border":{"radius":"50px"},"color":{"background":"rgba(16,185,129,0.1)","text":"#10b981"}}} -->
<div class="wp-block-designsetgo-pill dsgo-pill has-text-color has-background has-small-font-size"><span class="dsgo-pill__content" style="background-color:rgba(16,185,129,0.1);color:#10b981;border-radius:50px">Save $48</span></div>
<!-- /wp:designsetgo/pill --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|15"}},"color":{"text":"#64748b"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--15)">Billed annually at $180/year</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)"/>
<!-- /wp:separator -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":18,"style":{"spacing":{"blockGap":"var:preset|spacing|15"}}} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list" style="--dsgo-icon-list-icon-size:18px;--dsgo-icon-list-icon-color:#10b981;--dsgo-icon-list-gap:var(--wp--preset--spacing--15)"><!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">5 Projects</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">10GB Storage</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Basic Analytics</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Email Support</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list -->

<!-- wp:designsetgo/icon-button {"text":"Get Started","url":"#","icon":"","iconPosition":"none","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"0","right":"0"},"margin":{"top":"var:preset|spacing|30"}},"border":{"radius":"8px","width":"2px"},"color":{"background":"transparent","text":"#0f172a"},"layout":{"selfStretch":"fill","flexSize":null}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background" style="border-width:2px;border-radius:8px;margin-top:var(--wp--preset--spacing--30);display:inline-flex;align-items:center;justify-content:center;gap:0;width:100%;flex-direction:row;background-color:transparent;color:#0f172a;padding-top:var(--wp--preset--spacing--20);padding-right:0;padding-bottom:var(--wp--preset--spacing--20);padding-left:0" href="#" target="_self"><span class="dsgo-icon-button__text">Get Started</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"16px","width":"2px","color":"#6366f1"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-border-color has-base-background-color has-background" style="border-color:#6366f1;border-width:2px;border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/pill {"content":"Most Popular","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|15"}},"border":{"radius":"50px"},"color":{"background":"#6366f1","text":"#ffffff"}}} -->
<div class="wp-block-designsetgo-pill dsgo-pill has-text-color has-background has-small-font-size" style="margin-bottom:var(--wp--preset--spacing--15)"><span class="dsgo-pill__content" style="background-color:#6366f1;color:#ffffff;border-radius:50px">Most Popular</span></div>
<!-- /wp:designsetgo/pill -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Professional</h3>
<!-- /wp:heading -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"},"blockGap":"var:preset|spacing|10","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="margin-top:var(--wp--preset--spacing--20);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:left;flex-wrap:nowrap;gap:var(--wp--preset--spacing--10)"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"xx-large"} -->
<p class="has-xx-large-font-size" style="font-style:normal;font-weight:700">$39</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#64748b"}}} -->
<p class="has-text-color" style="color:#64748b">/month</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/pill {"content":"Save $120","style":{"border":{"radius":"50px"},"color":{"background":"rgba(16,185,129,0.1)","text":"#10b981"}}} -->
<div class="wp-block-designsetgo-pill dsgo-pill has-text-color has-background has-small-font-size"><span class="dsgo-pill__content" style="background-color:rgba(16,185,129,0.1);color:#10b981;border-radius:50px">Save $120</span></div>
<!-- /wp:designsetgo/pill --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|15"}},"color":{"text":"#64748b"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--15)">Billed annually at $468/year</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)"/>
<!-- /wp:separator -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":18,"style":{"spacing":{"blockGap":"var:preset|spacing|15"}}} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list" style="--dsgo-icon-list-icon-size:18px;--dsgo-icon-list-icon-color:#10b981;--dsgo-icon-list-gap:var(--wp--preset--spacing--15)"><!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Unlimited Projects</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">100GB Storage</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Advanced Analytics</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Priority Support</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">API Access</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list -->

<!-- wp:designsetgo/icon-button {"text":"Get Started","url":"#","icon":"","iconPosition":"none","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"0","right":"0"},"margin":{"top":"var:preset|spacing|30"}},"border":{"radius":"8px"},"color":{"background":"#6366f1","text":"#ffffff"},"layout":{"selfStretch":"fill","flexSize":null}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background" style="border-radius:8px;margin-top:var(--wp--preset--spacing--30);display:inline-flex;align-items:center;justify-content:center;gap:0;width:100%;flex-direction:row;background-color:#6366f1;color:#ffffff;padding-top:var(--wp--preset--spacing--20);padding-right:0;padding-bottom:var(--wp--preset--spacing--20);padding-left:0" href="#" target="_self"><span class="dsgo-icon-button__text">Get Started</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Enterprise</h3>
<!-- /wp:heading -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"},"blockGap":"var:preset|spacing|10","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="margin-top:var(--wp--preset--spacing--20);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:left;flex-wrap:nowrap;gap:var(--wp--preset--spacing--10)"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"xx-large"} -->
<p class="has-xx-large-font-size" style="font-style:normal;font-weight:700">$79</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"#64748b"}}} -->
<p class="has-text-color" style="color:#64748b">/month</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/pill {"content":"Save $240","style":{"border":{"radius":"50px"},"color":{"background":"rgba(16,185,129,0.1)","text":"#10b981"}}} -->
<div class="wp-block-designsetgo-pill dsgo-pill has-text-color has-background has-small-font-size"><span class="dsgo-pill__content" style="background-color:rgba(16,185,129,0.1);color:#10b981;border-radius:50px">Save $240</span></div>
<!-- /wp:designsetgo/pill --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|15"}},"color":{"text":"#64748b"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:#64748b;margin-top:var(--wp--preset--spacing--15)">Billed annually at $948/year</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)"/>
<!-- /wp:separator -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":18,"style":{"spacing":{"blockGap":"var:preset|spacing|15"}}} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list" style="--dsgo-icon-list-icon-size:18px;--dsgo-icon-list-icon-color:#10b981;--dsgo-icon-list-gap:var(--wp--preset--spacing--15)"><!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Everything in Pro</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Unlimited Storage</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Custom Integrations</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">Dedicated Support</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="wp-block-designsetgo-icon-list-item dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" data-icon-name="check" aria-hidden="true"></span><span class="dsgo-icon-list-item__content">SLA Guarantee</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list -->

<!-- wp:designsetgo/icon-button {"text":"Contact Sales","url":"#","icon":"","iconPosition":"none","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"0","right":"0"},"margin":{"top":"var:preset|spacing|30"}},"border":{"radius":"8px","width":"2px"},"color":{"background":"transparent","text":"#0f172a"},"layout":{"selfStretch":"fill","flexSize":null}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background" style="border-width:2px;border-radius:8px;margin-top:var(--wp--preset--spacing--30);display:inline-flex;align-items:center;justify-content:center;gap:0;width:100%;flex-direction:row;background-color:transparent;color:#0f172a;padding-top:var(--wp--preset--spacing--20);padding-right:0;padding-bottom:var(--wp--preset--spacing--20);padding-left:0" href="#" target="_self"><span class="dsgo-icon-button__text">Contact Sales</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/grid --></div>
<!-- /wp:designsetgo/tab-panel --></div></div>
<!-- /wp:designsetgo/tabs --></div></div>
<!-- /wp:designsetgo/section -->',
);
