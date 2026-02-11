/**
 * Form Textarea Block - Editor Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import classnames from 'classnames';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

export default function FormTextareaEdit({
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
		rows,
		maxLength,
		fieldWidth,
	} = attributes;

	// Generate unique field name on mount if not set
	useEffect(() => {
		if (!fieldName) {
			setAttributes({ fieldName: `field_${clientId.substring(0, 8)}` });
		}
	}, [fieldName, clientId, setAttributes]);

	// Get context values from parent form
	const fieldLabelColor = context['designsetgo/form/fieldLabelColor'];
	const fieldBorderColor = context['designsetgo/form/fieldBorderColor'];
	const fieldBackgroundColor =
		context['designsetgo/form/fieldBackgroundColor'];

	const fieldClasses = classnames(
		'dsgo-form-field',
		'dsgo-form-field--textarea'
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
								fieldName: value.replace(/[^a-z0-9_]/g, '_'),
							})
						}
						help={__(
							'Unique identifier for this field',
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

					<TextControl
						label={__('Placeholder', 'designsetgo')}
						value={placeholder}
						onChange={(value) =>
							setAttributes({ placeholder: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextareaControl
						label={__('Help Text', 'designsetgo')}
						value={helpText}
						onChange={(value) => setAttributes({ helpText: value })}
						rows={2}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Required Field', 'designsetgo')}
						checked={required}
						onChange={(value) => setAttributes({ required: value })}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Rows', 'designsetgo')}
						value={rows}
						onChange={(value) => setAttributes({ rows: value })}
						min={2}
						max={20}
						help={__(
							'Height of the textarea in rows',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Maximum Length', 'designsetgo')}
						value={maxLength}
						onChange={(value) =>
							setAttributes({ maxLength: value })
						}
						min={0}
						max={5000}
						step={50}
						help={__(
							'Maximum characters allowed (0 = no limit)',
							'designsetgo'
						)}
						__next40pxDefaultSize
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
			</InspectorControls>

			<div {...blockProps}>
				<label
					htmlFor={`field-${clientId}`}
					className="dsgo-form-field__label"
				>
					{label}
					{required && (
						<span className="dsgo-form-field__required">*</span>
					)}
				</label>

				<textarea
					id={`field-${clientId}`}
					className="dsgo-form-field__textarea"
					placeholder={placeholder}
					rows={rows}
					disabled
				/>

				{helpText && (
					<p className="dsgo-form-field__help">{helpText}</p>
				)}
			</div>
		</>
	);
}
