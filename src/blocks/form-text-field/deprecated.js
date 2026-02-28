/**
 * Form Text Field Block - Deprecated Versions
 *
 * Handles backward compatibility for blocks saved without aria-required.
 *
 * @since 2.0.34
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

/**
 * Version 1: Before aria-required was added to required fields.
 *
 * The site-designer-api generates HTML without aria-required="true" on
 * required input fields. This deprecation matches that older format.
 */
const v1 = {
	attributes: {
		fieldName: {
			type: 'string',
			default: '',
		},
		label: {
			type: 'string',
			default: 'Text Field',
		},
		placeholder: {
			type: 'string',
			default: '',
		},
		helpText: {
			type: 'string',
			default: '',
		},
		required: {
			type: 'boolean',
			default: false,
		},
		defaultValue: {
			type: 'string',
			default: '',
		},
		minLength: {
			type: 'number',
			default: 0,
		},
		maxLength: {
			type: 'number',
			default: 0,
		},
		validation: {
			type: 'string',
			default: 'none',
		},
		validationPattern: {
			type: 'string',
			default: '',
		},
		validationMessage: {
			type: 'string',
			default: '',
		},
		fieldWidth: {
			type: 'string',
			default: '100',
		},
	},

	save({ attributes }) {
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

		const fieldClasses = classnames(
			'dsgo-form-field',
			'dsgo-form-field--text'
		);

		const blockProps = useBlockProps.save({
			className: fieldClasses,
			style: {
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
					data-field-type="text"
				/>

				{helpText && (
					<p id={`${fieldId}-help`} className="dsgo-form-field__help">
						{helpText}
					</p>
				)}
			</div>
		);
	},
};

export default [v1];
