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
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import classnames from 'classnames';

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

	const fieldClasses = classnames(
		'dsg-form-field',
		'dsg-form-field--textarea'
	);

	const fieldStyles = {
		'--dsg-field-label-color': fieldLabelColor,
		'--dsg-field-border-color': fieldBorderColor,
	};

	const blockProps = useBlockProps({
		className: fieldClasses,
		style: fieldStyles,
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
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<label
					htmlFor={`field-${clientId}`}
					className="dsg-form-field__label"
				>
					{label}
					{required && (
						<span className="dsg-form-field__required">*</span>
					)}
				</label>

				<textarea
					id={`field-${clientId}`}
					className="dsg-form-field__textarea"
					placeholder={placeholder}
					rows={rows}
					disabled
				/>

				{helpText && <p className="dsg-form-field__help">{helpText}</p>}
			</div>
		</>
	);
}
