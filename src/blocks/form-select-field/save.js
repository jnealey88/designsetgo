/**
 * Form Select Field Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormSelectFieldSave({ attributes }) {
	const {
		fieldName,
		label,
		helpText,
		required,
		defaultValue,
		options,
		placeholder,
		fieldWidth,
	} = attributes;

	const fieldClasses = classnames(
		'dsgo-form-field',
		'dsgo-form-field--select'
	);

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

			<select
				id={fieldId}
				name={fieldName}
				className="dsgo-form-field__select"
				required={required || undefined}
				defaultValue={defaultValue || ''}
				aria-describedby={helpText ? `${fieldId}-help` : undefined}
				aria-required={required ? 'true' : undefined}
				data-field-type="select"
			>
				{placeholder && <option value="">{placeholder}</option>}
				{options.map((option, index) => (
					<option key={index} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{helpText && (
				<p id={`${fieldId}-help`} className="dsgo-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
