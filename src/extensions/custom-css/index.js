/**
 * Custom CSS Extension
 *
 * Adds a custom CSS control to all blocks (core and custom) allowing users to
 * add their own CSS styles directly in the editor.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

/**
 * Replace "selector" keyword with actual CSS class
 * Supports all variations: selector, selector h3, selector:hover, etc.
 *
 * @param {string} css       - User's CSS code
 * @param {string} className - Actual CSS class to use
 * @return {string} Processed CSS with selector replaced
 */
function replaceSelector(css, className) {
	if (!css) {
		return '';
	}

	// Replace "selector" with the actual class
	// Handles: selector, selector:hover, selector h3, etc.
	return css.replace(/\bselector\b/g, `.${className}`);
}

/**
 * List of blocks to exclude from custom CSS control
 * These blocks don't benefit from or conflict with custom CSS settings
 */
const EXCLUDED_BLOCKS = [
	'core/html', // Already allows custom HTML/CSS
	'core/code', // Code display block
];

/**
 * Add custom CSS attribute to all blocks
 *
 * @param {Object} settings - Block settings
 * @param {string} name     - Block name
 * @return {Object} Modified settings
 */
function addCustomCSSAttribute(settings, name) {
	// Skip excluded blocks
	if (EXCLUDED_BLOCKS.includes(name)) {
		return settings;
	}

	// Add custom CSS attribute
	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgCustomCSS: {
				type: 'string',
				default: '',
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/add-custom-css-attribute',
	addCustomCSSAttribute
);

/**
 * Add custom CSS control to block inspector
 */
const withCustomCSSControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name, clientId } = props;
		const { dsgCustomCSS } = attributes;

		// Skip excluded blocks
		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Custom CSS', 'designsetgo')}
						initialOpen={false}
					>
						<TextareaControl
							label={__('CSS Code', 'designsetgo')}
							value={dsgCustomCSS || ''}
							onChange={(value) =>
								setAttributes({ dsgCustomCSS: value || '' })
							}
							placeholder={`selector {\n  background: linear-gradient(45deg, #f00, #00f);\n  padding: 2rem;\n}\n\nselector h3 {\n  color: white;\n  font-size: 2rem;\n}`}
							rows={12}
							help={__(
								'Use "selector" to target this block. Write nested selectors like "selector h3" to target elements inside.',
								'designsetgo'
							)}
							className="dsg-custom-css-textarea"
						/>
						<p className="components-base-control__help">
							<strong>{__('Examples:', 'designsetgo')}</strong>
							<br />
							<code>selector {'{'} background: red; {'}'}</code> - Style this block
							<br />
							<code>selector h3 {'{'} color: white; {'}'}</code> - Style H3s inside
							<br />
							<code>selector:hover {'{'} opacity: 0.8; {'}'}</code> - Hover effect
						</p>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withCustomCSSControl');

addFilter(
	'editor.BlockEdit',
	'designsetgo/add-custom-css-control',
	withCustomCSSControl,
	20 // Higher priority to ensure it runs after other extensions
);

/**
 * Add custom CSS class AND inject styles into editor
 * Combined into single filter to avoid conflicts
 */
const withCustomCSSClassAndStyles = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name, clientId } = props;
		const { dsgCustomCSS } = attributes;

		// Skip if no custom CSS set or excluded block
		if (!dsgCustomCSS || EXCLUDED_BLOCKS.includes(name)) {
			return <BlockListBlock {...props} />;
		}

		// Add custom CSS class to block wrapper
		const customClassName = `dsg-custom-css-${clientId}`;
		const styleId = `dsg-custom-css-style-${clientId}`;

		// Inject styles into editor with "selector" replaced by actual class
		useEffect(() => {
			// Check if we're in the editor iframe or main window
			const editorDocument = document.querySelector('iframe[name="editor-canvas"]')?.contentDocument || document;

			// Remove existing style element if present
			const existingStyle = editorDocument.getElementById(styleId);
			if (existingStyle) {
				existingStyle.remove();
			}

			// Create new style element if custom CSS is provided
			if (dsgCustomCSS) {
				const styleElement = editorDocument.createElement('style');
				styleElement.id = styleId;
				// Replace "selector" with actual class name
				styleElement.textContent = replaceSelector(dsgCustomCSS, customClassName);
				editorDocument.head.appendChild(styleElement);
			}

			// Cleanup function to remove style element when block is removed
			return () => {
				const styleToRemove = editorDocument.getElementById(styleId);
				if (styleToRemove) {
					styleToRemove.remove();
				}
			};
		}, [dsgCustomCSS, clientId, styleId, customClassName]);

		return (
			<BlockListBlock
				{...props}
				className={`${props.className || ''} ${customClassName}`.trim()}
			/>
		);
	};
}, 'withCustomCSSClassAndStyles');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/add-custom-css-class-and-styles',
	withCustomCSSClassAndStyles,
	20
);

/**
 * Add custom CSS class to block wrapper on frontend
 */
function applyCustomCSSClass(props, blockType, attributes) {
	const { dsgCustomCSS } = attributes;

	// Skip if no custom CSS set
	if (!dsgCustomCSS) {
		return props;
	}

	// Skip excluded blocks
	if (EXCLUDED_BLOCKS.includes(blockType.name)) {
		return props;
	}

	// Generate a unique class based on block attributes hash
	// This ensures the same block always gets the same class
	const hash = hashCode(dsgCustomCSS + blockType.name);
	const customClassName = `dsg-custom-css-${hash}`;

	return {
		...props,
		className: `${props.className || ''} ${customClassName}`.trim(),
	};
}

/**
 * Simple hash function to generate consistent IDs
 * @param {string} str - String to hash
 * @return {string} Hash string
 */
function hashCode(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash).toString(36);
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/apply-custom-css-class',
	applyCustomCSSClass
);
