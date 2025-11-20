<?php
/**
 * Title: Image Gallery with Navigation
 * Slug: designsetgo/modal/image-gallery
 * Categories: dsgo-modal
 * Description: Three-image gallery with modal navigation (prev/next buttons and keyboard support)
 *
 * @package DesignSetGo
 */

return array(
	'title'      => __( 'Image Gallery with Navigation', 'designsetgo' ),
	'categories' => array( 'dsgo-modal' ),
	'content'    => '<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">' . esc_html__( 'Gallery', 'designsetgo' ) . '</h3>
<!-- /wp:heading -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#dsgo-modal-gallery-1">' . esc_html__( 'View Image 1', 'designsetgo' ) . '</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#dsgo-modal-gallery-2">' . esc_html__( 'View Image 2', 'designsetgo' ) . '</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#dsgo-modal-gallery-3">' . esc_html__( 'View Image 3', 'designsetgo' ) . '</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:designsetgo/modal {"modalId":"dsgo-modal-gallery-1","width":"auto","maxWidth":"95vw","height":"auto","maxHeight":"95vh","overlayColor":"#000000","overlayOpacity":95,"animationType":"fade","closeButtonPosition":"top-right","galleryGroupId":"image-gallery","galleryIndex":0,"showGalleryNavigation":true,"navigationStyle":"arrows","navigationPosition":"sides"} -->
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="" alt="' . esc_attr__( 'Image 1', 'designsetgo' ) . '"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#ffffff"}}} -->
<p class="has-text-align-center has-text-color" style="color:#ffffff">' . esc_html__( 'Image 1 caption...', 'designsetgo' ) . '</p>
<!-- /wp:paragraph -->
<!-- /wp:designsetgo/modal -->

<!-- wp:designsetgo/modal {"modalId":"dsgo-modal-gallery-2","width":"auto","maxWidth":"95vw","height":"auto","maxHeight":"95vh","overlayColor":"#000000","overlayOpacity":95,"animationType":"fade","closeButtonPosition":"top-right","galleryGroupId":"image-gallery","galleryIndex":1,"showGalleryNavigation":true,"navigationStyle":"arrows","navigationPosition":"sides"} -->
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="" alt="' . esc_attr__( 'Image 2', 'designsetgo' ) . '"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#ffffff"}}} -->
<p class="has-text-align-center has-text-color" style="color:#ffffff">' . esc_html__( 'Image 2 caption...', 'designsetgo' ) . '</p>
<!-- /wp:paragraph -->
<!-- /wp:designsetgo/modal -->

<!-- wp:designsetgo/modal {"modalId":"dsgo-modal-gallery-3","width":"auto","maxWidth":"95vw","height":"auto","maxHeight":"95vh","overlayColor":"#000000","overlayOpacity":95,"animationType":"fade","closeButtonPosition":"top-right","galleryGroupId":"image-gallery","galleryIndex":2,"showGalleryNavigation":true,"navigationStyle":"arrows","navigationPosition":"sides"} -->
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="" alt="' . esc_attr__( 'Image 3', 'designsetgo' ) . '"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#ffffff"}}} -->
<p class="has-text-align-center has-text-color" style="color:#ffffff">' . esc_html__( 'Image 3 caption...', 'designsetgo' ) . '</p>
<!-- /wp:paragraph -->
<!-- /wp:designsetgo/modal --></div>
<!-- /wp:group -->',
);
