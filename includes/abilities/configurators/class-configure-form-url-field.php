<?php
/**
 * Configure Form URL Field Block Ability.
 *
 * Configures DesignSetGo form URL field blocks using schema derived from block.json.
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
 * Configure Form URL Field ability class.
 */
class Configure_Form_Url_Field extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-form-url-field';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/form-url-field';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Form URL Field', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo form URL field block attributes.', 'designsetgo' );
	}
}
