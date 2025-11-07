/**
 * Form Phone Field Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function FormPhoneFieldSave({ attributes }) {
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

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--phone');

	const blockProps = useBlockProps.save({
		className: fieldClasses,
		style: {
			width: `${fieldWidth}%`,
		},
	});

	const fieldId = `field-${fieldName}`;

	// Get pattern based on phone format
	const getPattern = () => {
		switch (phoneFormat) {
			case 'us':
				return '[0-9]{3}-[0-9]{3}-[0-9]{4}';
			case 'international':
				return '\\+[0-9]{1,3}[0-9\\s\\-]{4,14}';
			default:
				return undefined;
		}
	};

	// Get placeholder based on format
	const getPlaceholder = () => {
		if (placeholder) return placeholder;

		switch (phoneFormat) {
			case 'us':
				return '555-123-4567';
			case 'international':
				return '+1 555 123 4567';
			default:
				return '';
		}
	};

	return (
		<div {...blockProps}>
			<label htmlFor={fieldId} className="dsg-form-field__label">
				{label}
				{required && <span className="dsg-form-field__required" aria-label="required">*</span>}
			</label>

			<div
				className="dsg-form-field__phone-wrapper"
				style={{ display: 'flex', gap: '0.5rem' }}
				data-auto-format={autoFormat}
			>
				{showCountryCode && (
					<select
						name={`${fieldName}_country_code`}
						className="dsg-form-field__country-code"
						defaultValue={countryCode}
						style={{ width: '100px', flexShrink: 0 }}
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
					className="dsg-form-field__input"
					placeholder={getPlaceholder()}
					required={required || undefined}
					defaultValue={defaultValue || undefined}
					pattern={getPattern()}
					aria-describedby={helpText ? `${fieldId}-help` : undefined}
					aria-required={required ? 'true' : undefined}
					data-field-type="tel"
					data-phone-format={phoneFormat}
					style={{ flex: 1 }}
				/>
			</div>

			{helpText && (
				<p id={`${fieldId}-help`} className="dsg-form-field__help">
					{helpText}
				</p>
			)}
		</div>
	);
}
