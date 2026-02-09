/**
 * Heading Segment Block - Save Function
 *
 * Outputs an inline span with its own typography styles.
 * Block Supports automatically apply font-family, font-weight,
 * color, and other typography properties.
 *
 * @since 2.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Heading Segment Save Function
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {JSX.Element|null} Saved heading segment markup, or null if empty
 */
export default function HeadingSegmentSave({ attributes }) {
	const { content } = attributes;

	if (!content || !content.trim()) {
		return null;
	}

	const blockProps = useBlockProps.save({
		className: 'dsgo-heading-segment',
	});

	return (
		<span {...blockProps}>
			<RichText.Content
				tagName="span"
				className="dsgo-heading-segment__text"
				value={content}
			/>
		</span>
	);
}
