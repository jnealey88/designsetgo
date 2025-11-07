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
		enableEmail,
		emailTo,
		emailSubject,
		emailFromName,
		emailFromEmail,
		emailReplyTo,
		emailBody,
	} = attributes;

	// Same classes as edit.js - MUST MATCH
	const formClasses = classnames('dsg-form-builder', {
		[`dsg-form-builder--align-${submitButtonAlignment}`]:
			submitButtonAlignment,
	});

	// Apply form settings as CSS custom properties - MUST MATCH edit.js
	const formStyles = {
		'--dsg-form-field-spacing': fieldSpacing,
		'--dsg-form-input-height': inputHeight,
		'--dsg-form-input-padding': inputPadding,
		'--dsg-form-label-color': fieldLabelColor,
		'--dsg-form-border-color': fieldBorderColor || '#d1d5db',
		'--dsg-form-field-bg': fieldBackgroundColor,
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
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-form__fields',
	});

	return (
		<div {...blockProps}>
			<form className="dsg-form" method="post" noValidate>
				<div {...innerBlocksProps} />

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

				<div className="dsg-form__footer">
					<button
						type="submit"
						className="dsg-form__submit wp-element-button"
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
				</div>

				<div
					className="dsg-form__message"
					role="status"
					aria-live="polite"
					aria-atomic="true"
					style={{ display: 'none' }}
				/>
			</form>
		</div>
	);
}
