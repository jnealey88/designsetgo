<?php
/**
 * Configure Accordion Block Ability.
 *
 * Configures DesignSetGo accordion blocks using schema derived from block.json.
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
 * Configure Accordion ability class.
 */
class Configure_Accordion extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-accordion';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/accordion';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Accordion', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo accordion block including icon style, position, behavior, and styling options.', 'designsetgo' );
	}

	/**
	 * Get the thinking message.
	 *
	 * @return string
	 */
	protected function get_thinking_message(): string {
		return __( 'Configuring accordion...', 'designsetgo' );
	}

	/**
	 * Get the success message.
	 *
	 * @return string
	 */
	protected function get_success_message(): string {
		return __( 'Accordion configured successfully.', 'designsetgo' );
	}
}
