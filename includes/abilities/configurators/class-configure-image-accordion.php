<?php
/**
 * Configure Image Accordion Block Ability.
 *
 * Configures DesignSetGo image accordion blocks using schema derived from block.json.
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
 * Configure Image Accordion ability class.
 */
class Configure_Image_Accordion extends Abstract_Configurator_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-image-accordion';
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return 'designsetgo/image-accordion';
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Image Accordion', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo image accordion block attributes.', 'designsetgo' );
	}
}
