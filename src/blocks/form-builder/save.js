/**
 * Form Builder Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormBuilderSave({ attributes }) {
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
		submitButtonPaddingVertical,
		submitButtonPaddingHorizontal,
		submitButtonFontSize,
		submitButtonHeight,
		enableHoneypot,
		enableTurnstile,
		enableEmail,
		emailTo,
		emailSubject,
		emailFromName,
		emailFromEmail,
		emailReplyTo,
		emailBody,
	} = attributes;

	// Same classes as edit.js - MUST MATCH
	const formClasses = classnames('dsgo-form-builder', {
		[`dsgo-form-builder--align-${submitButtonAlignment}`]:
			submitButtonAlignment && submitButtonPosition === 'below',
		'dsgo-form-builder--button-inline': submitButtonPosition === 'inline',
	});

	// Apply form settings as CSS custom properties - MUST MATCH edit.js
	const formStyles = {
		'--dsgo-form-field-spacing': fieldSpacing,
		'--dsgo-form-input-height': inputHeight,
		'--dsgo-form-input-padding': inputPadding,
		'--dsgo-form-label-color': fieldLabelColor,
		'--dsgo-form-border-color': fieldBorderColor || '#d1d5db',
		'--dsgo-form-field-bg': fieldBackgroundColor,
		// Button colors now applied as inline styles on button element
	};

	const blockProps = useBlockProps.save({
		className: formClasses,
		style: formStyles,
		'data-form-id': formId,
		'data-ajax-submit': ajaxSubmit,
		'data-success-message': successMessage,
		'data-error-message': errorMessage,
		'data-submit-text': submitButtonText,
		'data-enable-email': enableEmail,
		'data-email-to': emailTo,
		'data-email-subject': emailSubject,
		'data-email-from-name': emailFromName,
		'data-email-from-email': emailFromEmail,
		'data-email-reply-to': emailReplyTo,
		'data-email-body': emailBody,
		...(enableTurnstile && {
			'data-dsgo-turnstile': 'true',
		}),
	});

	// Extract children from innerBlocksProps so we can add button inside fields container
	const { children, ...innerBlocksPropsWithoutChildren } =
		useInnerBlocksProps.save({
			className: 'dsgo-form__fields',
		});

	return (
		<div {...blockProps}>
			<form className="dsgo-form" method="post" noValidate>
				<div {...innerBlocksPropsWithoutChildren}>
					{children}
					{submitButtonPosition === 'inline' && (
						<button
							type="submit"
							className="dsgo-form__submit dsgo-form__submit--inline wp-element-button"
							style={{
								...(submitButtonColor && {
									color: submitButtonColor,
								}),
								...(submitButtonBackgroundColor && {
									backgroundColor:
										submitButtonBackgroundColor,
								}),
								minHeight: submitButtonHeight,
								paddingTop: submitButtonPaddingVertical,
								paddingBottom: submitButtonPaddingVertical,
								paddingLeft: submitButtonPaddingHorizontal,
								paddingRight: submitButtonPaddingHorizontal,
								...(submitButtonFontSize && {
									fontSize: submitButtonFontSize,
								}),
							}}
						>
							{submitButtonText}
						</button>
					)}
				</div>

				{enableHoneypot && (
					<input
						type="text"
						name="dsg_website"
						value=""
						tabIndex="-1"
						autoComplete="off"
						aria-hidden="true"
						style={{
							position: 'absolute',
							left: '-9999px',
							width: '1px',
							height: '1px',
							overflow: 'hidden',
						}}
					/>
				)}

				<input type="hidden" name="dsg_form_id" value={formId} />

				{/* Timestamp added via JavaScript in view.js to avoid validation errors */}

				{/* Turnstile widget container - rendered by JS */}
				{enableTurnstile && (
					<div
						className="dsgo-turnstile-widget"
						data-dsgo-turnstile-container="true"
					/>
				)}

				{submitButtonPosition === 'below' && (
					<div className="dsgo-form__footer">
						<button
							type="submit"
							className="dsgo-form__submit wp-element-button"
							style={{
								...(submitButtonColor && {
									color: submitButtonColor,
								}),
								...(submitButtonBackgroundColor && {
									backgroundColor:
										submitButtonBackgroundColor,
								}),
								minHeight: submitButtonHeight,
								paddingTop: submitButtonPaddingVertical,
								paddingBottom: submitButtonPaddingVertical,
								paddingLeft: submitButtonPaddingHorizontal,
								paddingRight: submitButtonPaddingHorizontal,
								...(submitButtonFontSize && {
									fontSize: submitButtonFontSize,
								}),
							}}
						>
							{submitButtonText}
						</button>
					</div>
				)}

				<div
					className="dsgo-form__message"
					role="status"
					aria-live="polite"
					aria-atomic="true"
					style={{ display: 'none' }}
				/>
			</form>
		</div>
	);
}
