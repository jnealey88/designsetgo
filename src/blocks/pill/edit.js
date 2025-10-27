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

	// Extract color/background styles from blockProps to apply to inner span
	const wrapperStyle = blockProps.style || {};
	const innerStyle = {};

	// Transfer background color to inner span
	if (wrapperStyle.backgroundColor) {
		innerStyle.backgroundColor = wrapperStyle.backgroundColor;
		delete wrapperStyle.backgroundColor;
	}
	if (wrapperStyle.background) {
		innerStyle.background = wrapperStyle.background;
		delete wrapperStyle.background;
	}

	// Transfer text color to inner span
	if (wrapperStyle.color) {
		innerStyle.color = wrapperStyle.color;
		delete wrapperStyle.color;
	}

	// Transfer border styles to inner span
	if (wrapperStyle.borderColor) {
		innerStyle.borderColor = wrapperStyle.borderColor;
		delete wrapperStyle.borderColor;
	}
	if (wrapperStyle.borderWidth) {
		innerStyle.borderWidth = wrapperStyle.borderWidth;
		delete wrapperStyle.borderWidth;
	}
	if (wrapperStyle.borderStyle) {
		innerStyle.borderStyle = wrapperStyle.borderStyle;
		delete wrapperStyle.borderStyle;
	}
	if (wrapperStyle.borderRadius) {
		innerStyle.borderRadius = wrapperStyle.borderRadius;
		delete wrapperStyle.borderRadius;
	}

	// Update blockProps with cleaned style
	blockProps.style = wrapperStyle;

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
					style={innerStyle}
				/>
			</div>
		</>
	);
}
