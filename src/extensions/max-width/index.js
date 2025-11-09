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
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
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
];

/**
 * Add width attributes to blocks
 * - Stack/Flex/Grid/Container: constrainWidth and contentWidth (custom controls)
 * - Other blocks: dsgMaxWidth
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

	// Add constrainWidth and contentWidth for all container blocks
	const isContainerBlock = [
		'designsetgo/container',
		'designsetgo/stack',
		'designsetgo/flex',
		'designsetgo/grid',
	].includes(name);

	if (isContainerBlock) {
		return {
			...settings,
			attributes: {
				...settings.attributes,
				constrainWidth: {
					type: 'boolean',
					default: true, // Enabled by default for container blocks
				},
				contentWidth: {
					type: 'string',
					default: '', // Empty = uses theme default or 1200px
				},
			},
		};
	}

	// Add max-width attribute for all other blocks
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
 * Add width controls to block inspector
 * - Stack/Flex/Grid/Container: Custom "Constrain Width" controls
 * - Other blocks: Simple "Max width" control
 */
const withMaxWidthControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;
		const { dsgMaxWidth, constrainWidth, contentWidth } = attributes;

		// Check if this is a container block (Stack/Flex/Grid/Container)
		const isContainerBlock = [
			'designsetgo/container',
			'designsetgo/stack',
			'designsetgo/flex',
			'designsetgo/grid',
		].includes(name);

		// Skip excluded blocks (but NOT containers - they need custom controls)
		if (EXCLUDED_BLOCKS.includes(name) && !isContainerBlock) {
			return <BlockEdit {...props} />;
		}

		// Get theme content size and spacing units
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
						{/* Custom Constrain Width controls for all container blocks */}
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
										help={
											themeContentSize
												? // eslint-disable-next-line @wordpress/i18n-no-variables
													sprintf(
														/* translators: %s: theme content size value */
														__(
															'Leave empty to use theme default (%s)',
															'designsetgo'
														),
														themeContentSize
													)
												: __(
														'Leave empty to use default (1200px)',
														'designsetgo'
													)
										}
										isResetValueOnUnitChange
										__unstableInputWidth="80px"
										__next40pxDefaultSize
										__nextHasNoMarginBottom
									/>
								)}
							</>
						)}

						{/* Max width control for all other blocks */}
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
	10 // Early priority to appear above other panels like background video
);

/**
 * Apply max-width styles in editor using dynamic CSS generation
 * Handles both dsgMaxWidth (regular blocks) and constrainWidth (container blocks)
 */
const withMaxWidthStyles = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name, clientId } = props;
		const { dsgMaxWidth, constrainWidth, contentWidth, align, textAlign } =
			attributes;

		// Skip excluded blocks
		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockListBlock {...props} />;
		}

		// Check if this is a container block
		const isContainerBlock = [
			'designsetgo/container',
			'designsetgo/stack',
			'designsetgo/flex',
			'designsetgo/grid',
		].includes(name);

		// Determine which width value to use
		// IMPORTANT: Don't constrain width when block is alignfull
		let maxWidth;
		if (isContainerBlock) {
			maxWidth = (constrainWidth && align !== 'full') ? contentWidth || '1200px' : null;
		} else {
			maxWidth = dsgMaxWidth;
		}

		// Generate dynamic CSS for this block
		const styleId = `dsg-max-width-${clientId}`;

		// Inject dynamic CSS into editor
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
			if (maxWidth) {
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

				// Generate CSS - target inner container for container blocks
				const selector = isContainerBlock
					? `[data-block="${clientId}"] > .wp-block-designsetgo-${name.replace('designsetgo/', '')}`
					: `[data-block="${clientId}"]`;

				styleElement.textContent = `
					${selector} {
						max-width: ${maxWidth} !important;
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
		}, [
			maxWidth,
			clientId,
			styleId,
			textAlign,
			align,
			isContainerBlock,
			name,
		]);

		// Add class for identification only when max-width is set
		const className = maxWidth
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
 * Only handles dsgMaxWidth for regular blocks
 * Container blocks (Stack/Flex/Grid) handle their own width via save.js and PHP
 *
 * @param {Object} props      - Block wrapper props
 * @param {Object} blockType  - Block type object
 * @param {Object} attributes - Block attributes
 * @return {Object} Modified props with max-width styles
 */
function applyMaxWidthStyles(props, blockType, attributes) {
	const { dsgMaxWidth, align, textAlign } = attributes;

	// Skip container blocks - they handle width constraints internally via inner div
	const isContainerBlock = [
		'designsetgo/container',
		'designsetgo/stack',
		'designsetgo/flex',
		'designsetgo/grid',
	].includes(blockType.name);

	if (isContainerBlock) {
		return props;
	}

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
