/**
 * Form File Upload Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormFileUploadSave({ attributes }) {
	const {
		fieldName,
		label,
		helpText,
		required,
		acceptedFileTypes,
		multiple,
	} = attributes;
	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--file');
	const blockProps = useBlockProps.save({ className: fieldClasses });
	const fieldId = `field-${fieldName}`;

	return (
		<div {...blockProps}>
			<label htmlFor={fieldId} className="dsg-form-field__label">
				{label}
				{required && (
					<span className="dsg-form-field__required">*</span>
				)}
			</label>
			<input
				type="file"
				id={fieldId}
				name={fieldName}
				className="dsg-form-field__input"
				required={required || undefined}
				accept={acceptedFileTypes || undefined}
				multiple={multiple || undefined}
				aria-describedby={helpText ? `${fieldId}-help` : undefined}
				data-field-type="file"
			/>
			{helpText && (
				<p id={`${fieldId}-help`} className="dsg-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
