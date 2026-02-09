/**
 * Heading Segment Block - Edit Component
 *
 * An inline text span within an Advanced Heading.
 * Each segment supports independent typography controls
 * via WordPress Block Supports.
 *
 * @since 1.5.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Heading Segment Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Heading segment edit component
 */
export default function HeadingSegmentEdit({ attributes, setAttributes }) {
	const { content } = attributes;

	const blockProps = useBlockProps({
		className: 'dsgo-heading-segment',
	});

	return (
		<span {...blockProps}>
			<RichText
				tagName="span"
				className="dsgo-heading-segment__text"
				value={content}
				onChange={(newContent) =>
					setAttributes({ content: newContent })
				}
				placeholder={__('Heading text…', 'designsetgo')}
				allowedFormats={[
					'core/bold',
					'core/italic',
					'core/strikethrough',
					'core/superscript',
					'core/subscript',
				]}
			/>
		</span>
	);
}
