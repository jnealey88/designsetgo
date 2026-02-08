<?php
/**
 * Configure Form Time Field Block Ability.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.1.0
 */

namespace DesignSetGo\Abilities\Configurators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Configure Form Time Field ability class.
 */
class Configure_Form_Time_Field extends Configure_Form_Field {

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct(
			'designsetgo/configure-form-time-field',
			'designsetgo/form-time-field'
		);
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Form Time Field', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo form time field block attributes.', 'designsetgo' );
	}
}
