/**
 * Form Select Field Block - Deprecated Versions
 *
 * @since 2.0.32
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

/**
 * Version 2: Before aria-required was added to required fields.
 *
 * The site-designer-api generates HTML without aria-required="true" on
 * required select fields. This deprecation matches that older format.
 */
const v2 = {
	attributes: {
		fieldName: {
			type: 'string',
			default: '',
		},
		label: {
			type: 'string',
			default: 'Select Option',
		},
		helpText: {
			type: 'string',
			default: '',
		},
		required: {
			type: 'boolean',
			default: false,
		},
		options: {
			type: 'array',
			default: [
				{ label: 'Option 1', value: 'option-1' },
				{ label: 'Option 2', value: 'option-2' },
				{ label: 'Option 3', value: 'option-3' },
			],
			items: {
				type: 'object',
				properties: {
					label: { type: 'string' },
					value: { type: 'string' },
				},
			},
		},
		placeholder: {
			type: 'string',
			default: '-- Select an option --',
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
			helpText,
			required,
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
					aria-describedby={helpText ? `${fieldId}-help` : undefined}
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
	},
};

/**
 * Version 1: Original version with defaultValue on <select>.
 *
 * React's defaultValue prop serializes to the non-standard `defaultvalue`
 * HTML attribute, which wp_kses_post() strips. Removed in favour of letting
 * the browser select the first <option> naturally.
 */
const v1 = {
	attributes: {
		fieldName: {
			type: 'string',
			default: '',
		},
		label: {
			type: 'string',
			default: 'Select Option',
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
		options: {
			type: 'array',
			default: [
				{ label: 'Option 1', value: 'option-1' },
				{ label: 'Option 2', value: 'option-2' },
				{ label: 'Option 3', value: 'option-3' },
			],
			items: {
				type: 'object',
				properties: {
					label: { type: 'string' },
					value: { type: 'string' },
				},
			},
		},
		placeholder: {
			type: 'string',
			default: '-- Select an option --',
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
	},

	migrate(attributes) {
		return attributes;
	},
};

export default [v2, v1];
