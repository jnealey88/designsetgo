<?php
/**
 * Configure Icon List Block Ability.
 *
 * Configures DesignSetGo icon list blocks using schema derived from block.json.
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
 * Configure Icon List ability class.
 */
class Configure_Icon_List extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-icon-list';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/icon-list';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Icon List', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo icon list block attributes.', 'designsetgo' );
	}
}
