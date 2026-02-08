<?php
/**
 * Configure Form Number Field Block Ability.
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
 * Configure Form Number Field ability class.
 */
class Configure_Form_Number_Field extends Configure_Form_Field {

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct(
			'designsetgo/configure-form-number-field',
			'designsetgo/form-number-field'
		);
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Form Number Field', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo form number field block attributes.', 'designsetgo' );
	}
}
