<?php
/**
 * Markdown Converter Class
 *
 * Converts WordPress Gutenberg blocks to clean markdown format
 * for LLM consumption via the llms.txt REST API.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Markdown_Converter Class
 *
 * Converts post content (Gutenberg blocks) to markdown.
 */
class Markdown_Converter {
	/**
	 * Block handlers registry.
	 *
	 * @var array<string, callable>
	 */
	private $handlers = array();

	/**
	 * Constructor - registers default block handlers.
	 */
	public function __construct() {
		$this->register_default_handlers();

		/**
		 * Allow plugins to register custom block handlers.
		 *
		 * @since 1.4.0
		 *
		 * @param Markdown_Converter $converter The converter instance.
		 */
		do_action( 'designsetgo_markdown_converter_init', $this );
	}

	/**
	 * Convert a WordPress post to markdown.
	 *
	 * @param \WP_Post $post Post object.
	 * @return string Markdown content.
	 */
	public function convert( \WP_Post $post ): string {
		$lines = array();

		// Add title as H1.
		$lines[] = '# ' . $this->escape_markdown( $post->post_title );
		$lines[] = '';

		// Parse and render blocks.
		$blocks = parse_blocks( $post->post_content );
		$content = $this->render_blocks( $blocks );

		if ( ! empty( $content ) ) {
			$lines[] = $content;
		}

		return implode( "\n", $lines );
	}

	/**
	 * Register a custom block handler.
	 *
	 * @param string   $block_name Block name (e.g., 'core/paragraph').
	 * @param callable $handler    Handler function receiving ($block, $converter).
	 */
	public function register_handler( string $block_name, callable $handler ): void {
		$this->handlers[ $block_name ] = $handler;
	}

	/**
	 * Render an array of blocks to markdown.
	 *
	 * @param array $blocks Array of parsed blocks.
	 * @return string Rendered markdown.
	 */
	public function render_blocks( array $blocks ): string {
		$output = array();

		foreach ( $blocks as $block ) {
			// Skip empty blocks (whitespace between blocks).
			if ( empty( $block['blockName'] ) ) {
				continue;
			}

			$rendered = $this->render_block( $block );
			if ( ! empty( $rendered ) ) {
				$output[] = $rendered;
			}
		}

		return implode( "\n\n", $output );
	}

	/**
	 * Render a single block to markdown.
	 *
	 * @param array $block Parsed block array.
	 * @return string Rendered markdown.
	 */
	private function render_block( array $block ): string {
		$handler = $this->handlers[ $block['blockName'] ] ?? null;

		if ( $handler ) {
			return call_user_func( $handler, $block, $this );
		}

		return $this->default_handler( $block );
	}

	/**
	 * Default handler for unknown blocks.
	 *
	 * Attempts to extract text content from innerHTML.
	 *
	 * @param array $block Parsed block.
	 * @return string Markdown content.
	 */
	private function default_handler( array $block ): string {
		// If block has inner blocks, render them.
		if ( ! empty( $block['innerBlocks'] ) ) {
			return $this->render_blocks( $block['innerBlocks'] );
		}

		// Try to extract text from innerHTML.
		$html = $this->get_inner_html( $block );
		if ( ! empty( $html ) ) {
			return $this->html_to_text( $html );
		}

		return '';
	}

	/**
	 * Register default handlers for core and DesignSetGo blocks.
	 */
	private function register_default_handlers(): void {
		// Core WordPress blocks.
		$this->register_handler( 'core/paragraph', array( $this, 'handle_paragraph' ) );
		$this->register_handler( 'core/heading', array( $this, 'handle_heading' ) );
		$this->register_handler( 'core/list', array( $this, 'handle_list' ) );
		$this->register_handler( 'core/list-item', array( $this, 'handle_list_item' ) );
		$this->register_handler( 'core/quote', array( $this, 'handle_quote' ) );
		$this->register_handler( 'core/code', array( $this, 'handle_code' ) );
		$this->register_handler( 'core/preformatted', array( $this, 'handle_code' ) );
		$this->register_handler( 'core/image', array( $this, 'handle_image' ) );
		$this->register_handler( 'core/separator', array( $this, 'handle_separator' ) );
		$this->register_handler( 'core/spacer', array( $this, 'handle_spacer' ) );
		$this->register_handler( 'core/buttons', array( $this, 'handle_buttons' ) );
		$this->register_handler( 'core/button', array( $this, 'handle_button' ) );
		$this->register_handler( 'core/columns', array( $this, 'handle_container' ) );
		$this->register_handler( 'core/column', array( $this, 'handle_container' ) );
		$this->register_handler( 'core/group', array( $this, 'handle_container' ) );
		$this->register_handler( 'core/cover', array( $this, 'handle_container' ) );

		// DesignSetGo container blocks.
		$this->register_handler( 'designsetgo/grid', array( $this, 'handle_container' ) );
		$this->register_handler( 'designsetgo/row', array( $this, 'handle_container' ) );
		$this->register_handler( 'designsetgo/section', array( $this, 'handle_container' ) );
		$this->register_handler( 'designsetgo/stack', array( $this, 'handle_container' ) );

		// DesignSetGo content blocks.
		$this->register_handler( 'designsetgo/card', array( $this, 'handle_card' ) );
		$this->register_handler( 'designsetgo/accordion', array( $this, 'handle_accordion' ) );
		$this->register_handler( 'designsetgo/accordion-item', array( $this, 'handle_accordion_item' ) );
		$this->register_handler( 'designsetgo/tabs', array( $this, 'handle_tabs' ) );
		$this->register_handler( 'designsetgo/tab', array( $this, 'handle_tab' ) );
		$this->register_handler( 'designsetgo/icon-list', array( $this, 'handle_icon_list' ) );
		$this->register_handler( 'designsetgo/icon-list-item', array( $this, 'handle_icon_list_item' ) );
		$this->register_handler( 'designsetgo/divider', array( $this, 'handle_separator' ) );
		$this->register_handler( 'designsetgo/button', array( $this, 'handle_dsgo_button' ) );

		// Interactive blocks - provide description placeholders.
		$this->register_handler( 'designsetgo/slider', array( $this, 'handle_interactive' ) );
		$this->register_handler( 'designsetgo/modal', array( $this, 'handle_interactive' ) );
		$this->register_handler( 'designsetgo/map', array( $this, 'handle_map' ) );
		$this->register_handler( 'designsetgo/form-builder', array( $this, 'handle_form' ) );
		$this->register_handler( 'designsetgo/counter', array( $this, 'handle_counter' ) );
	}

	// =========================================================================
	// Core Block Handlers
	// =========================================================================

	/**
	 * Handle core/paragraph block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_paragraph( array $block ): string {
		$html = $this->get_inner_html( $block );
		return $this->html_to_text( $html );
	}

	/**
	 * Handle core/heading block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_heading( array $block ): string {
		$level = $block['attrs']['level'] ?? 2;
		$html = $this->get_inner_html( $block );
		$text = $this->html_to_text( $html );

		return str_repeat( '#', $level ) . ' ' . $text;
	}

	/**
	 * Handle core/list block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_list( array $block ): string {
		$ordered = ( $block['attrs']['ordered'] ?? false );
		$items = array();
		$index = 1;

		foreach ( $block['innerBlocks'] as $item ) {
			$text = $this->render_block( $item );
			if ( ! empty( $text ) ) {
				$prefix = $ordered ? "{$index}. " : '- ';
				$items[] = $prefix . $text;
				$index++;
			}
		}

		return implode( "\n", $items );
	}

	/**
	 * Handle core/list-item block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown (without bullet prefix).
	 */
	public function handle_list_item( array $block ): string {
		$html = $this->get_inner_html( $block );
		return $this->html_to_text( $html );
	}

	/**
	 * Handle core/quote block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_quote( array $block ): string {
		$content = '';

		if ( ! empty( $block['innerBlocks'] ) ) {
			$content = $this->render_blocks( $block['innerBlocks'] );
		} else {
			$html = $this->get_inner_html( $block );
			$content = $this->html_to_text( $html );
		}

		// Prefix each line with >.
		$lines = explode( "\n", $content );
		$quoted = array_map( fn( $line ) => '> ' . $line, $lines );

		return implode( "\n", $quoted );
	}

	/**
	 * Handle core/code and core/preformatted blocks.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_code( array $block ): string {
		$html = $this->get_inner_html( $block );
		$code = html_entity_decode( wp_strip_all_tags( $html ) );

		return "```\n" . trim( $code ) . "\n```";
	}

	/**
	 * Handle core/image block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_image( array $block ): string {
		$url = $block['attrs']['url'] ?? '';
		$alt = $block['attrs']['alt'] ?? '';
		$caption = $block['attrs']['caption'] ?? '';

		if ( empty( $url ) ) {
			// Try to extract from HTML.
			$html = $this->get_inner_html( $block );
			if ( preg_match( '/<img[^>]+src=["\']([^"\']+)["\']/', $html, $matches ) ) {
				$url = $matches[1];
			}
			if ( preg_match( '/<img[^>]+alt=["\']([^"\']*)["\']/', $html, $matches ) ) {
				$alt = $matches[1];
			}
		}

		if ( empty( $url ) ) {
			return '';
		}

		$markdown = '![' . $this->escape_markdown( $alt ) . '](' . $url . ')';

		if ( ! empty( $caption ) ) {
			$markdown .= "\n*" . $this->html_to_text( $caption ) . '*';
		}

		return $markdown;
	}

	/**
	 * Handle core/separator and designsetgo/divider blocks.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_separator( array $block ): string {
		return '---';
	}

	/**
	 * Handle core/spacer block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_spacer( array $block ): string {
		// Spacer doesn't have meaningful content.
		return '';
	}

	/**
	 * Handle core/buttons container.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_buttons( array $block ): string {
		if ( empty( $block['innerBlocks'] ) ) {
			return '';
		}

		$buttons = array();
		foreach ( $block['innerBlocks'] as $button ) {
			$rendered = $this->render_block( $button );
			if ( ! empty( $rendered ) ) {
				$buttons[] = $rendered;
			}
		}

		return implode( ' | ', $buttons );
	}

	/**
	 * Handle core/button block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_button( array $block ): string {
		$url = $block['attrs']['url'] ?? '';
		$html = $this->get_inner_html( $block );
		$text = $this->html_to_text( $html );

		if ( empty( $text ) ) {
			return '';
		}

		if ( ! empty( $url ) ) {
			return '[' . $text . '](' . $url . ')';
		}

		return '**' . $text . '**';
	}

	/**
	 * Handle container blocks (columns, groups, grid, row, section).
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_container( array $block ): string {
		if ( empty( $block['innerBlocks'] ) ) {
			return '';
		}

		return $this->render_blocks( $block['innerBlocks'] );
	}

	// =========================================================================
	// DesignSetGo Block Handlers
	// =========================================================================

	/**
	 * Handle designsetgo/card block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_card( array $block ): string {
		$lines = array();

		// Get card title from attributes.
		$title = $block['attrs']['dsgoCardTitle'] ?? '';
		if ( ! empty( $title ) ) {
			$lines[] = '### ' . $this->escape_markdown( $title );
			$lines[] = '';
		}

		// Render inner content.
		if ( ! empty( $block['innerBlocks'] ) ) {
			$lines[] = $this->render_blocks( $block['innerBlocks'] );
		}

		// Get card link.
		$link = $block['attrs']['dsgoCardLink']['url'] ?? '';
		$link_text = $block['attrs']['dsgoCardLink']['text'] ?? 'Learn more';
		if ( ! empty( $link ) ) {
			$lines[] = '';
			$lines[] = '[' . $this->escape_markdown( $link_text ) . '](' . $link . ')';
		}

		return implode( "\n", array_filter( $lines ) );
	}

	/**
	 * Handle designsetgo/accordion block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_accordion( array $block ): string {
		if ( empty( $block['innerBlocks'] ) ) {
			return '';
		}

		return $this->render_blocks( $block['innerBlocks'] );
	}

	/**
	 * Handle designsetgo/accordion-item block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_accordion_item( array $block ): string {
		$lines = array();

		$label = $block['attrs']['dsgoAccordionLabel'] ?? 'Accordion Item';
		$lines[] = '**' . $this->escape_markdown( $label ) . '**';

		if ( ! empty( $block['innerBlocks'] ) ) {
			$lines[] = '';
			$lines[] = $this->render_blocks( $block['innerBlocks'] );
		}

		return implode( "\n", $lines );
	}

	/**
	 * Handle designsetgo/tabs block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_tabs( array $block ): string {
		if ( empty( $block['innerBlocks'] ) ) {
			return '';
		}

		return $this->render_blocks( $block['innerBlocks'] );
	}

	/**
	 * Handle designsetgo/tab block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_tab( array $block ): string {
		$lines = array();

		$title = $block['attrs']['dsgoTabTitle'] ?? 'Tab';
		$lines[] = '### ' . $this->escape_markdown( $title );

		if ( ! empty( $block['innerBlocks'] ) ) {
			$lines[] = '';
			$lines[] = $this->render_blocks( $block['innerBlocks'] );
		}

		return implode( "\n", $lines );
	}

	/**
	 * Handle designsetgo/icon-list block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_icon_list( array $block ): string {
		if ( empty( $block['innerBlocks'] ) ) {
			return '';
		}

		$items = array();
		foreach ( $block['innerBlocks'] as $item ) {
			$rendered = $this->render_block( $item );
			if ( ! empty( $rendered ) ) {
				$items[] = '- ' . $rendered;
			}
		}

		return implode( "\n", $items );
	}

	/**
	 * Handle designsetgo/icon-list-item block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_icon_list_item( array $block ): string {
		$text = $block['attrs']['dsgoIconListItemText'] ?? '';

		if ( empty( $text ) && ! empty( $block['innerBlocks'] ) ) {
			return $this->render_blocks( $block['innerBlocks'] );
		}

		return $this->html_to_text( $text );
	}

	/**
	 * Handle designsetgo/button block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_dsgo_button( array $block ): string {
		$text = $block['attrs']['dsgoButtonText'] ?? '';
		$url = $block['attrs']['dsgoButtonLink']['url'] ?? '';

		if ( empty( $text ) ) {
			$html = $this->get_inner_html( $block );
			$text = $this->html_to_text( $html );
		}

		if ( empty( $text ) ) {
			return '';
		}

		if ( ! empty( $url ) ) {
			return '[' . $this->escape_markdown( $text ) . '](' . $url . ')';
		}

		return '**' . $this->escape_markdown( $text ) . '**';
	}

	/**
	 * Handle interactive blocks with placeholder.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_interactive( array $block ): string {
		$name = str_replace( array( 'designsetgo/', 'core/' ), '', $block['blockName'] );
		$name = ucwords( str_replace( '-', ' ', $name ) );

		// Try to render inner content if available.
		if ( ! empty( $block['innerBlocks'] ) ) {
			$content = $this->render_blocks( $block['innerBlocks'] );
			if ( ! empty( $content ) ) {
				return "*[{$name}]*\n\n" . $content;
			}
		}

		return "*[{$name}]*";
	}

	/**
	 * Handle designsetgo/map block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_map( array $block ): string {
		$address = $block['attrs']['dsgoMapAddress'] ?? '';

		if ( ! empty( $address ) ) {
			return '*[Map: ' . $this->escape_markdown( $address ) . ']*';
		}

		return '*[Map]*';
	}

	/**
	 * Handle designsetgo/form-builder block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_form( array $block ): string {
		$title = $block['attrs']['dsgoFormTitle'] ?? 'Contact Form';
		return '*[Form: ' . $this->escape_markdown( $title ) . ']*';
	}

	/**
	 * Handle designsetgo/counter block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_counter( array $block ): string {
		$end = $block['attrs']['dsgoCounterEnd'] ?? 0;
		$prefix = $block['attrs']['dsgoCounterPrefix'] ?? '';
		$suffix = $block['attrs']['dsgoCounterSuffix'] ?? '';
		$label = $block['attrs']['dsgoCounterLabel'] ?? '';

		$value = $prefix . number_format( $end ) . $suffix;

		if ( ! empty( $label ) ) {
			return "**{$value}** {$label}";
		}

		return "**{$value}**";
	}

	// =========================================================================
	// Utility Methods
	// =========================================================================

	/**
	 * Get inner HTML from block.
	 *
	 * @param array $block Block data.
	 * @return string HTML content.
	 */
	private function get_inner_html( array $block ): string {
		if ( isset( $block['innerHTML'] ) ) {
			return $block['innerHTML'];
		}

		if ( ! empty( $block['innerContent'] ) ) {
			return implode( '', array_filter( $block['innerContent'], 'is_string' ) );
		}

		return '';
	}

	/**
	 * Convert HTML to plain text, preserving some formatting.
	 *
	 * @param string $html HTML content.
	 * @return string Plain text.
	 */
	private function html_to_text( string $html ): string {
		// Convert common inline elements to markdown.
		$html = preg_replace( '/<strong[^>]*>(.*?)<\/strong>/is', '**$1**', $html );
		$html = preg_replace( '/<b[^>]*>(.*?)<\/b>/is', '**$1**', $html );
		$html = preg_replace( '/<em[^>]*>(.*?)<\/em>/is', '*$1*', $html );
		$html = preg_replace( '/<i[^>]*>(.*?)<\/i>/is', '*$1*', $html );
		$html = preg_replace( '/<code[^>]*>(.*?)<\/code>/is', '`$1`', $html );

		// Convert links.
		$html = preg_replace( '/<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is', '[$2]($1)', $html );

		// Convert line breaks.
		$html = preg_replace( '/<br\s*\/?>/i', "\n", $html );

		// Strip remaining HTML.
		$text = wp_strip_all_tags( $html );

		// Decode entities.
		$text = html_entity_decode( $text, ENT_QUOTES, 'UTF-8' );

		// Normalize whitespace.
		$text = preg_replace( '/[ \t]+/', ' ', $text );
		$text = preg_replace( '/\n\s*\n/', "\n\n", $text );

		return trim( $text );
	}

	/**
	 * Escape special markdown characters.
	 *
	 * @param string $text Text to escape.
	 * @return string Escaped text.
	 */
	private function escape_markdown( string $text ): string {
		// Only escape characters that break link syntax and formatting.
		$text = str_replace( '\\', '\\\\', $text );
		$text = str_replace( '[', '\\[', $text );
		$text = str_replace( ']', '\\]', $text );
		$text = str_replace( '(', '\\(', $text );
		$text = str_replace( ')', '\\)', $text );

		return $text;
	}
}
