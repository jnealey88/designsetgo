<?php
/**
 * Insert Form Builder Ability.
 *
 * Inserts a Form Builder block for creating contact forms,
 * registration forms, and other data collection forms.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Inserters;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Insert Form Builder ability class.
 */
class Insert_Form_Builder extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-form-builder';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Form Builder', 'designsetgo' ),
			'description'         => __( 'Inserts a Form Builder block for creating contact forms, registration forms, and surveys. Supports text, email, phone, textarea, select, checkbox, and more field types.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating form...', 'designsetgo' ),
			'success_message'     => __( 'Form inserted successfully.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Inserter::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common = Block_Inserter::get_common_input_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'attributes' => array(
						'type'        => 'object',
						'description' => __( 'Form attributes', 'designsetgo' ),
						'properties'  => array(
							'submitButtonText'   => array(
								'type'        => 'string',
								'description' => __( 'Submit button text', 'designsetgo' ),
								'default'     => 'Submit',
							),
							'recipientEmail'     => array(
								'type'        => 'string',
								'description' => __( 'Email address for form submissions', 'designsetgo' ),
							),
							'successMessage'     => array(
								'type'        => 'string',
								'description' => __( 'Message shown after successful submission', 'designsetgo' ),
								'default'     => 'Thank you for your submission!',
							),
							'errorMessage'       => array(
								'type'        => 'string',
								'description' => __( 'Message shown on submission error', 'designsetgo' ),
								'default'     => 'There was an error. Please try again.',
							),
							'emailSubject'       => array(
								'type'        => 'string',
								'description' => __( 'Email subject line', 'designsetgo' ),
								'default'     => 'New Form Submission',
							),
							'buttonAlignment'    => array(
								'type'        => 'string',
								'description' => __( 'Submit button alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right', 'full' ),
								'default'     => 'left',
							),
							'buttonStyle'        => array(
								'type'        => 'string',
								'description' => __( 'Submit button style', 'designsetgo' ),
								'enum'        => array( 'fill', 'outline' ),
								'default'     => 'fill',
							),
							'enableRecaptcha'    => array(
								'type'        => 'boolean',
								'description' => __( 'Enable spam protection', 'designsetgo' ),
								'default'     => false,
							),
							'labelPosition'      => array(
								'type'        => 'string',
								'description' => __( 'Position of field labels', 'designsetgo' ),
								'enum'        => array( 'above', 'inline', 'floating' ),
								'default'     => 'above',
							),
							'fieldSpacing'       => array(
								'type'        => 'string',
								'description' => __( 'Spacing between fields', 'designsetgo' ),
								'default'     => '1rem',
							),
						),
					),
					'fields'     => array(
						'type'        => 'array',
						'description' => __( 'Form field definitions', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'type'        => array(
									'type'        => 'string',
									'description' => __( 'Field type', 'designsetgo' ),
									'enum'        => array( 'text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'number', 'date', 'time', 'url', 'hidden' ),
								),
								'label'       => array(
									'type'        => 'string',
									'description' => __( 'Field label', 'designsetgo' ),
								),
								'placeholder' => array(
									'type'        => 'string',
									'description' => __( 'Field placeholder text', 'designsetgo' ),
								),
								'required'    => array(
									'type'        => 'boolean',
									'description' => __( 'Is field required', 'designsetgo' ),
									'default'     => false,
								),
								'options'     => array(
									'type'        => 'array',
									'description' => __( 'Options for select/checkbox fields', 'designsetgo' ),
									'items'       => array(
										'type' => 'string',
									),
								),
								'width'       => array(
									'type'        => 'string',
									'description' => __( 'Field width', 'designsetgo' ),
									'enum'        => array( 'full', 'half', 'third' ),
									'default'     => 'full',
								),
							),
						),
					),
				)
			),
			'additionalProperties' => false,
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool|WP_Error
	 */
	public function check_permission_callback() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to insert forms.', 'designsetgo' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error
	 */
	public function execute( array $input ) {
		$post_id    = (int) ( $input['post_id'] ?? 0 );
		$position   = (int) ( $input['position'] ?? -1 );
		$attributes = $input['attributes'] ?? array();
		$fields     = $input['fields'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return new WP_Error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Build inner blocks from fields array.
		$inner_blocks = array();
		if ( ! empty( $fields ) ) {
			foreach ( $fields as $field ) {
				$field_type = $field['type'] ?? 'text';
				$block_name = $this->get_field_block_name( $field_type );

				$field_attrs = array();
				if ( ! empty( $field['label'] ) ) {
					$field_attrs['label'] = sanitize_text_field( $field['label'] );
				}
				if ( ! empty( $field['placeholder'] ) ) {
					$field_attrs['placeholder'] = sanitize_text_field( $field['placeholder'] );
				}
				if ( isset( $field['required'] ) ) {
					$field_attrs['required'] = (bool) $field['required'];
				}
				if ( ! empty( $field['options'] ) && is_array( $field['options'] ) ) {
					$field_attrs['options'] = array_map( 'sanitize_text_field', $field['options'] );
				}

				$inner_blocks[] = array(
					'name'       => $block_name,
					'attributes' => $field_attrs,
				);
			}
		} else {
			// Default form fields.
			$inner_blocks = array(
				array(
					'name'       => 'designsetgo/form-text-field',
					'attributes' => array(
						'label'       => __( 'Name', 'designsetgo' ),
						'placeholder' => __( 'Your name', 'designsetgo' ),
						'required'    => true,
					),
				),
				array(
					'name'       => 'designsetgo/form-email-field',
					'attributes' => array(
						'label'       => __( 'Email', 'designsetgo' ),
						'placeholder' => __( 'your@email.com', 'designsetgo' ),
						'required'    => true,
					),
				),
				array(
					'name'       => 'designsetgo/form-textarea',
					'attributes' => array(
						'label'       => __( 'Message', 'designsetgo' ),
						'placeholder' => __( 'Your message...', 'designsetgo' ),
						'required'    => true,
						'rows'        => 5,
					),
				),
			);
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/form-builder',
			$attributes,
			$inner_blocks,
			$position
		);
	}

	/**
	 * Get block name for field type.
	 *
	 * @param string $field_type Field type.
	 * @return string Block name.
	 */
	private function get_field_block_name( string $field_type ): string {
		$mapping = array(
			'text'     => 'designsetgo/form-text-field',
			'email'    => 'designsetgo/form-email-field',
			'phone'    => 'designsetgo/form-phone-field',
			'textarea' => 'designsetgo/form-textarea',
			'select'   => 'designsetgo/form-select-field',
			'checkbox' => 'designsetgo/form-checkbox-field',
			'number'   => 'designsetgo/form-number-field',
			'date'     => 'designsetgo/form-date-field',
			'time'     => 'designsetgo/form-time-field',
			'url'      => 'designsetgo/form-url-field',
			'hidden'   => 'designsetgo/form-hidden-field',
		);

		return $mapping[ $field_type ] ?? 'designsetgo/form-text-field';
	}
}
