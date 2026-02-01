<?php
/**
 * DesignSetGo Block Handlers
 *
 * Handles conversion of DesignSetGo blocks to markdown.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

namespace DesignSetGo\Markdown;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dsgo_Handlers Class
 *
 * Converts DesignSetGo blocks to markdown.
 */
class Dsgo_Handlers {
	/**
	 * Converter instance.
	 *
	 * @var Converter
	 */
	private $converter;

	/**
	 * Constructor.
	 *
	 * @param Converter $converter Converter instance.
	 */
	public function __construct( Converter $converter ) {
		$this->converter = $converter;
	}

	/**
	 * Handle designsetgo/card block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_card( array $block ): string {
		$lines = array();

		$title = $block['attrs']['dsgoCardTitle'] ?? '';
		if ( ! empty( $title ) ) {
			$lines[] = '### ' . $this->converter->escape_markdown( $title );
			$lines[] = '';
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$lines[] = $this->converter->render_blocks( $block['innerBlocks'] );
		}

		$link      = $block['attrs']['dsgoCardLink']['url'] ?? '';
		$link_text = $block['attrs']['dsgoCardLink']['text'] ?? 'Learn more';
		if ( ! empty( $link ) ) {
			$lines[] = '';
			$lines[] = '[' . $this->converter->escape_markdown( $link_text ) . '](' . $link . ')';
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

		return $this->converter->render_blocks( $block['innerBlocks'] );
	}

	/**
	 * Handle designsetgo/accordion-item block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_accordion_item( array $block ): string {
		$lines = array();

		$label   = $block['attrs']['dsgoAccordionLabel'] ?? 'Accordion Item';
		$lines[] = '**' . $this->converter->escape_markdown( $label ) . '**';

		if ( ! empty( $block['innerBlocks'] ) ) {
			$lines[] = '';
			$lines[] = $this->converter->render_blocks( $block['innerBlocks'] );
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

		return $this->converter->render_blocks( $block['innerBlocks'] );
	}

	/**
	 * Handle designsetgo/tab block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_tab( array $block ): string {
		$lines = array();

		$title   = $block['attrs']['dsgoTabTitle'] ?? 'Tab';
		$lines[] = '### ' . $this->converter->escape_markdown( $title );

		if ( ! empty( $block['innerBlocks'] ) ) {
			$lines[] = '';
			$lines[] = $this->converter->render_blocks( $block['innerBlocks'] );
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
			$rendered = $this->converter->render_block( $item );
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
			return $this->converter->render_blocks( $block['innerBlocks'] );
		}

		return $this->converter->html_to_text( $text );
	}

	/**
	 * Handle designsetgo/button block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_button( array $block ): string {
		$text = $block['attrs']['dsgoButtonText'] ?? '';
		$url  = $block['attrs']['dsgoButtonLink']['url'] ?? '';

		if ( empty( $text ) ) {
			$html = $this->converter->get_inner_html( $block );
			$text = $this->converter->html_to_text( $html );
		}

		if ( empty( $text ) ) {
			return '';
		}

		if ( ! empty( $url ) ) {
			return '[' . $this->converter->escape_markdown( $text ) . '](' . $url . ')';
		}

		return '**' . $this->converter->escape_markdown( $text ) . '**';
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

		if ( ! empty( $block['innerBlocks'] ) ) {
			$content = $this->converter->render_blocks( $block['innerBlocks'] );
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
			return '*[Map: ' . $this->converter->escape_markdown( $address ) . ']*';
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
		return '*[Form: ' . $this->converter->escape_markdown( $title ) . ']*';
	}

	/**
	 * Handle designsetgo/counter block.
	 *
	 * @param array $block Block data.
	 * @return string Markdown.
	 */
	public function handle_counter( array $block ): string {
		$end    = $block['attrs']['dsgoCounterEnd'] ?? 0;
		$prefix = $block['attrs']['dsgoCounterPrefix'] ?? '';
		$suffix = $block['attrs']['dsgoCounterSuffix'] ?? '';
		$label  = $block['attrs']['dsgoCounterLabel'] ?? '';

		$value = $prefix . number_format( $end ) . $suffix;

		if ( ! empty( $label ) ) {
			return "**{$value}** {$label}";
		}

		return "**{$value}**";
	}
}
