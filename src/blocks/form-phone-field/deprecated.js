/**
 * Form Phone Field Block - Deprecated Versions
 *
 * Newest → oldest. WordPress tries each in order until one matches.
 *
 * @since 2.0.32
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

/**
 * Shared attributes definition for all deprecated versions.
 * All versions share the same attribute schema.
 */
const sharedAttributes = {
	fieldName: {
		type: 'string',
		default: '',
	},
	label: {
		type: 'string',
		default: 'Phone Number',
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
	phoneFormat: {
		type: 'string',
		default: 'any',
		enum: ['any', 'us', 'international'],
	},
	showCountryCode: {
		type: 'boolean',
		default: true,
	},
	countryCode: {
		type: 'string',
		default: '+1',
	},
	autoFormat: {
		type: 'boolean',
		default: true,
	},
	fieldWidth: {
		type: 'string',
		default: '100',
	},
};

/**
 * Shared helper: build blockProps for save.
 * @param {string} fieldWidth
 */
function getSaveBlockProps(fieldWidth) {
	return useBlockProps.save({
		className: classnames('dsgo-form-field', 'dsgo-form-field--phone'),
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
}

/**
 * Shared helper: get phone pattern.
 * @param {string} phoneFormat
 */
function getPattern(phoneFormat) {
	switch (phoneFormat) {
		case 'us':
			return '[0-9]{3}-[0-9]{3}-[0-9]{4}';
		case 'international':
			return '\\+[0-9]{1,3}[0-9\\s\\-]{4,14}';
		default:
			return undefined;
	}
}

/**
 * Shared helper: get placeholder.
 * @param {string} placeholder
 * @param {string} phoneFormat
 */
function getPlaceholderText(placeholder, phoneFormat) {
	if (placeholder) {
		return placeholder;
	}
	switch (phoneFormat) {
		case 'us':
			return '555-123-4567';
		case 'international':
			return '+1 555 123 4567';
		default:
			return '';
	}
}

/**
 * Version 2: Used `selected` attribute on individual <option> elements
 * instead of defaultValue on <select>. Still hardcoded 13 country codes
 * as <option> children.
 *
 * Replaced by empty <select> with data-dsgo-country-code; options are
 * now populated by view.js at runtime.
 */
const v2 = {
	attributes: sharedAttributes,

	save({ attributes }) {
		const {
			fieldName,
			label,
			placeholder,
			helpText,
			required,
			defaultValue,
			phoneFormat,
			showCountryCode,
			countryCode,
			autoFormat,
			fieldWidth,
		} = attributes;

		const blockProps = getSaveBlockProps(fieldWidth);
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

				<div
					className="dsgo-form-field__phone-wrapper"
					style={{ display: 'flex', gap: '0.5rem' }}
					data-auto-format={autoFormat}
				>
					{showCountryCode && (
						<select
							name={`${fieldName}_country_code`}
							className="dsgo-form-field__country-code"
							style={{ minWidth: '85px', flexShrink: 0 }}
							aria-label="Country Code"
						>
							<option value="+1" selected={countryCode === '+1'}>
								+1 (US/Canada)
							</option>
							<option
								value="+44"
								selected={countryCode === '+44'}
							>
								+44 (UK)
							</option>
							<option
								value="+61"
								selected={countryCode === '+61'}
							>
								+61 (Australia)
							</option>
							<option
								value="+33"
								selected={countryCode === '+33'}
							>
								+33 (France)
							</option>
							<option
								value="+49"
								selected={countryCode === '+49'}
							>
								+49 (Germany)
							</option>
							<option
								value="+81"
								selected={countryCode === '+81'}
							>
								+81 (Japan)
							</option>
							<option
								value="+86"
								selected={countryCode === '+86'}
							>
								+86 (China)
							</option>
							<option
								value="+91"
								selected={countryCode === '+91'}
							>
								+91 (India)
							</option>
							<option value="+7" selected={countryCode === '+7'}>
								+7 (Russia)
							</option>
							<option
								value="+34"
								selected={countryCode === '+34'}
							>
								+34 (Spain)
							</option>
							<option
								value="+39"
								selected={countryCode === '+39'}
							>
								+39 (Italy)
							</option>
							<option
								value="+52"
								selected={countryCode === '+52'}
							>
								+52 (Mexico)
							</option>
							<option
								value="+55"
								selected={countryCode === '+55'}
							>
								+55 (Brazil)
							</option>
						</select>
					)}
					<input
						type="tel"
						id={fieldId}
						name={fieldName}
						className="dsgo-form-field__input"
						placeholder={getPlaceholderText(
							placeholder,
							phoneFormat
						)}
						required={required || undefined}
						defaultValue={defaultValue || undefined}
						pattern={getPattern(phoneFormat)}
						aria-describedby={
							helpText ? `${fieldId}-help` : undefined
						}
						aria-required={required ? 'true' : undefined}
						data-field-type="tel"
						data-phone-format={phoneFormat}
						style={{ flex: 1 }}
					/>
				</div>

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

/**
 * Version 1: Original version with defaultValue on country code <select>.
 *
 * React's defaultValue prop serializes to the non-standard `defaultvalue`
 * HTML attribute, which wp_kses_post() strips. Replaced in v2 with the
 * standard `selected` attribute on individual <option> elements.
 */
const v1 = {
	attributes: sharedAttributes,

	save({ attributes }) {
		const {
			fieldName,
			label,
			placeholder,
			helpText,
			required,
			defaultValue,
			phoneFormat,
			showCountryCode,
			countryCode,
			autoFormat,
			fieldWidth,
		} = attributes;

		const blockProps = getSaveBlockProps(fieldWidth);
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

				<div
					className="dsgo-form-field__phone-wrapper"
					style={{ display: 'flex', gap: '0.5rem' }}
					data-auto-format={autoFormat}
				>
					{showCountryCode && (
						<select
							name={`${fieldName}_country_code`}
							className="dsgo-form-field__country-code"
							defaultValue={countryCode}
							style={{ minWidth: '85px', flexShrink: 0 }}
							aria-label="Country Code"
						>
							<option value="+1">+1 (US/Canada)</option>
							<option value="+44">+44 (UK)</option>
							<option value="+61">+61 (Australia)</option>
							<option value="+33">+33 (France)</option>
							<option value="+49">+49 (Germany)</option>
							<option value="+81">+81 (Japan)</option>
							<option value="+86">+86 (China)</option>
							<option value="+91">+91 (India)</option>
							<option value="+7">+7 (Russia)</option>
							<option value="+34">+34 (Spain)</option>
							<option value="+39">+39 (Italy)</option>
							<option value="+52">+52 (Mexico)</option>
							<option value="+55">+55 (Brazil)</option>
						</select>
					)}
					<input
						type="tel"
						id={fieldId}
						name={fieldName}
						className="dsgo-form-field__input"
						placeholder={getPlaceholderText(
							placeholder,
							phoneFormat
						)}
						required={required || undefined}
						defaultValue={defaultValue || undefined}
						pattern={getPattern(phoneFormat)}
						aria-describedby={
							helpText ? `${fieldId}-help` : undefined
						}
						aria-required={required ? 'true' : undefined}
						data-field-type="tel"
						data-phone-format={phoneFormat}
						style={{ flex: 1 }}
					/>
				</div>

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
