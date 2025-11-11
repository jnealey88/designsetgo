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
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Add columnSpan attribute to all blocks
 * @param {Object} settings Block settings
 * @return {Object} Modified block settings
 */
function addColumnSpanAttribute(settings) {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgColumnSpan: {
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
		const { dsgColumnSpan } = attributes;

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
								value={dsgColumnSpan}
								onChange={(value) =>
									setAttributes({ dsgColumnSpan: value })
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
 * Apply column span styles in editor
 */
const withColumnSpanStyles = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, clientId } = props;
		const { dsgColumnSpan } = attributes;

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

		// Generate dynamic CSS for column span in editor
		const styleId = `dsg-grid-span-${clientId}`;

		// Get parent grid's responsive column settings
		const parentGridSettings = useSelect(
			(select) => {
				if (!isInGrid) {
					return null;
				}

				const { getBlockParents, getBlock } =
					select('core/block-editor');
				const parents = getBlockParents(clientId);

				for (const parentId of parents) {
					const parent = getBlock(parentId);
					if (parent && parent.name === 'designsetgo/grid') {
						return {
							desktopColumns:
								parent.attributes?.desktopColumns || 3,
							tabletColumns:
								parent.attributes?.tabletColumns || 2,
							mobileColumns:
								parent.attributes?.mobileColumns || 1,
						};
					}
				}
				return null;
			},
			[clientId, isInGrid]
		);

		useEffect(() => {
			// Only apply if inside Grid
			if (!isInGrid || !parentGridSettings) {
				return;
			}

			// Get editor document (may be in iframe)
			const editorDocument =
				document.querySelector('iframe[name="editor-canvas"]')
					?.contentDocument || document;

			// Remove existing style
			const existingStyle = editorDocument.getElementById(styleId);
			if (existingStyle) {
				existingStyle.remove();
			}

			// Create new style element if columnSpan is set
			if (dsgColumnSpan && dsgColumnSpan > 1) {
				const styleElement = editorDocument.createElement('style');
				styleElement.id = styleId;

				// Calculate effective spans for each breakpoint
				// Constrain to parent's column count at each breakpoint
				const effectiveTabletSpan = Math.min(
					dsgColumnSpan,
					parentGridSettings.tabletColumns
				);
				const effectiveMobileSpan = Math.min(
					dsgColumnSpan,
					parentGridSettings.mobileColumns
				);

				styleElement.textContent = `
					/* Desktop */
					[data-block="${clientId}"] {
						grid-column: span ${dsgColumnSpan} !important;
					}

					/* Tablet - constrain to parent tablet columns */
					@media (max-width: 1024px) {
						[data-block="${clientId}"] {
							grid-column: span ${effectiveTabletSpan} !important;
						}
					}

					/* Mobile - constrain to parent mobile columns */
					@media (max-width: 767px) {
						[data-block="${clientId}"] {
							grid-column: span ${effectiveMobileSpan} !important;
						}
					}
				`;
				editorDocument.head.appendChild(styleElement);
			}

			// Cleanup
			return () => {
				const styleToRemove = editorDocument.getElementById(styleId);
				if (styleToRemove) {
					styleToRemove.remove();
				}
			};
		}, [dsgColumnSpan, clientId, styleId, isInGrid, parentGridSettings]);

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
	const { dsgColumnSpan } = attributes;

	// Only apply if columnSpan is set and > 1
	if (!dsgColumnSpan || dsgColumnSpan === 1) {
		return props;
	}

	return {
		...props,
		style: {
			...props.style,
			gridColumn: `span ${dsgColumnSpan}`,
		},
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/apply-column-span-styles',
	applyColumnSpanStyles
);
