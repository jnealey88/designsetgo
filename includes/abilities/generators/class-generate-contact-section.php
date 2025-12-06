<?php
/**
 * Generate Contact Section Ability.
 *
 * Generates a complete contact section with form and optional map,
 * contact information, and social links in a responsive layout.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Generators;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Generate Contact Section ability class.
 */
class Generate_Contact_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-contact-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Contact Section', 'designsetgo' ),
			'description'         => __( 'Generates a complete contact section with a contact form and optional map, contact details, and social links. Perfect for contact pages and landing page sections.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating contact section...', 'designsetgo' ),
			'success_message'     => __( 'Contact section generated successfully.', 'designsetgo' ),
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
					'heading'      => array(
						'type'        => 'string',
						'description' => __( 'Section heading text', 'designsetgo' ),
						'default'     => 'Get In Touch',
					),
					'headingLevel' => array(
						'type'        => 'integer',
						'description' => __( 'Heading level (1-6)', 'designsetgo' ),
						'minimum'     => 1,
						'maximum'     => 6,
						'default'     => 2,
					),
					'description'  => array(
						'type'        => 'string',
						'description' => __( 'Section description text', 'designsetgo' ),
						'default'     => 'Have a question or want to work together? Fill out the form below and we\'ll get back to you as soon as possible.',
					),
					'layout'      => array(
						'type'        => 'string',
						'description' => __( 'Section layout style', 'designsetgo' ),
						'enum'        => array( 'form-only', 'form-left', 'form-right', 'form-top' ),
						'default'     => 'form-left',
					),
					'formFields'  => array(
						'type'        => 'array',
						'description' => __( 'Form fields to include', 'designsetgo' ),
						'items'       => array(
							'type' => 'string',
							'enum' => array( 'name', 'email', 'phone', 'subject', 'message' ),
						),
						'default'     => array( 'name', 'email', 'message' ),
					),
					'submitText'  => array(
						'type'        => 'string',
						'description' => __( 'Form submit button text', 'designsetgo' ),
						'default'     => 'Send Message',
					),
					'recipientEmail' => array(
						'type'        => 'string',
						'description' => __( 'Email address to receive form submissions (defaults to admin email)', 'designsetgo' ),
					),
					'includeMap'  => array(
						'type'        => 'boolean',
						'description' => __( 'Include a map block', 'designsetgo' ),
						'default'     => false,
					),
					'mapLocation' => array(
						'type'        => 'object',
						'description' => __( 'Map location settings', 'designsetgo' ),
						'properties'  => array(
							'lat'     => array(
								'type'        => 'number',
								'description' => __( 'Latitude', 'designsetgo' ),
								'default'     => 40.7128,
							),
							'lng'     => array(
								'type'        => 'number',
								'description' => __( 'Longitude', 'designsetgo' ),
								'default'     => -74.006,
							),
							'zoom'    => array(
								'type'        => 'number',
								'description' => __( 'Map zoom level (1-20)', 'designsetgo' ),
								'default'     => 14,
								'minimum'     => 1,
								'maximum'     => 20,
							),
							'address' => array(
								'type'        => 'string',
								'description' => __( 'Display address', 'designsetgo' ),
							),
						),
					),
					'contactInfo' => array(
						'type'        => 'object',
						'description' => __( 'Contact information to display', 'designsetgo' ),
						'properties'  => array(
							'email'   => array(
								'type'        => 'string',
								'description' => __( 'Email address', 'designsetgo' ),
							),
							'phone'   => array(
								'type'        => 'string',
								'description' => __( 'Phone number', 'designsetgo' ),
							),
							'address' => array(
								'type'        => 'string',
								'description' => __( 'Physical address', 'designsetgo' ),
							),
							'hours'   => array(
								'type'        => 'string',
								'description' => __( 'Business hours', 'designsetgo' ),
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
	 * @return bool
	 */
	public function check_permission_callback(): bool {
		return $this->check_permission( 'edit_posts' );
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error
	 */
	public function execute( array $input ) {
		$post_id       = (int) ( $input['post_id'] ?? 0 );
		$position      = (int) ( $input['position'] ?? -1 );
		$heading       = sanitize_text_field( $input['heading'] ?? 'Get In Touch' );
		$heading_level = (int) ( $input['headingLevel'] ?? 2 );
		$description   = sanitize_textarea_field( $input['description'] ?? 'Have a question or want to work together? Fill out the form below and we\'ll get back to you as soon as possible.' );
		$layout        = $input['layout'] ?? 'form-left';
		$form_fields   = $input['formFields'] ?? array( 'name', 'email', 'message' );
		$submit_text   = sanitize_text_field( $input['submitText'] ?? 'Send Message' );
		$recipient     = sanitize_email( $input['recipientEmail'] ?? '' );
		$include_map   = (bool) ( $input['includeMap'] ?? false );
		$map_loc       = $input['mapLocation'] ?? array();
		$contact       = $input['contactInfo'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Validate heading level.
		$heading_level = max( 1, min( 6, $heading_level ) );

		// Build form fields.
		$form_inner_blocks = array();

		foreach ( $form_fields as $field ) {
			switch ( $field ) {
				case 'name':
					$form_inner_blocks[] = array(
						'name'       => 'designsetgo/form-text-field',
						'attributes' => array(
							'label'       => __( 'Name', 'designsetgo' ),
							'placeholder' => __( 'Your name', 'designsetgo' ),
							'required'    => true,
						),
					);
					break;
				case 'email':
					$form_inner_blocks[] = array(
						'name'       => 'designsetgo/form-email-field',
						'attributes' => array(
							'label'       => __( 'Email', 'designsetgo' ),
							'placeholder' => __( 'your@email.com', 'designsetgo' ),
							'required'    => true,
						),
					);
					break;
				case 'phone':
					$form_inner_blocks[] = array(
						'name'       => 'designsetgo/form-phone-field',
						'attributes' => array(
							'label'       => __( 'Phone', 'designsetgo' ),
							'placeholder' => __( 'Your phone number', 'designsetgo' ),
							'required'    => false,
						),
					);
					break;
				case 'subject':
					$form_inner_blocks[] = array(
						'name'       => 'designsetgo/form-text-field',
						'attributes' => array(
							'label'       => __( 'Subject', 'designsetgo' ),
							'placeholder' => __( 'What is this about?', 'designsetgo' ),
							'required'    => false,
						),
					);
					break;
				case 'message':
					$form_inner_blocks[] = array(
						'name'       => 'designsetgo/form-textarea',
						'attributes' => array(
							'label'       => __( 'Message', 'designsetgo' ),
							'placeholder' => __( 'Your message...', 'designsetgo' ),
							'required'    => true,
							'rows'        => 5,
						),
					);
					break;
			}
		}

		// Build form block.
		$form_attributes = array(
			'submitButtonText' => $submit_text,
		);
		if ( ! empty( $recipient ) ) {
			$form_attributes['recipientEmail'] = $recipient;
		}

		$form_block = array(
			'name'        => 'designsetgo/form-builder',
			'attributes'  => $form_attributes,
			'innerBlocks' => $form_inner_blocks,
		);

		// Build contact info block if provided.
		$info_blocks = array();
		if ( ! empty( $contact ) ) {
			$info_items = array();

			if ( ! empty( $contact['email'] ) ) {
				$info_items[] = array(
					'name'       => 'designsetgo/icon-list-item',
					'attributes' => array(
						'iconName' => 'mail',
						'text'     => sanitize_email( $contact['email'] ),
					),
				);
			}
			if ( ! empty( $contact['phone'] ) ) {
				$info_items[] = array(
					'name'       => 'designsetgo/icon-list-item',
					'attributes' => array(
						'iconName' => 'phone',
						'text'     => sanitize_text_field( $contact['phone'] ),
					),
				);
			}
			if ( ! empty( $contact['address'] ) ) {
				$info_items[] = array(
					'name'       => 'designsetgo/icon-list-item',
					'attributes' => array(
						'iconName' => 'map-pin',
						'text'     => sanitize_text_field( $contact['address'] ),
					),
				);
			}
			if ( ! empty( $contact['hours'] ) ) {
				$info_items[] = array(
					'name'       => 'designsetgo/icon-list-item',
					'attributes' => array(
						'iconName' => 'clock',
						'text'     => sanitize_text_field( $contact['hours'] ),
					),
				);
			}

			if ( ! empty( $info_items ) ) {
				$info_blocks[] = array(
					'name'        => 'designsetgo/icon-list',
					'attributes'  => array(),
					'innerBlocks' => $info_items,
				);
			}
		}

		// Build map block if included.
		$map_block = null;
		if ( $include_map ) {
			$map_block = array(
				'name'       => 'designsetgo/map',
				'attributes' => array(
					'dsgoLat'     => (float) ( $map_loc['lat'] ?? 40.7128 ),
					'dsgoLng'     => (float) ( $map_loc['lng'] ?? -74.006 ),
					'dsgoZoom'    => (int) ( $map_loc['zoom'] ?? 14 ),
					'dsgoHeight'  => '300px',
					'dsgoMarkers' => ! empty( $map_loc['address'] ) ? array(
						array(
							'lat'   => (float) ( $map_loc['lat'] ?? 40.7128 ),
							'lng'   => (float) ( $map_loc['lng'] ?? -74.006 ),
							'title' => sanitize_text_field( $map_loc['address'] ),
						),
					) : array(),
				),
			);
		}

		// Build section inner blocks based on layout.
		$inner_blocks = array();

		// Add heading.
		$inner_blocks[] = array(
			'name'       => 'core/heading',
			'attributes' => array(
				'level'     => $heading_level,
				'content'   => $heading,
				'textAlign' => 'form-top' === $layout ? 'center' : 'left',
			),
		);

		// Add description.
		if ( ! empty( $description ) ) {
			$inner_blocks[] = array(
				'name'       => 'core/paragraph',
				'attributes' => array(
					'content' => $description,
					'align'   => 'form-top' === $layout ? 'center' : 'left',
				),
			);
		}

		// Build content based on layout.
		if ( 'form-only' === $layout ) {
			$inner_blocks[] = $form_block;
		} elseif ( 'form-top' === $layout ) {
			$inner_blocks[] = $form_block;
			if ( $map_block ) {
				$inner_blocks[] = $map_block;
			}
			if ( ! empty( $info_blocks ) ) {
				$inner_blocks = array_merge( $inner_blocks, $info_blocks );
			}
		} else {
			// Side-by-side layouts (form-left, form-right).
			$left_column  = array();
			$right_column = array();

			if ( 'form-left' === $layout ) {
				$left_column[] = $form_block;
				if ( $map_block ) {
					$right_column[] = $map_block;
				}
				$right_column = array_merge( $right_column, $info_blocks );
			} else {
				if ( $map_block ) {
					$left_column[] = $map_block;
				}
				$left_column   = array_merge( $left_column, $info_blocks );
				$right_column[] = $form_block;
			}

			// Create grid layout.
			$inner_blocks[] = array(
				'name'        => 'designsetgo/grid',
				'attributes'  => array(
					'columnsDesktop' => 2,
					'columnsTablet'  => 1,
					'columnsMobile'  => 1,
					'gap'            => 'var(--wp--preset--spacing--60, 2rem)',
				),
				'innerBlocks' => array(
					array(
						'name'        => 'designsetgo/stack',
						'attributes'  => array(),
						'innerBlocks' => $left_column,
					),
					array(
						'name'        => 'designsetgo/stack',
						'attributes'  => array(),
						'innerBlocks' => $right_column,
					),
				),
			);
		}

		// Create section container.
		$section_attributes = array(
			'constrainWidth' => true,
		);

		// Insert the contact section.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/section',
			$section_attributes,
			$inner_blocks,
			$position
		);
	}
}
