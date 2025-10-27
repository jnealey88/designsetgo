/**
 * Save component for Pill Block
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function PillSave({ attributes }) {
	const { content, alignment } = attributes;

	const blockProps = useBlockProps.save({
		className: `dsg-pill${alignment !== 'none' ? ` has-text-align-${alignment}` : ''}`,
	});

	return (
		<div {...blockProps}>
			<RichText.Content
				tagName="span"
				className="dsg-pill__content"
				value={content}
			/>
		</div>
	);
}
