/**
 * Form Textarea Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormTextareaSave({ attributes }) {
	const {
		fieldName,
		label,
		placeholder,
		helpText,
		required,
		defaultValue,
		rows,
		maxLength,
	} = attributes;

	const fieldClasses = classnames(
		'dsg-form-field',
		'dsg-form-field--textarea'
	);

	const blockProps = useBlockProps.save({
		className: fieldClasses,
	});

	const fieldId = `field-${fieldName}`;

	return (
		<div {...blockProps}>
			<label htmlFor={fieldId} className="dsg-form-field__label">
				{label}
				{required && (
					<span
						className="dsg-form-field__required"
						aria-label="required"
					>
						*
					</span>
				)}
			</label>

			<textarea
				id={fieldId}
				name={fieldName}
				className="dsg-form-field__textarea"
				placeholder={placeholder || undefined}
				required={required || undefined}
				rows={rows}
				maxLength={maxLength > 0 ? maxLength : undefined}
				defaultValue={defaultValue || undefined}
				aria-describedby={helpText ? `${fieldId}-help` : undefined}
				aria-required={required ? 'true' : undefined}
				data-field-type="textarea"
			/>

			{helpText && (
				<p id={`${fieldId}-help`} className="dsg-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
