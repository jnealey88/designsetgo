<?php
/**
 * Generic Form Field Configurator Ability.
 *
 * Base class for all form field configurator abilities. Centralizes
 * ability name and block name handling. Subclasses override get_label()
 * and get_description() with literal __() calls for i18n compliance.
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
 * Generic form field configurator ability class.
 *
 * Subclasses call parent::__construct() with ability name and block name,
 * then override get_label() and get_description() with translated strings.
 */
abstract class Configure_Form_Field extends Abstract_Configurator_Ability {

	/**
	 * Ability name.
	 *
	 * @var string
	 */
	private string $ability_name;

	/**
	 * Target block name.
	 *
	 * @var string
	 */
	private string $block_name;

	/**
	 * Constructor.
	 *
	 * @param string $ability_name Ability name (e.g., 'designsetgo/configure-form-text-field').
	 * @param string $block_name   Target block name (e.g., 'designsetgo/form-text-field').
	 */
	public function __construct( string $ability_name, string $block_name ) {
		$this->ability_name = $ability_name;
		$this->block_name   = $block_name;
	}

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return $this->ability_name;
	}

	/**
	 * Get the target block name.
	 *
	 * @return string Block name for schema generation.
	 */
	protected function get_target_block_name(): ?string {
		return $this->block_name;
	}
}
