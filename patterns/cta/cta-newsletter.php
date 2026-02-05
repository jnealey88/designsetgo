<?php
/**
 * Title: Newsletter Signup
 * Slug: designsetgo/cta/cta-newsletter
 * Categories: dsgo-cta
 * Description: Email newsletter signup with form and benefits
 * Keywords: newsletter, email, signup, subscribe, form
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Newsletter Signup', 'designsetgo' ),
	'categories' => array( 'dsgo-cta' ),
	'content'    => '<!-- wp:designsetgo/section {"dsgoAnimation":{"type":"fadeIn","duration":"normal","delay":"none","easing":"ease"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"backgroundColor":"base-2","className":"has-dsgo-animation dsgo-animation-fadeIn","metadata":{"categories":["dsgo-cta"],"patternName":"designsetgo/cta/cta-newsletter","name":"Newsletter Signup"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-2-background-color has-background has-dsgo-animation dsgo-animation-fadeIn" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)" data-dsgo-animation="fadeIn" data-dsgo-animation-duration="normal" data-dsgo-animation-delay="none" data-dsgo-animation-easing="ease" data-dsgo-animation-once="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"verticalAlignment":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var:preset|spacing|60"}}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;flex-wrap:wrap;gap:var(--wp--preset--spacing--60);align-items:center"><!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:designsetgo/icon {"icon":"mail","size":"48px","color":"#6366f1","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<span class="wp-block-designsetgo-icon dsgo-icon dsgo-lazy-icon" style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;color:#6366f1;margin-bottom:var(--wp--preset--spacing--20)" data-icon-name="mail" data-icon-size="48" aria-hidden="true"></span>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-x-large-font-size">Stay in the Loop</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}},"fontSize":"medium"} -->
<p class="has-medium-font-size" style="margin-bottom:var(--wp--preset--spacing--30)">Get the latest updates, tips, and exclusive offers delivered straight to your inbox.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/icon-list {"iconColor":"#10b981","iconSize":18} -->
<ul class="wp-block-designsetgo-icon-list dsgo-icon-list"><!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:18px;height:18px" data-icon-name="check" data-icon-size="18"></span><span class="dsgo-icon-list-item__content">Weekly insights and tutorials</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:18px;height:18px" data-icon-name="check" data-icon-size="18"></span><span class="dsgo-icon-list-item__content">Early access to new features</span></li>
<!-- /wp:designsetgo/icon-list-item -->

<!-- wp:designsetgo/icon-list-item {"icon":"check"} -->
<li class="dsgo-icon-list-item"><span class="dsgo-icon-list-item__icon dsgo-lazy-icon" style="color:#10b981;width:18px;height:18px" data-icon-name="check" data-icon-size="18"></span><span class="dsgo-icon-list-item__content">No spam, unsubscribe anytime</span></li>
<!-- /wp:designsetgo/icon-list-item --></ul>
<!-- /wp:designsetgo/icon-list --></div>
<!-- /wp:designsetgo/row-column -->

<!-- wp:designsetgo/row-column {"width":"50","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row-column dsgo-row-column" style="flex-basis:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/form-builder {"formId":"newsletter-form","submitButtonText":"Subscribe","submitButtonStyle":"filled","submitButtonColor":"#6366f1"} -->
<form class="wp-block-designsetgo-form-builder dsgo-form" id="newsletter-form" data-form-id="newsletter-form" data-submit-style="filled" data-submit-color="#6366f1"><!-- wp:designsetgo/form-field-text {"fieldId":"newsletter-name","label":"Your Name","placeholder":"Enter your name","required":true} -->
<div class="wp-block-designsetgo-form-field-text dsgo-form-field"><label class="dsgo-form-field__label" for="newsletter-name">Your Name <span class="dsgo-form-field__required">*</span></label><input type="text" id="newsletter-name" name="newsletter-name" class="dsgo-form-field__input" placeholder="Enter your name" required/></div>
<!-- /wp:designsetgo/form-field-text -->

<!-- wp:designsetgo/form-field-email {"fieldId":"newsletter-email","label":"Email Address","placeholder":"you@example.com","required":true} -->
<div class="wp-block-designsetgo-form-field-email dsgo-form-field"><label class="dsgo-form-field__label" for="newsletter-email">Email Address <span class="dsgo-form-field__required">*</span></label><input type="email" id="newsletter-email" name="newsletter-email" class="dsgo-form-field__input" placeholder="you@example.com" required/></div>
<!-- /wp:designsetgo/form-field-email -->

<button type="submit" class="dsgo-form__submit wp-block-button__link wp-element-button" style="background-color:#6366f1;width:100%">Subscribe</button></form>
<!-- /wp:designsetgo/form-builder -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"textColor":"contrast","fontSize":"small"} -->
<p class="has-text-align-center has-contrast-color has-text-color has-small-font-size" style="margin-top:var(--wp--preset--spacing--20)">Join 10,000+ subscribers</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section --></div>
<!-- /wp:designsetgo/row-column --></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/section -->',
);
