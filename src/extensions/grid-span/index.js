/**
 * Grid Span Extension
 *
 * Adds column span controls to blocks when they're inside a Grid container.
 * Allows blocks to span multiple columns in the grid.
 *
 * @since 1.0.0
 */

import './editor.scss';
import './style.scss';

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { shouldExtendBlock } from '../../utils/should-extend-block';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

/**
 * Add columnSpan attribute to all blocks
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified block settings
 */
function addColumnSpanAttribute(settings, name) {
	// Check user exclusion list first
	if (!shouldExtendBlock(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoColumnSpan: {
				type: 'number',
				default: 1,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/add-column-span-attribute',
	addColumnSpanAttribute
);

/**
 * Add Column Span control to block inspector when inside Grid
 */
const withColumnSpanControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, clientId } = props;
		const { dsgoColumnSpan } = attributes;

		// Check if this block is inside a Grid container
		const parentBlock = useSelect(
			(select) => {
				const { getBlockParents, getBlock } =
					select('core/block-editor');
				const parents = getBlockParents(clientId);

				// Check each parent to see if it's a Grid
				for (const parentId of parents) {
					const parent = getBlock(parentId);
					if (parent && parent.name === 'designsetgo/grid') {
						return parent;
					}
				}
				return null;
			},
			[clientId]
		);

		// Get max columns from parent Grid
		const maxColumns = parentBlock?.attributes?.desktopColumns || 12;

		return (
			<>
				<BlockEdit {...props} />
				{parentBlock && (
					<InspectorControls>
						<PanelBody
							title={__('Grid Settings', 'designsetgo')}
							initialOpen={false}
						>
							<RangeControl
								label={__('Column Span', 'designsetgo')}
								value={dsgoColumnSpan}
								onChange={(value) =>
									setAttributes({ dsgoColumnSpan: value })
								}
								min={1}
								max={maxColumns}
								help={__(
									'Number of columns this block spans in the grid',
									'designsetgo'
								)}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'withColumnSpanControl');

addFilter(
	'editor.BlockEdit',
	'designsetgo/add-column-span-control',
	withColumnSpanControl,
	20
);

/**
 * Apply column span styles in editor via wrapperProps
 *
 * Uses inline styles on the block wrapper instead of dynamic <style> injection.
 * This ensures grid-column spans work in both the editor canvas AND pattern
 * previews (which render in separate iframes without name="editor-canvas").
 */
const withColumnSpanStyles = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, clientId } = props;
		const { dsgoColumnSpan } = attributes;

		// Check if this block is inside a Grid container
		const isInGrid = useSelect(
			(select) => {
				const { getBlockParents, getBlock } =
					select('core/block-editor');
				const parents = getBlockParents(clientId);

				for (const parentId of parents) {
					const parent = getBlock(parentId);
					if (parent && parent.name === 'designsetgo/grid') {
						return true;
					}
				}
				return false;
			},
			[clientId]
		);

		// Apply grid-column span directly via wrapperProps
		if (isInGrid && dsgoColumnSpan && dsgoColumnSpan > 1) {
			const wrapperProps = {
				...props.wrapperProps,
				style: {
					...props.wrapperProps?.style,
					gridColumn: `span ${dsgoColumnSpan}`,
				},
			};

			return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
		}

		return <BlockListBlock {...props} />;
	};
}, 'withColumnSpanStyles');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/add-column-span-styles-editor',
	withColumnSpanStyles,
	20
);

/**
 * Apply column span styles on frontend
 * @param {Object} props      Block props
 * @param {Object} blockType  Block type
 * @param {Object} attributes Block attributes
 * @return {Object} Modified props
 */
function applyColumnSpanStyles(props, blockType, attributes) {
	const { dsgoColumnSpan } = attributes;

	// Only apply if columnSpan is set and > 1
	if (!dsgoColumnSpan || dsgoColumnSpan === 1) {
		return props;
	}

	return {
		...props,
		style: {
			...props.style,
			gridColumn: `span ${dsgoColumnSpan}`,
		},
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/apply-column-span-styles',
	applyColumnSpanStyles
);
