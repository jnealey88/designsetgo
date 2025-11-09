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
import { useEffect } from '@wordpress/element';

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
 * Set default textAlign when block is inserted into a container
 */
addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/apply-inherited-alignment',
	(props, blockType, attributes) => {
		// Only apply to text blocks
		if (!TEXT_BLOCKS.includes(blockType.name)) {
			return props;
		}

		// Apply alignment from attributes
		if (attributes.textAlign) {
			return {
				...props,
				style: {
					...props.style,
					textAlign: attributes.textAlign,
				},
			};
		}

		return props;
	}
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

/**
 * Apply inherited alignment from parent container
 */
const withAlignmentInheritance = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes, context } = props;

		// Only apply to text blocks
		if (!TEXT_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		const { __textAlignSource, textAlign } = attributes;
		const parentTextAlign = context['designsetgo/textAlign'];

		// Apply inherited alignment when:
		// 1. Source is set to inherit (default)
		// 2. No manual alignment is currently set OR alignment should follow parent
		// 3. Parent has an alignment set
		useEffect(() => {
			if (
				(__textAlignSource === 'inherit' || !__textAlignSource) &&
				parentTextAlign &&
				textAlign !== parentTextAlign
			) {
				setAttributes({
					textAlign: parentTextAlign,
				});
			}
		}, [parentTextAlign, textAlign, __textAlignSource, setAttributes]);

		return <BlockEdit {...props} />;
	};
}, 'withAlignmentInheritance');

addFilter(
	'editor.BlockEdit',
	'designsetgo/with-alignment-inheritance',
	withAlignmentInheritance
);
