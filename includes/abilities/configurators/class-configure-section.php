<?php
/**
 * Configure Section Block Ability.
 *
 * Configures DesignSetGo section blocks using schema derived from block.json.
 * Demonstrates the new Abstract_Configurator_Ability pattern.
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
 * Configure Section ability class.
 *
 * This ability uses the new block.json schema integration.
 * The input schema is automatically generated from the section block's
 * block.json file, ensuring consistency with block definitions.
 */
class Configure_Section extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-section';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/section';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Section', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo section block including layout, shape dividers, hover effects, and overlay settings.', 'designsetgo' );
	}

	/**
	 * Get the thinking message.
	 *
	 * @return string
	 */
	protected function get_thinking_message(): string {
		return __( 'Configuring section...', 'designsetgo' );
	}

	/**
	 * Get the success message.
	 *
	 * @return string
	 */
	protected function get_success_message(): string {
		return __( 'Section configured successfully.', 'designsetgo' );
	}

	/**
	 * Get attributes to exclude from the schema.
	 *
	 * We exclude the 'style' attribute as it's a complex WordPress
	 * block supports object that should be configured through the
	 * core WordPress styling abilities.
	 *
	 * @return array<string> Attributes to exclude.
	 */
	protected function get_excluded_attributes(): array {
		return array( 'style' );
	}
}
