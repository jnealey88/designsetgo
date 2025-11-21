<?php
/**
 * Breadcrumbs Block - Server-side Rendering
 *
 * @package DesignSetGo
 * @since 1.0.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (unused for dynamic blocks).
 * @param WP_Block $block      Block instance.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Check if we should hide breadcrumbs on homepage.
if ( ! empty( $attributes['hideOnHome'] ) && is_front_page() ) {
	return '';
}

// Get breadcrumb trail (function defined in includes/breadcrumbs-functions.php).
$trail = designsetgo_get_breadcrumb_trail( $block, $attributes );

// If no breadcrumbs, return empty.
if ( empty( $trail ) ) {
	return '';
}

// Get separator (function defined in includes/breadcrumbs-functions.php).
$separator = designsetgo_get_breadcrumb_separator( $attributes );

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                 => 'dsgo-breadcrumbs',
		'aria-label'            => __( 'Breadcrumb', 'designsetgo' ),
		'data-dsgo-breadcrumbs' => wp_json_encode( $trail ),
	)
);

// Output directly (WordPress captures echo'd output from render callbacks).
?>
<nav <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! empty( $attributes['prefixText'] ) ) : ?>
		<span class="dsgo-breadcrumbs__prefix"><?php echo esc_html( $attributes['prefixText'] ); ?></span>
	<?php endif; ?>

	<ol class="dsgo-breadcrumbs__list">
		<?php foreach ( $trail as $index => $item ) : ?>
			<li class="dsgo-breadcrumbs__item<?php echo ! empty( $item['is_current'] ) ? ' dsgo-breadcrumbs__item--current' : ''; ?>">
				<?php if ( empty( $item['is_current'] ) || ! empty( $attributes['linkCurrent'] ) ) : ?>
					<a href="<?php echo esc_url( $item['url'] ); ?>" class="dsgo-breadcrumbs__link">
						<?php echo esc_html( $item['title'] ); ?>
					</a>
				<?php else : ?>
					<span class="dsgo-breadcrumbs__text">
						<?php echo esc_html( $item['title'] ); ?>
					</span>
				<?php endif; ?>
			</li>

			<?php if ( $index < count( $trail ) - 1 ) : ?>
				<li class="dsgo-breadcrumbs__separator" aria-hidden="true"><?php echo esc_html( $separator ); ?></li>
			<?php endif; ?>
		<?php endforeach; ?>
	</ol>
</nav><?php
