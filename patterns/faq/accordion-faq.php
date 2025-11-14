<?php
/**
 * Title: FAQ Accordion
 * Slug: designsetgo/faq/accordion-faq
 * Categories: dsgo-faq
 * Description: A frequently asked questions section using the Accordion block
 * Keywords: faq, accordion, questions, help, support
 */

return array(
	'title'      => __( 'FAQ Accordion', 'designsetgo' ),
	'categories' => array( 'dsgo-faq' ),
	'content'    => '<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center">Frequently Asked Questions</h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}}} -->
	<p class="has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--50)">Find answers to common questions about our services</p>
	<!-- /wp:paragraph -->

	<!-- wp:designsetgo/accordion {"allowMultipleOpen":false,"initiallyOpen":"first","iconStyle":"chevron","iconPosition":"right","borderBetween":true} -->
	<div class="wp-block-designsetgo-accordion dsgo-accordion dsgo-accordion--icon-right dsgo-accordion--border-between" data-allow-multiple="false" data-icon-style="chevron">
		<div class="dsgo-accordion__items">
			<!-- wp:designsetgo/accordion-item {"title":"What is DesignSetGo?","isOpen":true} -->
			<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--open" data-initially-open="true">
				<div class="dsgo-accordion-item__header">
					<button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="true">
						<span class="dsgo-accordion-item__title">What is DesignSetGo?</span>
						<span class="dsgo-accordion-item__icon" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg>
						</span>
					</button>
				</div>
				<div class="dsgo-accordion-item__panel" role="region">
					<div class="dsgo-accordion-item__content">
						<!-- wp:paragraph -->
						<p>DesignSetGo is a modern WordPress block plugin that provides advanced layout blocks, including containers, accordions, and tabs. It helps you create beautiful, responsive websites without writing code.</p>
						<!-- /wp:paragraph -->
					</div>
				</div>
			</div>
			<!-- /wp:designsetgo/accordion-item -->

			<!-- wp:designsetgo/accordion-item {"title":"How do I use the Accordion block?","isOpen":false} -->
			<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--closed" data-initially-open="false">
				<div class="dsgo-accordion-item__header">
					<button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="false">
						<span class="dsgo-accordion-item__title">How do I use the Accordion block?</span>
						<span class="dsgo-accordion-item__icon" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg>
						</span>
					</button>
				</div>
				<div class="dsgo-accordion-item__panel" role="region" hidden>
					<div class="dsgo-accordion-item__content">
						<!-- wp:paragraph -->
						<p>Simply add the Accordion block from the DesignSetGo category in the block inserter. You can add multiple accordion items, customize the icon style and position, and control whether multiple panels can be open at once.</p>
						<!-- /wp:paragraph -->
					</div>
				</div>
			</div>
			<!-- /wp:designsetgo/accordion-item -->

			<!-- wp:designsetgo/accordion-item {"title":"Can I customize the accordion appearance?","isOpen":false} -->
			<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--closed" data-initially-open="false">
				<div class="dsgo-accordion-item__header">
					<button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="false">
						<span class="dsgo-accordion-item__title">Can I customize the accordion appearance?</span>
						<span class="dsgo-accordion-item__icon" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg>
						</span>
					</button>
				</div>
				<div class="dsgo-accordion-item__panel" role="region" hidden>
					<div class="dsgo-accordion-item__content">
						<!-- wp:paragraph -->
						<p>Yes! The Accordion block supports all WordPress theme.json settings including colors, typography, spacing, and borders. You can customize individual items or apply global styles through the Site Editor.</p>
						<!-- /wp:paragraph -->
					</div>
				</div>
			</div>
			<!-- /wp:designsetgo/accordion-item -->

			<!-- wp:designsetgo/accordion-item {"title":"Is the accordion accessible?","isOpen":false} -->
			<div class="wp-block-designsetgo-accordion-item dsgo-accordion-item dsgo-accordion-item--closed" data-initially-open="false">
				<div class="dsgo-accordion-item__header">
					<button type="button" class="dsgo-accordion-item__trigger dsgo-accordion-item__trigger--icon-right" aria-expanded="false">
						<span class="dsgo-accordion-item__title">Is the accordion accessible?</span>
						<span class="dsgo-accordion-item__icon" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"></path></svg>
						</span>
					</button>
				</div>
				<div class="dsgo-accordion-item__panel" role="region" hidden>
					<div class="dsgo-accordion-item__content">
						<!-- wp:paragraph -->
						<p>Absolutely! The Accordion block follows WCAG 2.1 guidelines with proper ARIA attributes, keyboard navigation support (Enter and Space keys), and focus management. All content is visible when printed.</p>
						<!-- /wp:paragraph -->
					</div>
				</div>
			</div>
			<!-- /wp:designsetgo/accordion-item -->
		</div>
	</div>
	<!-- /wp:designsetgo/accordion -->
</div>
<!-- /wp:group -->'
);
