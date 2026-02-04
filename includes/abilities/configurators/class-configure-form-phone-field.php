<?php
/**
 * Configure Form Phone Field Block Ability.
 *
 * Configures DesignSetGo form phone field blocks using schema derived from block.json.
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
 * Configure Form Phone Field ability class.
 */
class Configure_Form_Phone_Field extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-form-phone-field';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/form-phone-field';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Form Phone Field', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo form phone field block attributes.', 'designsetgo' );
	}
}
