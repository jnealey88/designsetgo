<?php
/**
 * Query Slider Block - Server-side Rendering
 *
 * Runs a WP_Query based on block attributes and outputs slider markup
 * identical to the static slider/slide blocks so the same view.js and
 * CSS work without modification.
 *
 * @package DesignSetGo
 * @since 1.5.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (unused for dynamic blocks).
 * @param WP_Block $block      Block instance.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ── Build WP_Query args ──────────────────────────────────────────────
$query_config = isset( $attributes['query'] ) ? $attributes['query'] : array();

// Validate orderby against allowed values.
$allowed_orderby = array( 'date', 'title', 'modified', 'menu_order', 'author', 'name', 'type', 'rand' );
$orderby         = ! empty( $query_config['orderBy'] ) ? sanitize_key( $query_config['orderBy'] ) : 'date';
if ( ! in_array( $orderby, $allowed_orderby, true ) ) {
	$orderby = 'date';
}

// Validate order against allowed values.
$order = ! empty( $query_config['order'] ) ? strtoupper( sanitize_key( $query_config['order'] ) ) : 'DESC';
if ( ! in_array( $order, array( 'ASC', 'DESC' ), true ) ) {
	$order = 'DESC';
}

$query_args = array(
	'post_type'      => ! empty( $query_config['postType'] ) ? sanitize_key( $query_config['postType'] ) : 'post',
	'posts_per_page' => isset( $query_config['postsPerPage'] ) ? absint( $query_config['postsPerPage'] ) : 6,
	'orderby'        => $orderby,
	'order'          => $order,
	'offset'         => isset( $query_config['offset'] ) ? absint( $query_config['offset'] ) : 0,
	'post_status'    => 'publish',
	'no_found_rows'  => true, // No pagination needed — performance optimization.
);

// Category filter.
if ( ! empty( $query_config['categories'] ) && is_array( $query_config['categories'] ) ) {
	$query_args['category__in'] = array_map( 'absint', $query_config['categories'] );
}

// Tag filter.
if ( ! empty( $query_config['tags'] ) && is_array( $query_config['tags'] ) ) {
	$query_args['tag__in'] = array_map( 'absint', $query_config['tags'] );
}

// Exclude current post.
if ( ! empty( $query_config['excludeCurrent'] ) && get_the_ID() ) {
	$query_args['post__not_in'] = array( get_the_ID() );
}

/**
 * Filter the query arguments for the Post Slider block.
 *
 * @param array    $query_args WP_Query arguments.
 * @param array    $attributes Block attributes.
 * @param WP_Block $block      Block instance.
 */
$query_args = apply_filters( 'designsetgo_query_slider_args', $query_args, $attributes, $block );

$query = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
	wp_reset_postdata();
	return '';
}

// ── Content display settings ─────────────────────────────────────────
$show_title      = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
$show_excerpt    = isset( $attributes['showExcerpt'] ) ? $attributes['showExcerpt'] : true;
$show_date       = isset( $attributes['showDate'] ) ? $attributes['showDate'] : false;
$show_category   = isset( $attributes['showCategory'] ) ? $attributes['showCategory'] : true;
$show_read_more  = isset( $attributes['showReadMore'] ) ? $attributes['showReadMore'] : true;
$read_more_text  = ! empty( $attributes['readMoreText'] ) ? $attributes['readMoreText'] : __( 'Read More', 'designsetgo' );
$title_tag       = ! empty( $attributes['titleTag'] ) ? $attributes['titleTag'] : 'h3';
$excerpt_length  = isset( $attributes['excerptLength'] ) ? absint( $attributes['excerptLength'] ) : 20;
$link_title      = isset( $attributes['linkTitle'] ) ? $attributes['linkTitle'] : true;
$overlay_color   = ! empty( $attributes['overlayColor'] ) ? $attributes['overlayColor'] : '';
$overlay_opacity = isset( $attributes['overlayOpacity'] ) ? $attributes['overlayOpacity'] : 60;
$style_variation = ! empty( $attributes['styleVariation'] ) ? $attributes['styleVariation'] : 'classic';

// Content alignment.
$v_align_map = array(
	'top'    => 'flex-start',
	'center' => 'center',
	'end'    => 'flex-end',
	'bottom' => 'flex-end',
);
$h_align_map = array(
	'left'   => 'flex-start',
	'start'  => 'flex-start',
	'center' => 'center',
	'right'  => 'flex-end',
	'end'    => 'flex-end',
);

$v_align = ! empty( $attributes['contentVerticalAlign'] ) ? $attributes['contentVerticalAlign'] : 'end';
$h_align = ! empty( $attributes['contentHorizontalAlign'] ) ? $attributes['contentHorizontalAlign'] : 'start';

$content_justify = isset( $v_align_map[ $v_align ] ) ? $v_align_map[ $v_align ] : 'flex-end';
$content_align   = isset( $h_align_map[ $h_align ] ) ? $h_align_map[ $h_align ] : 'flex-start';

// ── Slider settings ──────────────────────────────────────────────────
$slides_per_view        = isset( $attributes['slidesPerView'] ) ? absint( $attributes['slidesPerView'] ) : 1;
$slides_per_view_tablet = isset( $attributes['slidesPerViewTablet'] ) ? absint( $attributes['slidesPerViewTablet'] ) : 1;
$slides_per_view_mobile = isset( $attributes['slidesPerViewMobile'] ) ? absint( $attributes['slidesPerViewMobile'] ) : 1;
$slider_height          = ! empty( $attributes['height'] ) ? $attributes['height'] : '500px';
$use_aspect_ratio       = ! empty( $attributes['useAspectRatio'] );
$aspect_ratio           = ! empty( $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '16/9';
$slider_gap             = ! empty( $attributes['gap'] ) ? $attributes['gap'] : '20px';
$show_arrows            = isset( $attributes['showArrows'] ) ? $attributes['showArrows'] : true;
$show_dots              = isset( $attributes['showDots'] ) ? $attributes['showDots'] : true;
$arrow_style            = ! empty( $attributes['arrowStyle'] ) ? $attributes['arrowStyle'] : 'default';
$arrow_position         = ! empty( $attributes['arrowPosition'] ) ? $attributes['arrowPosition'] : 'sides';
$arrow_v_position       = ! empty( $attributes['arrowVerticalPosition'] ) ? $attributes['arrowVerticalPosition'] : 'center';
$arrow_color            = ! empty( $attributes['arrowColor'] ) ? $attributes['arrowColor'] : '';
$arrow_bg_color         = ! empty( $attributes['arrowBackgroundColor'] ) ? $attributes['arrowBackgroundColor'] : '';
$arrow_size             = ! empty( $attributes['arrowSize'] ) ? $attributes['arrowSize'] : '48px';
$arrow_padding          = ! empty( $attributes['arrowPadding'] ) ? $attributes['arrowPadding'] : '';
$dot_style              = ! empty( $attributes['dotStyle'] ) ? $attributes['dotStyle'] : 'default';
$dot_position           = ! empty( $attributes['dotPosition'] ) ? $attributes['dotPosition'] : 'bottom';
$dot_color              = ! empty( $attributes['dotColor'] ) ? $attributes['dotColor'] : '';
$effect                 = ! empty( $attributes['effect'] ) ? $attributes['effect'] : 'slide';

// Validate effect against allowed values.
$allowed_effects = array( 'slide', 'fade', 'zoom' );
if ( ! in_array( $effect, $allowed_effects, true ) ) {
	$effect = 'slide';
}
$transition_duration    = ! empty( $attributes['transitionDuration'] ) ? $attributes['transitionDuration'] : '0.5s';
$transition_easing      = ! empty( $attributes['transitionEasing'] ) ? $attributes['transitionEasing'] : 'ease-in-out';
$is_autoplay            = ! empty( $attributes['autoplay'] );
$autoplay_interval      = isset( $attributes['autoplayInterval'] ) ? absint( $attributes['autoplayInterval'] ) : 3000;
$pause_on_hover         = isset( $attributes['pauseOnHover'] ) ? $attributes['pauseOnHover'] : true;
$pause_on_interaction   = isset( $attributes['pauseOnInteraction'] ) ? $attributes['pauseOnInteraction'] : true;
$is_loop                = isset( $attributes['loop'] ) ? $attributes['loop'] : true;
$is_draggable           = isset( $attributes['draggable'] ) ? $attributes['draggable'] : true;
$is_swipeable           = isset( $attributes['swipeable'] ) ? $attributes['swipeable'] : true;
$is_free_mode           = ! empty( $attributes['freeMode'] );
$is_centered            = ! empty( $attributes['centeredSlides'] );
$mobile_breakpoint      = isset( $attributes['mobileBreakpoint'] ) ? absint( $attributes['mobileBreakpoint'] ) : 768;
$tablet_breakpoint      = isset( $attributes['tabletBreakpoint'] ) ? absint( $attributes['tabletBreakpoint'] ) : 1024;
$aria_label             = ! empty( $attributes['ariaLabel'] ) ? $attributes['ariaLabel'] : __( 'Post Slider', 'designsetgo' );

// Sanitize title tag to allowed heading values.
$allowed_title_tags = array( 'h2', 'h3', 'h4', 'h5', 'h6' );
if ( ! in_array( $title_tag, $allowed_title_tags, true ) ) {
	$title_tag = 'h3';
}

// ── Build CSS classes (must match slider block exactly) ──────────────
$slider_classes = array( 'dsgo-slider' );

if ( $effect ) {
	$slider_classes[] = 'dsgo-slider--effect-' . $effect;
}
if ( $show_arrows ) {
	$slider_classes[] = 'dsgo-slider--has-arrows';
	$slider_classes[] = 'dsgo-slider--arrows-' . $arrow_style;
	$slider_classes[] = 'dsgo-slider--arrows-' . $arrow_position;
	$slider_classes[] = 'dsgo-slider--arrows-v-' . $arrow_v_position;
}
if ( $show_dots ) {
	$slider_classes[] = 'dsgo-slider--has-dots';
	$slider_classes[] = 'dsgo-slider--dots-' . $dot_style;
	$slider_classes[] = 'dsgo-slider--dots-' . $dot_position;
}
if ( $style_variation ) {
	$slider_classes[] = 'dsgo-slider--style-' . $style_variation;
}
if ( $use_aspect_ratio ) {
	$slider_classes[] = 'dsgo-slider--use-aspect-ratio';
}
if ( $is_centered ) {
	$slider_classes[] = 'dsgo-slider--centered';
}
if ( $is_free_mode ) {
	$slider_classes[] = 'dsgo-slider--free-mode';
}

// ── Build CSS custom properties ──────────────────────────────────────
$css_vars = array(
	'--dsgo-slider-height'                   => $use_aspect_ratio ? 'auto' : $slider_height,
	'--dsgo-slider-aspect-ratio'             => $use_aspect_ratio ? $aspect_ratio : 'auto',
	'--dsgo-slider-gap'                      => $slider_gap,
	'--dsgo-slider-slides-per-view'          => $slides_per_view,
	'--dsgo-slider-slides-per-view-tablet'   => $slides_per_view_tablet,
	'--dsgo-slider-slides-per-view-mobile'   => $slides_per_view_mobile,
	'--dsgo-slider-arrow-color'              => $arrow_color ?: 'var(--wp--preset--color--base, #ffffff)',
	'--dsgo-slider-arrow-bg'                 => $arrow_bg_color ?: 'rgba(0, 0, 0, 0.5)',
	'--dsgo-slider-arrow-size'               => $arrow_size,
	'--dsgo-slider-arrow-padding'            => $arrow_padding ?: '0',
	'--dsgo-slider-dot-color'                => $dot_color ?: 'var(--wp--preset--color--base, #ffffff)',
	'--dsgo-slider-transition-duration'      => $transition_duration,
	'--dsgo-slider-transition-easing'        => $transition_easing,
);

$style_parts = array();
foreach ( $css_vars as $prop => $val ) {
	$style_parts[] = esc_attr( $prop ) . ':' . esc_attr( $val );
}
$inline_style = implode( ';', $style_parts );

// ── Build data attributes for view.js ────────────────────────────────
$data_attrs = array(
	'data-effect'             => $effect,
	'data-slides-per-view'    => $slides_per_view,
	'data-slides-tablet'      => $slides_per_view_tablet,
	'data-slides-mobile'      => $slides_per_view_mobile,
	'data-autoplay'           => $is_autoplay ? 'true' : 'false',
	'data-autoplay-interval'  => $autoplay_interval,
	'data-pause-on-hover'     => $pause_on_hover ? 'true' : 'false',
	'data-pause-on-interact'  => $pause_on_interaction ? 'true' : 'false',
	'data-loop'               => $is_loop ? 'true' : 'false',
	'data-draggable'          => $is_draggable ? 'true' : 'false',
	'data-swipeable'          => $is_swipeable ? 'true' : 'false',
	'data-free-mode'          => $is_free_mode ? 'true' : 'false',
	'data-centered-slides'    => $is_centered ? 'true' : 'false',
	'data-mobile-breakpoint'  => $mobile_breakpoint,
	'data-tablet-breakpoint'  => $tablet_breakpoint,
	'data-active-slide'       => 0,
	'data-show-arrows'        => $show_arrows ? 'true' : 'false',
	'data-show-dots'          => $show_dots ? 'true' : 'false',
	'data-arrow-style'        => $arrow_style,
	'data-dot-style'          => $dot_style,
	'data-transition-duration' => $transition_duration,
	'data-transition-easing'  => $transition_easing,
);

$data_attr_string = '';
foreach ( $data_attrs as $key => $val ) {
	$data_attr_string .= ' ' . esc_attr( $key ) . '="' . esc_attr( $val ) . '"';
}

// ── Build wrapper attributes ─────────────────────────────────────────
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                => implode( ' ', $slider_classes ),
		'style'                => $inline_style,
		'role'                 => 'region',
		'aria-roledescription' => 'slider',
		'aria-label'           => esc_attr( $aria_label ),
	)
);

// ── Render slides ────────────────────────────────────────────────────
$slides_html = '';

while ( $query->have_posts() ) {
	$query->the_post();

	$post_id     = get_the_ID();
	$permalink   = get_permalink( $post_id );
	$post_title  = get_the_title( $post_id );
	$thumbnail   = get_the_post_thumbnail_url( $post_id, 'large' );
	$date_str    = get_the_date( '', $post_id );
	$raw_excerpt = get_the_excerpt( $post_id );

	// Truncate excerpt using WordPress built-in function.
	$excerpt = wp_trim_words( $raw_excerpt, $excerpt_length, '&hellip;' );

	// Primary category.
	$category_name = '';
	if ( $show_category ) {
		$categories = get_the_category( $post_id );
		if ( ! empty( $categories ) ) {
			$category_name = esc_html( $categories[0]->name );
		}
	}

	// Slide classes.
	$slide_classes = array( 'dsgo-slide' );
	if ( $style_variation ) {
		$slide_classes[] = 'dsgo-slide--style-' . $style_variation;
	}
	if ( $thumbnail ) {
		$slide_classes[] = 'dsgo-slide--has-background';
	}

	// Slide inline styles.
	$slide_style_parts = array();
	if ( $overlay_color ) {
		$slide_style_parts[] = '--dsgo-slide-overlay-color:' . esc_attr( $overlay_color );
		$slide_style_parts[] = '--dsgo-slide-overlay-opacity:' . esc_attr( $overlay_opacity / 100 );
	}
	$slide_style_parts[] = '--dsgo-slide-content-justify:' . esc_attr( $content_justify );
	$slide_style_parts[] = '--dsgo-slide-content-align:' . esc_attr( $content_align );

	if ( $thumbnail ) {
		$slide_style_parts[] = 'background-image:url(' . esc_url( $thumbnail ) . ')';
		$slide_style_parts[] = 'background-size:cover';
		$slide_style_parts[] = 'background-position:center center';
		$slide_style_parts[] = 'background-repeat:no-repeat';
	}

	$slide_style = implode( ';', $slide_style_parts );

	// Build slide HTML.
	$slides_html .= '<div class="' . esc_attr( implode( ' ', $slide_classes ) ) . '" style="' . esc_attr( $slide_style ) . '" role="group" aria-roledescription="slide">';

	// Overlay.
	if ( $overlay_color ) {
		$slides_html .= '<div class="dsgo-slide__overlay"></div>';
	}

	// Content.
	$slides_html .= '<div class="dsgo-slide__content">';

	if ( $show_category && $category_name ) {
		$slides_html .= '<span class="dsgo-query-slide__category">' . $category_name . '</span>';
	}

	if ( $show_date ) {
		$slides_html .= '<time class="dsgo-query-slide__date" datetime="' . esc_attr( get_the_date( 'c', $post_id ) ) . '">' . esc_html( $date_str ) . '</time>';
	}

	if ( $show_title && $post_title ) {
		$slides_html .= '<' . $title_tag . ' class="dsgo-query-slide__title">';
		if ( $link_title ) {
			$slides_html .= '<a href="' . esc_url( $permalink ) . '">' . esc_html( $post_title ) . '</a>';
		} else {
			$slides_html .= esc_html( $post_title );
		}
		$slides_html .= '</' . $title_tag . '>';
	}

	if ( $show_excerpt && $excerpt ) {
		$slides_html .= '<p class="dsgo-query-slide__excerpt">' . esc_html( $excerpt ) . '</p>';
	}

	if ( $show_read_more ) {
		$slides_html .= '<a href="' . esc_url( $permalink ) . '" class="dsgo-query-slide__read-more">' . esc_html( $read_more_text ) . '</a>';
	}

	$slides_html .= '</div>'; // .dsgo-slide__content
	$slides_html .= '</div>'; // .dsgo-slide
}

wp_reset_postdata();

// ── Final output ─────────────────────────────────────────────────────
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns pre-escaped HTML. ?><?php echo $data_attr_string; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built with esc_attr() per key-value pair on line 232. ?>>
	<div class="dsgo-slider__viewport">
		<div class="dsgo-slider__track">
			<?php echo $slides_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Each element escaped individually: esc_attr() for classes/styles, esc_url() for links/images, esc_html() for text content. ?>
		</div>
	</div>
</div>
<?php
