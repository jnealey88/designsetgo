/**
 * Form Builder Block - Editor Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	RangeControl,
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import classnames from 'classnames';

export default function FormBuilderEdit({
	attributes,
	setAttributes,
	clientId,
}) {
	const {
		formId,
		submitButtonText,
		submitButtonAlignment,
		submitButtonPosition,
		ajaxSubmit,
		successMessage,
		errorMessage,
		fieldSpacing,
		inputHeight,
		inputPadding,
		fieldLabelColor,
		fieldBorderColor,
		fieldBackgroundColor,
		submitButtonColor,
		submitButtonBackgroundColor,
		enableHoneypot,
		enableRateLimit,
		rateLimitCount,
		rateLimitWindow,
		enableEmail,
		emailTo,
		emailSubject,
		emailFromName,
		emailFromEmail,
		emailReplyTo,
		emailBody,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Generate unique formId on mount
	useEffect(() => {
		if (!formId) {
			setAttributes({ formId: clientId.substring(0, 8) });
		}
	}, [formId, clientId, setAttributes]);

	// Calculate classes
	const formClasses = classnames('dsg-form-builder', {
		[`dsg-form-builder--align-${submitButtonAlignment}`]:
			submitButtonAlignment && submitButtonPosition === 'below',
		'dsg-form-builder--button-inline': submitButtonPosition === 'inline',
	});

	// Apply form settings as CSS custom properties
	const formStyles = {
		'--dsg-form-field-spacing': fieldSpacing,
		'--dsg-form-input-height': inputHeight,
		'--dsg-form-input-padding': inputPadding,
		'--dsg-form-label-color': fieldLabelColor,
		'--dsg-form-border-color': fieldBorderColor || '#d1d5db',
		'--dsg-form-field-bg': fieldBackgroundColor,
		// Button colors now applied as inline styles on button element
	};

	const blockProps = useBlockProps({
		className: formClasses,
		style: formStyles,
		'data-form-id': formId,
	});

	// Inner blocks for form fields
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-form__fields',
		},
		{
			allowedBlocks: [
				'designsetgo/form-text-field',
				'designsetgo/form-email-field',
				'designsetgo/form-textarea',
				'designsetgo/form-number-field',
				'designsetgo/form-phone-field',
				'designsetgo/form-url-field',
				'designsetgo/form-date-field',
				'designsetgo/form-time-field',
				'designsetgo/form-select-field',
				'designsetgo/form-checkbox',
				'designsetgo/form-hidden-field',
			],
			template: [
				[
					'designsetgo/form-text-field',
					{
						label: __('Name', 'designsetgo'),
						fieldName: 'name',
						required: true,
					},
				],
				[
					'designsetgo/form-email-field',
					{
						label: __('Email', 'designsetgo'),
						fieldName: 'email',
						required: true,
					},
				],
				[
					'designsetgo/form-textarea',
					{
						label: __('Message', 'designsetgo'),
						fieldName: 'message',
					},
				],
			],
			orientation: 'vertical',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Form Settings', 'designsetgo')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('AJAX Submit', 'designsetgo')}
						checked={ajaxSubmit}
						onChange={(value) =>
							setAttributes({ ajaxSubmit: value })
						}
						help={__(
							'Submit form without page reload',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Submit Button Text', 'designsetgo')}
						value={submitButtonText}
						onChange={(value) =>
							setAttributes({ submitButtonText: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Button Position', 'designsetgo')}
						value={submitButtonPosition}
						options={[
							{
								label: __('Below fields', 'designsetgo'),
								value: 'below',
							},
							{
								label: __(
									'Inline with last field',
									'designsetgo'
								),
								value: 'inline',
							},
						]}
						onChange={(value) =>
							setAttributes({ submitButtonPosition: value })
						}
						help={__(
							'Place button below all fields or inline with the last field (useful for subscribe forms)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{submitButtonPosition === 'below' && (
						<SelectControl
							label={__('Button Alignment', 'designsetgo')}
							value={submitButtonAlignment}
							options={[
								{
									label: __('Left', 'designsetgo'),
									value: 'left',
								},
								{
									label: __('Center', 'designsetgo'),
									value: 'center',
								},
								{
									label: __('Right', 'designsetgo'),
									value: 'right',
								},
							]}
							onChange={(value) =>
								setAttributes({ submitButtonAlignment: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<UnitControl
						label={__('Field Spacing', 'designsetgo')}
						value={fieldSpacing}
						onChange={(value) =>
							setAttributes({ fieldSpacing: value || '1.5rem' })
						}
						units={[
							{ value: 'px', label: 'px', default: 24 },
							{ value: 'rem', label: 'rem', default: 1.5 },
							{ value: 'em', label: 'em', default: 1.5 },
						]}
						min={0}
						max={100}
						help={__('Space between form fields', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Input Height', 'designsetgo')}
						value={inputHeight}
						onChange={(value) =>
							setAttributes({ inputHeight: value || '44px' })
						}
						units={[
							{ value: 'px', label: 'px', default: 44 },
							{ value: 'rem', label: 'rem', default: 2.75 },
							{ value: 'em', label: 'em', default: 2.75 },
						]}
						min={28}
						max={200}
						help={__(
							'Minimum height for input fields',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Input Padding', 'designsetgo')}
						value={inputPadding}
						onChange={(value) =>
							setAttributes({ inputPadding: value || '0.75rem' })
						}
						units={[
							{ value: 'px', label: 'px', default: 12 },
							{ value: 'rem', label: 'rem', default: 0.75 },
							{ value: 'em', label: 'em', default: 0.75 },
						]}
						min={0}
						max={50}
						help={__('Padding inside input fields', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Messages', 'designsetgo')}
					initialOpen={false}
				>
					<TextareaControl
						label={__('Success Message', 'designsetgo')}
						value={successMessage}
						onChange={(value) =>
							setAttributes({ successMessage: value })
						}
						help={__(
							'Message shown after successful submission',
							'designsetgo'
						)}
						rows={3}
						__nextHasNoMarginBottom
					/>

					<TextareaControl
						label={__('Error Message', 'designsetgo')}
						value={errorMessage}
						onChange={(value) =>
							setAttributes({ errorMessage: value })
						}
						help={__(
							'Message shown if submission fails',
							'designsetgo'
						)}
						rows={3}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Spam Protection', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Honeypot', 'designsetgo')}
						checked={enableHoneypot}
						onChange={(value) =>
							setAttributes({ enableHoneypot: value })
						}
						help={__(
							'Invisible field to catch spam bots',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Enable Rate Limiting', 'designsetgo')}
						checked={enableRateLimit}
						onChange={(value) =>
							setAttributes({ enableRateLimit: value })
						}
						help={__(
							'Limit submissions per IP address',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					{enableRateLimit && (
						<>
							<RangeControl
								label={__('Max Submissions', 'designsetgo')}
								value={rateLimitCount}
								onChange={(value) =>
									setAttributes({ rateLimitCount: value })
								}
								min={1}
								max={10}
								help={__(
									'Maximum submissions allowed per time window',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<RangeControl
								label={__(
									'Time Window (seconds)',
									'designsetgo'
								)}
								value={rateLimitWindow}
								onChange={(value) =>
									setAttributes({ rateLimitWindow: value })
								}
								min={30}
								max={300}
								step={30}
								help={__(
									'Time period for rate limiting',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>

				<PanelBody
					title={__('Email Notifications', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Email Notifications', 'designsetgo')}
						checked={enableEmail}
						onChange={(value) =>
							setAttributes({ enableEmail: value })
						}
						help={__(
							'Send email when form is submitted',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					{enableEmail && (
						<>
							<TextControl
								label={__('Recipient Email', 'designsetgo')}
								value={emailTo}
								onChange={(value) =>
									setAttributes({ emailTo: value })
								}
								type="email"
								placeholder="admin@example.com"
								help={__(
									'Email address to receive notifications',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<TextControl
								label={__('Email Subject', 'designsetgo')}
								value={emailSubject}
								onChange={(value) =>
									setAttributes({ emailSubject: value })
								}
								help={__(
									'Subject line for notification emails. Use {field_name} for dynamic values.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<TextControl
								label={__('From Name', 'designsetgo')}
								value={emailFromName}
								onChange={(value) =>
									setAttributes({ emailFromName: value })
								}
								placeholder={__('Site Name', 'designsetgo')}
								help={__(
									'Name shown as email sender (leave empty for site name)',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<TextControl
								label={__('From Email', 'designsetgo')}
								value={emailFromEmail}
								onChange={(value) =>
									setAttributes({ emailFromEmail: value })
								}
								type="email"
								placeholder="wordpress@example.com"
								help={__(
									'Email address shown as sender (leave empty for admin email)',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<TextControl
								label={__('Reply-To Field Name', 'designsetgo')}
								value={emailReplyTo}
								onChange={(value) =>
									setAttributes({ emailReplyTo: value })
								}
								placeholder="email"
								help={__(
									'Use a form field value for reply-to (e.g., "email" or "user_email")',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<TextareaControl
								label={__('Email Body Template', 'designsetgo')}
								value={emailBody}
								onChange={(value) =>
									setAttributes({ emailBody: value })
								}
								placeholder={
									__('New form submission:', 'designsetgo') +
									'\n\n{all_fields}\n\n' +
									__(
										'Submitted from: {page_url}',
										'designsetgo'
									)
								}
								help={__(
									'Email content template. Use {field_name} for specific fields or {all_fields} for all submitted data.',
									'designsetgo'
								)}
								rows={5}
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Form Colors', 'designsetgo')}
					settings={[
						{
							label: __('Label Color', 'designsetgo'),
							colorValue: fieldLabelColor,
							onColorChange: (color) =>
								setAttributes({ fieldLabelColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Border Color', 'designsetgo'),
							colorValue: fieldBorderColor,
							onColorChange: (color) =>
								setAttributes({
									fieldBorderColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Field Background', 'designsetgo'),
							colorValue: fieldBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									fieldBackgroundColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Button Text Color', 'designsetgo'),
							colorValue: submitButtonColor,
							onColorChange: (color) =>
								setAttributes({
									submitButtonColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Button Background Color', 'designsetgo'),
							colorValue: submitButtonBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									submitButtonBackgroundColor: color || '',
								}),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />

				{submitButtonPosition === 'inline' && (
					<button
						type="button"
						className="dsg-form__submit dsg-form__submit--inline wp-element-button"
						disabled
						style={{
							...(submitButtonColor && {
								color: submitButtonColor,
							}),
							...(submitButtonBackgroundColor && {
								backgroundColor: submitButtonBackgroundColor,
							}),
						}}
					>
						{submitButtonText}
					</button>
				)}

				{submitButtonPosition === 'below' && (
					<div className="dsg-form__footer">
						<button
							type="button"
							className="dsg-form__submit wp-element-button"
							disabled
							style={{
								...(submitButtonColor && {
									color: submitButtonColor,
								}),
								...(submitButtonBackgroundColor && {
									backgroundColor:
										submitButtonBackgroundColor,
								}),
							}}
						>
							{submitButtonText}
						</button>
					</div>
				)}

				<div
					className="dsg-form__message dsg-form__message--editor"
					style={{ display: 'none' }}
				>
					{__('Form messages will appear here', 'designsetgo')}
				</div>
			</div>
		</>
	);
}
