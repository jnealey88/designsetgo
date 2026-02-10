<?php
/**
 * Title: Contribute
 * Slug: designsetgo/pages/page-contribute
 * Categories: dsgo-pages
 * Description: Full page design for contributing to the DesignSetGo plugin
 * Keywords: contribute, open source, github, community, developer
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Contribute', 'designsetgo' ),
	'categories' => array( 'dsgo-pages' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"background":{"backgroundImage":{"url":"https://designsetgoblocks.com/wp-content/uploads/2026/02/topography-2.svg","id":1832,"source":"file","title":"topography 2"},"backgroundSize":"cover"},"elements":{"link":{"color":{"text":"var:preset|color|base"}}}},"shapeDividerBottom":"wave","shapeDividerBottomColor":"#ffffff","shapeDividerBottomFlipY":true,"backgroundColor":"contrast","textColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-stack--has-shape-divider has-base-color has-contrast-background-color has-text-color has-background has-link-color" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto;padding-bottom:100px"><!-- wp:designsetgo/pill {"content":"Open Source","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"var:preset|spacing|20","right":"var:preset|spacing|20"}},"border":{"radius":"50px"},"color":{"background":"#eef2ff","text":"#6366f1"}},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInDown","dsgoAnimationDuration":500} -->
<div class="wp-block-designsetgo-pill aligncenter dsgo-pill has-text-color has-background has-small-font-size has-dsgo-animation dsgo-animation-fadeInDown" style="padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--20);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--20)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInDown" data-dsgo-animation-duration="500"><span class="dsgo-pill__content" style="background-color:#eef2ff;color:#6366f1;border-radius:50px">Open Source</span></div>
<!-- /wp:designsetgo/pill -->

<!-- wp:heading {"textAlign":"center","level":1,"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInUp"} -->
<h1 class="wp-block-heading has-text-align-center has-dsgo-animation dsgo-animation-fadeInUp" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInUp">Contribute to DesignSetGo</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size" style="margin-top:var(--wp--preset--spacing--30)">DesignSetGo is a free, open-source WordPress plugin built by the community, for the community. There are many ways to contribute — whether you write code, report bugs, translate, or spread the word.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"},"blockGap":"var:preset|spacing|20","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInUp","dsgoAnimationDelay":200} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint has-dsgo-animation dsgo-animation-fadeInUp" style="margin-top:var(--wp--preset--spacing--40);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInUp" data-dsgo-animation-delay="200"><div class="dsgo-flex__inner" style="display:flex;justify-content:center;flex-wrap:wrap;gap:var(--wp--preset--spacing--20)"><!-- wp:designsetgo/icon-button {"text":"View on GitHub","url":"https://github.com/developer-starter-templates/developer-starter-templates","icon":"github","iconPosition":"end","hoverAnimation":"fill-diagonal","backgroundColor":"accent-2","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button dsgo-icon-button--fill-diagonal" style="border-radius:8px;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto;flex-direction:row-reverse;background-color:var(--wp--preset--color--accent-2);color:var(--wp--preset--color--base);padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--40)" href="https://github.com/developer-starter-templates/developer-starter-templates" target="_self"><span class="dsgo-icon-button__icon dsgo-lazy-icon" style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;flex-shrink:0" data-icon-name="github" data-icon-size="20"></span><span class="dsgo-icon-button__text">View on GitHub</span></a>
<!-- /wp:designsetgo/icon-button -->

<!-- wp:designsetgo/icon-button {"text":"Read the Docs","url":"#getting-started","icon":"","iconPosition":"none","borderColor":"base","backgroundColor":"transparent","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px","width":"2px"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-border-color has-base-border-color" style="border-width:2px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;gap:0;width:auto;flex-direction:row;background-color:var(--wp--preset--color--transparent);color:var(--wp--preset--color--base);padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--40)" href="#getting-started" target="_self"><span class="dsgo-icon-button__text">Read the Docs</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size" style="margin-top:var(--wp--preset--spacing--30)">Licensed under GPL v2 or later. Contributions welcome from all experience levels.</p>
<!-- /wp:paragraph --></div><div class="dsgo-shape-divider dsgo-shape-divider--bottom" style="--dsgo-shape-height:100px;--dsgo-shape-width:100%;--dsgo-shape-offset:-0%;--dsgo-shape-color:#ffffff" aria-hidden="true"><svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0 C300,120 900,0 1200,80 L1200,120 L0,120 Z"></path></svg></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:paragraph {"align":"center","style":{"typography":{"textTransform":"uppercase","letterSpacing":"2px"}},"fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size" style="letter-spacing:2px;text-transform:uppercase">Project at a glance</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/counter-group {"columns":4,"animationDuration":2000,"animationDelay":200,"animationEasing":"easeOutExpo","className":"dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-1"} -->
<div class="wp-block-designsetgo-counter-group dsgo-counter-group dsgo-counter-group-cols-4 dsgo-counter-group-cols-tablet-2 dsgo-counter-group-cols-mobile-1" style="align-self:stretch;--dsgo-counter-columns-desktop:4;--dsgo-counter-columns-tablet:2;--dsgo-counter-columns-mobile:1;--dsgo-counter-gap:32px" data-animation-duration="2000" data-animation-delay="200" data-animation-easing="easeOutExpo" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter-group__inner dsgo-counter-group__inner--align-center"><!-- wp:designsetgo/counter {"uniqueId":"counter-contrib-1","endValue":50,"suffix":"+","label":"Custom Blocks","className":"dsgo-counter\u002d\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-contrib-1" style="text-align:center" data-start-value="0" data-end-value="50" data-decimals="0" data-prefix="" data-suffix="+" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Custom Blocks</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-contrib-2","endValue":15,"label":"Extensions","className":"dsgo-counter\u002d\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-contrib-2" style="text-align:center" data-start-value="0" data-end-value="15" data-decimals="0" data-prefix="" data-suffix="" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Extensions</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-contrib-3","endValue":9,"label":"Languages","className":"dsgo-counter\u002d\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-contrib-3" style="text-align:center" data-start-value="0" data-end-value="9" data-decimals="0" data-prefix="" data-suffix="" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Languages</div></div>
<!-- /wp:designsetgo/counter -->

<!-- wp:designsetgo/counter {"uniqueId":"counter-contrib-4","suffix":"%","label":"Free Forever","className":"dsgo-counter\u002d\u002dalign-center"} -->
<div class="wp-block-designsetgo-counter dsgo-counter dsgo-counter--align-center" id="counter-contrib-4" style="text-align:center" data-start-value="0" data-end-value="100" data-decimals="0" data-prefix="" data-suffix="%" data-duration="2" data-delay="0" data-easing="easeOutQuad" data-use-grouping="true" data-separator="," data-decimal="."><div class="dsgo-counter__content icon-top"><div class="dsgo-counter__number"><span class="dsgo-counter__value">0</span></div></div><div class="dsgo-counter__label">Free Forever</div></div>
<!-- /wp:designsetgo/counter --></div></div>
<!-- /wp:designsetgo/counter-group --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"base-2","dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeIn","dsgoAnimationDuration":800} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-2-background-color has-background has-dsgo-animation dsgo-animation-fadeIn" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--30)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeIn" data-dsgo-animation-duration="800"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/pill {"content":"Get Involved","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"var:preset|spacing|20","right":"var:preset|spacing|20"}},"border":{"radius":"50px"},"color":{"background":"#eef2ff","text":"#6366f1"}}} -->
<div class="wp-block-designsetgo-pill aligncenter dsgo-pill has-text-color has-background has-small-font-size" style="padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--20);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--20)"><span class="dsgo-pill__content" style="background-color:#eef2ff;color:#6366f1;border-radius:50px">Get Involved</span></div>
<!-- /wp:designsetgo/pill -->

<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size" style="margin-top:var(--wp--preset--spacing--20);font-style:normal;font-weight:700">How You Can Help</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20)">Every contribution makes DesignSetGo better for everyone. Here are the ways you can get involved.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/grid {"style":{"spacing":{"blockGap":"var:preset|spacing|30","padding":{"top":"var:preset|spacing|50","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-grid alignfull dsgo-grid dsgo-grid-cols-3 dsgo-grid-cols-tablet-2 dsgo-grid-cols-mobile-1 dsgo-no-width-constraint" style="padding-top:var(--wp--preset--spacing--50);padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-grid__inner" style="display:grid;grid-template-columns:repeat(3, 1fr);align-items:stretch;row-gap:var(--wp--preset--spacing--30);column-gap:var(--wp--preset--spacing--30)"><!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"code","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="code" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Code"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Write Code</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Submit pull requests for bug fixes, new features, or performance improvements. We follow WordPress coding standards and review every contribution.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"warning","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="warning" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Warning"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Report Bugs</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Found something that doesn&#039;t work right? Open a GitHub issue with steps to reproduce. Clear bug reports help us fix problems faster.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"globe","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="globe" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Globe"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Translate</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Help make DesignSetGo accessible to more people by translating it into your language. We currently support 9 languages and want to add more.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"book","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="book" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Book"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Improve Docs</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Good documentation helps everyone. Contribute to our wiki, write tutorials, or suggest improvements to existing documentation.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"star","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="star" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Star"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Leave a Review</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Reviews on WordPress.org help other users discover DesignSetGo. Share your experience and help grow the community.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"share","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="share" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Share"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Spread the Word</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Tell other WordPress users about DesignSetGo. Write blog posts, share on social media, or mention us at meetups.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/grid --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeIn","dsgoAnimationDuration":800} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-dsgo-animation dsgo-animation-fadeIn" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--30)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeIn" data-dsgo-animation-duration="800"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/pill {"content":"Developer Setup","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"var:preset|spacing|20","right":"var:preset|spacing|20"}},"border":{"radius":"50px"},"color":{"background":"#eef2ff","text":"#6366f1"}}} -->
<div class="wp-block-designsetgo-pill aligncenter dsgo-pill has-text-color has-background has-small-font-size" style="padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--20);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--20)"><span class="dsgo-pill__content" style="background-color:#eef2ff;color:#6366f1;border-radius:50px">Developer Setup</span></div>
<!-- /wp:designsetgo/pill -->

<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"x-large","anchor":"getting-started"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size" id="getting-started" style="margin-top:var(--wp--preset--spacing--20);font-style:normal;font-weight:700">Getting Started with Development</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|40"}}},"fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--40)">Set up your local development environment and start contributing code in minutes.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/accordion {"style":{"spacing":{"blockGap":"var:preset|spacing|15"}}} -->
<div class="wp-block-designsetgo-accordion dsgo-accordion dsgo-accordion--icon-right dsgo-accordion--border-between" style="--dsgo-accordion-open-bg:;--dsgo-accordion-open-text:;--dsgo-accordion-hover-bg:;--dsgo-accordion-hover-text:;--dsgo-accordion-gap:0.5rem" data-allow-multiple="false" data-icon-style="chevron"><div class="dsgo-accordion__items"><!-- wp:designsetgo/accordion-item {"title":"1. Clone the Repository","isOpen":true,"uniqueId":"contrib-acc-001","backgroundColor":"base-2","style":{"border":{"radius":"12px"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|25","right":"var:preset|spacing|25"}}}} -->
<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--open has-base-2-background-color has-background" data-initially-open="true" style="border-radius:12px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--25);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--25)"><div class="dsgo-accordion-item__header"><button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="true" aria-controls="contrib-acc-001-panel" id="contrib-acc-001-header"><span class="dsgo-accordion-item__title">1. Clone the Repository</span><span class="dsgo-accordion-item__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg></span></button></div><div class="dsgo-accordion-item__panel" role="region" aria-labelledby="contrib-acc-001-header" id="contrib-acc-001-panel"><div class="dsgo-accordion-item__content"><!-- wp:paragraph -->
<p>Fork the repository on GitHub, then clone your fork locally. This gives you a complete copy of the codebase to work with.</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>git clone https://github.com/YOUR-USERNAME/designsetgo.git
cd designsetgo</code></pre>
<!-- /wp:code --></div></div></div>
<!-- /wp:designsetgo/accordion-item -->

<!-- wp:designsetgo/accordion-item {"title":"2. Install Dependencies","uniqueId":"contrib-acc-002","backgroundColor":"base-2","style":{"border":{"radius":"12px"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|25","right":"var:preset|spacing|25"}}}} -->
<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--closed has-base-2-background-color has-background" data-initially-open="false" style="border-radius:12px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--25);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--25)"><div class="dsgo-accordion-item__header"><button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="false" aria-controls="contrib-acc-002-panel" id="contrib-acc-002-header"><span class="dsgo-accordion-item__title">2. Install Dependencies</span><span class="dsgo-accordion-item__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg></span></button></div><div class="dsgo-accordion-item__panel" role="region" aria-labelledby="contrib-acc-002-header" id="contrib-acc-002-panel" hidden><div class="dsgo-accordion-item__content"><!-- wp:paragraph -->
<p>Install Node.js dependencies and set up the build tools. Requires Node.js 18+ and npm.</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>npm install</code></pre>
<!-- /wp:code --></div></div></div>
<!-- /wp:designsetgo/accordion-item -->

<!-- wp:designsetgo/accordion-item {"title":"3. Start Development Server","uniqueId":"contrib-acc-003","backgroundColor":"base-2","style":{"border":{"radius":"12px"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|25","right":"var:preset|spacing|25"}}}} -->
<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--closed has-base-2-background-color has-background" data-initially-open="false" style="border-radius:12px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--25);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--25)"><div class="dsgo-accordion-item__header"><button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="false" aria-controls="contrib-acc-003-panel" id="contrib-acc-003-header"><span class="dsgo-accordion-item__title">3. Start Development Server</span><span class="dsgo-accordion-item__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg></span></button></div><div class="dsgo-accordion-item__panel" role="region" aria-labelledby="contrib-acc-003-header" id="contrib-acc-003-panel" hidden><div class="dsgo-accordion-item__content"><!-- wp:paragraph -->
<p>Run the development server with hot reloading. Changes to JS, SCSS, and PHP files will be reflected instantly.</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>npm start                    # Development mode with hot reload
npm run wp-env:start         # Local WordPress environment</code></pre>
<!-- /wp:code --></div></div></div>
<!-- /wp:designsetgo/accordion-item -->

<!-- wp:designsetgo/accordion-item {"title":"4. Run Linters &amp; Tests","uniqueId":"contrib-acc-004","backgroundColor":"base-2","style":{"border":{"radius":"12px"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|25","right":"var:preset|spacing|25"}}}} -->
<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--closed has-base-2-background-color has-background" data-initially-open="false" style="border-radius:12px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--25);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--25)"><div class="dsgo-accordion-item__header"><button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="false" aria-controls="contrib-acc-004-panel" id="contrib-acc-004-header"><span class="dsgo-accordion-item__title">4. Run Linters &amp; Tests</span><span class="dsgo-accordion-item__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg></span></button></div><div class="dsgo-accordion-item__panel" role="region" aria-labelledby="contrib-acc-004-header" id="contrib-acc-004-panel" hidden><div class="dsgo-accordion-item__content"><!-- wp:paragraph -->
<p>Check code quality before submitting your pull request. All linters and tests must pass.</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>npm run lint:js              # ESLint for JavaScript
npm run lint:css             # Stylelint for CSS/SCSS
npm run lint:php             # PHPCS for PHP
npm run build                # Production build</code></pre>
<!-- /wp:code --></div></div></div>
<!-- /wp:designsetgo/accordion-item -->

<!-- wp:designsetgo/accordion-item {"title":"5. Submit Your Pull Request","uniqueId":"contrib-acc-005","backgroundColor":"base-2","style":{"border":{"radius":"12px"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|25","right":"var:preset|spacing|25"}}}} -->
<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--closed has-base-2-background-color has-background" data-initially-open="false" style="border-radius:12px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--25);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--25)"><div class="dsgo-accordion-item__header"><button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="false" aria-controls="contrib-acc-005-panel" id="contrib-acc-005-header"><span class="dsgo-accordion-item__title">5. Submit Your Pull Request</span><span class="dsgo-accordion-item__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg></span></button></div><div class="dsgo-accordion-item__panel" role="region" aria-labelledby="contrib-acc-005-header" id="contrib-acc-005-panel" hidden><div class="dsgo-accordion-item__content"><!-- wp:paragraph -->
<p>Push your changes to your fork and open a pull request against the main branch. Include a clear description of what you changed and why. We review every PR and provide constructive feedback.</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:designsetgo/accordion-item --></div></div>
<!-- /wp:designsetgo/accordion --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"base-2","dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeIn","dsgoAnimationDuration":800} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-2-background-color has-background has-dsgo-animation dsgo-animation-fadeIn" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--30)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeIn" data-dsgo-animation-duration="800"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/pill {"content":"Quality Standards","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"var:preset|spacing|20","right":"var:preset|spacing|20"}},"border":{"radius":"50px"},"color":{"background":"#eef2ff","text":"#6366f1"}}} -->
<div class="wp-block-designsetgo-pill aligncenter dsgo-pill has-text-color has-background has-small-font-size" style="padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--20);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--20)"><span class="dsgo-pill__content" style="background-color:#eef2ff;color:#6366f1;border-radius:50px">Quality Standards</span></div>
<!-- /wp:designsetgo/pill -->

<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size" style="margin-top:var(--wp--preset--spacing--20);font-style:normal;font-weight:700">Contribution Guidelines</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20)">To maintain code quality and consistency, please follow these guidelines when contributing.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/grid {"desktopColumns":2,"style":{"spacing":{"blockGap":"var:preset|spacing|30","padding":{"top":"var:preset|spacing|50","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-grid alignfull dsgo-grid dsgo-grid-cols-2 dsgo-grid-cols-tablet-2 dsgo-grid-cols-mobile-1 dsgo-no-width-constraint" style="padding-top:var(--wp--preset--spacing--50);padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-grid__inner" style="display:grid;grid-template-columns:repeat(2, 1fr);align-items:stretch;row-gap:var(--wp--preset--spacing--30);column-gap:var(--wp--preset--spacing--30)"><!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"shield","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="shield" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Shield"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Security First</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Never introduce vulnerabilities. Follow WordPress security best practices for sanitization, escaping, nonce verification, and capability checks.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"lightning","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="lightning" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Lightning"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Performance Matters</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Keep blocks lightweight. No jQuery dependencies. Target under 15KB JS and 10KB CSS per block. Test bundle sizes.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"verified-check","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="verified-check" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Verified Check"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Accessibility Required</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">All blocks must be WCAG compliant with proper ARIA attributes, keyboard navigation, and screen reader support.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"settings","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="settings" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Settings"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Follow Standards</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Use WordPress coding standards for PHP, JavaScript, and CSS. Run linters before submitting. Include inline documentation.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"blocks","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="blocks" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Blocks"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Write Tests</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">Add unit tests for new functionality. Maintain or improve test coverage. Run the full test suite before submitting.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"16px"}},"backgroundColor":"base"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"users","align":"left","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
<div class="wp-block-designsetgo-icon alignleft dsgo-icon" style="margin-bottom:var(--wp--preset--spacing--20);display:flex;align-items:center;justify-content:center"><div class="dsgo-icon__wrapper dsgo-lazy-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:inherit" data-icon-name="users" data-icon-style="filled" data-icon-stroke-width="1.5" role="img" aria-label="Users"></div></div>
<!-- /wp:designsetgo/icon -->

<!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size">Be Respectful</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|10"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10)">We welcome contributors of all experience levels. Be patient, constructive, and kind in code reviews and discussions.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/grid --></div></div>
<!-- /wp:designsetgo/section -->

<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"gradient":"vivid-cyan-blue-to-vivid-purple","dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeIn","dsgoAnimationDuration":800} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-vivid-cyan-blue-to-vivid-purple-gradient-background has-background has-dsgo-animation dsgo-animation-fadeIn" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeIn" data-dsgo-animation-duration="800"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"textColor":"base","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-base-color has-text-color has-x-large-font-size" style="font-style:normal;font-weight:700">Join the Community</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"textColor":"base","fontSize":"medium"} -->
<p class="has-text-align-center has-base-color has-text-color has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20)">Start contributing to DesignSetGo today. Every contribution, big or small, makes a difference.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"},"blockGap":"var:preset|spacing|20","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"},"dsgoAnimationEnabled":true,"dsgoEntranceAnimation":"fadeInUp","dsgoAnimationDelay":200} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint has-dsgo-animation dsgo-animation-fadeInUp" style="margin-top:var(--wp--preset--spacing--40);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0" data-dsgo-animation-enabled="true" data-dsgo-entrance-animation="fadeInUp" data-dsgo-animation-delay="200"><div class="dsgo-flex__inner" style="display:flex;justify-content:center;flex-wrap:wrap;gap:var(--wp--preset--spacing--20)"><!-- wp:designsetgo/icon-button {"text":"View on GitHub","url":"https://github.com/developer-starter-templates/developer-starter-templates","icon":"github","iconPosition":"end","hoverAnimation":"fill-diagonal","backgroundColor":"base","textColor":"contrast","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button dsgo-icon-button--fill-diagonal" style="border-radius:8px;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto;flex-direction:row-reverse;background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--contrast);padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--50)" href="https://github.com/developer-starter-templates/developer-starter-templates" target="_self"><span class="dsgo-icon-button__icon dsgo-lazy-icon" style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;flex-shrink:0" data-icon-name="github" data-icon-size="20"></span><span class="dsgo-icon-button__text">View on GitHub</span></a>
<!-- /wp:designsetgo/icon-button -->

<!-- wp:designsetgo/icon-button {"text":"Download Plugin","url":"https://wordpress.org/plugins/designsetgo/","icon":"","iconPosition":"none","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px","width":"2px","color":"var:preset|color|base"},"color":{"text":"#ffffff","background":"#ffffff00"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-border-color" style="border-color:var(--wp--preset--color--base);border-width:2px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;gap:0;width:auto;flex-direction:row;background-color:#ffffff00;color:#ffffff;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--50)" href="https://wordpress.org/plugins/designsetgo/" target="_self"><span class="dsgo-icon-button__text">Download Plugin</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/row -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"textColor":"base","fontSize":"small"} -->
<p class="has-text-align-center has-base-color has-text-color has-small-font-size" style="margin-top:var(--wp--preset--spacing--30)">Licensed under GPL v2 or later. Compatible with WordPress 6.7+ and any block theme.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section -->',
);
