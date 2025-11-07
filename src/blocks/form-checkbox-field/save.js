/**
 * Form Checkbox Field Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormCheckboxFieldSave({ attributes }) {
	const {
		fieldName,
		label,
		helpText,
		required,
		checkedByDefault,
		value,
	} = attributes;

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--checkbox');

	const blockProps = useBlockProps.save({
		className: fieldClasses,
	});

	const fieldId = `field-${fieldName}`;

	return (
		<div {...blockProps}>
			<div className="dsg-form-field__checkbox-wrapper">
				<input
					type="checkbox"
					id={fieldId}
					name={fieldName}
					className="dsg-form-field__checkbox-input"
					value={value}
					defaultChecked={checkedByDefault || undefined}
					required={required || undefined}
					aria-describedby={helpText ? `${fieldId}-help` : undefined}
					aria-required={required ? 'true' : undefined}
					data-field-type="checkbox"
				/>
				<label htmlFor={fieldId} className="dsg-form-field__checkbox-label">
					<RichText.Content tagName="span" value={label} />
					{required && <span className="dsg-form-field__required" aria-label="required"> *</span>}
				</label>
			</div>

			{helpText && (
				<p id={`${fieldId}-help`} className="dsg-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
