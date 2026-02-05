/**
 * Grid Mobile Order Extension
 *
 * Adds mobile reordering controls to blocks when they're inside a Grid container.
 * Allows changing the visual order of grid children on mobile devices,
 * solving the alternating row stacking problem.
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
import { useEffect } from '@wordpress/element';

/**
 * Check if the current block is inside a Grid container
 *
 * @param {string} clientId Block client ID
 * @return {Object|null} Parent grid block object or null
 */
function useParentGrid(clientId) {
	return useSelect(
		(select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parents = getBlockParents(clientId);

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
}

/**
 * Add mobileOrder attribute to all blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified block settings
 */
function addMobileOrderAttribute(settings, name) {
	if (!shouldExtendBlock(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoMobileOrder: {
				type: 'number',
				default: 0,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/add-mobile-order-attribute',
	addMobileOrderAttribute
);

/**
 * Add Mobile Order control to block inspector when inside Grid
 */
const withMobileOrderControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, clientId } = props;
		const { dsgoMobileOrder } = attributes;

		const parentGrid = useParentGrid(clientId);

		return (
			<>
				<BlockEdit {...props} />
				{parentGrid && (
					<InspectorControls>
						<PanelBody
							title={__('Mobile Order', 'designsetgo')}
							initialOpen={false}
						>
							<RangeControl
								label={__('Order on Mobile', 'designsetgo')}
								value={dsgoMobileOrder}
								onChange={(value) =>
									setAttributes({
										dsgoMobileOrder: value,
									})
								}
								min={0}
								max={10}
								allowReset
								resetFallbackValue={0}
								help={
									dsgoMobileOrder > 0
										? __(
												'Lower numbers appear first on mobile. Items without a custom order default to 0.',
												'designsetgo'
											)
										: __(
												'Set a custom order for this item when the grid stacks on mobile. Lower numbers appear first.',
												'designsetgo'
											)
								}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'withMobileOrderControl');

addFilter(
	'editor.BlockEdit',
	'designsetgo/add-mobile-order-control',
	withMobileOrderControl,
	20
);

/**
 * Apply mobile order styles in editor via dynamic style elements
 */
const withMobileOrderStyles = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, clientId } = props;
		const { dsgoMobileOrder } = attributes;

		const isInGrid = !!useParentGrid(clientId);

		const styleId = `dsgo-mobile-order-${clientId}`;

		useEffect(() => {
			if (!isInGrid) {
				return;
			}

			// Get editor document (may be in iframe)
			const editorDocument =
				document.querySelector('iframe[name="editor-canvas"]')
					?.contentDocument || document;

			if (!editorDocument?.getElementById) {
				return;
			}

			// Remove existing style
			const existingStyle = editorDocument.getElementById(styleId);
			if (existingStyle) {
				existingStyle.remove();
			}

			// Create new style element if mobileOrder is set
			if (dsgoMobileOrder > 0) {
				const styleElement = editorDocument.createElement('style');
				styleElement.id = styleId;

				// Sanitize clientId for CSS selector (defense-in-depth)
				const safeClientId = window.CSS?.escape
					? window.CSS.escape(clientId)
					: clientId.replace(/[^a-zA-Z0-9-]/g, '');

				styleElement.textContent = `
					/* Mobile order */
					@media (max-width: 767px) {
						[data-block="${safeClientId}"] {
							order: ${Number(dsgoMobileOrder)} !important;
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
		}, [dsgoMobileOrder, clientId, styleId, isInGrid]);

		return <BlockListBlock {...props} />;
	};
}, 'withMobileOrderStyles');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/add-mobile-order-styles-editor',
	withMobileOrderStyles,
	20
);

/**
 * Apply mobile order as CSS custom property on frontend save
 *
 * @param {Object} props      Block props
 * @param {Object} blockType  Block type
 * @param {Object} attributes Block attributes
 * @return {Object} Modified props
 */
function applyMobileOrderSaveProps(props, blockType, attributes) {
	if (!shouldExtendBlock(blockType.name)) {
		return props;
	}

	const { dsgoMobileOrder } = attributes;

	// Validate and clamp the value
	const mobileOrder = Math.max(0, Math.min(10, Number(dsgoMobileOrder) || 0));

	if (mobileOrder <= 0) {
		return props;
	}

	return {
		...props,
		style: {
			...props.style,
			'--dsgo-mobile-order': mobileOrder,
		},
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/apply-mobile-order-save-props',
	applyMobileOrderSaveProps
);
