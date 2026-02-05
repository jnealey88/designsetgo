<?php
/**
 * Title: Content Tabs Section
 * Slug: designsetgo/content/content-tabs-section
 * Categories: dsgo-content
 * Description: Tabbed content section with multiple panels
 * Keywords: tabs, content, panels, navigation, sections
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Content Tabs Section', 'designsetgo' ),
	'categories' => array( 'dsgo-content' ),
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"backgroundColor":"base","metadata":{"categories":["dsgo-content"],"patternName":"designsetgo/content/content-tabs-section","name":"Content Tabs Section"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/section {"dsgoTextReveal":{"enabled":true,"color":"rgba(0,0,0,0.05)","splitMode":"words"},"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"className":"has-dsgo-text-reveal"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-dsgo-text-reveal" style="margin-bottom:var(--wp--preset--spacing--50);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0" data-dsgo-text-reveal-enabled="true" data-dsgo-text-reveal-color="rgba(0,0,0,0.05)" data-dsgo-text-reveal-split-mode="words"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size">Explore Our Services</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20)">Discover how we can help you achieve your goals</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/tabs {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-tabs dsgo-tabs" data-dsgo-tabs-active="0"><!-- wp:designsetgo/tabs-list {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} -->
<div class="dsgo-tabs__list" role="tablist" style="display:flex;gap:var(--wp--preset--spacing--20);justify-content:center;flex-wrap:wrap;margin-bottom:var(--wp--preset--spacing--40)"><!-- wp:designsetgo/tab-button {"label":"Web Design","isActive":true,"style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px"}}} -->
<button class="dsgo-tabs__button dsgo-tabs__button--active" role="tab" aria-selected="true" style="padding:var(--wp--preset--spacing--20) var(--wp--preset--spacing--40);border-radius:8px;background-color:#6366f1;color:#ffffff;border:none;cursor:pointer;font-weight:600">Web Design</button>
<!-- /wp:designsetgo/tab-button -->

<!-- wp:designsetgo/tab-button {"label":"Development","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px"}}} -->
<button class="dsgo-tabs__button" role="tab" aria-selected="false" style="padding:var(--wp--preset--spacing--20) var(--wp--preset--spacing--40);border-radius:8px;background-color:var(--wp--preset--color--base-2);color:var(--wp--preset--color--contrast);border:none;cursor:pointer;font-weight:600">Development</button>
<!-- /wp:designsetgo/tab-button -->

<!-- wp:designsetgo/tab-button {"label":"Marketing","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px"}}} -->
<button class="dsgo-tabs__button" role="tab" aria-selected="false" style="padding:var(--wp--preset--spacing--20) var(--wp--preset--spacing--40);border-radius:8px;background-color:var(--wp--preset--color--base-2);color:var(--wp--preset--color--contrast);border:none;cursor:pointer;font-weight:600">Marketing</button>
<!-- /wp:designsetgo/tab-button -->

<!-- wp:designsetgo/tab-button {"label":"Support","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px"}}} -->
<button class="dsgo-tabs__button" role="tab" aria-selected="false" style="padding:var(--wp--preset--spacing--20) var(--wp--preset--spacing--40);border-radius:8px;background-color:var(--wp--preset--color--base-2);color:var(--wp--preset--color--contrast);border:none;cursor:pointer;font-weight:600">Support</button>
<!-- /wp:designsetgo/tab-button --></div>
<!-- /wp:designsetgo/tabs-list -->

<!-- wp:designsetgo/tabs-content -->
<div class="dsgo-tabs__content"><!-- wp:designsetgo/tab-panel {"isActive":true} -->
<div class="dsgo-tabs__panel dsgo-tabs__panel--active" role="tabpanel"><!-- wp:designsetgo/row {"verticalAlignment":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;flex-wrap:wrap;gap:var(--wp--preset--spacing--50);align-items:center"><!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:image {"sizeSlug":"large","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&amp;h=400&amp;fit=crop" alt="Web Design Services" style="border-radius:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:designsetgo/row-column -->

<!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Beautiful, Responsive Web Design</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|30"}}},"fontSize":"medium"} -->
<p class="has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--30)">We create stunning websites that work perfectly on all devices. Our design process focuses on user experience and conversion optimization.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":20} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list"><!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Custom UI/UX Design</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Mobile-First Approach</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Brand Integration</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list --></div>
<!-- /wp:designsetgo/row-column --></div></div>
<!-- /wp:designsetgo/row --></div>
<!-- /wp:designsetgo/tab-panel -->

<!-- wp:designsetgo/tab-panel -->
<div class="dsgo-tabs__panel" role="tabpanel" hidden><!-- wp:designsetgo/row {"verticalAlignment":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;flex-wrap:wrap;gap:var(--wp--preset--spacing--50);align-items:center"><!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:image {"sizeSlug":"large","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&amp;h=400&amp;fit=crop" alt="Development Services" style="border-radius:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:designsetgo/row-column -->

<!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Robust Web Development</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|30"}}},"fontSize":"medium"} -->
<p class="has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--30)">Our development team builds scalable, secure, and high-performance web applications using the latest technologies and best practices.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":20} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list"><!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Custom WordPress Development</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">E-commerce Solutions</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">API Integration</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list --></div>
<!-- /wp:designsetgo/row-column --></div></div>
<!-- /wp:designsetgo/row --></div>
<!-- /wp:designsetgo/tab-panel -->

<!-- wp:designsetgo/tab-panel -->
<div class="dsgo-tabs__panel" role="tabpanel" hidden><!-- wp:designsetgo/row {"verticalAlignment":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;flex-wrap:wrap;gap:var(--wp--preset--spacing--50);align-items:center"><!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:image {"sizeSlug":"large","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&amp;h=400&amp;fit=crop" alt="Marketing Services" style="border-radius:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:designsetgo/row-column -->

<!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Digital Marketing Excellence</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|30"}}},"fontSize":"medium"} -->
<p class="has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--30)">Drive growth with our comprehensive digital marketing strategies. We help you reach your target audience and convert them into loyal customers.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":20} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list"><!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">SEO Optimization</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Social Media Marketing</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Content Strategy</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list --></div>
<!-- /wp:designsetgo/row-column --></div></div>
<!-- /wp:designsetgo/row --></div>
<!-- /wp:designsetgo/tab-panel -->

<!-- wp:designsetgo/tab-panel -->
<div class="dsgo-tabs__panel" role="tabpanel" hidden><!-- wp:designsetgo/row {"verticalAlignment":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var:preset|spacing|50"}}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;flex-wrap:wrap;gap:var(--wp--preset--spacing--50);align-items:center"><!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:image {"sizeSlug":"large","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&amp;h=400&amp;fit=crop" alt="Support Services" style="border-radius:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:designsetgo/row-column -->

<!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">24/7 Customer Support</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|30"}}},"fontSize":"medium"} -->
<p class="has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--30)">We are always here to help. Our dedicated support team ensures your website runs smoothly and any issues are resolved quickly.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":20} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list"><!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Round-the-clock Availability</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Security Monitoring</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check-circle"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:20px;height:20px" data-icon-name="check-circle" data-icon-size="20"></span><span class="dsgo-icon-list-item__content">Regular Updates & Backups</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list --></div>
<!-- /wp:designsetgo/row-column --></div></div>
<!-- /wp:designsetgo/row --></div>
<!-- /wp:designsetgo/tab-panel --></div>
<!-- /wp:designsetgo/tabs-content --></div>
<!-- /wp:designsetgo/tabs --></div></div>
<!-- /wp:designsetgo/section -->',
);
