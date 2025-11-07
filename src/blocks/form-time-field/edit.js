/**
 * Form Time Field Block - Edit Component
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

export default function FormTimeFieldEdit({
	attributes,
	setAttributes,
	clientId,
}) {
	const {
		fieldName,
		label,
		helpText,
		required,
		defaultValue,
		minTime,
		maxTime,
		step,
	} = attributes;

	// Generate field name from clientId if empty
	if (!fieldName) {
		setAttributes({ fieldName: `time-${clientId.slice(0, 8)}` });
	}

	const fieldClasses = classnames('dsg-form-field', 'dsg-form-field--time');

	const blockProps = useBlockProps({
		className: fieldClasses,
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
				</PanelBody>

				<PanelBody
					title={__('Time Range', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('Minimum Time', 'designsetgo')}
						value={minTime}
						onChange={(value) => setAttributes({ minTime: value })}
						help={__('Format: HH:MM (e.g., 09:00)', 'designsetgo')}
						type="time"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Maximum Time', 'designsetgo')}
						value={maxTime}
						onChange={(value) => setAttributes({ maxTime: value })}
						help={__('Format: HH:MM (e.g., 17:00)', 'designsetgo')}
						type="time"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<NumberControl
						label={__('Step (seconds)', 'designsetgo')}
						value={step}
						onChange={(value) =>
							setAttributes({ step: parseInt(value) || 60 })
						}
						help={__(
							'Time increment in seconds (60 = 1 minute)',
							'designsetgo'
						)}
						min={1}
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
							'Pre-filled time (Format: HH:MM)',
							'designsetgo'
						)}
						type="time"
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
					type="time"
					id={fieldId}
					className="dsg-form-field__input"
					defaultValue={defaultValue || undefined}
					min={minTime || undefined}
					max={maxTime || undefined}
					step={step}
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
