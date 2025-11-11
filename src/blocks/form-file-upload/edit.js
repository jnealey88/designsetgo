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
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis -- NumberControl is stable in practice
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import classnames from 'classnames';

export default function FormFileUploadEdit({
	attributes,
	setAttributes,
	clientId,
	context,
}) {
	const {
		fieldName,
		label,
		helpText,
		required,
		acceptedFileTypes,
		maxFileSize,
		multiple,
		fieldWidth,
	} = attributes;

	if (!fieldName) {
		setAttributes({ fieldName: `file-${clientId.slice(0, 8)}` });
	}

	// Get context values from parent form
	const fieldBackgroundColor =
		context['designsetgo/form-builder/fieldBackgroundColor'];

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--file');

	const fieldStyles = {
		'--dsg-form-field-bg': fieldBackgroundColor,
	};

	const blockProps = useBlockProps({
		className: fieldClasses,
		style: {
			...fieldStyles,
			// Use flex-basis with calc to account for gap between fields
			flexBasis:
				fieldWidth === '100'
					? '100%'
					: `calc(${fieldWidth}% - var(--dsg-form-field-spacing, 1.5rem) / 2)`,
			maxWidth:
				fieldWidth === '100'
					? '100%'
					: `calc(${fieldWidth}% - var(--dsg-form-field-spacing, 1.5rem) / 2)`,
		},
	});
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
