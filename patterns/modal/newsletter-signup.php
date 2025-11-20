<?php
/**
 * Title: Newsletter Signup Modal
 * Slug: designsetgo/modal/newsletter-signup
 * Categories: dsgo-modal
 * Description: Newsletter subscription modal with exit intent trigger and form
 *
 * @package DesignSetGo
 */

return array(
	'title'      => __( 'Newsletter Signup Modal', 'designsetgo' ),
	'categories' => array( 'dsgo-modal' ),
	'content'    => '<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:designsetgo/icon-button {"text":"' . esc_html__( 'Subscribe to Newsletter', 'designsetgo' ) . '","icon":"email","iconPosition":"start","width":"auto","url":"#dsgo-modal-newsletter","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}}} /-->

<!-- wp:designsetgo/modal {"modalId":"dsgo-modal-newsletter","width":"500px","maxWidth":"90vw","overlayOpacity":80,"animationType":"slide-up","autoTriggerType":"exitIntent","exitIntentSensitivity":"medium","autoTriggerFrequency":"once","cookieDuration":30} -->
<!-- wp:heading {"textAlign":"center","level":2} -->
<h2 class="wp-block-heading has-text-align-center">' . esc_html__( 'Subscribe to Our Newsletter', 'designsetgo' ) . '</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">' . esc_html__( 'Get the latest updates and exclusive content delivered to your inbox.', 'designsetgo' ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/form-builder {"submitButtonText":"' . esc_html__( 'Subscribe', 'designsetgo' ) . '","submitButtonAlignment":"center","ajaxSubmit":true,"successMessage":"' . esc_html__( 'Thank you for subscribing!', 'designsetgo' ) . '"} -->
<!-- wp:designsetgo/form-email-field {"label":"' . esc_html__( 'Email Address', 'designsetgo' ) . '","placeholder":"your@email.com","required":true,"fieldName":"email"} /-->
<!-- /wp:designsetgo/form-builder -->
<!-- /wp:designsetgo/modal --></div>
<!-- /wp:group -->',
);
