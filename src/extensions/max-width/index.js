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

import { __ } from '@wordpress/i18n';
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
	// Container blocks have native width controls - don't duplicate
	'designsetgo/section', // Section block (vertical stack)
	'designsetgo/row', // Row block (horizontal flex)
	'designsetgo/grid', // Grid block
];

/**
 * Add width attributes to blocks
 * Adds dsgMaxWidth to all blocks except excluded ones
 * Container blocks handle their own width via native attributes
 *
 * @param {Object} settings - Block settings
 * @param {string} name     - Block name
 * @return {Object} Modified settings
 */
function addMaxWidthAttribute(settings, name) {
	// Skip excluded blocks (includes container blocks with native width controls)
	if (EXCLUDED_BLOCKS.includes(name)) {
		return settings;
	}

	// Add max-width attribute for all non-excluded blocks
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
 * Adds simple "Max width" control to all non-excluded blocks
 * Container blocks handle their own width controls natively
 */
const withMaxWidthControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;
		const { dsgMaxWidth } = attributes;

		// Skip excluded blocks (including container blocks)
		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		// Get spacing units for the unit control
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
 * Handles dsgMaxWidth for regular blocks
 * Container blocks handle their own width constraints
 */
const withMaxWidthStyles = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name, clientId } = props;
		const { dsgMaxWidth, align, textAlign } = attributes;

		// Skip excluded blocks (including container blocks)
		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockListBlock {...props} />;
		}

		// Use dsgMaxWidth for regular blocks
		const maxWidth = dsgMaxWidth;

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

				// Generate CSS targeting the block wrapper
				const selector = `[data-block="${clientId}"]`;

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
		}, [maxWidth, clientId, styleId, textAlign, align, name]);

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

	// Skip excluded blocks (includes container blocks that handle width internally)
	if (EXCLUDED_BLOCKS.includes(blockType.name)) {
		return props;
	}

	// Skip if no max-width set
	if (!dsgMaxWidth) {
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
