/**
 * Form Checkbox Field Block - Edit Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import classnames from 'classnames';

export default function FormCheckboxFieldEdit({
	attributes,
	setAttributes,
	clientId,
}) {
	const { fieldName, label, helpText, required, checkedByDefault, value } =
		attributes;

	// Generate field name from clientId if empty
	if (!fieldName) {
		setAttributes({ fieldName: `checkbox-${clientId.slice(0, 8)}` });
	}

	const fieldClasses = classnames(
		'dsgo-form-field',
		'dsgo-form-field--checkbox'
	);

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
						onChange={(newValue) =>
							setAttributes({
								fieldName: newValue.replace(
									/[^a-z0-9_-]/gi,
									''
								),
							})
						}
						help={__(
							'Unique identifier for this field (letters, numbers, hyphens, underscores only)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Required', 'designsetgo')}
						checked={required}
						onChange={(newValue) =>
							setAttributes({ required: newValue })
						}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Checked by Default', 'designsetgo')}
						checked={checkedByDefault}
						onChange={(newValue) =>
							setAttributes({ checkedByDefault: newValue })
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Additional Options', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('Value', 'designsetgo')}
						value={value}
						onChange={(newValue) =>
							setAttributes({ value: newValue })
						}
						help={__(
							'The value submitted when checkbox is checked',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Help Text', 'designsetgo')}
						value={helpText}
						onChange={(newValue) =>
							setAttributes({ helpText: newValue })
						}
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
				<div className="dsgo-form-field__checkbox-wrapper">
					<input
						type="checkbox"
						id={fieldId}
						className="dsgo-form-field__checkbox-input"
						defaultChecked={checkedByDefault}
						disabled
					/>
					<label
						htmlFor={fieldId}
						className="dsgo-form-field__checkbox-label"
					>
						<RichText
							tagName="span"
							value={label}
							onChange={(newValue) =>
								setAttributes({ label: newValue })
							}
							placeholder={__(
								'Enter checkbox label…',
								'designsetgo'
							)}
							allowedFormats={[
								'core/bold',
								'core/italic',
								'core/link',
							]}
						/>
						{required && (
							<span
								className="dsgo-form-field__required"
								aria-label="required"
							>
								{' '}
								*
							</span>
						)}
					</label>
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
