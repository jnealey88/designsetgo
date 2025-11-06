/**
 * Max Width Extension
 *
 * Adds a max-width control to all blocks (core and custom) allowing users to
 * constrain block width directly in the editor.
 *
 * @since 1.0.0
 */

import './editor.scss';
import './style.scss';

import { __, sprintf } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

/**
 * List of blocks to exclude from max-width control
 * These blocks don't benefit from or conflict with max-width settings
 */
const EXCLUDED_BLOCKS = [
	'core/spacer', // Already has height control
	'core/separator', // Already has width control
	'core/page-list', // Navigation element
	'core/navigation', // Navigation element
	// Container blocks have their own "Constrain Width" and "Content Width" controls
	'designsetgo/container',
	'designsetgo/stack',
	'designsetgo/flex',
	'designsetgo/grid',
];

/**
 * Add max-width attribute to all blocks
 *
 * @param {Object} settings - Block settings
 * @param {string} name     - Block name
 * @return {Object} Modified settings
 */
function addMaxWidthAttribute(settings, name) {
	// Skip excluded blocks
	if (EXCLUDED_BLOCKS.includes(name)) {
		return settings;
	}

	// Add max-width attribute
	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgMaxWidth: {
				type: 'string',
				default: '',
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/add-max-width-attribute',
	addMaxWidthAttribute
);

/**
 * Add unified Width panel to block inspector
 * - Max width: Shows for ALL blocks
 * - Constrain Width: Shows ONLY for Container blocks
 */
const withMaxWidthControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;
		const { dsgMaxWidth, constrainWidth, contentWidth } = attributes;

		// Check if this is a Container block (legacy or new Stack/Flex/Grid)
		const isContainerBlock = [
			'designsetgo/container',
			'designsetgo/stack',
			'designsetgo/flex',
			'designsetgo/grid',
		].includes(name);

		// Skip excluded blocks (but NOT container blocks - they need Constrain Width controls)
		if (EXCLUDED_BLOCKS.includes(name) && !isContainerBlock) {
			return <BlockEdit {...props} />;
		}

		// Get theme content size and spacing units for Container blocks
		const [themeContentSize] = useSettings('layout.contentSize');
		const [spacingUnits] = useSettings('spacing.units');
		const units = useCustomUnits({
			availableUnits: spacingUnits || [
				'px',
				'em',
				'rem',
				'vh',
				'vw',
				'%',
			],
		});

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Width', 'designsetgo')}
						initialOpen={false}
					>
						{/* Constrain Width - Shows ONLY for Container blocks */}
						{isContainerBlock && (
							<>
								<ToggleControl
									label={__('Constrain Width', 'designsetgo')}
									checked={constrainWidth}
									onChange={(value) =>
										setAttributes({ constrainWidth: value })
									}
									help={
										constrainWidth
											? __(
													'Content is centered with max-width',
													'designsetgo'
												)
											: __(
													'Content uses full width',
													'designsetgo'
												)
									}
									__nextHasNoMarginBottom
								/>

								{constrainWidth && (
									<UnitControl
										label={__(
											'Content Width',
											'designsetgo'
										)}
										value={contentWidth}
										onChange={(value) =>
											setAttributes({
												contentWidth: value || '',
											})
										}
										units={units}
										placeholder={
											themeContentSize || '1200px'
										}
										help={__(
											`Leave empty to use theme default (${themeContentSize || '1200px'})`,
											'designsetgo'
										)}
										isResetValueOnUnitChange
										__unstableInputWidth="80px"
										__next40pxDefaultSize
										__nextHasNoMarginBottom
									/>
								)}
							</>
						)}

						{/* Max width - Shows for ALL non-container blocks */}
						{!isContainerBlock && (
							<UnitControl
								label={__('Max width', 'designsetgo')}
								value={dsgMaxWidth || ''}
								onChange={(value) =>
									setAttributes({ dsgMaxWidth: value || '' })
								}
								units={units}
								help={__(
									'Maximum width for this block. Leave empty for no constraint.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						)}
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withMaxWidthControl');

addFilter(
	'editor.BlockEdit',
	'designsetgo/add-max-width-control',
	withMaxWidthControl,
	20 // Higher priority to ensure it runs after other extensions
);

/**
 * Apply max-width styles in editor using dynamic CSS generation
 * This follows WordPress's pattern for Group block's contentSize
 */
const withMaxWidthStyles = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name, clientId } = props;
		const { dsgMaxWidth, align, textAlign } = attributes;

		// Skip excluded blocks
		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockListBlock {...props} />;
		}

		// Generate dynamic CSS for this block
		// This mimics WordPress's approach for Group block content width
		const styleId = `dsg-max-width-${clientId}`;

		// Inject dynamic CSS into editor
		// IMPORTANT: Always run this effect, even when dsgMaxWidth is empty,
		// to ensure cleanup happens when max-width is removed
		useEffect(() => {
			// Get editor document (may be in iframe)
			const editorDocument =
				document.querySelector('iframe[name="editor-canvas"]')
					?.contentDocument || document;

			// Remove existing style
			const existingStyle = editorDocument.getElementById(styleId);
			if (existingStyle) {
				existingStyle.remove();
			}

			// Create new style element only if max-width is set
			if (dsgMaxWidth) {
				const styleElement = editorDocument.createElement('style');
				styleElement.id = styleId;

				// Determine margins based on text alignment
				let marginLeft = 'auto';
				let marginRight = 'auto';

				if (textAlign === 'left' || align === 'left') {
					marginLeft = '0';
					marginRight = 'auto';
				} else if (textAlign === 'right' || align === 'right') {
					marginLeft = 'auto';
					marginRight = '0';
				}

				// Generate CSS similar to WordPress Group block
				// Use block ID for specificity
				styleElement.textContent = `
					[data-block="${clientId}"] {
						max-width: ${dsgMaxWidth} !important;
						margin-left: ${marginLeft} !important;
						margin-right: ${marginRight} !important;
					}
				`;

				editorDocument.head.appendChild(styleElement);
			}

			// Cleanup - remove style when component unmounts or max-width changes
			return () => {
				const styleToRemove = editorDocument.getElementById(styleId);
				if (styleToRemove) {
					styleToRemove.remove();
				}
			};
		}, [dsgMaxWidth, clientId, styleId, textAlign, align]);

		// Add class for identification only when max-width is set
		const className = dsgMaxWidth
			? `${props.className || ''} dsg-has-max-width`.trim()
			: props.className;

		return <BlockListBlock {...props} className={className} />;
	};
}, 'withMaxWidthStyles');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/add-max-width-styles-editor',
	withMaxWidthStyles,
	20
);

/**
 * Apply max-width styles to block wrapper on frontend
 * Respects text alignment to adjust margins like WordPress Group block
 * @param props
 * @param blockType
 * @param attributes
 */
function applyMaxWidthStyles(props, blockType, attributes) {
	const { dsgMaxWidth, align, textAlign } = attributes;

	// Skip if no max-width set
	if (!dsgMaxWidth) {
		return props;
	}

	// Skip excluded blocks
	if (EXCLUDED_BLOCKS.includes(blockType.name)) {
		return props;
	}

	// Determine margins based on text alignment
	let marginLeft = 'auto';
	let marginRight = 'auto';

	if (textAlign === 'left' || align === 'left') {
		marginLeft = '0';
		marginRight = 'auto';
	} else if (textAlign === 'right' || align === 'right') {
		marginLeft = 'auto';
		marginRight = '0';
	}

	// Apply max-width with inline styles
	// Inline styles have higher specificity than most CSS rules
	return {
		...props,
		className: `${props.className || ''} dsg-has-max-width`.trim(),
		style: {
			...props.style,
			maxWidth: dsgMaxWidth,
			marginLeft,
			marginRight,
		},
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/apply-max-width-styles',
	applyMaxWidthStyles
);
