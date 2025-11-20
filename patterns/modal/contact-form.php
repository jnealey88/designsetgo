<?php
/**
 * Title: Contact Form Modal
 * Slug: designsetgo/modal/contact-form
 * Categories: dsgo-modal
 * Description: Contact form in a modal with trigger button
 *
 * @package DesignSetGo
 */

return array(
	'title'      => __( 'Contact Form Modal', 'designsetgo' ),
	'categories' => array( 'dsgo-modal' ),
	'content'    => '<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:designsetgo/icon-button {"text":"' . esc_html__( 'Contact Us', 'designsetgo' ) . '","icon":"email","iconPosition":"start","width":"auto","url":"#dsgo-modal-contact"} /-->

<!-- wp:designsetgo/modal {"modalId":"dsgo-modal-contact","width":"600px","maxWidth":"90vw","overlayOpacity":75,"animationType":"slide-up"} -->
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">' . esc_html__( 'Get in Touch', 'designsetgo' ) . '</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>' . esc_html__( 'Have a question? We\'d love to hear from you.', 'designsetgo' ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/form-builder {"submitButtonText":"' . esc_html__( 'Send Message', 'designsetgo' ) . '","submitButtonAlignment":"left","ajaxSubmit":true,"successMessage":"' . esc_html__( 'Thank you! Your message has been sent.', 'designsetgo' ) . '"} -->
<!-- wp:designsetgo/form-text-field {"label":"' . esc_html__( 'Name', 'designsetgo' ) . '","placeholder":"Your name","required":true,"fieldName":"name"} /-->

<!-- wp:designsetgo/form-email-field {"label":"' . esc_html__( 'Email', 'designsetgo' ) . '","placeholder":"your@email.com","required":true,"fieldName":"email"} /-->

<!-- wp:designsetgo/form-textarea {"label":"' . esc_html__( 'Message', 'designsetgo' ) . '","placeholder":"Your message...","required":true,"fieldName":"message"} /-->
<!-- /wp:designsetgo/form-builder -->
<!-- /wp:designsetgo/modal --></div>
<!-- /wp:group -->',
);
