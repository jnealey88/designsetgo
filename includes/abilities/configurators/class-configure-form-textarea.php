<?php
/**
 * Configure Form Textarea Block Ability.
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
 * Configure Form Textarea ability class.
 */
class Configure_Form_Textarea extends Configure_Form_Field {

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct(
			'designsetgo/configure-form-textarea',
			'designsetgo/form-textarea'
		);
	}

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	protected function get_label(): string {
		return __( 'Configure Form Textarea', 'designsetgo' );
	}

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Configure a DesignSetGo form textarea block attributes.', 'designsetgo' );
	}
}
