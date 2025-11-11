/**
 * Form Date Field Block - Edit Component
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

export default function FormDateFieldEdit({
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
		defaultValue,
		minDate,
		maxDate,
		fieldWidth,
	} = attributes;

	// Generate field name from clientId if empty
	if (!fieldName) {
		setAttributes({ fieldName: `date-${clientId.slice(0, 8)}` });
	}

	// Get context values from parent form
	const fieldBackgroundColor =
		context['designsetgo/form-builder/fieldBackgroundColor'];

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--date');

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
					title={__('Date Range', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('Minimum Date', 'designsetgo')}
						value={minDate}
						onChange={(value) => setAttributes({ minDate: value })}
						help={__(
							'Format: YYYY–MM–DD (e.g., 2024–01–01)',
							'designsetgo'
						)}
						type="date"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Maximum Date', 'designsetgo')}
						value={maxDate}
						onChange={(value) => setAttributes({ maxDate: value })}
						help={__(
							'Format: YYYY–MM–DD (e.g., 2024–12–31)',
							'designsetgo'
						)}
						type="date"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Additional Options', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('Default Value', 'designsetgo')}
						value={defaultValue}
						onChange={(value) =>
							setAttributes({ defaultValue: value })
						}
						help={__(
							'Pre-filled date (Format: YYYY-MM-DD)',
							'designsetgo'
						)}
						type="date"
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
				<label htmlFor={fieldId} className="dsg-form-field__label">
					{label}
					{required && (
						<span
							className="dsg-form-field__required"
							aria-label="required"
						>
							*
						</span>
					)}
				</label>

				<input
					type="date"
					id={fieldId}
					className="dsg-form-field__input"
					defaultValue={defaultValue || undefined}
					min={minDate || undefined}
					max={maxDate || undefined}
					aria-describedby={helpText ? `${fieldId}-help` : undefined}
					disabled
				/>

				{helpText && (
					<p id={`${fieldId}-help`} className="dsg-form-field__help">
						{helpText}
					</p>
				)}
			</div>
		</>
	);
}
