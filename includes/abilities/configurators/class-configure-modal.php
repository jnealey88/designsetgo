<?php
/**
 * Configure Modal Block Ability.
 *
 * Configures DesignSetGo modal blocks using schema derived from block.json.
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
 * Configure Modal ability class.
 */
class Configure_Modal extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-modal';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/modal';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Modal', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo modal block including size, animation, overlay, close button, auto-trigger, and gallery settings.', 'designsetgo' );
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
