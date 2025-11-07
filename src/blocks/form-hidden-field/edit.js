/**
 * Form Hidden Field Block - Edit Component
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Notice,
} from '@wordpress/components';

export default function FormHiddenFieldEdit({ attributes, setAttributes, clientId }) {
	const {
		fieldName,
		value,
	} = attributes;

	// Generate field name from clientId if empty
	if (!fieldName) {
		setAttributes({ fieldName: `hidden-${clientId.slice(0, 8)}` });
	}

	const blockProps = useBlockProps({
		className: 'dsg-form-field dsg-form-field--hidden',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Field Settings', 'designsetgo')} initialOpen={true}>
					<TextControl
						label={__('Field Name', 'designsetgo')}
						value={fieldName}
						onChange={(value) =>
							setAttributes({ fieldName: value.replace(/[^a-z0-9_-]/gi, '') })
						}
						help={__('Unique identifier for this field (letters, numbers, hyphens, underscores only)', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Value', 'designsetgo')}
						value={value}
						onChange={(value) => setAttributes({ value: value })}
						help={__('The hidden value to be submitted with the form', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<Notice status="info" isDismissible={false}>
					<strong>{__('Hidden Field:', 'designsetgo')}</strong> {fieldName} = {value || __('(empty)', 'designsetgo')}
				</Notice>
			</div>
		</>
	);
}
