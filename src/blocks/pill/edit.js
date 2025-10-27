/**
 * Edit component for Pill Block
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	AlignmentToolbar
} from '@wordpress/block-editor';

export default function PillEdit({ attributes, setAttributes }) {
	const { content, alignment } = attributes;

	const blockProps = useBlockProps({
		className: `dsg-pill${alignment !== 'none' ? ` has-text-align-${alignment}` : ''}`,
	});

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(newAlignment) => setAttributes({ alignment: newAlignment || 'none' })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<RichText
					tagName="span"
					className="dsg-pill__content"
					value={content}
					onChange={(newContent) => setAttributes({ content: newContent })}
					placeholder={__('Add pill text...', 'designsetgo')}
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</div>
		</>
	);
}
