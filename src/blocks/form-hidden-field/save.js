/**
 * Form Hidden Field Block - Save Component
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';

export default function FormHiddenFieldSave({ attributes }) {
	const { fieldName, value } = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsg-form-field dsg-form-field--hidden',
	});

	return (
		<div {...blockProps}>
			<input
				type="hidden"
				name={fieldName}
				value={value}
				data-field-type="hidden"
			/>
		</div>
	);
}
