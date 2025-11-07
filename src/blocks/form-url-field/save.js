/**
 * Form URL Field Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormURLFieldSave({ attributes }) {
	const { fieldName, label, placeholder, helpText, required, defaultValue } =
		attributes;

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--url');

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
				type="url"
				id={fieldId}
				name={fieldName}
				className="dsg-form-field__input"
				placeholder={placeholder || undefined}
				required={required || undefined}
				defaultValue={defaultValue || undefined}
				aria-describedby={helpText ? `${fieldId}-help` : undefined}
				aria-required={required ? 'true' : undefined}
				data-field-type="url"
			/>

			{helpText && (
				<p id={`${fieldId}-help`} className="dsg-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
