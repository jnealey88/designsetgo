/**
 * Form Date Field Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormDateFieldSave({ attributes }) {
	const {
		fieldName,
		label,
		helpText,
		required,
		defaultValue,
		minDate,
		maxDate,
	} = attributes;

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--date');

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

			<input
				type="date"
				id={fieldId}
				name={fieldName}
				className="dsg-form-field__input"
				required={required || undefined}
				defaultValue={defaultValue || undefined}
				min={minDate || undefined}
				max={maxDate || undefined}
				aria-describedby={helpText ? `${fieldId}-help` : undefined}
				aria-required={required ? 'true' : undefined}
				data-field-type="date"
			/>

			{helpText && (
				<p id={`${fieldId}-help`} className="dsg-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
