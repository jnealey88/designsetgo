/**
 * Form Email Field Block - Editor Component
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
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import classnames from 'classnames';

export default function FormEmailFieldEdit({
	attributes,
	setAttributes,
	clientId,
	context,
}) {
	const { fieldName, label, placeholder, helpText, required, defaultValue } =
		attributes;

	// Generate unique field name on mount if not set
	useEffect(() => {
		if (!fieldName) {
			setAttributes({ fieldName: `field_${clientId.substring(0, 8)}` });
		}
	}, [fieldName, clientId, setAttributes]);

	// Get context values from parent form
	const fieldLabelColor = context['designsetgo/form/fieldLabelColor'];
	const fieldBorderColor = context['designsetgo/form/fieldBorderColor'];

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--email');

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
						placeholder="email@example.com"
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

					<TextControl
						label={__('Default Value', 'designsetgo')}
						value={defaultValue}
						onChange={(value) =>
							setAttributes({ defaultValue: value })
						}
						type="email"
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

				<input
					type="email"
					id={`field-${clientId}`}
					className="dsg-form-field__input"
					placeholder={placeholder}
					disabled
				/>

				{helpText && <p className="dsg-form-field__help">{helpText}</p>}
			</div>
		</>
	);
}
