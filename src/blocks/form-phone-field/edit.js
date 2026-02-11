/**
 * Form Phone Field Block - Edit Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import classnames from 'classnames';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

export default function FormPhoneFieldEdit({
	attributes,
	setAttributes,
	clientId,
	context,
}) {
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

	// Generate field name from clientId if empty
	if (!fieldName) {
		setAttributes({ fieldName: `phone-${clientId.slice(0, 8)}` });
	}

	// Get context values from parent form
	const fieldLabelColor = context['designsetgo/form/fieldLabelColor'];
	const fieldBorderColor = context['designsetgo/form/fieldBorderColor'];
	const fieldBackgroundColor =
		context['designsetgo/form/fieldBackgroundColor'];

	const fieldClasses = classnames(
		'dsgo-form-field',
		'dsgo-form-field--phone'
	);

	const fieldStyles = {
		'--dsgo-field-label-color': convertPresetToCSSVar(fieldLabelColor),
		'--dsgo-field-border-color': convertPresetToCSSVar(fieldBorderColor),
		'--dsgo-form-field-bg': convertPresetToCSSVar(fieldBackgroundColor),
	};

	const blockProps = useBlockProps({
		className: fieldClasses,
		style: {
			...fieldStyles,
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
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Field Settings', 'designsetgo')}
					initialOpen={true}
				>
					<TextControl
						label={__('Field Name', 'designsetgo')}
						value={fieldName}
						onChange={(value) =>
							setAttributes({
								fieldName: value.replace(/[^a-z0-9_-]/gi, ''),
							})
						}
						help={__(
							'Unique identifier for this field (letters, numbers, hyphens, underscores only)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Label', 'designsetgo')}
						value={label}
						onChange={(value) => setAttributes({ label: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Required', 'designsetgo')}
						checked={required}
						onChange={(value) => setAttributes({ required: value })}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Field Width', 'designsetgo')}
						value={fieldWidth}
						options={[
							{
								label: __('Full Width (100%)', 'designsetgo'),
								value: '100',
							},
							{
								label: __('Half Width (50%)', 'designsetgo'),
								value: '50',
							},
							{
								label: __('One Third (33%)', 'designsetgo'),
								value: '33',
							},
							{
								label: __('Two Thirds (66%)', 'designsetgo'),
								value: '66',
							},
							{
								label: __('One Quarter (25%)', 'designsetgo'),
								value: '25',
							},
							{
								label: __(
									'Three Quarters (75%)',
									'designsetgo'
								),
								value: '75',
							},
						]}
						onChange={(value) =>
							setAttributes({ fieldWidth: value })
						}
						help={__(
							'Set field width to create multi-column layouts',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Phone Format', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Format', 'designsetgo')}
						value={phoneFormat}
						options={[
							{
								label: __('Any Format', 'designsetgo'),
								value: 'any',
							},
							{
								label: __(
									'US Format (555–123–4567)',
									'designsetgo'
								),
								value: 'us',
							},
							{
								label: __(
									'International (+1 555 123 4567)',
									'designsetgo'
								),
								value: 'international',
							},
						]}
						onChange={(value) =>
							setAttributes({ phoneFormat: value })
						}
						help={__(
							'Choose how phone numbers should be formatted',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Country Code', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show Country Code Selector', 'designsetgo')}
						checked={showCountryCode}
						onChange={(value) =>
							setAttributes({ showCountryCode: value })
						}
						help={__(
							'Display a dropdown for selecting country code',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>

					{showCountryCode && (
						<SelectControl
							label={__('Default Country Code', 'designsetgo')}
							value={countryCode}
							options={[
								{ label: '+1 (US/Canada)', value: '+1' },
								{ label: '+44 (UK)', value: '+44' },
								{ label: '+61 (Australia)', value: '+61' },
								{ label: '+33 (France)', value: '+33' },
								{ label: '+49 (Germany)', value: '+49' },
								{ label: '+81 (Japan)', value: '+81' },
								{ label: '+86 (China)', value: '+86' },
								{ label: '+91 (India)', value: '+91' },
								{ label: '+7 (Russia)', value: '+7' },
								{ label: '+34 (Spain)', value: '+34' },
								{ label: '+39 (Italy)', value: '+39' },
								{ label: '+52 (Mexico)', value: '+52' },
								{ label: '+55 (Brazil)', value: '+55' },
							]}
							onChange={(value) =>
								setAttributes({ countryCode: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<ToggleControl
						label={__('Auto-Format Phone Number', 'designsetgo')}
						checked={autoFormat}
						onChange={(value) =>
							setAttributes({ autoFormat: value })
						}
						help={__(
							'Automatically format phone number as user types',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Additional Options', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('Placeholder', 'designsetgo')}
						value={placeholder}
						onChange={(value) =>
							setAttributes({ placeholder: value })
						}
						help={__(
							'Example text shown when field is empty',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Default Value', 'designsetgo')}
						value={defaultValue}
						onChange={(value) =>
							setAttributes({ defaultValue: value })
						}
						help={__(
							'Pre-filled value for this field',
							'designsetgo'
						)}
						type="tel"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Help Text', 'designsetgo')}
						value={helpText}
						onChange={(value) => setAttributes({ helpText: value })}
						help={__(
							'Additional guidance shown below the field',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

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
				>
					{showCountryCode && (
						<select
							className="dsgo-form-field__country-code"
							defaultValue={countryCode}
							disabled
							style={{ minWidth: '85px', flexShrink: 0 }}
						>
							<option value="+1">+1</option>
							<option value="+44">+44</option>
							<option value="+61">+61</option>
							<option value="+33">+33</option>
							<option value="+49">+49</option>
							<option value="+81">+81</option>
							<option value="+86">+86</option>
							<option value="+91">+91</option>
							<option value="+7">+7</option>
							<option value="+34">+34</option>
							<option value="+39">+39</option>
							<option value="+52">+52</option>
							<option value="+55">+55</option>
						</select>
					)}
					<input
						type="tel"
						id={fieldId}
						className="dsgo-form-field__input"
						placeholder={getPlaceholder()}
						defaultValue={defaultValue || undefined}
						pattern={getPattern()}
						aria-describedby={
							helpText ? `${fieldId}-help` : undefined
						}
						disabled
						style={{ flex: 1 }}
					/>
				</div>

				{helpText && (
					<p id={`${fieldId}-help`} className="dsgo-form-field__help">
						{helpText}
					</p>
				)}
			</div>
		</>
	);
}
