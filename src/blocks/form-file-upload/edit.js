/**
 * Form File Upload Block - Edit Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import classnames from 'classnames';

export default function FormFileUploadEdit({
	attributes,
	setAttributes,
	clientId,
}) {
	const {
		fieldName,
		label,
		helpText,
		required,
		acceptedFileTypes,
		maxFileSize,
		multiple,
	} = attributes;

	if (!fieldName) {
		setAttributes({ fieldName: `file-${clientId.slice(0, 8)}` });
	}

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--file');
	const blockProps = useBlockProps({ className: fieldClasses });
	const fieldId = `field-${fieldName}`;

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
					<ToggleControl
						label={__('Allow Multiple Files', 'designsetgo')}
						checked={multiple}
						onChange={(value) => setAttributes({ multiple: value })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody
					title={__('File Restrictions', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('Accepted File Types', 'designsetgo')}
						value={acceptedFileTypes}
						onChange={(value) =>
							setAttributes({ acceptedFileTypes: value })
						}
						help={__(
							'e.g., .pdf,.doc,.jpg (leave empty for all)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<NumberControl
						label={__('Max File Size (MB)', 'designsetgo')}
						value={maxFileSize}
						onChange={(value) =>
							setAttributes({ maxFileSize: parseInt(value) || 5 })
						}
						min={1}
						max={50}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Help Text', 'designsetgo')}
						value={helpText}
						onChange={(value) => setAttributes({ helpText: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

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
					className="dsg-form-field__input"
					accept={acceptedFileTypes || undefined}
					multiple={multiple || undefined}
					disabled
				/>
				{helpText && <p className="dsg-form-field__help">{helpText}</p>}
			</div>
		</>
	);
}
