<?php
/**
 * Title: Quote Highlight
 * Slug: designsetgo/content/content-quote-highlight
 * Categories: dsgo-content
 * Description: Featured quote or testimonial with large typography
 * Keywords: quote, testimonial, blockquote, highlight, featured
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Quote Highlight', 'designsetgo' ),
	'categories' => array( 'dsgo-content' ),
	'content'    => '<!-- wp:designsetgo/section {"dsgoParallax":{"enabled":true,"speed":0.2,"direction":"vertical","overflow":"hidden","scale":1.1},"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"className":"has-dsgo-parallax","metadata":{"categories":["dsgo-content"],"patternName":"designsetgo/content/content-quote-highlight","name":"Quote Highlight"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-dsgo-parallax" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80);background:linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" data-dsgo-parallax-enabled="true" data-dsgo-parallax-speed="0.2" data-dsgo-parallax-direction="vertical" data-dsgo-parallax-overflow="hidden" data-dsgo-parallax-scale="1.1" data-dsgo-parallax-viewport-start="top" data-dsgo-parallax-viewport-end="bottom" data-dsgo-parallax-disable-mobile="false" data-dsgo-parallax-disable-tablet="false" data-dsgo-parallax-disable-reduced-motion="true"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/section {"dsgoTextReveal":{"enabled":true,"color":"rgba(255,255,255,0.1)","splitMode":"words"},"constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"className":"has-dsgo-text-reveal"} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint has-dsgo-text-reveal" style="padding-top:0;padding-right:var(--wp--preset--spacing--50);padding-bottom:0;padding-left:var(--wp--preset--spacing--50)" data-dsgo-text-reveal-enabled="true" data-dsgo-text-reveal-color="rgba(255,255,255,0.1)" data-dsgo-text-reveal-split-mode="words"><div class="dsgo-stack__inner"><!-- wp:designsetgo/icon {"icon":"quote","size":"64px","color":"#8b5cf6","align":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} -->
<span class="wp-block-designsetgo-icon aligncenter dsgo-icon dsgo-lazy-icon" style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;color:#8b5cf6;margin-bottom:var(--wp--preset--spacing--40)" data-icon-name="quote" data-icon-size="64" aria-hidden="true"></span>
<!-- /wp:designsetgo/icon -->

<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"clamp(1.5rem, 4vw, 2.5rem)","lineHeight":"1.4","fontStyle":"italic","fontWeight":"400"}},"textColor":"base"} -->
<p class="has-text-align-center has-base-color has-text-color" style="font-size:clamp(1.5rem, 4vw, 2.5rem);font-style:italic;font-weight:400;line-height:1.4">The best way to predict the future is to create it. Innovation distinguishes between a leader and a follower.</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/divider {"width":"80px","color":"#8b5cf6","thickness":"3px","align":"center","style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}}} -->
<div class="wp-block-designsetgo-divider aligncenter dsgo-divider" style="width:80px;border-top-width:3px;border-top-color:#8b5cf6;margin-top:var(--wp--preset--spacing--40);margin-bottom:var(--wp--preset--spacing--40)" aria-hidden="true"></div>
<!-- /wp:designsetgo/divider -->

<!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;flex-wrap:wrap;gap:var(--wp--style--block-gap,24px);align-items:center;justify-content:center"><!-- wp:image {"width":"60px","height":"60px","scale":"cover","sizeSlug":"thumbnail","className":"is-style-rounded"} -->
<figure class="wp-block-image size-thumbnail is-resized is-style-rounded"><img src="https://i.pravatar.cc/150?img=12" alt="Steve Jobs" style="object-fit:cover;width:60px;height:60px"/></figure>
<!-- /wp:image -->

<!-- wp:designsetgo/section {"constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"textColor":"base"} -->
<p class="has-base-color has-text-color" style="font-style:normal;font-weight:600">Steve Jobs</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"text":"rgba(255,255,255,0.7)"}},"fontSize":"small"} -->
<p class="has-text-color has-small-font-size" style="color:rgba(255,255,255,0.7)">Co-founder, Apple Inc.</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/section --></div></div>
<!-- /wp:designsetgo/section -->',
);
