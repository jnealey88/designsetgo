<?php
/**
 * Form Handler Class
 *
 * Handles form submissions via REST API endpoint with validation,
 * spam protection, and data storage.
 *
 * Security Monitoring Hooks
 * -------------------------
 * This class provides several action hooks for monitoring security events:
 *
 * 1. designsetgo_form_spam_detected
 *    Fired when spam is detected (honeypot or time-based)
 *
 *    @param string $form_id     Form identifier
 *    @param string $reason      Detection method: 'honeypot' or 'too_fast'
 *    @param string $ip_address  Client IP address
 *    @param array  $data        Additional data (optional, e.g., elapsed time)
 *
 * 2. designsetgo_form_rate_limit_exceeded
 *    Fired when rate limit is exceeded
 *    @param string $form_id         Form identifier
 *    @param string $ip_address      Client IP address
 *    @param int    $current_count   Current submission count
 *    @param int    $max_submissions Maximum allowed submissions
 *
 * 3. designsetgo_form_validation_failed
 *    Fired when field validation fails
 *    @param string $form_id     Form identifier
 *    @param string $field_name  Field that failed validation
 *    @param string $field_type  Field type (email, url, etc.)
 *    @param string $error_code  Validation error code
 *    @param string $ip_address  Client IP address
 *
 * 4. designsetgo_form_submitted
 *    Fired when form is successfully submitted
 *    @param int    $submission_id   Submission post ID
 *    @param string $form_id         Form identifier
 *    @param array  $sanitized_fields Sanitized form fields
 *
 * Example Usage:
 * ```php
 * // Log spam attempts
 * add_action( 'designsetgo_form_spam_detected', function( $form_id, $reason, $ip ) {
 *     error_log( "Spam detected on form {$form_id}: {$reason} from {$ip}" );
 * }, 10, 3 );
 *
 * // Block IPs after multiple rate limit violations
 * add_action( 'designsetgo_form_rate_limit_exceeded', function( $form_id, $ip, $count ) {
 *     if ( $count > 10 ) {
 *         // Add to blocklist
 *         update_option( 'blocked_ips', array_merge(
 *             get_option( 'blocked_ips', [] ),
 *             [ $ip ]
 *         ) );
 *     }
 * }, 10, 3 );
 * ```
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo\Blocks;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Form_Handler class.
 */
class Form_Handler {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'localize_form_script' ) );
	}

	/**
	 * Register REST API endpoint for form submission.
	 *
	 * SECURITY NOTE: This is a public endpoint (permission_callback = __return_true)
	 * because it needs to accept form submissions from non-logged-in users.
	 *
	 * Security measures in place:
	 * - Honeypot field check (detects spam bots)
	 * - Time-based submission check (< 3 seconds = likely bot)
	 * - Rate limiting (3 submissions per 60 seconds per IP address)
	 * - Comprehensive field validation (email, url, phone, number types)
	 * - Type-specific sanitization for all field values
	 * - Email header injection prevention (strips newlines from email parameters)
	 * - REST API parameter validation for email configuration
	 *
	 * If abuse occurs, consider adding:
	 * - Google reCAPTCHA integration
	 * - More aggressive rate limiting
	 * - IP blocklist functionality
	 * - Cloudflare Turnstile or similar
	 *
	 * Extensibility:
	 * - Use 'designsetgo_form_rate_limit_count' filter to adjust rate limit
	 * - Use 'designsetgo_form_rate_limit_window' filter to adjust time window
	 * - Use 'designsetgo_form_submitted' action to hook into successful submissions
	 */
	public function register_rest_endpoint() {
		register_rest_route(
			'designsetgo/v1',
			'/form/submit',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_form_submission' ),
				'permission_callback' => '__return_true', // Public endpoint - see DocBlock above for security measures.
				'args'                => array(
					'formId'           => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'fields'           => array(
						'required'          => true,
						'type'              => 'array',
						'validate_callback' => function ( $param ) {
							return is_array( $param );
						},
					),
					'honeypot'         => array(
						'required' => false,
						'type'     => 'string',
						'default'  => '',
					),
					'timestamp'        => array(
						'required' => false,
						'type'     => 'string',
						'default'  => '',
					),
					// Email configuration parameters.
					'enable_email'     => array(
						'type'              => 'boolean',
						'default'           => false,
						'sanitize_callback' => 'rest_sanitize_boolean',
					),
					'email_to'         => array(
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_email',
						'validate_callback' => function ( $param ) {
							return empty( $param ) || is_email( $param );
						},
					),
					'email_from_email' => array(
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_email',
						'validate_callback' => function ( $param ) {
							return empty( $param ) || is_email( $param );
						},
					),
					'email_from_name'  => array(
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'email_subject'    => array(
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'email_reply_to'   => array(
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'email_body'       => array(
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_textarea_field',
					),
				),
			)
		);
	}

	/**
	 * Handle form submission.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error on failure.
	 */
	public function handle_form_submission( $request ) {
		$form_id   = $request->get_param( 'formId' );
		$fields    = $request->get_param( 'fields' );
		$honeypot  = $request->get_param( 'honeypot' );
		$timestamp = $request->get_param( 'timestamp' );

		// Honeypot spam check - if filled, it's a bot.
		if ( ! empty( $honeypot ) ) {
			// Security monitoring hook for honeypot spam detection.
			do_action( 'designsetgo_form_spam_detected', $form_id, 'honeypot', $this->get_client_ip() );

			return new WP_Error(
				'spam_detected',
				__( 'Spam submission rejected.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		// Time-based check - submission must be > 3 seconds after page load.
		if ( ! empty( $timestamp ) ) {
			$elapsed = ( time() * 1000 ) - intval( $timestamp );
			if ( $elapsed < 3000 ) {
				// Security monitoring hook for time-based spam detection.
				do_action( 'designsetgo_form_spam_detected', $form_id, 'too_fast', $this->get_client_ip(), array( 'elapsed_ms' => $elapsed ) );

				return new WP_Error(
					'too_fast',
					__( 'Submission too fast. Please try again.', 'designsetgo' ),
					array( 'status' => 429 )
				);
			}
		}

		// Rate limiting check.
		$rate_limit_check = $this->check_rate_limit( $form_id );
		if ( is_wp_error( $rate_limit_check ) ) {
			return $rate_limit_check;
		}

		// Sanitize and validate all fields.
		$sanitized_fields = array();
		foreach ( $fields as $field ) {
			if ( ! isset( $field['name'] ) || ! isset( $field['value'] ) ) {
				continue;
			}

			$field_name  = sanitize_text_field( $field['name'] );
			$field_value = $field['value'];
			$field_type  = isset( $field['type'] ) ? sanitize_text_field( $field['type'] ) : 'text';

			// Type-specific validation.
			$validation_result = $this->validate_field( $field_value, $field_type );
			if ( is_wp_error( $validation_result ) ) {
				// Security monitoring hook for validation failures.
				do_action( 'designsetgo_form_validation_failed', $form_id, $field_name, $field_type, $validation_result->get_error_code(), $this->get_client_ip() );

				return new WP_Error(
					'validation_error',
					sprintf(
						/* translators: %1$s: field name, %2$s: error message */
						__( 'Field "%1$s": %2$s', 'designsetgo' ),
						$field_name,
						$validation_result->get_error_message()
					),
					array( 'status' => 400 )
				);
			}

			// Type-specific sanitization.
			$sanitized_value = $this->sanitize_field( $field_value, $field_type );

			$sanitized_fields[ $field_name ] = array(
				'value' => $sanitized_value,
				'type'  => $field_type,
			);
		}

		// Store submission.
		$submission_id = $this->store_submission( $form_id, $sanitized_fields );

		if ( is_wp_error( $submission_id ) ) {
			return new WP_Error(
				'submission_failed',
				__( 'Failed to save form submission. Please try again.', 'designsetgo' ),
				array( 'status' => 500 )
			);
		}

		// Send email notification if enabled.
		$this->send_email_notification( $request, $form_id, $sanitized_fields, $submission_id );

		// Trigger action hook for email notifications, integrations, etc.
		do_action( 'designsetgo_form_submitted', $submission_id, $form_id, $sanitized_fields );

		return new WP_REST_Response(
			array(
				'success'      => true,
				'message'      => __( 'Form submitted successfully!', 'designsetgo' ),
				'submissionId' => $submission_id,
			),
			200
		);
	}

	/**
	 * Check rate limiting for form submissions.
	 *
	 * @param string $form_id Form ID.
	 * @return true|WP_Error True if allowed, WP_Error if rate limited.
	 */
	private function check_rate_limit( $form_id ) {
		$ip_address = $this->get_client_ip();
		$key        = 'form_submit_' . $form_id . '_' . md5( $ip_address );
		$count      = get_transient( $key );

		// Default rate limit: 3 submissions per 60 seconds.
		$max_submissions = apply_filters( 'designsetgo_form_rate_limit_count', 3, $form_id );
		$time_window     = apply_filters( 'designsetgo_form_rate_limit_window', 60, $form_id );

		if ( false === $count ) {
			// First submission, start tracking.
			set_transient( $key, 1, $time_window );
			return true;
		}

		if ( $count >= $max_submissions ) {
			// Security monitoring hook for rate limit violations.
			do_action( 'designsetgo_form_rate_limit_exceeded', $form_id, $ip_address, $count, $max_submissions );

			return new WP_Error(
				'rate_limit',
				__( 'Too many submissions. Please try again later.', 'designsetgo' ),
				array( 'status' => 429 )
			);
		}

		// Increment count.
		set_transient( $key, $count + 1, $time_window );
		return true;
	}

	/**
	 * Validate field based on type.
	 *
	 * @param mixed  $value Field value.
	 * @param string $type Field type.
	 * @return true|WP_Error True if valid, WP_Error if invalid.
	 */
	private function validate_field( $value, $type ) {
		switch ( $type ) {
			case 'email':
				if ( ! is_email( $value ) ) {
					return new WP_Error(
						'invalid_email',
						__( 'Invalid email address.', 'designsetgo' )
					);
				}
				break;

			case 'url':
				if ( ! filter_var( $value, FILTER_VALIDATE_URL ) ) {
					return new WP_Error(
						'invalid_url',
						__( 'Invalid URL.', 'designsetgo' )
					);
				}
				break;

			case 'number':
				if ( ! is_numeric( $value ) ) {
					return new WP_Error(
						'invalid_number',
						__( 'Invalid number.', 'designsetgo' )
					);
				}
				break;

			case 'tel':
				// Basic phone validation - numbers, spaces, dashes, parentheses, plus.
				if ( ! preg_match( '/^[0-9\s\-\(\)\+]+$/', $value ) ) {
					return new WP_Error(
						'invalid_phone',
						__( 'Invalid phone number.', 'designsetgo' )
					);
				}
				break;
		}

		return true;
	}

	/**
	 * Sanitize field based on type.
	 *
	 * @param mixed  $value Field value.
	 * @param string $type Field type.
	 * @return mixed Sanitized value.
	 */
	private function sanitize_field( $value, $type ) {
		switch ( $type ) {
			case 'email':
				return sanitize_email( $value );

			case 'url':
				return esc_url_raw( $value );

			case 'number':
				return is_numeric( $value ) ? floatval( $value ) : 0;

			case 'tel':
				return preg_replace( '/[^0-9\s\-\(\)\+]/', '', $value );

			case 'textarea':
				return sanitize_textarea_field( $value );

			case 'text':
			default:
				return sanitize_text_field( $value );
		}
	}

	/**
	 * Store form submission as custom post type.
	 *
	 * @param string $form_id Form ID.
	 * @param array  $fields Sanitized fields array.
	 * @return int|WP_Error Post ID on success, WP_Error on failure.
	 */
	private function store_submission( $form_id, $fields ) {
		$post_id = wp_insert_post(
			array(
				'post_type'   => 'dsgo_form_submission',
				'post_status' => 'private',
				'post_title'  => sprintf(
					/* translators: %s: form ID */
					__( 'Form Submission - %s', 'designsetgo' ),
					$form_id
				),
				'post_date'   => current_time( 'mysql' ),
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// Store form data as post meta.
		update_post_meta( $post_id, '_dsg_form_id', $form_id );
		update_post_meta( $post_id, '_dsg_form_fields', $fields );
		update_post_meta( $post_id, '_dsg_submission_ip', $this->get_client_ip() );
		update_post_meta( $post_id, '_dsg_submission_user_agent', $this->get_user_agent() );
		update_post_meta( $post_id, '_dsg_submission_referer', wp_get_referer() );
		update_post_meta( $post_id, '_dsg_submission_date', current_time( 'mysql' ) );

		// Clear cached form submission count.
		delete_transient( 'dsgo_form_submissions_count' );

		return $post_id;
	}

	/**
	 * Get client IP address.
	 *
	 * @return string IP address.
	 */
	private function get_client_ip() {
		$ip_keys = array(
			'HTTP_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'REMOTE_ADDR',
		);

		foreach ( $ip_keys as $key ) {
			if ( ! empty( $_SERVER[ $key ] ) ) {
				$ip = sanitize_text_field( wp_unslash( $_SERVER[ $key ] ) );
				// Handle multiple IPs (take first one).
				if ( strpos( $ip, ',' ) !== false ) {
					$ip = explode( ',', $ip )[0];
				}
				$ip = trim( $ip );
				if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
					return $ip;
				}
			}
		}

		return 'unknown';
	}

	/**
	 * Get user agent string.
	 *
	 * @return string User agent.
	 */
	private function get_user_agent() {
		return isset( $_SERVER['HTTP_USER_AGENT'] )
			? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) )
			: 'unknown';
	}

	/**
	 * Localize script with nonce and REST URL.
	 */
	public function localize_form_script() {
		// Only enqueue if form block is present on the page.
		if ( ! has_block( 'designsetgo/form-builder' ) ) {
			return;
		}

		// Get the form-builder view script handle.
		$asset_file = include DESIGNSETGO_PATH . 'build/blocks/form-builder/view.asset.php';
		$handle     = 'designsetgo-form-builder-view-script';

		// Localize with nonce and REST URL.
		wp_localize_script(
			$handle,
			'designsetgoForm',
			array(
				'nonce'   => wp_create_nonce( 'wp_rest' ),
				'restUrl' => rest_url( 'designsetgo/v1/form/submit' ),
			)
		);
	}

	/**
	 * Send email notification with form submission data.
	 *
	 * @param WP_REST_Request $request Full request object.
	 * @param string          $form_id Form ID.
	 * @param array           $fields Sanitized form fields.
	 * @param int             $submission_id Submission post ID.
	 */
	private function send_email_notification( $request, $form_id, $fields, $submission_id ) {
		// Get email settings from request body.
		$enable_email = $request->get_param( 'enable_email' ) === 'true';

		if ( ! $enable_email ) {
			return;
		}

		// Get and sanitize email parameters (strip newlines to prevent header injection).
		$email_to        = str_replace( array( "\r", "\n", '%0a', '%0d' ), '', $request->get_param( 'email_to' ) );
		$email_subject   = str_replace( array( "\r", "\n", '%0a', '%0d' ), '', $request->get_param( 'email_subject' ) );
		$email_from_name = str_replace( array( "\r", "\n", '%0a', '%0d' ), '', $request->get_param( 'email_from_name' ) );
		$email_from      = str_replace( array( "\r", "\n", '%0a', '%0d' ), '', $request->get_param( 'email_from_email' ) );
		$email_reply_to  = str_replace( array( "\r", "\n", '%0a', '%0d' ), '', $request->get_param( 'email_reply_to' ) );
		$email_body      = $request->get_param( 'email_body' );

		// Set defaults and validate email addresses.
		if ( empty( $email_to ) ) {
			$email_to = get_option( 'admin_email' );
		} else {
			$email_to = sanitize_email( $email_to );
			if ( ! is_email( $email_to ) ) {
				$email_to = get_option( 'admin_email' );
			}
		}

		if ( empty( $email_subject ) ) {
			$email_subject = __( 'New Form Submission', 'designsetgo' );
		}

		if ( empty( $email_from_name ) ) {
			$email_from_name = get_bloginfo( 'name' );
		}

		if ( empty( $email_from ) ) {
			$email_from = get_option( 'admin_email' );
		} else {
			$email_from = sanitize_email( $email_from );
			if ( ! is_email( $email_from ) ) {
				$email_from = get_option( 'admin_email' );
			}
		}

		// Prepare merge tags.
		$current_url = '';
		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$current_url = esc_url_raw(
				home_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) )
			);
		}

		$merge_tags = array(
			'{form_id}'       => $form_id,
			'{submission_id}' => $submission_id,
			'{page_url}'      => $current_url,
			'{site_name}'     => get_bloginfo( 'name' ),
			'{date}'          => current_time( 'mysql' ),
		);

		// Add field values to merge tags.
		foreach ( $fields as $field_name => $field_data ) {
			$merge_tags[ '{' . $field_name . '}' ] = is_array( $field_data ) ? $field_data['value'] : $field_data;
		}

		// Build all_fields list.
		$all_fields_html = '';
		foreach ( $fields as $field_name => $field_data ) {
			$value            = is_array( $field_data ) ? $field_data['value'] : $field_data;
			$label            = ucwords( str_replace( array( '_', '-' ), ' ', $field_name ) );
			$all_fields_html .= sprintf( "<strong>%s:</strong> %s<br>\n", esc_html( $label ), esc_html( $value ) );
		}
		$merge_tags['{all_fields}'] = $all_fields_html;

		// Default email body if empty.
		if ( empty( $email_body ) ) {
			$email_body = __( "New form submission:\n\n{all_fields}\n\nSubmitted from: {page_url}", 'designsetgo' );
		}

		// Replace merge tags in subject and body.
		$email_subject = str_replace( array_keys( $merge_tags ), array_values( $merge_tags ), $email_subject );
		$email_body    = str_replace( array_keys( $merge_tags ), array_values( $merge_tags ), $email_body );

		// Convert line breaks to <br> for HTML email.
		$email_body = nl2br( $email_body );

		// Set up headers.
		$headers = array(
			'Content-Type: text/html; charset=UTF-8',
			sprintf( 'From: %s <%s>', $email_from_name, $email_from ),
		);

		// Add Reply-To if specified and field exists.
		if ( ! empty( $email_reply_to ) && isset( $fields[ $email_reply_to ] ) ) {
			$reply_to_value = is_array( $fields[ $email_reply_to ] ) ? $fields[ $email_reply_to ]['value'] : $fields[ $email_reply_to ];

			// Strip newlines to prevent email header injection.
			$reply_to_value = str_replace( array( "\r", "\n", '%0a', '%0d' ), '', $reply_to_value );
			$reply_to_value = sanitize_email( $reply_to_value );

			if ( is_email( $reply_to_value ) ) {
				$headers[] = sprintf( 'Reply-To: %s', $reply_to_value );
			}
		}

		// Send email.
		wp_mail( $email_to, $email_subject, $email_body, $headers );
	}
}
