<?php
/**
 * Title: CTA Countdown
 * Slug: designsetgo/cta/cta-countdown
 * Categories: dsgo-cta
 * Description: Urgency-driven CTA section with countdown timer, gradient background, and animated elements
 * Keywords: cta, countdown, timer, urgency, sale, promo
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'CTA Countdown', 'designsetgo' ),
	'categories' => array( 'dsgo-cta' ),
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"color":{"gradient":"linear-gradient(135deg,rgb(99,102,241) 0%,rgb(168,85,247) 50%,rgb(236,72,153) 100%)"}},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeIn","dsgoAnimationDuration":600} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-background has-dsgo-animation dsgo-animation-fadeIn" style="background:linear-gradient(135deg,rgb(99,102,241) 0%,rgb(168,85,247) 50%,rgb(236,72,153) 100%);padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--30)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeIn" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="600" data-dsgo-animation-delay="0" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/pill {"content":"Limited Time Offer","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}},"border":{"radius":"50px"},"color":{"background":"rgba(255,255,255,0.2)","text":"#ffffff"}},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInDown","dsgoAnimationDuration":400} -->
<div class="wp-block-designsetgo-pill aligncenter dsgo-pill has-text-color has-background has-small-font-size has-dsgo-animation dsgo-animation-fadeInDown" style="margin-bottom:var(--wp--preset--spacing--20)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInDown" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="400" data-dsgo-animation-delay="0" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><span class="dsgo-pill__content" style="background-color:rgba(255,255,255,0.2);color:#ffffff;border-radius:50px">Limited Time Offer</span></div>
<!-- /wp:designsetgo/pill -->

<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"color":{"text":"#ffffff"}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-text-color has-x-large-font-size" style="color:#ffffff;font-style:normal;font-weight:700">Black Friday Sale - 50% Off</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|15"}},"color":{"text":"rgba(255,255,255,0.9)"}},"fontSize":"medium"} -->
<p class="has-text-align-center has-text-color has-medium-font-size" style="color:rgba(255,255,255,0.9);margin-top:var(--wp--preset--spacing--15)">Don\'t miss out on our biggest sale of the year. Offer ends soon!</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/countdown-timer {"endDate":"2025-12-31T23:59:59","style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}},"color":{"text":"#ffffff"}},"align":"center","showLabels":true,"labelPosition":"below","separator":":"} -->
<div class="wp-block-designsetgo-countdown-timer aligncenter dsgo-countdown dsgo-countdown--separator dsgo-countdown--labels-below has-text-color" style="color:#ffffff;margin-top:var(--wp--preset--spacing--40);margin-bottom:var(--wp--preset--spacing--40)" data-end-date="2025-12-31T23:59:59" data-timezone="local" data-expired-message="Offer has ended!" data-show-days="true" data-show-hours="true" data-show-minutes="true" data-show-seconds="true" data-show-labels="true" data-label-position="below" data-separator=":"><div class="dsgo-countdown__inner"><div class="dsgo-countdown__unit dsgo-countdown__days"><span class="dsgo-countdown__number">00</span><span class="dsgo-countdown__label">Days</span></div><span class="dsgo-countdown__separator">:</span><div class="dsgo-countdown__unit dsgo-countdown__hours"><span class="dsgo-countdown__number">00</span><span class="dsgo-countdown__label">Hours</span></div><span class="dsgo-countdown__separator">:</span><div class="dsgo-countdown__unit dsgo-countdown__minutes"><span class="dsgo-countdown__number">00</span><span class="dsgo-countdown__label">Minutes</span></div><span class="dsgo-countdown__separator">:</span><div class="dsgo-countdown__unit dsgo-countdown__seconds"><span class="dsgo-countdown__number">00</span><span class="dsgo-countdown__label">Seconds</span></div></div></div>
<!-- /wp:designsetgo/countdown-timer -->

<!-- wp:designsetgo/row {"style":{"spacing":{"blockGap":"var:preset|spacing|20","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInUp","dsgoAnimationDelay":200} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint has-dsgo-animation dsgo-animation-fadeInUp" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInUp" data-dsgo-exit-animation="" data-dsgo-animation-trigger="scroll" data-dsgo-animation-duration="600" data-dsgo-animation-delay="200" data-dsgo-animation-easing="ease-out" data-dsgo-animation-offset="100" data-dsgo-animation-once="true"><div class="dsgo-flex__inner" style="display:flex;justify-content:center;flex-wrap:wrap;gap:var(--wp--preset--spacing--20)"><!-- wp:designsetgo/icon-button {"text":"Claim Your Discount","url":"#","icon":"arrow-right","iconPosition":"end","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"},"color":{"background":"#ffffff","text":"#6366f1"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background" style="border-radius:8px;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto;flex-direction:row-reverse;background-color:#ffffff;color:#6366f1;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--50)" href="#" target="_self"><span class="dsgo-icon-button__icon dsgo-lazy-icon" style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;flex-shrink:0" data-icon-name="arrow-right" data-icon-size="20"></span><span class="dsgo-icon-button__text">Claim Your Discount</span></a>
<!-- /wp:designsetgo/icon-button -->

<!-- wp:designsetgo/icon-button {"text":"Learn More","url":"#","icon":"","iconPosition":"none","className":"has-text-color has-background","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px","width":"2px","color":"rgba(255,255,255,0.5)"},"color":{"background":"transparent","text":"#ffffff"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-text-color has-background has-border-color" style="border-color:rgba(255,255,255,0.5);border-width:2px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;gap:0;width:auto;flex-direction:row;background-color:transparent;color:#ffffff;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--50)" href="#" target="_self"><span class="dsgo-icon-button__text">Learn More</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}},"color":{"text":"rgba(255,255,255,0.7)"}},"fontSize":"small"} -->
<p class="has-text-align-center has-text-color has-small-font-size" style="color:rgba(255,255,255,0.7);margin-top:var(--wp--preset--spacing--30)">No credit card required. Cancel anytime.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->',
);
