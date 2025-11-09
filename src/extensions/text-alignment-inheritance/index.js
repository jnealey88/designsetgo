/**
 * Text Alignment Inheritance Extension
 *
 * Automatically inherits text alignment from parent container blocks.
 * - Child blocks inherit parent's textAlign setting dynamically
 * - New blocks default to parent alignment
 * - Individual blocks can override by setting their own alignment
 * - Clearing alignment restores inheritance
 *
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * List of core blocks that support text alignment
 */
const TEXT_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/quote',
	'core/pullquote',
	'core/verse',
	'core/preformatted',
	'core/code',
];

/**
 * Add attributes to track alignment inheritance
 */
addFilter(
	'blocks.registerBlockType',
	'designsetgo/add-alignment-inheritance-attributes',
	(settings, name) => {
		// Only apply to text blocks that support alignment
		if (!TEXT_BLOCKS.includes(name)) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				// Track if alignment was explicitly set by user or inherited
				__textAlignSource: {
					type: 'string',
					// 'inherit' = use parent, 'manual' = user set
					default: 'inherit',
				},
			},
			usesContext: [
				...(settings.usesContext || []),
				'designsetgo/textAlign',
			],
		};
	}
);

/**
 * Override block save to apply inherited alignment styles
 */
const withInheritedAlignmentProps = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const { name, attributes, context } = props;

			// Only apply to text blocks
			if (!TEXT_BLOCKS.includes(name)) {
				return <BlockListBlock {...props} />;
			}

			// Get parent's textAlign from context
			const parentTextAlign = context?.['designsetgo/textAlign'];
			const { textAlign, __textAlignSource } = attributes;

			// Determine effective alignment:
			// Priority: manual setting > inherited from parent > default (none)
			const effectiveAlign =
				__textAlignSource === 'manual' ? textAlign : parentTextAlign;

			// Apply alignment as a style if inherited and different from block's own setting
			if (
				effectiveAlign &&
				__textAlignSource === 'inherit' &&
				textAlign !== effectiveAlign
			) {
				const wrapperProps = {
					...props.wrapperProps,
					style: {
						...props.wrapperProps?.style,
						textAlign: effectiveAlign,
					},
				};

				return (
					<BlockListBlock {...props} wrapperProps={wrapperProps} />
				);
			}

			return <BlockListBlock {...props} />;
		};
	},
	'withInheritedAlignmentProps'
);

addFilter(
	'editor.BlockListBlock',
	'designsetgo/with-inherited-alignment-props',
	withInheritedAlignmentProps
);

/**
 * Intercept alignment changes to mark them as manual
 */
const withManualAlignmentTracking = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes } = props;

		// Only apply to text blocks
		if (!TEXT_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		// Wrap setAttributes to track when alignment is manually changed
		const wrappedSetAttributes = (newAttributes) => {
			// If textAlign is being changed, mark it as manual
			if (
				newAttributes.hasOwnProperty('textAlign') &&
				newAttributes.textAlign !== attributes.textAlign
			) {
				// If clearing alignment (undefined/null), restore inheritance
				if (
					newAttributes.textAlign === undefined ||
					newAttributes.textAlign === null ||
					newAttributes.textAlign === ''
				) {
					setAttributes({
						...newAttributes,
						__textAlignSource: 'inherit',
					});
				} else {
					// Manual change
					setAttributes({
						...newAttributes,
						__textAlignSource: 'manual',
					});
				}
			} else {
				setAttributes(newAttributes);
			}
		};

		return <BlockEdit {...props} setAttributes={wrappedSetAttributes} />;
	};
}, 'withManualAlignmentTracking');

addFilter(
	'editor.BlockEdit',
	'designsetgo/with-manual-alignment-tracking',
	withManualAlignmentTracking
);
