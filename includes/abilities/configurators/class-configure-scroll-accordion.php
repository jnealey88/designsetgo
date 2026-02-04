<?php
/**
 * Configure Scroll Accordion Block Ability.
 *
 * Configures DesignSetGo scroll accordion blocks using schema derived from block.json.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.1.0
 */

namespace DesignSetGo\Abilities\Configurators;

use DesignSetGo\Abilities\Abstract_Configurator_Ability;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Configure Scroll Accordion ability class.
 */
class Configure_Scroll_Accordion extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-scroll-accordion';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/scroll-accordion';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Scroll Accordion', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo scroll accordion block attributes.', 'designsetgo' );
	}
}
