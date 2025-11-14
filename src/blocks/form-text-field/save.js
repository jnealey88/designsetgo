/**
 * Form Text Field Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormTextFieldSave({ attributes }) {
	const {
		fieldName,
		label,
		placeholder,
		helpText,
		required,
		defaultValue,
		minLength,
		maxLength,
		validation,
		validationPattern,
		validationMessage,
		fieldWidth,
	} = attributes;

	const fieldClasses = classnames('dsgo-form-field', 'dsgo-form-field--text');

	const blockProps = useBlockProps.save({
		className: fieldClasses,
		style: {
			// Use flex-basis with calc to account for gap between fields
			flexBasis:
				fieldWidth === '100'
					? '100%'
					: `calc(${fieldWidth}% - var(--dsgo-form-field-spacing, 1.5rem) / 2)`,
			maxWidth:
				fieldWidth === '100'
					? '100%'
					: `calc(${fieldWidth}% - var(--dsgo-form-field-spacing, 1.5rem) / 2)`,
		},
	});

	// Get validation pattern based on validation type
	const getValidationPattern = () => {
		switch (validation) {
			case 'letters':
				return '[A-Za-z\\s]+';
			case 'numbers':
				return '[0-9]+';
			case 'alphanumeric':
				return '[A-Za-z0-9]+';
			case 'custom':
				return validationPattern;
			default:
				return null;
		}
	};

	const pattern = getValidationPattern();
	const fieldId = `field-${fieldName}`;

	return (
		<div {...blockProps}>
			<label htmlFor={fieldId} className="dsgo-form-field__label">
				{label}
				{required && (
					<span
						className="dsgo-form-field__required"
						aria-label="required"
					>
						*
					</span>
				)}
			</label>

			<input
				type="text"
				id={fieldId}
				name={fieldName}
				className="dsgo-form-field__input"
				placeholder={placeholder || undefined}
				required={required || undefined}
				minLength={minLength > 0 ? minLength : undefined}
				maxLength={maxLength > 0 ? maxLength : undefined}
				pattern={pattern || undefined}
				title={validationMessage || undefined}
				defaultValue={defaultValue || undefined}
				aria-describedby={helpText ? `${fieldId}-help` : undefined}
				aria-required={required ? 'true' : undefined}
				data-field-type="text"
			/>

			{helpText && (
				<p id={`${fieldId}-help`} className="dsgo-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
