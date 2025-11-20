<?php
/**
 * Title: Announcement & Promo Modal
 * Slug: designsetgo/modal/announcement-promo
 * Categories: dsgo-modal
 * Description: Promotional announcement modal that auto-opens on page load
 *
 * @package DesignSetGo
 */

return array(
	'title'      => __( 'Announcement & Promo Modal', 'designsetgo' ),
	'categories' => array( 'dsgo-modal' ),
	'content'    => '<!-- wp:designsetgo/modal {"modalId":"dsgo-modal-promo","width":"600px","maxWidth":"90vw","overlayOpacity":70,"animationType":"zoom","autoTriggerType":"pageLoad","autoTriggerDelay":2,"autoTriggerFrequency":"session"} -->
<!-- wp:heading {"textAlign":"center","level":2} -->
<h2 class="wp-block-heading has-text-align-center">' . esc_html__( '🎉 Special Offer!', 'designsetgo' ) . '</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size">' . esc_html__( 'Get 20% off your first purchase. Use code <strong>WELCOME20</strong> at checkout.', 'designsetgo' ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:designsetgo/icon-button {"text":"' . esc_html__( 'Shop Now', 'designsetgo' ) . '","icon":"cart","iconPosition":"end","width":"full","style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} /-->
<!-- /wp:designsetgo/modal -->',
);
