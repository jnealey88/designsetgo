<?php
/**
 * Configure Form Email Field Block Ability.
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
 * Configure Form Email Field ability class.
 */
class Configure_Form_Email_Field extends Configure_Form_Field {

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct(
			'designsetgo/configure-form-email-field',
			'designsetgo/form-email-field'
		);
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Form Email Field', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo form email field block attributes.', 'designsetgo' );
	}
}
