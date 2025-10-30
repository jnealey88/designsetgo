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
import { PanelBody, ToggleControl, TextControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
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

		// Skip excluded blocks
		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		// Check if this is a Container block
		const isContainerBlock = name === 'designsetgo/container';

		// Get theme content size for Container blocks
		const [themeContentSize] = useSettings('layout.contentSize');

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Width', 'designsetgo')}
						initialOpen={false}
					>
						{/* Max width - Shows for ALL blocks */}
						<UnitControl
							label={__('Max width', 'designsetgo')}
							value={dsgMaxWidth || ''}
							onChange={(value) =>
								setAttributes({ dsgMaxWidth: value || '' })
							}
							units={[
								{ value: 'px', label: 'px', default: 0 },
								{ value: '%', label: '%', default: 100 },
								{ value: 'em', label: 'em', default: 0 },
								{ value: 'rem', label: 'rem', default: 0 },
								{ value: 'vw', label: 'vw', default: 100 },
							]}
							help={__(
								'Maximum width for this block. Leave empty for no constraint.',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>

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
											: __('Content uses full width', 'designsetgo')
									}
									__nextHasNoMarginBottom
								/>

								{constrainWidth && (
									<TextControl
										label={__('Content Width', 'designsetgo')}
										value={contentWidth}
										onChange={(value) =>
											setAttributes({ contentWidth: value })
										}
										placeholder={
											themeContentSize ||
											__('e.g., 800px, 60rem', 'designsetgo')
										}
										help={
											themeContentSize
												? sprintf(
														/* translators: %s: theme's content width */
														__(
															'Leave empty to use theme default (%s)',
															'designsetgo'
														),
														themeContentSize
													)
												: __(
														'Maximum content width (e.g., 800px, 60rem)',
														'designsetgo'
													)
										}
										__next40pxDefaultSize
										__nextHasNoMarginBottom
									/>
								)}
							</>
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

		// Skip if no max-width set or excluded block
		if (!dsgMaxWidth || EXCLUDED_BLOCKS.includes(name)) {
			return <BlockListBlock {...props} />;
		}

		// Generate dynamic CSS for this block
		// This mimics WordPress's approach for Group block content width
		const styleId = `dsg-max-width-${clientId}`;

		// Inject dynamic CSS into editor
		useEffect(() => {
			// Get editor document (may be in iframe)
			const editorDocument = document.querySelector('iframe[name="editor-canvas"]')?.contentDocument || document;

			// Remove existing style
			const existingStyle = editorDocument.getElementById(styleId);
			if (existingStyle) {
				existingStyle.remove();
			}

			// Create new style element
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

			// Cleanup
			return () => {
				const styleToRemove = editorDocument.getElementById(styleId);
				if (styleToRemove) {
					styleToRemove.remove();
				}
			};
		}, [dsgMaxWidth, clientId, styleId, textAlign, align]);

		// Add class for identification
		return (
			<BlockListBlock
				{...props}
				className={`${props.className || ''} dsg-has-max-width`.trim()}
			/>
		);
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
